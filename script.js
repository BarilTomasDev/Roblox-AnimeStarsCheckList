const STORAGE_KEY = "animeStarsChecklist";
const PAGE_KEY = "animeStarsChecklistPage";
const SIDEBAR_SECTIONS_KEY = "animeStarsChecklistSidebarSections";
const PROMO_RANK_KEY = "animeStarsChecklistPromoRank";

let state = loadState();
let currentPageId = loadCurrentPage();
let sidebarCollapsedSections = loadSidebarCollapsedSections();
let viewedPromoRank = loadViewedPromoRank();

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

function loadViewedPromoRank() {
  const v = Number(localStorage.getItem(PROMO_RANK_KEY));
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

function saveViewedPromoRank(rank) {
  viewedPromoRank = rank;
  localStorage.setItem(PROMO_RANK_KEY, String(rank));
}

function promoMissionId(rankIdx, missionIdx) {
  return `promo-r${rankIdx}-m${missionIdx}`;
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
  if (category.type === "promotion") {
    let earned = 0;
    let total = 0;
    category.ranks.forEach((rank, rankIdx) => {
      rank.missions.forEach((_, missionIdx) => {
        total += 1;
        if (isChecked(promoMissionId(rankIdx, missionIdx))) earned += 1;
      });
    });
    return { earned, total };
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
      if (item.type === "check") {
        total += 1;
        if (isChecked(item.id)) earned += 1;
      } else {
        total += 1;
        earned += getLevel(item.id, item.levels.length) / item.levels.length;
      }
    } else if (category.type === "tier") {
      if (item.type === "check") {
        total += 1;
        if (isChecked(item.id)) earned += 1;
      } else {
        total += tiers.length;
        earned += getTierIndex(item.id) + 1;
      }
    } else if (category.type === "priority") {
      total += 1;
      if (isChecked(item.id)) earned += 1;
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

function progressPercent(earned, total) {
  if (total === 0) return 0;
  if (earned >= total) return 100;
  return Math.min(99, Math.round((earned / total) * 100));
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
      "data-item-id": item.id,
    },
    children
  );
  if (item.color) wrapper.style.setProperty("--stat-color", item.color);
  return wrapper;
}

function renderPriorityCard(item) {
  const done = isChecked(item.id);
  const checkbox = el("input", {
    type: "checkbox",
    class: "priority-card-check",
    onchange: () => {
      toggleCheck(item.id);
      renderAll();
    },
  });
  checkbox.checked = done;

  const icon = item.image
    ? el("img", { class: "priority-card-icon priority-card-img", src: item.image, alt: "" })
    : el("div", { class: "priority-card-icon", text: item.name.slice(0, 1) });
  if (item.color) icon.style.setProperty("--stat-color", item.color);

  const children = [
    el("span", { class: "priority-card-rank mono", text: item.rank != null ? `#${item.rank}` : "?" }),
    checkbox,
    icon,
    el("div", { class: "priority-card-name", text: item.name }),
  ];
  if (item.subtitle) {
    children.push(el("div", { class: "priority-card-subtitle", text: item.subtitle }));
  }

  return el(
    "label",
    { class: `priority-card${done ? " done" : ""}`, "data-item-id": item.id },
    children
  );
}

function renderPriorityCategory(category) {
  const rows = category.tiers.map((t) => {
    const items = category.items.filter((item) => item.tier === t.label);
    if (items.length === 0) return null;
    const label = el("div", { class: "priority-tier-label", text: t.label });
    label.style.setProperty("--tier-color", t.color);
    const cards = el(
      "div",
      { class: "priority-tier-items" },
      items.map((item) => renderPriorityCard(item))
    );
    return el("div", { class: "priority-tier-row" }, [label, cards]);
  });
  return el("div", { class: "priority-tierlist" }, rows);
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
      "data-item-id": item.id,
      "data-level-id": item.id,
    },
    [top, bar]
  );
  if (item.color) wrapper.style.setProperty("--stat-color", item.color);
  return wrapper;
}

const LATIN_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function letterTierSuffixes(marker, startExp) {
  return LATIN_UPPER.map((letter, i) => [Math.pow(10, startExp + i * 3), `${marker}${letter}`]).reverse();
}

