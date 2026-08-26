const STORAGE_KEY = "animeStarsChecklist";
const COLLAPSE_KEY = "animeStarsChecklistCollapsed";

let state = loadState();
let collapsed = loadCollapsed();

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadCollapsed() {
  try {
    return JSON.parse(localStorage.getItem(COLLAPSE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCollapsed() {
  localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsed));
}

function isChecked(id) {
  return !!state[id];
}

function getLevel(id, max) {
  const v = Number(state[id]);
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.min(v, max);
}

function setLevel(id, value, max) {
  const v = Math.max(0, Math.min(Number(value) || 0, max));
  state[id] = v;
  saveState();
}

function toggleCheck(id) {
  state[id] = !state[id];
  saveState();
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c) node.appendChild(c);
  }
  return node;
}

function computeCategoryProgress(category) {
  let earned = 0;
  let total = 0;
  for (const item of category.items) {
    total += 1;
    if (category.type === "check") {
      if (isChecked(item.id)) earned += 1;
    } else if (category.type === "level") {
      earned += getLevel(item.id, item.max) / item.max;
    }
  }
  return { earned, total };
}

function computeWorldProgress(world) {
  let earned = 0;
  let total = 0;
  for (const category of world.categories) {
    const p = computeCategoryProgress(category);
    earned += p.earned;
    total += p.total;
  }
  return { earned, total };
}

function computeGlobalProgress() {
  let earned = 0;
  let total = 0;
  for (const world of CHECKLIST_DATA) {
    const p = computeWorldProgress(world);
    earned += p.earned;
    total += p.total;
  }
  return { earned, total };
}

function renderCheckItem(item, category) {
  const done = isChecked(item.id);
  const label = el("span", { class: "check-item-label", text: item.name });
  const checkbox = el("input", {
    type: "checkbox",
    onchange: () => {
      toggleCheck(item.id);
      renderAll();
    },
  });
  checkbox.checked = done;

  const children = [checkbox];
  if (item.rarity) {
    children.push(el("span", { class: `rarity-dot rarity-${item.rarity}` }));
  }
  children.push(label);

  const wrapper = el(
    "label",
    {
      class: `check-item${done ? " done" : ""}`,
      "data-search": item.name.toLowerCase(),
    },
    children
  );
  return wrapper;
}

function renderLevelItem(item) {
  const value = getLevel(item.id, item.max);
  const done = value >= item.max;
  const pct = Math.round((value / item.max) * 100);

  const input = el("input", {
    class: "level-input",
    type: "number",
    min: "0",
    max: String(item.max),
    value: String(value),
  });
  input.addEventListener("change", () => {
    setLevel(item.id, input.value, item.max);
    renderAll();
  });

  const minusBtn = el("button", {
    class: "level-btn",
    text: "−",
    onclick: () => {
      setLevel(item.id, getLevel(item.id, item.max) - 1, item.max);
      renderAll();
    },
  });
  const plusBtn = el("button", {
    class: "level-btn",
    text: "+",
    onclick: () => {
      setLevel(item.id, getLevel(item.id, item.max) + 1, item.max);
      renderAll();
    },
  });

  const top = el("div", { class: "level-item-top" }, [
    el("span", { class: "level-item-label", text: item.name }),
    el("div", { class: "level-item-controls" }, [
      minusBtn,
      input,
      el("span", { class: "level-max", text: `/ ${item.max}` }),
      plusBtn,
    ]),
  ]);

  const barFill = el("div", { class: "level-bar-fill" });
  barFill.style.width = pct + "%";
  const bar = el("div", { class: "level-bar" }, [barFill]);
  bar.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragState = { id: item.id, max: item.max, lastEvent: e };
    setLevel(item.id, levelValueFromEvent(e, bar, item.max), item.max);
    renderAll();
  });

  return el(
    "div",
    {
      class: `level-item${done ? " done" : ""}`,
      "data-search": item.name.toLowerCase(),
      "data-level-id": item.id,
    },
    [top, bar]
  );
}

