const root=document.getElementById('root');
const state={busca:'',jogoSelecionado:null};

function render(){
  root.innerHTML=`
    <h1><span class="emoji">🎮</span><span class="gradient-text">Buscador Xenia Canary</span></h1>
    <div class="section">
      <input placeholder="Buscar jogo..." oninput="state.busca=this.value;render()">
    </div>
    <div class="section">
      <div class="games-grid">
        ${JOGOS_COMPLETOS.filter(j=>j.nome.toLowerCase().includes(state.busca.toLowerCase()))
          .map(j=>`
            <div class="game-card">
              <div class="gradient-text">${j.nome}</div>
            </div>
          `).join('')}
      </div>
    </div>`;
}
render();