const COUNT_SUFFIXES = [
  ...letterTierSuffixes("υ", 114),
  ...letterTierSuffixes("β", 36),
  [1e33, "De"], [1e30, "No"], [1e27, "Oc"], [1e24, "Sp"], [1e21, "Sx"], [1e18, "Qi"],
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
  const costPhrase = (idx) => {
    const cost = item.levels[idx].cost;
    return cost == null ? "" : ` costs ${formatCount(cost)} ${costUnit}`;
  };
  const estimatedSuffix = item.estimated ? " (estimated)" : "";
  const captionText =
    (level === 0
      ? `Level 1${costPhrase(0)}`
      : done
      ? `Current: ${formatScaleValue(item, level)} - maxed`
      : `Current: ${formatScaleValue(item, level)} - level ${level + 1}${costPhrase(level)}`) +
    estimatedSuffix;
  const caption = el("div", { class: "index-caption", text: captionText });

  const wrapper = el(
    "div",
    {
      class: `level-item${done ? " done" : ""}${item.color ? " stat-colored" : ""}`,
      "data-item-id": item.id,
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

  const caption = item.rarityValues
    ? el("div", {
        class: "index-caption",
        text:
          selected >= 0
            ? selected < total - 1
              ? `Current: ${item.rarityValues[selected]} - next: ${tiers[selected + 1].name} (${item.rarityValues[selected + 1]})`
              : `Current: ${item.rarityValues[selected]} - maxed`
            : `${tiers[0].name} gives ${item.rarityValues[0]}`,
      })
    : null;

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
    { class: "tier-item", "data-tier-id": item.id, "data-item-id": item.id },
    caption ? [top, bar, labels, caption] : [top, bar, labels]
  );
}

function isPromoRankComplete(category, rankIdx) {
  return category.ranks[rankIdx].missions.every((_, i) => isChecked(promoMissionId(rankIdx, i)));
}

function computeUnlockedPromoRank(category) {
  const maxRank = category.ranks.length - 1;
  let unlocked = 0;
  while (unlocked < maxRank && isPromoRankComplete(category, unlocked)) unlocked++;
  return unlocked;
}

function renderPromotionCategory(category) {
  const maxRank = category.ranks.length - 1;
  const unlocked = computeUnlockedPromoRank(category);
  let viewed = Math.min(Math.max(viewedPromoRank, 0), Math.min(unlocked, maxRank));
  if (viewed !== viewedPromoRank) saveViewedPromoRank(viewed);

  const rank = category.ranks[viewed];
  const goTo = (idx) => {
    saveViewedPromoRank(idx);
    renderAll();
  };

  const prevAttrs = { class: "promo-nav-btn", text: "←", onclick: () => goTo(viewed - 1) };
  if (viewed === 0) prevAttrs.disabled = "disabled";
  const nextAttrs = { class: "promo-nav-btn", text: "→", onclick: () => goTo(viewed + 1) };
  if (viewed >= unlocked) nextAttrs.disabled = "disabled";

  const indexStrip = el(
    "div",
    { class: "promo-index" },
    category.ranks.map((_, idx) => {
      const locked = idx > unlocked;
      const itemAttrs = {
        class: `promo-index-item${idx === viewed ? " active" : ""}${locked ? " locked" : ""}${!locked && isPromoRankComplete(category, idx) ? " done" : ""}`,
        text: String(idx),
        onclick: () => goTo(idx),
      };
      if (locked) itemAttrs.disabled = "disabled";
      return el("button", itemAttrs);
    })
  );

  const statsPanel = rank.stats.length
    ? el(
        "div",
        { class: "promo-stats-grid" },
        rank.stats.map((s) => el("div", { class: "promo-stat-chip", text: s }))
      )
    : el("div", { class: "promo-stats-empty", text: "No bonus stats at this rank." });

  const missionsList = el(
    "div",
    { class: "promo-missions" },
    rank.missions.map((text, i) => {
      const id = promoMissionId(viewed, i);
      const done = isChecked(id);
      const checkbox = el("input", {
        type: "checkbox",
        onchange: () => {
          toggleCheck(id);
          renderAll();
        },
      });
      checkbox.checked = done;
      return el("label", { class: `promo-mission${done ? " done" : ""}` }, [
        checkbox,
        el("span", { class: "promo-mission-text", text }),
      ]);
    })
  );

  const allDone = isPromoRankComplete(category, viewed);
  const completeAllAttrs = {
    class: "btn promo-complete-all",
    text: allDone ? "All missions complete" : "Complete All Missions",
    onclick: () => {
      rank.missions.forEach((_, i) => {
        const id = promoMissionId(viewed, i);
        if (!isChecked(id)) toggleCheck(id);
      });
      renderAll();
    },
  };
  if (allDone) completeAllAttrs.disabled = "disabled";

  const header = el("div", { class: "promo-header" }, [
    el("button", prevAttrs),
    el("div", { class: "promo-rank-title" }, [
      el("span", { class: "promo-rank-label", text: "RANK" }),
      el("span", { class: "promo-rank-number", text: String(viewed) }),
    ]),
    el("button", nextAttrs),
  ]);

  return el("div", { class: "promo-page" }, [
    indexStrip,
    header,
    el("div", { class: "promo-section-label", text: "Stats" }),
    statsPanel,
    el("div", { class: "promo-section-label", text: "Missions" }),
    missionsList,
    el("button", completeAllAttrs),
  ]);
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
  if (category.type === "promotion") {
    return renderPromotionCategory(category);
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
  } else if (category.type === "priority") {
    body = renderPriorityCategory(category);
  } else if (category.type === "index") {
    body = renderIndexCategory(category, world);
  } else if (category.type === "scale") {
    const visibleItems = category.items.filter((item) => !item.requires || isChecked(item.requires));
    const useGrid = visibleItems.length > 1 && !visibleItems.some((item) => item.type === "check");
    body = el(
      "div",
      { class: `level-list${useGrid ? " scale-grid" : ""}` },
      visibleItems.map((item) =>
        item.type === "check" ? renderCheckItem(item, category) : renderScaleItem(item)
      )
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
  { id: "general", label: "General", collapsible: true },
  { id: "worlds", label: "Worlds", collapsible: true },
];

function renderPageNavItem(page) {
  const children = [
    el("span", { class: "page-nav-icon", text: page.icon || "🌍" }),
    el("span", { class: "page-nav-name", text: page.name }),
  ];
  if (!page.hideNavPercent) {
    const p = computeWorldProgress(page);
    const pct = progressPercent(p.earned, p.total);
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
  const pct = progressPercent(p.earned, p.total);

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

  const children = [header];

  if (page.sourceNote) {
    children.push(
      el("div", { class: "page-source-note" }, [
        document.createTextNode(page.sourceNote.text + " "),
        el("a", {
          href: page.sourceNote.url,
          target: "_blank",
          rel: "noopener noreferrer",
          text: "Source",
        }),
      ])
    );
  }

  const body = el(
    "div",
    { class: "world-body" },
    page.categories.map((c) => renderCategory(c, page))
  );
  children.push(body);

  return el("div", { class: "page" }, children);
}

function renderAll() {
  renderPageNav();

  const page = CHECKLIST_DATA.find((p) => p.id === currentPageId) || CHECKLIST_DATA[0];
  const container = document.getElementById("pageContent");
  container.innerHTML = "";
  container.appendChild(renderPageContent(page));

  const g = computeGlobalProgress();
  const gPct = progressPercent(g.earned, g.total);
  document.getElementById("globalPercentLabel").textContent = gPct + "%";
  document.getElementById("globalCountLabel").textContent = `${Math.floor(g.earned)} / ${g.total}`;
  document.getElementById("globalProgressFill").style.width = gPct + "%";

  applyPendingHighlight();
}

function buildSearchIndex() {
  const index = [];
  for (const page of CHECKLIST_DATA) {
    for (const category of page.categories) {
      if (!category.items) continue;
      for (const item of category.items) {
        if (!item.id || !item.name) continue;
        index.push({
          pageId: page.id,
          pageIcon: page.icon || "🌍",
          pageName: page.name,
          categoryName: category.name,
          itemId: item.id,
          itemName: item.name,
        });
      }
    }
  }
  return index;
}

const SEARCH_INDEX = buildSearchIndex();
let pendingHighlightId = null;

function applyPendingHighlight() {
  if (!pendingHighlightId) return;
  const id = pendingHighlightId;
  pendingHighlightId = null;
  const node = document.querySelector(`[data-item-id="${CSS.escape(id)}"]`);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "center" });
  node.classList.add("search-highlight");
  setTimeout(() => node.classList.remove("search-highlight"), 1800);
}

function goToSearchResult(pageId, itemId) {
  currentPageId = pageId;
  saveCurrentPage();
  pendingHighlightId = itemId;
  document.getElementById("searchInput").value = "";
  document.getElementById("searchInput").blur();
  closeSearchResults();
  renderAll();
}

function closeSearchResults() {
  const container = document.getElementById("searchResults");
  container.classList.remove("open");
  container.innerHTML = "";
}

function renderSearchResults(query) {
  const container = document.getElementById("searchResults");
  if (!query) {
    closeSearchResults();
    return;
  }

  const q = query.toLowerCase();
  const matches = SEARCH_INDEX.filter((entry) => entry.itemName.toLowerCase().includes(q));

  const inputRect = document.getElementById("searchInput").getBoundingClientRect();
  container.style.top = inputRect.bottom + 6 + "px";
  container.style.left = inputRect.left + "px";
  container.style.width = inputRect.width + "px";

  container.innerHTML = "";
  container.classList.add("open");

  if (matches.length === 0) {
    container.appendChild(el("div", { class: "search-empty", text: "No matches." }));
    return;
  }

  const byPage = new Map();
  for (const m of matches) {
    if (!byPage.has(m.pageId)) byPage.set(m.pageId, { icon: m.pageIcon, name: m.pageName, items: [] });
    byPage.get(m.pageId).items.push(m);
  }

  for (const group of byPage.values()) {
    const rows = group.items
      .slice(0, 6)
      .map((m) =>
        el(
          "button",
          { class: "search-result-row", onclick: () => goToSearchResult(m.pageId, m.itemId) },
          [
            document.createTextNode(m.itemName + " "),
            el("span", { class: "search-result-cat", text: `(${m.categoryName})` }),
          ]
        )
      );
    const groupChildren = [
      el("div", { class: "search-result-group-title", text: `${group.icon} ${group.name}` }),
      ...rows,
    ];
    if (group.items.length > 6) {
      groupChildren.push(
        el("div", { class: "search-result-more", text: `+${group.items.length - 6} more` })
      );
    }
    container.appendChild(el("div", { class: "search-result-group" }, groupChildren));
  }
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  renderSearchResults(e.target.value.trim());
});
document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.target.value = "";
    closeSearchResults();
    e.target.blur();
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".sidebar-search-wrap")) closeSearchResults();
});

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

function discordChip(username) {
  const iconWrapper = document.createElement("span");
  iconWrapper.className = "discord-chip-icon";
  iconWrapper.innerHTML =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0293a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>';
  return el("span", { class: "discord-chip" }, [
    iconWrapper,
    el("span", { class: "discord-chip-name", text: username }),
  ]);
}

document.getElementById("disclaimerBtn").addEventListener("click", () => {
  showModal(
    "Data Accuracy Notice",
    [
      el("p", {
        text: "This checklist may be missing some values, and some values could be wrong.",
      }),
      el("p", {
        text:
          "Most of this data was found on Discord rather than confirmed directly in-game, since some of it is genuinely hard to obtain (high-level costs, rare drop rates, etc).",
      }),
      el(
        "div",
        { class: "modal-discord-row" },
        [
          document.createTextNode("If you spot something wrong or missing, reach out on Discord:"),
          discordChip("bariltomas"),
        ]
      ),
    ],
    [el("button", { class: "btn", text: "Close", onclick: closeModal })]
  );
});

document.getElementById("creditsRow").appendChild(
  el("div", { class: "credits-text" }, [
    document.createTextNode("Made by "),
    discordChip("bariltomas"),
  ])
);

renderAll();
