'use strict';

// ---- Storage keys ----
const LS_LOG = 'nt_log_v1';       // { date: 'YYYY-MM-DD', items: [...] }
const LS_FREQ = 'nt_freq_v1';     // { foodId: count } — drives quick-add ranking

// ---- State ----
let logState = loadLog();
let freq = loadJSON(LS_FREQ, {});
let selectedFood = null;

// ---- Element refs ----
const el = {
  totalCalories: document.getElementById('totalCalories'),
  totalProtein: document.getElementById('totalProtein'),
  totalFat: document.getElementById('totalFat'),
  quickAddList: document.getElementById('quickAddList'),
  searchInput: document.getElementById('searchInput'),
  searchResults: document.getElementById('searchResults'),
  categorySelect: document.getElementById('categorySelect'),
  foodSelect: document.getElementById('foodSelect'),
  addForm: document.getElementById('addForm'),
  selectedFoodName: document.getElementById('selectedFoodName'),
  selectedFoodMacros: document.getElementById('selectedFoodMacros'),
  quantityInput: document.getElementById('quantityInput'),
  quantityUnit: document.getElementById('quantityUnit'),
  addFoodBtn: document.getElementById('addFoodBtn'),
  logList: document.getElementById('logList'),
  emptyLogMsg: document.getElementById('emptyLogMsg'),
  clearDayBtn: document.getElementById('clearDayBtn'),
};

// ---- Helpers ----
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage full/blocked */ }
}

function loadLog() {
  const stored = loadJSON(LS_LOG, null);
  if (stored && stored.date === todayStr() && Array.isArray(stored.items)) {
    return stored;
  }
  // New day (or no log yet): start fresh.
  return { date: todayStr(), items: [] };
}

function saveLog() { saveJSON(LS_LOG, logState); }

function foodById(id) { return FOOD_DB.find(f => f.id === id) || null; }

function round(n, dp = 0) {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

// Macros for a given food and number of servings.
function scaled(food, servings) {
  return {
    calories: food.calories * servings,
    protein: food.protein * servings,
    fat: food.fat * servings,
  };
}

// ---- Rendering ----
function renderTotals() {
  const t = logState.items.reduce((acc, it) => {
    acc.calories += it.calories;
    acc.protein += it.protein;
    acc.fat += it.fat;
    return acc;
  }, { calories: 0, protein: 0, fat: 0 });

  el.totalCalories.textContent = round(t.calories);
  el.totalProtein.textContent = round(t.protein);
  el.totalFat.textContent = round(t.fat);
}

function renderLog() {
  el.logList.innerHTML = '';
  if (logState.items.length === 0) {
    el.emptyLogMsg.classList.remove('hidden');
  } else {
    el.emptyLogMsg.classList.add('hidden');
  }

  logState.items.forEach((it) => {
    const li = document.createElement('li');
    li.className = 'log-item';

    const info = document.createElement('div');
    info.className = 'log-item-info';
    const qtyText = formatQty(it.servings, it.servingSize, it.servingUnit);
    info.innerHTML = `<div class="log-item-name">${escapeHtml(it.name)}</div>
      <div class="log-item-qty">${qtyText}</div>`;

    const macros = document.createElement('div');
    macros.className = 'log-item-macros';
    macros.innerHTML = `<span class="m-cal">${round(it.calories)}</span>
      <span class="m-protein">${round(it.protein, 1)}p</span>
      <span class="m-fat">${round(it.fat, 1)}f</span>`;

    const rm = document.createElement('button');
    rm.className = 'remove-btn';
    rm.setAttribute('aria-label', 'Remove ' + it.name);
    rm.innerHTML = '&times;';
    rm.addEventListener('click', () => removeItem(it.uid));

    li.appendChild(info);
    li.appendChild(macros);
    li.appendChild(rm);
    el.logList.appendChild(li);
  });
}

// Human-readable quantity, e.g. "2 × 1 medium" or "150 g".
function formatQty(servings, servingSize, servingUnit) {
  const totalAmount = round(servings * servingSize, 2);
  return `${totalAmount} ${servingUnit}`;
}

function renderQuickAdd() {
  el.quickAddList.innerHTML = '';

  // Rank by past usage frequency; fall back to common foods for a fresh install.
  const ranked = Object.keys(freq)
    .map(id => ({ id, count: freq[id] }))
    .sort((a, b) => b.count - a.count)
    .map(x => foodById(x.id))
    .filter(Boolean);

  let quick = ranked.slice(0, 8);

  if (quick.length < 8) {
    const seen = new Set(quick.map(f => f.id));
    for (const f of FOOD_DB) {
      if (quick.length >= 8) break;
      if (f.common && !seen.has(f.id)) { quick.push(f); seen.add(f.id); }
    }
  }

  quick.forEach((food) => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.innerHTML = `${escapeHtml(food.name)}<span class="chip-sub">${round(food.calories)} kcal</span>`;
    chip.addEventListener('click', () => {
      addFood(food, 1);
      flashChip(chip);
    });
    el.quickAddList.appendChild(chip);
  });
}

