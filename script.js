// ============================================
// BUSCADOR XENIA CANARY - JAVASCRIPT PURO
// 944 Jogos com configurações de hardware
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
  'p': '✅ Jogável',
  'g': '⚠️ Gameplay',
  'm': '🔶 Menus',
  'i': '🎬 Intro',
  'u': '❓ Desconhecido'
};

// Estado da aplicação
let state = {
  hardware: { cpu: 'i5', gpu: 'gtx1050', ram: '16gb', resolucao: '1080p' },
  busca: '',
  filtroStatus: 'todos',
  filtroCategoria: 'Todos',
  jogoSelecionado: null,
  copiado: false,
};

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

function getConfigurationTemplate() {
  const cpuScore = PROCESSADORES.find(p => p.id === state.hardware.cpu)?.score ?? 0;
  const gpuScore = GPUS.find(g => g.id === state.hardware.gpu)?.score ?? 0;
  const ramScore = MEMORIAS.find(m => m.id === state.hardware.ram)?.score ?? 0;
  const totalScore = cpuScore + gpuScore + ramScore;
  
  if (totalScore <= 6) return 'Fraco';
  if (totalScore >= 16) return 'Forte';
  return 'Médio';
}

function calcularScore() {
  const cpuScore = PROCESSADORES.find(p => p.id === state.hardware.cpu)?.score ?? 0;
  const gpuScore = GPUS.find(g => g.id === state.hardware.gpu)?.score ?? 0;
  const ramScore = MEMORIAS.find(m => m.id === state.hardware.ram)?.score ?? 0;
  return cpuScore + gpuScore + ramScore;
}

function jogoCompativel(jogo) {
  const cpuScore = PROCESSADORES.find(p => p.id === state.hardware.cpu)?.score ?? 0;
  const gpuScore = GPUS.find(g => g.id === state.hardware.gpu)?.score ?? 0;
  const ramScore = MEMORIAS.find(m => m.id === state.hardware.ram)?.score ?? 0;
  
  const requisitosCPU = jogo.cpu ?? 2;
  const requisitosGpu = jogo.gpu ?? 1.0;
  const requisitoRam = jogo.ram ?? 2;
  
  return (cpuScore >= requisitosCPU) && (gpuScore >= requisitosGpu) && (ramScore >= requisitoRam);
}

function filtrarJogos() {
  return JOGOS_COMPLETOS.filter(j => {
    const hardwareMatch = jogoCompativel(j);
    const buscaMatch = state.busca === '' || 
                       j.nome.toLowerCase().includes(state.busca.toLowerCase()) || 
                       j.codigo.includes(state.busca.toUpperCase());
    
    let statusMatch = true;
    if (state.filtroStatus !== 'todos') {
      statusMatch = j.status === state.filtroStatus;
    }
    
    const categoriaMatch = state.filtroCategoria === 'Todos' || j.categoria === state.filtroCategoria;
    
    return hardwareMatch && buscaMatch && statusMatch && categoriaMatch;
  });
}

function renderJogos() {
  const jogosFiltrados = filtrarJogos();
  const gamesGrid = document.getElementById('gamesGrid');
  const resultsInfo = document.getElementById('resultsInfo');

  if (!gamesGrid || !resultsInfo) return;

  resultsInfo.innerHTML = `
    Resultados: ${jogosFiltrados.length} / ${JOGOS_COMPLETOS.length}
  `;

  gamesGrid.innerHTML = `
    ${jogosFiltrados.length === 0 ? '<p style="text-align: center; grid-column: 1/-1; padding: 40px;">Nenhum jogo encontrado com esses filtros.</p>' : ''}
    ${jogosFiltrados.map(jogo => `
      <div class="game-card" onclick="selectGame(${jogo.id})">
        <div class="game-name">${jogo.nome}</div>
        <div class="game-code">Código: ${jogo.codigo}</div>
        <div class="game-status">${STATUS_TEXT_MAP[jogo.status] || '❓ Desconhecido'}</div>
        <div class="game-info">
          <div>📂 ${jogo.categoria}</div>
          <div>🎮 ${jogo.fps} FPS</div>
          <div>💾 RAM: ${jogo.ram}GB | GPU: ${jogo.gpu}GB</div>
        </div>
      </div>
    `).join('')}
  `;
}

