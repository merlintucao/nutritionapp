// Generates the app icons from dog.png.
// Pure Node: decodes the source PNG, center-crops it square, resizes, and writes PNGs.
// Run: node scripts/gen-icons.js
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function encodeICO(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = header.length + images.length * 16;

  images.forEach((image) => {
    const entry = Buffer.alloc(16);
    entry[0] = image.size === 256 ? 0 : image.size;
    entry[1] = image.size === 256 ? 0 : image.size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += image.png.length;
  });

  return Buffer.concat([header, ...entries, ...images.map(image => image.png)]);
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePNG(file) {
  const png = fs.readFileSync(file);
  if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    throw new Error(`${file} is not a PNG`);
  }

  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    const type = png.toString('ascii', offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (data[10] !== 0 || data[11] !== 0 || data[12] !== 0) {
        throw new Error('Unsupported PNG compression, filter, or interlace method');
      }
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  if (bitDepth !== 8 || colorType !== 6) {
    throw new Error('Expected an 8-bit RGBA PNG source');
  }

  const bpp = 4;
  const stride = width * bpp;
  const inflated = zlib.inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(width * height * bpp);

  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    const filter = inflated[rowStart];
    const row = inflated.subarray(rowStart + 1, rowStart + 1 + stride);
    const out = pixels.subarray(y * stride, y * stride + stride);
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;

    for (let x = 0; x < stride; x++) {
      const left = x >= bpp ? out[x - bpp] : 0;
      const up = prev ? prev[x] : 0;
      const upLeft = prev && x >= bpp ? prev[x - bpp] : 0;
      if (filter === 0) out[x] = row[x];
      else if (filter === 1) out[x] = (row[x] + left) & 255;
      else if (filter === 2) out[x] = (row[x] + up) & 255;
      else if (filter === 3) out[x] = (row[x] + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) out[x] = (row[x] + paeth(left, up, upLeft)) & 255;
      else throw new Error(`Unsupported PNG filter: ${filter}`);
    }
  }

  return { width, height, pixels };
}

function resizeCenterCrop(image, size) {
  const crop = Math.min(image.width, image.height);
  const cropX = Math.floor((image.width - crop) / 2);
  const cropY = Math.floor((image.height - crop) / 2);
  const out = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    const srcY = cropY + Math.min(crop - 1, Math.floor((y + 0.5) * crop / size));
    for (let x = 0; x < size; x++) {
      const srcX = cropX + Math.min(crop - 1, Math.floor((x + 0.5) * crop / size));
      const src = (srcY * image.width + srcX) * 4;
      const dest = (y * size + x) * 4;
      image.pixels.copy(out, dest, src, src + 4);
    }
  }

  return out;
}

// Key the source's near-white background out to transparent, in place, so the
// header logo blends into the page instead of showing a white box.
function keyNearWhite(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i] > 244 && pixels[i + 1] > 244 && pixels[i + 2] > 244) pixels[i + 3] = 0;
  }
  return pixels;
}

const source = path.join(__dirname, '..', 'dog.png');
const outDir = path.join(__dirname, '..', 'icons');
const image = decodePNG(source);

fs.mkdirSync(outDir, { recursive: true });

const pngs = new Map();

[16, 32, 180, 192, 512].forEach((size) => {
  const pixels = resizeCenterCrop(image, size);
  const png = encodePNG(size, size, pixels);
  pngs.set(size, png);
  const out = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(out, png);
  console.log(`wrote icons/icon-${size}.png (${png.length} bytes)`);
});

const favicon = encodeICO([
  { size: 16, png: pngs.get(16) },
  { size: 32, png: pngs.get(32) },
]);
const faviconPath = path.join(__dirname, '..', 'favicon.ico');
fs.writeFileSync(faviconPath, favicon);
console.log(`wrote favicon.ico (${favicon.length} bytes)`);

// Lightweight, transparent-background header logo (shown ~34px, generated at 96px).
const logoPng = encodePNG(96, 96, keyNearWhite(resizeCenterCrop(image, 96)));
fs.writeFileSync(path.join(outDir, 'logo.png'), logoPng);
console.log(`wrote icons/logo.png (${logoPng.length} bytes)`);
