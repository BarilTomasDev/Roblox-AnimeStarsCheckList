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

function saveState(skipCloudSync) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!skipCloudSync && window.onStateSaved) window.onStateSaved(state);
}

function replaceState(newState) {
  state = newState || {};
  saveState(true);
  renderAll();
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

function getTierIndex(categoryId) {
  const v = state[categoryId];
  return Number.isInteger(v) ? v : -1;
}

function setTierIndex(categoryId, index) {
  state[categoryId] = index;
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

function computeIndexProgress(category, world) {
  let collected = 0;
  let possible = 0;
  for (const sourceId of category.sources) {
    const source = world.categories.find((c) => c.id === sourceId);
    if (!source) continue;
    possible += source.items.length;
    collected += source.items.filter((item) => isChecked(item.id)).length;
  }

  const reached = Math.min(collected, category.count);
  const nextThreshold = reached < category.count ? reached + 1 : null;

  return { collected, possible, reached, nextThreshold };
}

function computeCategoryProgress(category, world) {
  if (category.type === "index") {
    const p = computeIndexProgress(category, world);
    return { earned: p.reached, total: category.count };
  }
  if (category.type === "soon") {
    return { earned: 0, total: 0 };
  }

  let earned = 0;
  let total = 0;
  for (const item of category.items) {
    if (category.type === "check") {
      total += 1;
      if (isChecked(item.id)) earned += 1;
    } else if (category.type === "level") {
      total += 1;
      earned += getLevel(item.id, item.max) / item.max;
    } else if (category.type === "scale") {
      total += 1;
      earned += getLevel(item.id, item.levels.length) / item.levels.length;
    } else if (category.type === "tier") {
      total += RARITY_TIERS.length;
      earned += getTierIndex(item.id) + 1;
    }
  }
  return { earned, total };
}

function computeWorldProgress(world) {
  let earned = 0;
  let total = 0;
  for (const category of world.categories) {
    if (category.excludeFromProgress) continue;
    if (category.type === "index") {
      const p = computeIndexProgress(category, world);
      total += 1;
      if (p.reached >= category.count) earned += 1;
      continue;
    }
    const p = computeCategoryProgress(category, world);
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
    el("span", { class: "item-title", text: item.name }),
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
    dragState = { kind: "level", id: item.id, max: item.max, lastEvent: e };
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

function formatScaleValue(item, level) {
  const entry = item.levels[level - 1];
  const v = item.unit === "x" ? entry.value.toFixed(2) : entry.value.toFixed(1);
  return item.unit === "x" ? `+${v}x` : `+${v} ${item.unit}`;
}

function renderScaleItem(item) {
  const max = item.levels.length;
  const level = getLevel(item.id, max);
  const done = level >= max;
  const pct = Math.round((level / max) * 100);

  const input = el("input", {
    class: "level-input",
    type: "number",
    min: "0",
    max: String(max),
    value: String(level),
  });
  input.addEventListener("change", () => {
    setLevel(item.id, input.value, max);
    renderAll();
  });

  const minusBtn = el("button", {
    class: "level-btn",
    text: "−",
    onclick: () => {
      setLevel(item.id, getLevel(item.id, max) - 1, max);
      renderAll();
    },
  });
  const plusBtn = el("button", {
    class: "level-btn",
    text: "+",
    onclick: () => {
      setLevel(item.id, getLevel(item.id, max) + 1, max);
      renderAll();
    },
  });

  const top = el("div", { class: "level-item-top" }, [
    el("span", { class: "item-title", text: item.name }),
    el("div", { class: "level-item-controls" }, [
      minusBtn,
      input,
      el("span", { class: "level-max", text: `/ ${max}` }),
      plusBtn,
    ]),
  ]);

  const barFill = el("div", { class: "level-bar-fill" });
  barFill.style.width = pct + "%";
  const bar = el("div", { class: "level-bar" }, [barFill]);
  bar.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragState = { kind: "level", id: item.id, max, lastEvent: e };
    setLevel(item.id, levelValueFromEvent(e, bar, max), max);
    renderAll();
  });

  const captionText =
    level === 0
      ? `Level 1 costs ${item.levels[0].cost} Trial Shards`
      : done
      ? `Current: ${formatScaleValue(item, level)} — maxed`
      : `Current: ${formatScaleValue(item, level)} — level ${level + 1} costs ${item.levels[level].cost} Trial Shards`;
  const caption = el("div", { class: "index-caption", text: captionText });

  return el(
    "div",
    {
      class: `level-item${done ? " done" : ""}`,
      "data-search": item.name.toLowerCase(),
      "data-level-id": item.id,
    },
    [top, bar, caption]
  );
}

function tierIndexFromEvent(e, barEl, total) {
  const rect = barEl.getBoundingClientRect();
  const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
  const fraction = rect.width === 0 ? 0 : x / rect.width;
  if (fraction <= 0) return -1;
  return Math.min(total - 1, Math.floor(fraction * total));
}

function renderTierItem(item) {
  const tiers = RARITY_TIERS;
  const total = tiers.length;
  const selected = getTierIndex(item.id);
  const step = selected + 1;
  const pct = (step / total) * 100;
  const currentName = selected >= 0 ? tiers[selected].name : "None";
  const currentRarityClass = selected >= 0 ? `rarity-${tiers[selected].rarity}` : "";

  const minusBtn = el("button", {
    class: "level-btn",
    text: "−",
    onclick: () => {
      setTierIndex(item.id, Math.max(-1, selected - 1));
      renderAll();
    },
  });
  const plusBtn = el("button", {
    class: "level-btn",
    text: "+",
    onclick: () => {
      setTierIndex(item.id, Math.min(total - 1, selected + 1));
      renderAll();
    },
  });

  const valueLabel = el("span", {
    class: `tier-value ${currentRarityClass}`,
    text: currentName,
  });

  const top = el("div", { class: "level-item-top" }, [
    el("span", { class: "item-title", text: item.name }),
    el("div", { class: "level-item-controls" }, [
      minusBtn,
      valueLabel,
      el("span", { class: "level-max", text: `/ ${tiers[total - 1].name}` }),
      plusBtn,
    ]),
  ]);

  const barFill = el("div", { class: `tier-bar-fill ${currentRarityClass}` });
  barFill.style.width = pct + "%";

  const ticks = el(
    "div",
    { class: "tier-ticks" },
    tiers.slice(1).map((_, idx) => {
      const leftPct = ((idx + 1) / total) * 100;
      return el("span", { class: "tier-tick", style: `left:${leftPct}%` });
    })
  );

  const bar = el("div", { class: "tier-bar" }, [barFill, ticks]);
  bar.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragState = { kind: "tier", id: item.id, total, lastEvent: e };
    setTierIndex(item.id, tierIndexFromEvent(e, bar, total));
    renderAll();
  });

  const labels = el(
    "div",
    { class: "tier-labels" },
    tiers.map((tier) => el("span", { class: "tier-label-item", text: tier.name }))
  );

  return el(
    "div",
    { class: "tier-item", "data-tier-id": item.id, "data-search": item.name.toLowerCase() },
    [top, bar, labels]
  );
}