function copiarConfig() {
  const tipoPC = getConfigurationTemplate();
  const cpuNome = PROCESSADORES.find(p => p.id === state.hardware.cpu)?.nome || 'Intel i5 (4 Cores)';
  const gpuNome = GPUS.find(g => g.id === state.hardware.gpu)?.nome || 'GTX 1050';
  const ramNome = MEMORIAS.find(m => m.id === state.hardware.ram)?.nome || '16 GB';
  const resolucaoNome = RESOLUCOES.find(r => r.id === state.hardware.resolucao)?.nome || '1080p';
  
  let configSaida = '';
  
  if (tipoPC === 'Fraco') {
    configSaida = `[Video]
gpu = "d3d12"
resolution_scale = 0.5
vsync = false
postprocess_antialiasing = "fxaa"

[APU]
apu = "any"
apu_max_queued_frames = 16
enable_xmp = true
mute = false
use_dedicated_xma_thread = false
xma_decoder = "new"

[CPU]
break_on_debugbreak = true
break_on_unimplemented_instructions = true
disable_context_promotion = false
ignore_trap_instructions = true

[GPU]
anisotropic_override = -1
clear_memory_page_state = false
framerate_limit = 45
gpu_allow_invalid_fetch_constants = true
query_occlusion_sample_lower_threshold = 80
query_occlusion_sample_upper_threshold = 100
native_2x_msaa = false

[Display]
fullscreen = false
present_letterbox = true
vsync = false

[General]
apply_patches = true
discord = true
time_scalar = 1

[HID]
hid = "xinput"
vibration = true

[Kernel]
apply_title_update = true
ignore_thread_affinities = true
ignore_thread_priorities = true`;
  } else if (tipoPC === 'Médio') {
    configSaida = `[Video]
gpu = "d3d12"
resolution_scale = 1.0
vsync = true
postprocess_antialiasing = "fxaa"
postprocess_dither = true
postprocess_scaling_and_sharpening = "cas"

[APU]
apu = "any"
apu_max_queued_frames = 8
enable_xmp = true
mute = false
use_dedicated_xma_thread = false
xma_decoder = "new"

[CPU]
break_on_debugbreak = true
break_on_unimplemented_instructions = true
disable_context_promotion = false
ignore_trap_instructions = true

[GPU]
anisotropic_override = -1
clear_memory_page_state = false
framerate_limit = 60
gpu_allow_invalid_fetch_constants = true
query_occlusion_sample_lower_threshold = 80
query_occlusion_sample_upper_threshold = 100
native_2x_msaa = true

[Display]
fullscreen = false
present_letterbox = true
vsync = true

[General]
apply_patches = true
discord = true
time_scalar = 1

[HID]
hid = "xinput"
vibration = true

[Kernel]
apply_title_update = true
ignore_thread_affinities = true
ignore_thread_priorities = true`;
  } else {
    configSaida = `[Video]
gpu = "d3d12"
resolution_scale = 2.0
vsync = true
postprocess_antialiasing = "fxaa"
postprocess_dither = true
postprocess_scaling_and_sharpening = "cas"

[APU]
apu = "any"
apu_max_queued_frames = 8
enable_xmp = true
mute = false
use_dedicated_xma_thread = true
xma_decoder = "new"

[CPU]
break_on_debugbreak = true
break_on_unimplemented_instructions = true
disable_context_promotion = false
ignore_trap_instructions = true

[GPU]
anisotropic_override = -1
clear_memory_page_state = false
framerate_limit = 60
gpu_allow_invalid_fetch_constants = true
query_occlusion_sample_lower_threshold = 80
query_occlusion_sample_upper_threshold = 100
native_2x_msaa = true

[Display]
fullscreen = true
present_letterbox = true
vsync = true

[General]
apply_patches = true
discord = true
time_scalar = 1

[HID]
hid = "xinput"
vibration = true

[Kernel]
apply_title_update = true
ignore_thread_affinities = true
ignore_thread_priorities = true`;
  }
  
  const scorePC = calcularScore();
  const jogosFiltrados = filtrarJogos();
  
  const textoCompleto = `🎮 CONFIGURAÇÃO XENIA CANARY - ${tipoPC.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CPU: ${cpuNome}
GPU: ${gpuNome}
RAM: ${ramNome}
Resolução: ${resolucaoNome}
Score: ${scorePC} / 18
Jogos Compatíveis: ${jogosFiltrados.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${configSaida}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gerada em: ${new Date().toLocaleString('pt-BR')}`;
  
  navigator.clipboard.writeText(textoCompleto).then(() => {
    state.copiado = true;
    alert(`✅ CONFIGURAÇÃO COPIADA COM SUCESSO!

Tipo: ${tipoPC}
CPU: ${cpuNome}
GPU: ${gpuNome}
RAM: ${ramNome}

📋 Cole em: xenia-canary.config.toml`);
    setTimeout(() => {
      state.copiado = false;
      render();
    }, 2000);
  }).catch(err => {
    alert(`❌ Erro ao copiar: ${err.message}`);
  });
}

