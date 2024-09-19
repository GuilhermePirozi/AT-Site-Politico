// https://tailwindcss.com/docs/customizing-colors
// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:arrow_upward:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=arrow&icon.size=26&icon.color=%23777b7e

const endAPI = "https://dadosabertos.camara.leg.br/api/v2/";

fetch(endAPI + "deputados")
  .then(response => {
    if (!response.ok) {
      throw new Error("Erro na requisição" + response.status);
    }
    return response.json();
  })
  .then(data => {
    let chamaDeput = data.dados;

    let divResultado = document.getElementById("deputAreaPai");

    chamaDeput.forEach(function(deputado) {
      let item = document.createElement("div");
      item.classList.add("itemDeput");

      let imagemUrl = deputado.urlFoto;
      if (deputado.nome === "Capitão Samuel") {
        imagemUrl = "Img/imageQuebra.png";
      }

      item.innerHTML = `     
        <img class="imageDeput" src="${imagemUrl}" alt="Foto do(a) deputado(a) ${deputado.nome}" title="Foto do(a) deputado(a) ${deputado.nome}">
        <p class="nomeDeputTotal">Nome: <span class="nomeDeput styleDeput">${deputado.nome}</span></p>
        <p class="styleDeput">Uf: ${deputado.siglaUf}</p>
        <p class="styleDeput">Partido: <span class="partBusc">${deputado.siglaPartido}</span></p>
        <div class="iconeRede">
          <img alt="logo do facebook" title="logo da empresa facebook" class="iconesDeput" src="Img/faceBook.svg">
          <img alt="logo do instagram" title="logo da empresa instagram" class="iconesDeput" src="Img/instagram.svg">
          <img alt="logo do twitter" title="logo da empresa twitter" class="iconesDeput" src="Img/twitter.svg">
        </div>
      `;

      divResultado.appendChild(item);
    });
  })
  .catch(error => {
    console.warn("Erro na chamada da API: ", error);
  });

document.getElementById("procurarInputPes").addEventListener("input", function(event) {
  let termoBusca = event.target.value.trim().toLowerCase();
  let todosDeputados = Array.from(document.querySelectorAll(".itemDeput"));
  todosDeputados.forEach(deputado => {
    let nome = deputado.querySelector(".nomeDeput").textContent.toLowerCase();
    let part = deputado.querySelector(".partBusc").textContent.toLowerCase();

    if (nome.includes(termoBusca) || part.includes(termoBusca)) {

      deputado.classList.remove("aparecer");
    } else {
      deputado.classList.add("aparecer");
    }
  });

  if (termoBusca === "") {
    todosDeputados.forEach(deputado => {
      deputado.classList.remove("aparecer");
    });
  }
});

document.getElementById("procurarInputPes").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    let termoBusca = event.target.value.trim().toLowerCase();
    event.target.value = "";

    let todosDeputados = Array.from(document.querySelectorAll(".itemDeput"));

    todosDeputados.forEach(deputado => {
      let nome = deputado.querySelector(".nomeDeput").textContent.toLowerCase();
      if (nome.includes(termoBusca)) {
        deputado.classList.remove("aparecer");
      } else {
        deputado.classList.add("aparecer");
      }
    });
  }
});

// Botão Fixo

document.addEventListener('DOMContentLoaded', () => {
  var botaoFixo = document.getElementById('voltarTopo')

  window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      botaoFixo.classList.add('show')
      botaoFixo.setAttribute('title', 'Voltar ao Topo')
    } else {
      botaoFixo.classList.remove('show')
      botaoFixo.removeAttribute('title')
    }
  }

  botaoFixo.onclick = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }
})

// Api Eventos 

let chamarBusca1 = document.getElementById("procurarInputPesEvent");
let chamarBusca2 = document.getElementById("procurarInputPesEvent2");
let chamarButton = document.getElementById("buttonEventBus");

chamarButton.addEventListener("click", function() {
  let urlPai = `${endAPI}eventos`;
  if (chamarBusca2.value !== "") {
    urlPai = `${endAPI}eventos?dataInicio=${chamarBusca2.value}&dataFim=${chamarBusca2.value}&ordem=ASC&ordenarPor=dataHoraInicio`;
  }
console.log(urlPai)
  fetch(urlPai)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      let chamaEvento = data.dados;
      let divResultado = document.getElementById("eventAreaPai");
      divResultado.innerHTML = ''; // Limpa resultados anteriores

      chamaEvento.forEach(function(evento) {
        let item = document.createElement("div");
        item.classList.add("itemEvent");
        item.innerHTML = `
          <div id="cardEvent">
            <h3>${evento.descricaoTipo}</h3>
            <p class="styleEvent">Início do Evento: ${new Date(evento.dataHoraInicio).toLocaleString()}</p>
            <p class="styleEvent">Fim do Evento: ${new Date(evento.dataHoraFim).toLocaleString()}</p>
            <p class="styleEvent">Descrição do Evento: ${evento.descricao}</p>
            <p class="styleEvent">Local do Evento: ${evento.localCamara.nome}</p>
          </div>
        `;

        let recebaDescri = (evento.descricao).toLowerCase()
        let recebaBusc = (chamarBusca1.value).toLowerCase()

        if (recebaDescri.includes(recebaBusc)) {
          item.classList.remove("aparecer");
        } else {
          item.classList.add("aparecer");
        }
        divResultado.appendChild(item);
      });
      chamarBusca1.value = "";
      chamarBusca2.value = "";
    })
    .catch(error => {
      console.warn("Erro na chamada da API: ", error);
    });
});