function renderIndexCategory(category, world) {
  const p = computeIndexProgress(category, world);
  const pct = category.count === 0 ? 0 : (p.reached / category.count) * 100;

  const valueLabel = el("span", {
    class: "index-value",
    text: `${p.reached} / ${category.count}`,
  });

  const top = el("div", { class: "level-item-top" }, [
    el("span", { class: "item-title", text: category.name }),
    valueLabel,
  ]);

  const barFill = el("div", { class: "index-bar-fill" });
  barFill.style.width = pct + "%";

  const ticks = el(
    "div",
    { class: "tier-ticks" },
    Array.from({ length: category.count - 1 }, (_, i) => {
      const leftPct = ((i + 1) / category.count) * 100;
      return el("span", { class: "tier-tick", style: `left:${leftPct}%` });
    })
  );

  const bar = el("div", { class: "index-bar" }, [barFill, ticks]);

  const captionText =
    p.possible === 0
      ? "No pets/avatars defined yet"
      : p.nextThreshold !== null
      ? `${p.collected} / ${p.possible} entries collected — next milestone at ${p.nextThreshold}`
      : `${p.collected} / ${p.possible} entries collected — all milestones reached`;
  const caption = el("div", { class: "index-caption", text: captionText });

  return el("div", { class: "index-item" }, [top, bar, caption]);
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
  if (e.buttons === 0) {
    dragState = null;
    return;
  }
  dragState.lastEvent = e;
  if (dragRafPending) return;
  dragRafPending = true;
  requestAnimationFrame(() => {
    dragRafPending = false;
    if (!dragState) return;
    if (dragState.kind === "level") {
      const barEl = document.querySelector(`.level-item[data-level-id="${dragState.id}"] .level-bar`);
      if (!barEl) return;
      setLevel(dragState.id, levelValueFromEvent(dragState.lastEvent, barEl, dragState.max), dragState.max);
    } else if (dragState.kind === "tier") {
      const barEl = document.querySelector(`.tier-item[data-tier-id="${dragState.id}"] .tier-bar`);
      if (!barEl) return;
      setTierIndex(dragState.id, tierIndexFromEvent(dragState.lastEvent, barEl, dragState.total));
    }
    renderAll();
  });
}

window.addEventListener("pointermove", scheduleDragUpdate);
window.addEventListener("pointerup", () => { dragState = null; });
window.addEventListener("pointercancel", () => { dragState = null; });

function renderCategory(category, world) {
  if (category.type === "soon") {
    const title = el("h3", { class: "category-title" }, [
      document.createTextNode(category.name + " "),
      el("span", { class: "soon-badge", text: "Coming soon" }),
    ]);
    const body = el("div", { class: "soon-note", text: "Not implemented yet." });
    return el("div", { class: "category category-soon" }, [title, body]);
  }

  const p = computeCategoryProgress(category, world);
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
  } else if (category.type === "tier") {
    body = el(
      "div",
      { class: "level-list" },
      category.items.map((item) => renderTierItem(item))
    );
  } else if (category.type === "index") {
    body = renderIndexCategory(category, world);
  } else if (category.type === "scale") {
    body = el(
      "div",
      { class: "level-list" },
      category.items.map((item) => renderScaleItem(item))
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
    world.categories.map((c) => renderCategory(c, world))
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
  if (confirm("Reset all progress? This action cannot be undone.")) {
    state = {};
    saveState();
    renderAll();
  }
});

renderAll();