function baixarToml() {
  const tipoPC = getConfigurationTemplate();
  const cpuNome = PROCESSADORES.find(p => p.id === state.hardware.cpu)?.nome || 'Intel i5 (4 Cores)';
  const gpuNome = GPUS.find(g => g.id === state.hardware.gpu)?.nome || 'GTX 1050';
  const ramNome = MEMORIAS.find(m => m.id === state.hardware.ram)?.nome || '16 GB';
  const resolucaoNome = RESOLUCOES.find(r => r.id === state.hardware.resolucao)?.nome || '1080p';
  const scorePC = calcularScore();
  
  let configSaida = '';
  
  if (tipoPC === 'Fraco') {
    configSaida = `[Video]
gpu = "d3d12"
resolution_scale = 0.5
vsync = false`;
  } else if (tipoPC === 'Médio') {
    configSaida = `[Video]
gpu = "d3d12"
resolution_scale = 1.0
vsync = true`;
  } else {
    configSaida = `[Video]
gpu = "d3d12"
resolution_scale = 2.0
vsync = true
fullscreen = true`;
  }
  
  const conteudo = `# Configuração Xenia Canary - ${tipoPC.toUpperCase()}
# Hardware: ${cpuNome} | ${gpuNome} | ${ramNome}
# Resolução: ${resolucaoNome}
# Score: ${scorePC} / 18

${configSaida}`;

  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `xenia_${tipoPC.toLowerCase()}_${Date.now()}.toml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert(`✅ ARQUIVO BAIXADO!`);
}

// ============================================
// RENDERIZAÇÃO
// ============================================

function render() {
  const root = document.getElementById('root');
  const scorePC = calcularScore();
  const categorias = ['Todos', ...new Set(JOGOS_COMPLETOS.map(j => j.categoria))].sort();
  
  const countByStatus = {
    todos: JOGOS_COMPLETOS.length,
    p: JOGOS_COMPLETOS.filter(j => j.status === 'p').length,
    g: JOGOS_COMPLETOS.filter(j => j.status === 'g').length,
    u: JOGOS_COMPLETOS.filter(j => j.status === 'u').length,
  };
  
  root.innerHTML = `
    <h1>🎮 Buscador Xenia Canary</h1>
    <div class="header-info">
      <p>Total de Jogos: <strong>944</strong> | Gameplay: <strong>688</strong> | Comentários Reais: <strong>296+</strong></p>
    </div>

    <div class="section">
      <h2>⚙️ Configuração do Hardware</h2>
      <div class="hardware-grid">
        <div>
          <label>CPU (Processador)</label>
          <select id="cpu" onchange="updateHardware('cpu', this.value)">
            ${PROCESSADORES.map(p => `<option value="${p.id}" ${state.hardware.cpu === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>GPU (Placa de Vídeo)</label>
          <select id="gpu" onchange="updateHardware('gpu', this.value)">
            ${GPUS.map(g => `<option value="${g.id}" ${state.hardware.gpu === g.id ? 'selected' : ''}>${g.nome}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>RAM (Memória)</label>
          <select id="ram" onchange="updateHardware('ram', this.value)">
            ${MEMORIAS.map(m => `<option value="${m.id}" ${state.hardware.ram === m.id ? 'selected' : ''}>${m.nome}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>Resolução</label>
          <select id="resolucao" onchange="updateHardware('resolucao', this.value)">
            ${RESOLUCOES.map(r => `<option value="${r.id}" ${state.hardware.resolucao === r.id ? 'selected' : ''}>${r.nome}</option>`).join('')}
          </select>
        </div>
      </div>
      
      <div class="score-display">
        Score de Compatibilidade: ${scorePC} / 18
      </div>
    </div>

    <div class="section">
      <h2>📋 Gerar Configuração</h2>
      <div class="buttons-container">
        <button class="btn-primary" onclick="copiarConfig()" ${state.copiado ? 'disabled' : ''}>
          ${state.copiado ? '✅ Config Copiada!' : '📋 Copiar Configuração Completa'}
        </button>
        <button class="btn-success" onclick="baixarToml()">
          📥 Baixar arquivo .toml
        </button>
      </div>
    </div>

    <div class="section">
      <h2>🔍 Buscar Jogos</h2>
      <input type="text" id="searchInput" name="search" class="search-box" placeholder="Buscar por nome ou código Xbox..." 
             value="${state.busca}" oninput="updateBusca(this.value)">
    </div>

    <div class="section">
      <h2>🎮 Filtrar por Status</h2>
      <div class="filters">
        <button class="filter-btn ${state.filtroStatus === 'todos' ? 'active' : ''}" onclick="updateFiltroStatus('todos')">
          Todos (${countByStatus.todos})
        </button>
        <button class="filter-btn ${state.filtroStatus === 'p' ? 'active' : ''}" onclick="updateFiltroStatus('p')">
          ✅ Jogável (${countByStatus.p})
        </button>
        <button class="filter-btn ${state.filtroStatus === 'g' ? 'active' : ''}" onclick="updateFiltroStatus('g')">
          ⚠️ Gameplay (${countByStatus.g})
        </button>
        <button class="filter-btn ${state.filtroStatus === 'u' ? 'active' : ''}" onclick="updateFiltroStatus('u')">
          ❓ Desconhecido (${countByStatus.u})
        </button>
      </div>
    </div>

    <div class="section">
      <h2>📂 Filtrar por Categoria</h2>
      <div class="filters">
        ${categorias.map(cat => {
          const count = JOGOS_COMPLETOS.filter(j => j.categoria === cat).length;
          return `<button class="filter-btn ${state.filtroCategoria === cat ? 'active' : ''}" onclick="updateFiltroCategoria('${cat}')">
            ${cat} (${count})
          </button>`;
        }).join('')}
      </div>
    </div>

    <div class="section">
      <h2>🕹️ Jogos Encontrados</h2>
      <div class="results-info" id="resultsInfo"></div>
      <div class="games-grid" id="gamesGrid"></div>
    </div>
  `;
  
  renderJogos();
  
  // Renderizar modal se jogo selecionado
  const modal = document.getElementById('modal');
  if (state.jogoSelecionado) {
    const jogo = state.jogoSelecionado;
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${jogo.nome}</h2>
          <button class="close-btn" onclick="closeModal()">×</button>
        </div>
        
        <div class="modal-section">
          <h3>Informações</h3>
          <div style="padding: 10px;">
            <div>📄 <strong>Código:</strong> ${jogo.codigo}</div>
            <div>📂 <strong>Categoria:</strong> ${jogo.categoria}</div>
            <div>⭐ <strong>Status:</strong> ${STATUS_TEXT_MAP[jogo.status] || '❓ Desconhecido'}</div>
            <div>🎮 <strong>FPS:</strong> ${jogo.fps}</div>
            <div>💾 <strong>RAM:</strong> ${jogo.ram}GB | <strong>GPU:</strong> ${jogo.gpu}GB | <strong>CPU:</strong> ${jogo.cpu} cores</div>
          </div>
        </div>
        
        ${jogo.problemas && jogo.problemas.length > 0 ? `
          <div class="modal-section">
            <h3>🐛 Problemas Conhecidos</h3>
            <ul>
              ${jogo.problemas.map(p => `<li>• ${p}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${jogo.solucoes && jogo.solucoes.length > 0 ? `
          <div class="modal-section">
            <h3>✅ Soluções</h3>
            <ul>
              ${jogo.solucoes.map(s => `<li>• ${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${jogo.comentarios && jogo.comentarios.length > 0 ? `
          <div class="modal-section">
            <h3>💬 Comentários do GitHub</h3>
            <ul>
              ${jogo.comentarios.slice(0, 5).map(c => `<li>• ${c}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        <div class="modal-buttons">
          <button class="btn-primary" onclick="window.open('${jogo.link}', '_blank')">
            🔗 Ver no GitHub
          </button>
          <button class="btn-success" onclick="closeModal()">
            Fechar
          </button>
        </div>
      </div>
    `;
    modal.classList.add('active');
  } else {
    modal.classList.remove('active');
    modal.innerHTML = '';
  }
}

// ============================================
// EVENT HANDLERS
// ============================================

function updateHardware(tipo, valor) {
  state.hardware[tipo] = valor;
  render();
}

function updateBusca(valor) {
  state.busca = valor;
  renderJogos();
}

function updateFiltroStatus(status) {
  state.filtroStatus = status;
  renderJogos();
}

function updateFiltroCategoria(categoria) {
  state.filtroCategoria = categoria;
  renderJogos();
}

function selectGame(id) {
  state.jogoSelecionado = JOGOS_COMPLETOS.find(j => j.id === id);
  render();
}

function closeModal() {
  state.jogoSelecionado = null;
  render();
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página carregada. Total de jogos:', JOGOS_COMPLETOS.length);
  render();
});
