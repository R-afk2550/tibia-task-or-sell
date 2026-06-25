/**
 * Tibia Task-or-Sell — Main Application Logic
 */

/* ─────────────────── State ─────────────────── */
let currentTask = null;   // currently selected TASKS entry
let quantities  = {};     // { itemName: number }

/* ─────────────────── DOM Helpers ─────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────── Bootstrap ─────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  buildNpcFilter();
  buildTaskList();
  bindSearch();

  // Restore last selected task from sessionStorage
  const lastId = sessionStorage.getItem("lastTask");
  if (lastId) {
    const task = TASKS.find(t => t.id === lastId);
    if (task) selectTask(task);
  }
});

/* ─────────────────── NPC filter chips ─────────────────── */
function buildNpcFilter() {
  const npcs = [...new Set(TASKS.map(t => t.npc))].sort();
  const container = $("#npc-filter");

  const allBtn = createChip("All", true, () => filterByNpc(null));
  container.appendChild(allBtn);

  npcs.forEach(npc => {
    const btn = createChip(npc, false, () => filterByNpc(npc));
    container.appendChild(btn);
  });
}

function createChip(label, active, onClick) {
  const btn = document.createElement("button");
  btn.className = "chip" + (active ? " active" : "");
  btn.textContent = label;
  btn.dataset.label = label;
  btn.addEventListener("click", () => {
    $$(".chip").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    onClick();
  });
  return btn;
}

function filterByNpc(npc) {
  const query = $("#search-input").value.trim().toLowerCase();
  renderTaskList(npc, query);
}

/* ─────────────────── Search ─────────────────── */
function bindSearch() {
  const input = $("#search-input");
  input.addEventListener("input", () => {
    const activeChip = $(".chip.active");
    const npc = activeChip && activeChip.dataset.label !== "All"
      ? activeChip.dataset.label
      : null;
    renderTaskList(npc, input.value.trim().toLowerCase());
  });
}

/* ─────────────────── Task list sidebar ─────────────────── */
function buildTaskList() {
  renderTaskList(null, "");
}