let dragState = null;
let dragRafPending = false;

function levelValueFromEvent(e, barEl, max) {
  const rect = barEl.getBoundingClientRect();
  const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
  const fraction = rect.width === 0 ? 0 : x / rect.width;
  return Math.round(fraction * max);
}

function scheduleDragUpdate(e) {
  if (!dragState) return;
  dragState.lastEvent = e;
  if (dragRafPending) return;
  dragRafPending = true;
  requestAnimationFrame(() => {
    dragRafPending = false;
    if (!dragState) return;
    const barEl = document.querySelector(`.level-item[data-level-id="${dragState.id}"] .level-bar`);
    if (!barEl) return;
    setLevel(dragState.id, levelValueFromEvent(dragState.lastEvent, barEl, dragState.max), dragState.max);
    renderAll();
  });
}

window.addEventListener("pointermove", scheduleDragUpdate);
window.addEventListener("pointerup", () => { dragState = null; });
window.addEventListener("pointercancel", () => { dragState = null; });

function renderCategory(category) {
  const p = computeCategoryProgress(category);
  const title = el("h3", { class: "category-title" }, [
    document.createTextNode(category.name + " "),
    el("span", { class: "cat-count", text: `(${Math.floor(p.earned)}/${p.total})` }),
  ]);

  let body;
  if (category.type === "check") {
    body = el(
      "div",
      { class: "check-grid" },
      category.items.map((item) => renderCheckItem(item, category))
    );
  } else {
    body = el(
      "div",
      { class: "level-list" },
      category.items.map((item) => renderLevelItem(item))
    );
  }

  return el("div", { class: "category" }, [title, body]);
}

function renderWorld(world) {
  const p = computeWorldProgress(world);
  const pct = p.total === 0 ? 0 : Math.round((p.earned / p.total) * 100);
  const isCollapsed = !!collapsed[world.id];

  const header = el(
    "div",
    {
      class: "world-header",
      onclick: () => {
        collapsed[world.id] = !collapsed[world.id];
        saveCollapsed();
        renderAll();
      },
    },
    [
      el("span", { class: "world-icon", text: world.icon || "🌍" }),
      el("div", { class: "world-title" }, [
        el("h2", { text: world.name }),
        el("div", { class: "world-progress-bar" }, [
          (() => {
            const fill = el("div", { class: "world-progress-fill" });
            fill.style.width = pct + "%";
            return fill;
          })(),
        ]),
      ]),
      el("span", { class: "world-percent", text: pct + "%" }),
      el("span", { class: "chevron", text: "▾" }),
    ]
  );

  const body = el(
    "div",
    { class: "world-body" },
    world.categories.map((c) => renderCategory(c))
  );

  return el("div", { class: `world${isCollapsed ? " collapsed" : ""}` }, [header, body]);
}

function renderAll() {
  const container = document.getElementById("worldsContainer");
  container.innerHTML = "";
  for (const world of CHECKLIST_DATA) {
    container.appendChild(renderWorld(world));
  }

  const g = computeGlobalProgress();
  const gPct = g.total === 0 ? 0 : Math.round((g.earned / g.total) * 100);
  document.getElementById("globalPercentLabel").textContent = gPct + "%";
  document.getElementById("globalCountLabel").textContent = `${Math.floor(g.earned)} / ${g.total}`;
  document.getElementById("globalProgressFill").style.width = gPct + "%";

  applySearchFilter();
}

function applySearchFilter() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const items = document.querySelectorAll("[data-search]");
  items.forEach((node) => {
    const matches = !query || node.getAttribute("data-search").includes(query);
    node.classList.toggle("hidden-by-filter", !matches);
  });
}

document.getElementById("searchInput").addEventListener("input", applySearchFilter);

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Réinitialiser toute la progression ? Cette action est irréversible.")) {
    state = {};
    saveState();
    renderAll();
  }
});

renderAll();
