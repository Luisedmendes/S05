class AulasComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.hoje = "ter";
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    try {
      const response = await fetch('./aulas.json');
      const aulas = await response.json();
      this.render(aulas);
    } catch (error) {
      console.error('Erro ao carregar os dados das aulas:', error);
    }
  }

  render(aulas) {
    const aulasDia = aulas.filter(a => a.data === this.hoje);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'styles_componente.css'; 
    this.shadowRoot.appendChild(link); 

    const tipoNota = {
      red: () => "lable-nota red",
      green: () => "lable-nota green",
      orange: () => "lable-nota orange",
    };
    
    this.shadowRoot.innerHTML += `
      <style>
        .lable-nota {
          padding: 7px 15px;
          margin-bottom: 10px;
          border-radius: 500px;
          text-align: center;
          margin-right: 10px;
        }
    
        .red {
          color: red;
        }
    
        .orange {
          color: orange;
        }
    
        .green {
          color: green;
        }
      </style>
      
      <div>
        ${aulasDia
          .map((a) => {
            let provaDisplay = a.prova_alert ? "" : "display: none;";
    
            let styleString = "";
            if (a.nota < 6) {
              styleString = tipoNota["red"]();
            } else if (a.nota >= 8) {
              styleString = tipoNota["green"]();
            } else {
              styleString = tipoNota["orange"]();
            }
    
            return `
              <div class="comp-aula">
                <div class="lable-prova p_lable" style="${provaDisplay}">
                  PROVA: <b>${a.prova}</b>
                </div>
                <div class="titulo_aula">${a.disciplina}</div>
                <p class="p">Local e Horário: <b>${a.local} - ${a.horario}</b></p>
                <div class="lables">
                  <div class="lable-frequencia p_lable">
                    FALTAS: <b>${a.frequencia}</b>
                  </div>
                  <div class="${styleString}"><b>${a.nota}</b></div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
    
  }
}

customElements.define('aulas-component', AulasComponent);  