function renderTaskList(npcFilter, query) {
  const list = $("#task-list");
  list.innerHTML = "";

  const filtered = TASKS.filter(task => {
    if (npcFilter && task.npc !== npcFilter) return false;
    if (query) {
      const haystack = (task.taskName + task.npc + task.location +
        task.items.map(i => i.name).join(" ")).toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<p class="empty-msg">No tasks match your filter.</p>`;
    return;
  }

  filtered.forEach(task => {
    const item = document.createElement("div");
    item.className = "task-item" + (currentTask?.id === task.id ? " selected" : "");
    item.dataset.taskId = task.id;
    item.innerHTML = `
      <span class="task-item-name">${task.taskName}</span>
      <span class="task-item-npc">${task.npc} · ${task.location}</span>
    `;
    item.addEventListener("click", () => selectTask(task));
    list.appendChild(item);
  });
}

/* ─────────────────── Task detail panel ─────────────────── */
function selectTask(task) {
  currentTask = task;
  quantities  = {};
  sessionStorage.setItem("lastTask", task.id);

  // highlight sidebar
  $$(".task-item").forEach(el => {
    el.classList.toggle("selected", el.dataset.taskId === task.id);
  });

  renderDetail(task);
}

function renderDetail(task) {
  const panel = $("#detail-panel");
  panel.innerHTML = "";

  /* Header */
  panel.insertAdjacentHTML("beforeend", `
    <div class="detail-header">
      <h2>${task.taskName}</h2>
      <div class="detail-meta">
        <span>🧭 ${task.location}</span>
        <span>👤 ${task.npc}</span>
        ${task.rewardXP ? `<span>✨ ${task.rewardXP.toLocaleString()} XP reward</span>` : ""}
        ${task.rewardGold ? `<span>💰 ${task.rewardGold.toLocaleString()} gp bonus</span>` : ""}
        ${task.notes ? `<span class="note">ℹ️ ${task.notes}</span>` : ""}
      </div>
    </div>
  `);

  /* Items table */
  const tableWrap = document.createElement("div");
  tableWrap.className = "items-table-wrap";

  const table = document.createElement("table");
  table.className = "items-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Item</th>
        <th>NPC Price (each)</th>
        <th>Your Market Price (each)</th>
        <th>Quantity</th>
        <th>NPC Total</th>
        <th>Market Total</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");
  task.items.forEach(item => {
    quantities[item.name] = item.quantity; // default quantity
    const tr = buildItemRow(item, task);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  panel.appendChild(tableWrap);

  /* Reward items */
  if (task.rewardItems.length > 0) {
    const rewardSection = document.createElement("div");
    rewardSection.className = "reward-items";
    rewardSection.innerHTML = `<h3>Reward Items</h3>` +
      task.rewardItems.map(ri => `
        <div class="reward-item-row">
          <span>${ri.name}</span>
          <label>Market value:
            <input type="number" class="reward-market-input" data-item="${ri.name}"
              value="${ri.marketValue}" min="0" step="1" />
          </label>
        </div>
      `).join("");
    panel.appendChild(rewardSection);

    $$(".reward-market-input", rewardSection).forEach(input => {
      input.addEventListener("input", () => updateResult(task));
    });
  }

  /* Result card */
  const resultCard = document.createElement("div");
  resultCard.id = "result-card";
  resultCard.className = "result-card";
  panel.appendChild(resultCard);

  updateResult(task);
}

function buildItemRow(item, task) {
  const tr = document.createElement("tr");
  tr.dataset.itemName = item.name;
  tr.innerHTML = `
    <td class="item-name-cell">${item.name}</td>
    <td class="npc-price-cell">${item.npcPrice.toLocaleString()} gp</td>
    <td>
      <input type="number" class="market-price-input" data-item="${item.name}"
        value="${item.npcPrice}" min="0" step="1" placeholder="Market price" />
    </td>
    <td>
      <input type="number" class="quantity-input" data-item="${item.name}"
        value="${item.quantity}" min="0" step="1" placeholder="Qty" />
    </td>
    <td class="npc-total-cell">—</td>
    <td class="market-total-cell">—</td>
  `;

  tr.querySelector(".market-price-input").addEventListener("input", () => updateResult(task));
  tr.querySelector(".quantity-input").addEventListener("input", e => {
    quantities[item.name] = Math.max(0, parseInt(e.target.value) || 0);
    updateResult(task);
  });

  return tr;
}

/* ─────────────────── Result Calculation ─────────────────── */
function updateResult(task) {
  const panel = $("#detail-panel");
  let totalNpc    = task.rewardGold;
  let totalMarket = 0;
  let rewardItemValue = 0;

  task.items.forEach(item => {
    const qtyInput  = $(`input.quantity-input[data-item="${CSS.escape(item.name)}"]`);
    const mktInput  = $(`input.market-price-input[data-item="${CSS.escape(item.name)}"]`);
    const tr        = $(`tr[data-item-name="${CSS.escape(item.name)}"]`);

    const qty = parseInt(qtyInput?.value) || 0;
    const mkt = parseFloat(mktInput?.value) || 0;

    const npcTotal = qty * item.npcPrice;
    const mktTotal = qty * mkt;

    totalNpc    += npcTotal;
    totalMarket += mktTotal;

    if (tr) {
      tr.querySelector(".npc-total-cell").textContent    = `${npcTotal.toLocaleString()} gp`;
      tr.querySelector(".market-total-cell").textContent = `${mktTotal.toLocaleString()} gp`;
    }
  });

  // Add reward XP value (converted at a placeholder 1 XP = 0 gp; user can ignore)
  // Add reward item market values
  task.rewardItems.forEach(ri => {
    const riInput = $(`input.reward-market-input[data-item="${CSS.escape(ri.name)}"]`);
    if (riInput) rewardItemValue += parseFloat(riInput.value) || 0;
  });
  const taskTotalValue = totalNpc + rewardItemValue;

  renderResult(taskTotalValue, totalMarket, task.rewardXP);
}

function renderResult(taskValue, marketValue, rewardXP) {
  const card = $("#result-card");
  if (!card) return;

  const diff    = taskValue - marketValue;
  const isTask  = diff >= 0;
  const absDiff = Math.abs(diff);
  const verdict = isTask
    ? "✅ Complete the Task"
    : "💰 Sell on Market";
  const verdictClass = isTask ? "verdict-task" : "verdict-sell";

  card.innerHTML = `
    <div class="result-grid">
      <div class="result-col ${isTask ? "result-winner" : ""}">
        <div class="result-label">Task Value (NPC + bonuses)</div>
        <div class="result-amount">${taskValue.toLocaleString()} gp</div>
        ${rewardXP ? `<div class="result-xp">+${rewardXP.toLocaleString()} XP</div>` : ""}
      </div>
      <div class="result-col ${!isTask ? "result-winner" : ""}">
        <div class="result-label">Market Sell Value</div>
        <div class="result-amount">${marketValue.toLocaleString()} gp</div>
      </div>
    </div>
    <div class="verdict ${verdictClass}">
      ${verdict}
      <span class="verdict-diff">
        ${isTask
          ? `(+${absDiff.toLocaleString()} gp over selling)`
          : `(+${absDiff.toLocaleString()} gp over task)`}
      </span>
    </div>
    <p class="result-hint">
      Adjust quantities and market prices above to match your situation.
      Market prices change daily — check
      <a href="https://www.tibia.com/charactertrade/?subtopic=marketstatistics" target="_blank" rel="noopener">
        Tibia Market
      </a> or
      <a href="https://tibia.fandom.com/wiki/Tibia_Wiki" target="_blank" rel="noopener">
        TibiaWiki
      </a> for current values.
    </p>
  `;
}
