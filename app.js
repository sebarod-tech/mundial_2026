}

function formatScore(match) {
  if (["SCHEDULED", "TIMED", "POSTPONED"].includes(match.status)) return "vs";
  return `${score(match, "home")} - ${score(match, "away")}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatStatus(status = "") {
  const labels = {
    SCHEDULED: "Programado",
    TIMED: "Con horario",
    IN_PLAY: "En juego",
    PAUSED: "Entretiempo",
    FINISHED: "Finalizado",
    POSTPONED: "Postergado",
    SUSPENDED: "Suspendido",
    CANCELED: "Cancelado"
  };
  return labels[status] || status.replaceAll("_", " ");
}

function formatStage(stage = "") {
  const labels = {
    GROUP_STAGE: "Fase de grupos",
    LAST_32: "Dieciseisavos",
    LAST_16: "Octavos de final",
    QUARTER_FINALS: "Cuartos de final",
    SEMI_FINALS: "Semifinales",
    THIRD_PLACE: "Tercer puesto",
    FINAL: "Final"
  };
  return labels[stage] || stage.replaceAll("_", " ").toLowerCase().replace(/^\w/, (char) => char.toUpperCase());
}

function formatGroup(group = "") {
  if (!group) return "";
  return group.replace("GROUP_", "Grupo ");
}

function stageOrder(stage) {
  const order = ["GROUP_STAGE", "LAST_32", "LAST_16", "QUARTER_FINALS", "SEMI_FINALS", "THIRD_PLACE", "FINAL"];
  const index = order.indexOf(stage);
  return index === -1 ? 99 : index;
}

function groupBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

function valuePair(homeStats, awayStats, key) {
  const home = homeStats?.[key];
  const away = awayStats?.[key];
  if (home === undefined && away === undefined) return "";
  return `${home ?? 0}-${away ?? 0}`;
}

function statSum(match, key) {
  return Number(match.homeTeam?.statistics?.[key] || 0) + Number(match.awayTeam?.statistics?.[key] || 0);
}

function emptyState(title = "No hay datos para mostrar todavía.", copy = "Conectá la API o cambiá los filtros.") {
  return `<div class="empty-state"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p></div>`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

els.tokenForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.token = els.tokenInput.value.trim();
  state.season = els.seasonInput.value.trim() || "2026";
  state.proxy = els.proxyInput.value.trim();
  saveSettings();
  refreshData();
});

els.refreshBtn.addEventListener("click", () => {
  state.token = els.tokenInput.value.trim();
  state.season = els.seasonInput.value.trim() || "2026";
  state.proxy = els.proxyInput.value.trim();
  saveSettings();
  refreshData();
});

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.selectedTab = tab.dataset.tab;
    els.tabs.forEach((item) => item.classList.toggle("active", item === tab));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
    document.querySelector(`#${state.selectedTab}Panel`).classList.add("active");
  });
});

els.searchInput.addEventListener("input", () => {
  state.search = els.searchInput.value;
  renderMatches();
});

els.statusFilter.addEventListener("change", () => {
  state.status = els.statusFilter.value;
  renderMatches();
});

els.stageFilter.addEventListener("change", () => {
  state.stage = els.stageFilter.value;
  renderMatches();
});

els.closeDialog.addEventListener("click", () => els.dialog.close());

loadSettings();
renderAll();
if (state.token) refreshData(true);

state.timer = setInterval(() => {
  if (state.token) refreshData(true);
}, 60000);
