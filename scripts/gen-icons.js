// Generates the app icons (solid dark bg + accent "leaf/fork" mark) as PNGs.
// Pure Node: hand-rolled PNG encoder using zlib. Run: node scripts/gen-icons.js
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

function encodePNG(size, pixels) {
  // pixels: Uint8Array RGBA, length size*size*4
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter type none
    pixels.copy
      ? pixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
      : Buffer.from(pixels.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Modernist design: light tile, bold red square "plate" ring split by a bar.
// Sharp geometry (Chebyshev/square distance), 0px radius — matches the theme.
function drawIcon(size) {
  const px = Buffer.alloc(size * size * 4);
  const bg = [243, 242, 242];   // #f3f2f2
  const accent = [236, 48, 19]; // #ec3013

  const set = (x, y, c, a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = a;
  };

  // Background fill.
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) set(x, y, bg);

  const cx = (size - 1) / 2, cy = (size - 1) / 2;
  const outer = size * 0.30;
  const inner = size * 0.185;

  // A square accent ring (a plate, rendered sharp for the Modernist look).
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cheb = Math.max(Math.abs(x - cx), Math.abs(y - cy));
      if (cheb <= outer && cheb >= inner) set(x, y, accent);
    }
  }

  // A vertical bar notching through the ring for a clean split.
  const barW = Math.max(2, Math.round(size * 0.04));
  for (let y = Math.round(cy - outer * 1.2); y <= Math.round(cy + outer * 1.2); y++) {
    for (let x = Math.round(cx - barW / 2); x <= Math.round(cx + barW / 2); x++) {
      set(x, y, bg);
    }
  }

  return px;
}

const outDir = path.join(__dirname, '..', 'icons');
fs.mkdirSync(outDir, { recursive: true });

[180, 192, 512].forEach((size) => {
  const pixels = drawIcon(size);
  const png = encodePNG(size, pixels);
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), png);
  console.log(`wrote icons/icon-${size}.png (${png.length} bytes)`);
});
