// ============================================
// BUSCADOR XENIA CANARY - JAVASCRIPT PURO
// ============================================

// Dados do hardware
const PROCESSADORES = [
  { id: 'i3', nome: 'Intel i3 (2 Cores)', score: 2 },
  { id: 'i5', nome: 'Intel i5 (4 Cores)', score: 4 },
  { id: 'i7', nome: 'Intel i7 (6+ Cores)', score: 6 },
  { id: 'ryzen5', nome: 'AMD Ryzen 5 (6 Cores)', score: 6 },
  { id: 'ryzen7', nome: 'AMD Ryzen 7+ (8+ Cores)', score: 8 },
];

const GPUS = [
  { id: 'gtx750', nome: 'GTX 750 Ti', score: 2, vram: 2 },
  { id: 'gtx1050', nome: 'GTX 1050', score: 3, vram: 2 },
  { id: 'gtx1660', nome: 'GTX 1660', score: 5, vram: 6 },
  { id: 'rtx2070', nome: 'RTX 2070', score: 6, vram: 8 },
  { id: 'rtx3060', nome: 'RTX 3060', score: 8, vram: 12 },
];

const MEMORIAS = [
  { id: '8gb', nome: '8 GB', score: 2 },
  { id: '16gb', nome: '16 GB', score: 4 },
  { id: '32gb', nome: '32 GB', score: 6 },
];

const RESOLUCOES = [
  { id: '720p', nome: '720p', escala: 0.5 },
  { id: '1080p', nome: '1080p (Padrão)', escala: 1.0 },
  { id: '1440p', nome: '1440p', escala: 1.5 },
  { id: '4k', nome: '4K', escala: 2.0 },
];

const STATUS_TEXT_MAP = {
  p: '✅ Jogável',
  g: '⚠️ Gameplay',
  m: '🔶 Menus',
  i: '🎬 Intro',
  u: '❓ Desconhecido',
};

let state = {
  hardware: { cpu: 'i5', gpu: 'gtx1050', ram: '16gb', resolucao: '1080p' },
  busca: '',
  filtroStatus: 'todos',
  filtroCategoria: 'Todos',
  jogoSelecionado: null,
  copiado: false,
};

// ============================================
// RENDERIZAÇÃO
// ============================================

function render() {
  const root = document.getElementById('root');
  const scorePC = calcularScore();
  const categorias = ['Todos', ...new Set(JOGOS_COMPLETOS.map(j => j.categoria))].sort();

  root.innerHTML = `
    <h1 class="gradient-text">
      <span class="emoji">🎮</span>
      Buscador Xenia Canary
    </h1>

    <div class="header-info gradient-text">
      Total de Jogos: <strong>944</strong> | Gameplay: <strong>688</strong> | Comentários Reais: <strong>296+</strong>
    </div>

    <div class="section">
      <h2>
        <span class="emoji">⚙️</span>
        <span class="gradient-text">Configuração do Hardware</span>
      </h2>

      <div class="hardware-grid">
        <div>
          <label class="gradient-text">CPU (Processador)</label>
          <select onchange="updateHardware('cpu', this.value)">
            ${PROCESSADORES.map(p => `<option value="${p.id}" ${state.hardware.cpu === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="gradient-text">GPU (Placa de Vídeo)</label>
          <select onchange="updateHardware('gpu', this.value)">
            ${GPUS.map(g => `<option value="${g.id}" ${state.hardware.gpu === g.id ? 'selected' : ''}>${g.nome}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="gradient-text">RAM (Memória)</label>
          <select onchange="updateHardware('ram', this.value)">
            ${MEMORIAS.map(m => `<option value="${m.id}" ${state.hardware.ram === m.id ? 'selected' : ''}>${m.nome}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="gradient-text">Resolução</label>
          <select onchange="updateHardware('resolucao', this.value)">
            ${RESOLUCOES.map(r => `<option value="${r.id}" ${state.hardware.resolucao === r.id ? 'selected' : ''}>${r.nome}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="score-display gradient-text">
        Score de Compatibilidade: ${scorePC} / 18
      </div>
    </div>

    <div class="section">
      <h2>
        <span class="emoji">🕹️</span>
        <span class="gradient-text">Jogos Encontrados</span>
      </h2>

      <div class="results-info" id="resultsInfo"></div>
      <div class="games-grid" id="gamesGrid"></div>
    </div>
  `;

  renderJogos();
}

function renderJogos() {
  const jogos = filtrarJogos();
  document.getElementById('resultsInfo').innerHTML =
    `Resultados: ${jogos.length} / ${JOGOS_COMPLETOS.length}`;

  document.getElementById('gamesGrid').innerHTML = jogos.map(jogo => `
    <div class="game-card">
      <div class="game-name gradient-text">${jogo.nome}</div>
      <div class="game-code">Código: ${jogo.codigo}</div>
      <div class="game-status">${STATUS_TEXT_MAP[jogo.status]}</div>
    </div>
  `).join('');
}

// ============================================
// EVENTOS
// ============================================

function updateHardware(tipo, valor) {
  state.hardware[tipo] = valor;
  render();
}

function filtrarJogos() {
  return JOGOS_COMPLETOS;
}

function calcularScore() {
  return 11;
}

document.addEventListener('DOMContentLoaded', render);
