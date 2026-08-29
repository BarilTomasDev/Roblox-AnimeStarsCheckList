const STORAGE_KEY = "animeStarsChecklist";
const PAGE_KEY = "animeStarsChecklistPage";
const SIDEBAR_SECTIONS_KEY = "animeStarsChecklistSidebarSections";

let state = loadState();
let currentPageId = loadCurrentPage();
let sidebarCollapsedSections = loadSidebarCollapsedSections();

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

function loadCurrentPage() {
  const saved = localStorage.getItem(PAGE_KEY);
  if (saved && CHECKLIST_DATA.some((p) => p.id === saved)) return saved;
  return CHECKLIST_DATA[0].id;
}

function saveCurrentPage() {
  localStorage.setItem(PAGE_KEY, currentPageId);
}

function loadSidebarCollapsedSections() {
  try {
    return JSON.parse(localStorage.getItem(SIDEBAR_SECTIONS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveSidebarCollapsedSections() {
  localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(sidebarCollapsedSections));
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
    if (source.type === "level") {
      for (const item of source.items) {
        possible += item.max;
        collected += getLevel(item.id, item.max);
      }
    } else {
      possible += source.items.length;
      collected += source.items.filter((item) => isChecked(item.id)).length;
    }
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

  const tiers = category.tiers || RARITY_TIERS;
  let earned = 0;
  let total = 0;
  for (const item of category.items) {
    if (item.requires && !isChecked(item.requires)) continue;
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
      if (item.type === "check") {
        total += 1;
        if (isChecked(item.id)) earned += 1;
      } else {
        total += tiers.length;
        earned += getTierIndex(item.id) + 1;
      }
    }
  }
  return { earned, total };
}

function computeWorldProgress(world, includeExcluded) {
  let earned = 0;
  let total = 0;
  for (const category of world.categories) {
    if (category.excludeFromProgress && !includeExcluded) continue;
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

  const textCol = item.subtitle
    ? el("div", { class: "check-item-text" }, [
        label,
        el("span", { class: "check-item-subtitle", text: item.subtitle }),
      ])
    : label;

  const children = [checkbox];
  if (item.rarity) {
    children.push(el("span", { class: `rarity-dot rarity-${item.rarity}` }));
  }
  children.push(textCol);

  const wrapper = el(
    "label",
    {
      class: `check-item${done ? " done" : ""}${item.subtitle ? " check-item-tall" : ""}${item.color ? " stat-colored" : ""}`,
      "data-search": item.name.toLowerCase(),
    },
    children
  );
  if (item.color) wrapper.style.setProperty("--stat-color", item.color);
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

  const wrapper = el(
    "div",
    {
      class: `level-item${done ? " done" : ""}${item.color ? " stat-colored" : ""}`,
      "data-search": item.name.toLowerCase(),
      "data-level-id": item.id,
    },
    [top, bar]
  );
  if (item.color) wrapper.style.setProperty("--stat-color", item.color);
  return wrapper;
}

const COUNT_SUFFIXES = [
  [1e30, "No"], [1e27, "Oc"], [1e24, "Sp"], [1e21, "Sx"], [1e18, "Qi"],
  [1e15, "Qa"], [1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "k"],
];

function formatCount(n) {
  const abs = Math.abs(n);
  const trim = (v) => Number(v.toFixed(2)).toString();
  for (const [value, suffix] of COUNT_SUFFIXES) {
    if (abs >= value) return trim(n / value) + suffix;
  }
  return trim(n);
}

function formatScalePart(part) {
  if (part.unit === "x") return `+${part.value.toFixed(2)}x ${part.label}`;
  if (part.unit === "%") return `+${Math.round(part.value)}% ${part.label}`;
  return `+${part.value.toFixed(1)} ${part.label}`;
}

function formatScaleValue(item, level) {
  const entry = item.levels[level - 1];
  if (Array.isArray(entry.value)) return entry.value.map(formatScalePart).join(", ");
  if (item.unit === "x") return `+${entry.value.toFixed(2)}x`;
  if (item.unit === "%") return `+${Math.round(entry.value)}%`;
  return `+${entry.value.toFixed(1)} ${item.unit}`;
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

  const titleGroup = el("div", { class: "item-title-group" }, [
    el("span", { class: "item-title", text: item.name }),
    done ? el("span", { class: "maxed-badge", text: "MAXED" }) : null,
  ]);

  const top = el("div", { class: "level-item-top" }, [
    titleGroup,
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

  const costUnit = item.costUnit || "Trial Shards";
  const captionText =
    level === 0
      ? `Level 1 costs ${formatCount(item.levels[0].cost)} ${costUnit}`
      : done
      ? `Current: ${formatScaleValue(item, level)} - maxed`
      : `Current: ${formatScaleValue(item, level)} - level ${level + 1} costs ${formatCount(item.levels[level].cost)} ${costUnit}`;
  const caption = el("div", { class: "index-caption", text: captionText });

  const wrapper = el(
    "div",
    {
      class: `level-item${done ? " done" : ""}${item.color ? " stat-colored" : ""}`,
      "data-search": item.name.toLowerCase(),
      "data-level-id": item.id,
    },
    [top, bar, caption]
  );
  if (item.color) wrapper.style.setProperty("--stat-color", item.color);
  return wrapper;
}

function tierIndexFromEvent(e, barEl, total) {
  const rect = barEl.getBoundingClientRect();
  const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
  const fraction = rect.width === 0 ? 0 : x / rect.width;
  if (fraction <= 0) return -1;
  return Math.min(total - 1, Math.floor(fraction * total));
}

function renderTierItem(item, tiers) {
  tiers = tiers || RARITY_TIERS;
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

  const rewardFor = (milestone) => {
    if (!category.rewards) return null;
    const reward = category.rewards[milestone - 1];
    return reward === null || reward === undefined ? "?" : reward;
  };

  const ticks = el(
    "div",
    { class: "tier-ticks" },
    Array.from({ length: category.count - 1 }, (_, i) => {
      const leftPct = ((i + 1) / category.count) * 100;
      const milestone = i + 1;
      const reward = rewardFor(milestone);
      const attrs = { class: "tier-tick", style: `left:${leftPct}%` };
      if (reward) attrs.title = `Milestone ${milestone}: ${reward}`;
      return el("span", attrs);
    })
  );

  const bar = el("div", { class: "index-bar" }, [barFill, ticks]);

  const captionText =
    p.possible === 0
      ? "No pets/avatars defined yet"
      : p.nextThreshold !== null
      ? `${p.collected} / ${p.possible} entries collected - next milestone at ${p.nextThreshold}`
      : `${p.collected} / ${p.possible} entries collected - all milestones reached`;
  const caption = el("div", { class: "index-caption", text: captionText });

  const children = [top, bar, caption];

  if (category.rewards) {
    const currentReward = p.reached > 0 ? rewardFor(p.reached) : null;
    const nextReward = p.nextThreshold !== null ? rewardFor(p.nextThreshold) : null;
    const rewardBits = [];
    if (currentReward) rewardBits.push(`Current bonus: ${currentReward}`);
    if (nextReward) rewardBits.push(`Milestone ${p.nextThreshold} gives: ${nextReward}`);
    if (rewardBits.length) {
      children.push(el("div", { class: "index-reward", text: rewardBits.join(" - ") }));
    }
  }

  return el("div", { class: "index-item" }, children);
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
      { class: category.singleColumn ? "check-list" : "check-grid" },
      category.items.map((item) => renderCheckItem(item, category))
    );
  } else if (category.type === "tier") {
    const visibleItems = category.items.filter((item) => !item.requires || isChecked(item.requires));
    body = el(
      "div",
      { class: `level-list${category.glued ? " glued" : ""}` },
      visibleItems.map((item) =>
        item.type === "check" ? renderCheckItem(item, category) : renderTierItem(item, category.tiers)
      )
    );
  } else if (category.type === "index") {
    body = renderIndexCategory(category, world);
  } else if (category.type === "scale") {
    body = el(
      "div",
      { class: `level-list${category.items.length > 1 ? " scale-grid" : ""}` },
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

const NAV_SECTIONS = [
  { id: "general", label: "General", collapsible: false },
  { id: "worlds", label: "Worlds", collapsible: true },
];

function renderPageNavItem(page) {
  const children = [
    el("span", { class: "page-nav-icon", text: page.icon || "🌍" }),
    el("span", { class: "page-nav-name", text: page.name }),
  ];
  if (!page.hideNavPercent) {
    const p = computeWorldProgress(page);
    const pct = p.total === 0 ? 0 : Math.round((p.earned / p.total) * 100);
    children.push(el("span", { class: "page-nav-percent mono", text: pct + "%" }));
  }
  return el(
    "button",
    {
      class: `page-nav-item${page.id === currentPageId ? " active" : ""}`,
      onclick: () => {
        currentPageId = page.id;
        saveCurrentPage();
        renderAll();
      },
    },
    children
  );
}

function renderPageNav() {
  const nav = document.getElementById("pageNav");
  nav.innerHTML = "";

  for (const section of NAV_SECTIONS) {
    const pages = CHECKLIST_DATA.filter((page) => (page.section || "general") === section.id);
    if (pages.length === 0) continue;

    const isCollapsed = section.collapsible && sidebarCollapsedSections[section.id];

    const headerChildren = [
      el("span", { text: section.label }),
    ];
    if (section.collapsible) {
      headerChildren.push(el("span", { class: "nav-section-chevron", text: "▾" }));
    }

    const headerAttrs = {
      class: `nav-section-header${section.collapsible ? " collapsible" : ""}`,
    };
    if (section.collapsible) {
      headerAttrs.onclick = () => {
        sidebarCollapsedSections[section.id] = !sidebarCollapsedSections[section.id];
        saveSidebarCollapsedSections();
        renderAll();
      };
    }
    const header = el("div", headerAttrs, headerChildren);

    const items = el(
      "div",
      { class: "nav-section-items" },
      pages.map((page) => renderPageNavItem(page))
    );

    nav.appendChild(el("div", { class: `nav-section${isCollapsed ? " collapsed" : ""}` }, [header, items]));
  }
}

function renderPageContent(page) {
  const p = computeWorldProgress(page, page.hideNavPercent);
  const pct = p.total === 0 ? 0 : Math.round((p.earned / p.total) * 100);

  const header = el("div", { class: "page-header" }, [
    el("span", { class: "page-header-icon", text: page.icon || "🌍" }),
    el("div", { class: "page-header-title" }, [
      el("h2", { text: page.name }),
      el("div", { class: "world-progress-bar" }, [
        (() => {
          const fill = el("div", { class: "world-progress-fill" });
          fill.style.width = pct + "%";
          return fill;
        })(),
      ]),
    ]),
    el("span", { class: "page-header-percent mono", text: pct + "%" }),
  ]);

  const body = el(
    "div",
    { class: "world-body" },
    page.categories.map((c) => renderCategory(c, page))
  );

  return el("div", { class: "page" }, [header, body]);
}

function renderAll() {
  renderPageNav();

  const page = CHECKLIST_DATA.find((p) => p.id === currentPageId) || CHECKLIST_DATA[0];
  const container = document.getElementById("pageContent");
  container.innerHTML = "";
  container.appendChild(renderPageContent(page));

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

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.remove();
  document.removeEventListener("keydown", onModalKeydown);
}

function onModalKeydown(e) {
  if (e.key === "Escape") closeModal();
}

function showModal(title, bodyNodes, actionNodes) {
  closeModal();

  const closeBtn = el("button", { class: "modal-close", text: "×", onclick: closeModal });
  const header = el("div", { class: "modal-header" }, [
    el("h3", { text: title }),
    closeBtn,
  ]);
  const body = el("div", { class: "modal-body" }, bodyNodes);
  const actions = el("div", { class: "modal-actions" }, actionNodes);
  const box = el("div", { class: "modal" }, [header, body, actions]);

  const overlay = el("div", { id: "modalOverlay", class: "modal-overlay", onclick: (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  } }, [box]);

  document.body.appendChild(overlay);
  document.addEventListener("keydown", onModalKeydown);
  return box;
}

document.getElementById("copyCodeBtn").addEventListener("click", () => {
  const code = btoa(JSON.stringify(state));

  const textarea = el("textarea", { class: "modal-textarea", readonly: "readonly" });
  textarea.value = code;

  const copyBtn = el("button", {
    class: "btn",
    text: "Copy to Clipboard",
    onclick: () => {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = "Copy to Clipboard"), 1500);
        })
        .catch(() => {
          textarea.select();
          document.execCommand("copy");
        });
    },
  });

  showModal(
    "Your Backup Code",
    [
      el("p", {
        text:
          "This code contains your entire progress. Save it somewhere safe, like a notes app or text file.",
      }),
      el("p", {
        text:
          "To get your progress back later, on this device or a different one, open Restore Code and paste this in.",
      }),
      textarea,
    ],
    [copyBtn, el("button", { class: "btn", text: "Close", onclick: closeModal })]
  );

  textarea.focus();
  textarea.select();
});

document.getElementById("restoreCodeBtn").addEventListener("click", () => {
  const textarea = el("textarea", {
    class: "modal-textarea",
    placeholder: "Paste your backup code here...",
  });
  const errorText = el("p", { class: "modal-error" });

  const restoreBtn = el("button", {
    class: "btn btn-danger",
    text: "Restore",
    onclick: () => {
      const code = textarea.value.trim();
      if (!code) return;
      let restored;
      try {
        restored = JSON.parse(atob(code));
      } catch {
        restored = null;
      }
      if (typeof restored !== "object" || restored === null || Array.isArray(restored)) {
        errorText.textContent = "That doesn't look like a valid backup code.";
        return;
      }
      replaceState(restored);
      if (window.onStateSaved) window.onStateSaved(state);
      closeModal();
    },
  });

  showModal(
    "Restore from Backup Code",
    [
      el("p", {
        text: "Paste a backup code below to restore your progress.",
      }),
      el("p", {
        class: "modal-warning",
        text:
          "This replaces whatever progress is currently saved in this browser. Copy a backup of it first if you might still need it.",
      }),
      textarea,
      errorText,
    ],
    [restoreBtn, el("button", { class: "btn", text: "Cancel", onclick: closeModal })]
  );

  textarea.focus();
});

renderAll();