function flashChip(chip) {
  chip.style.background = 'var(--accent)';
  chip.style.color = '#08120d';
  setTimeout(() => { chip.style.background = ''; chip.style.color = ''; }, 220);
}

// ---- Category / food pickers ----
function initCategories() {
  CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    el.categorySelect.appendChild(opt);
  });
}

function populateFoodSelect(category) {
  el.foodSelect.innerHTML = '<option value="">Food…</option>';
  if (!category) {
    el.foodSelect.disabled = true;
    return;
  }
  const foods = FOOD_DB.filter(f => f.category === category); // already common-first, alphabetical
  foods.forEach((food) => {
    const opt = document.createElement('option');
    opt.value = food.id;
    opt.textContent = food.name;
    el.foodSelect.appendChild(opt);
  });
  el.foodSelect.disabled = false;
}

// ---- Add form ----
function selectFood(food) {
  selectedFood = food;
  el.selectedFoodName.textContent = food.name;
  el.selectedFoodMacros.textContent =
    `Per ${food.servingSize} ${food.servingUnit}: ${food.calories} kcal · ${food.protein}g protein · ${food.fat}g fat`;
  el.quantityInput.value = food.servingSize;
  el.quantityUnit.textContent = food.servingUnit;
  el.addForm.classList.remove('hidden');
}

function clearAddForm() {
  selectedFood = null;
  el.addForm.classList.add('hidden');
  el.foodSelect.value = '';
}

// Add from the picker form using the amount the user typed (in serving units).
function addFromForm() {
  if (!selectedFood) return;
  const amount = parseFloat(el.quantityInput.value);
  if (!isFinite(amount) || amount <= 0) {
    el.quantityInput.focus();
    return;
  }
  const servings = amount / selectedFood.servingSize;
  addFood(selectedFood, servings);
  clearAddForm();
  el.categorySelect.value = '';
  populateFoodSelect('');
}

// Core add: append a scaled entry to today's log and bump usage frequency.
function addFood(food, servings) {
  const m = scaled(food, servings);
  logState.items.push({
    uid: Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    foodId: food.id,
    name: food.name,
    servings: servings,
    servingSize: food.servingSize,
    servingUnit: food.servingUnit,
    calories: m.calories,
    protein: m.protein,
    fat: m.fat,
  });
  saveLog();

  freq[food.id] = (freq[food.id] || 0) + 1;
  saveJSON(LS_FREQ, freq);

  renderAll();
}

function removeItem(uid) {
  logState.items = logState.items.filter(it => it.uid !== uid);
  saveLog();
  renderTotals();
  renderLog();
}

function clearDay() {
  if (logState.items.length === 0) return;
  if (!confirm("Clear today's log? This can't be undone.")) return;
  logState.items = [];
  saveLog();
  renderTotals();
  renderLog();
}

// ---- Search ----
function runSearch(q) {
  const query = q.trim().toLowerCase();
  if (!query) {
    el.searchResults.classList.add('hidden');
    el.searchResults.innerHTML = '';
    return;
  }
  const matches = FOOD_DB
    .filter(f => f.name.toLowerCase().includes(query) || f.category.toLowerCase().includes(query))
    .slice(0, 12);

  el.searchResults.innerHTML = '';
  if (matches.length === 0) {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `<span class="result-name">No matches</span>`;
    el.searchResults.appendChild(div);
  } else {
    matches.forEach((food) => {
      const div = document.createElement('div');
      div.className = 'result-item';
      div.innerHTML = `<span class="result-name">${escapeHtml(food.name)}</span>
        <span class="result-meta">${round(food.calories)} kcal · ${food.protein}p · ${food.fat}f</span>`;
      div.addEventListener('click', () => {
        addFood(food, 1);
        el.searchInput.value = '';
        el.searchResults.classList.add('hidden');
        el.searchResults.innerHTML = '';
        el.searchInput.blur();
      });
      el.searchResults.appendChild(div);
    });
  }
  el.searchResults.classList.remove('hidden');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderAll() {
  renderTotals();
  renderLog();
  renderQuickAdd();
}

// ---- Wire up events ----
el.categorySelect.addEventListener('change', (e) => {
  populateFoodSelect(e.target.value);
  clearAddForm();
});

el.foodSelect.addEventListener('change', (e) => {
  const food = foodById(e.target.value);
  if (food) selectFood(food);
  else el.addForm.classList.add('hidden');
});

el.addFoodBtn.addEventListener('click', addFromForm);
el.quantityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addFromForm();
});

el.searchInput.addEventListener('input', (e) => runSearch(e.target.value));
el.searchInput.addEventListener('focus', (e) => { if (e.target.value.trim()) runSearch(e.target.value); });

// Close search results when tapping outside.
document.addEventListener('click', (e) => {
  if (!el.searchInput.contains(e.target) && !el.searchResults.contains(e.target)) {
    el.searchResults.classList.add('hidden');
  }
});

el.clearDayBtn.addEventListener('click', clearDay);

// If the app is reopened on a new day, roll over to a fresh log.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && logState.date !== todayStr()) {
    logState = loadLog();
    renderAll();
  }
});

// ---- Boot ----
initCategories();
renderAll();
