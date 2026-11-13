/* Copiauto · simulado de prova teórica. PERGUNTAS DE EXEMPLO sobre sinalização, regras e direção defensiva
   (conteúdo geral do Código de Trânsito Brasileiro, não é banco oficial do Detran nem material da autoescola).
   Placas desenhadas em SVG. SIM.montar(elemento, { ids: [...], mini: true|false }). */
(function () {
  'use strict';
  var V = '#C8102E';
  function circulo(miolo, barra) {
    return '<circle cx="60" cy="60" r="51" fill="#fff" stroke="' + V + '" stroke-width="11"/>' + miolo +
      (barra ? '<line x1="25" y1="25" x2="95" y2="95" stroke="' + V + '" stroke-width="10"/>' : '');
  }
  var PLACAS = {
    pare: '<polygon points="111.7,81.4 81.4,111.7 38.6,111.7 8.3,81.4 8.3,38.6 38.6,8.3 81.4,8.3 111.7,38.6" fill="#fff"/>' +
      '<polygon points="106.2,79.1 79.1,106.2 40.9,106.2 13.8,79.1 13.8,40.9 40.9,13.8 79.1,13.8 106.2,40.9" fill="' + V + '"/>' +
      '<text x="60" y="71" text-anchor="middle" font-family="Overpass,Arial,sans-serif" font-weight="900" font-size="31" fill="#fff">PARE</text>',
    preferencia: '<path d="M10 16 H110 L60 106Z" fill="#fff" stroke="' + V + '" stroke-width="12" stroke-linejoin="round"/>',
    lombada: '<rect x="25" y="25" width="70" height="70" transform="rotate(45 60 60)" fill="#FFD400" stroke="#111" stroke-width="5"/>' +
      '<path d="M37 70 H49 C51 52 69 52 71 70 H83 V77 H37Z" fill="#111"/>',
    estacionar: circulo('<text x="60" y="80" text-anchor="middle" font-family="Overpass,Arial,sans-serif" font-weight="900" font-size="56" fill="#111">E</text>', true),
    vel40: circulo('<text x="60" y="72" text-anchor="middle" font-family="Overpass,Arial,sans-serif" font-weight="900" font-size="40" fill="#111">40</text><text x="60" y="90" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="12" fill="#111">km/h</text>', false),
    esquerda: circulo('<path d="M70 92 V58 Q70 46 58 46 H46" fill="none" stroke="#111" stroke-width="10"/><path d="M48 32 L30 46 L48 60Z" fill="#111"/>', true),
    semaforo: '<rect x="38" y="6" width="44" height="108" rx="10" fill="#1A1A1A"/><circle cx="60" cy="30" r="13" fill="#4A1515"/><circle cx="60" cy="60" r="13" fill="#FFC400"/><circle cx="60" cy="60" r="18" fill="#FFC400" opacity=".25"/><circle cx="60" cy="90" r="13" fill="#173D24"/>',
    duplaContinua: '<rect x="10" y="4" width="100" height="112" rx="6" fill="#2A2B2F"/><rect x="16" y="4" width="4" height="112" fill="#eee"/><rect x="100" y="4" width="4" height="112" fill="#eee"/>' +
      '<rect x="54" y="4" width="4" height="112" fill="#FFD400"/><rect x="62" y="4" width="4" height="112" fill="#FFD400"/>' +
      '<rect x="76" y="62" width="16" height="30" rx="5" fill="#fff"/><rect x="28" y="22" width="16" height="30" rx="5" fill="#9EC5FF"/>',
    celular: '<circle cx="48" cy="66" r="36" fill="none" stroke="#111" stroke-width="9"/><circle cx="48" cy="66" r="8" fill="#111"/><path d="M14 64 H82" stroke="#111" stroke-width="7"/>' +
      '<rect x="70" y="10" width="34" height="58" rx="6" fill="#fff" stroke="' + V + '" stroke-width="5"/><rect x="77" y="18" width="20" height="36" fill="#9EC5FF"/>',
    sirene: '<rect x="10" y="4" width="100" height="112" rx="6" fill="#2A2B2F"/><rect x="58" y="4" width="4" height="112" fill="#FFD400" opacity=".7"/>' +
      '<rect x="26" y="70" width="22" height="40" rx="5" fill="#fff"/><path d="M33 86 h8 M37 82 v8" stroke="' + V + '" stroke-width="3"/><rect x="28" y="74" width="7" height="3" fill="' + V + '"/><rect x="39" y="74" width="7" height="3" fill="#2F6BFF"/>' +
      '<rect x="26" y="22" width="20" height="32" rx="5" fill="#C9D3DD"/><path d="M70 38 l14 -8 M70 38 l14 8" stroke="#FFD400" stroke-width="4" stroke-linecap="round"/>'
  };
  var PERGUNTAS = [
    { id: 'pare', placa: 'pare', q: 'O que essa placa manda fazer?', ops: ['Parar o veículo por completo antes de seguir', 'Reduzir e seguir se não vier ninguém', 'Parar só se tiver pedestre'], c: 0, exp: 'Placa R-1, Parada obrigatória: o carro para totalmente, você olha, e só então segue.' },
    { id: 'preferencia', placa: 'preferencia', q: 'Triângulo com a ponta para baixo. O que ele quer dizer?', ops: ['Via preferencial: a vez é sua', 'Dê a preferência a quem vem na outra via', 'Proibido seguir em frente'], c: 1, exp: 'Placa R-2, Dê a preferência: reduza e só entre quando não atrapalhar quem já está passando.' },
    { id: 'lombada', placa: 'lombada', q: 'Losango amarelo com esse desenho avisa o quê?', ops: ['Ponte estreita', 'Pista escorregadia', 'Lombada (saliência) à frente'], c: 2, exp: 'Placa A-18, Saliência ou lombada. Losango amarelo é placa de advertência. E sim: tem que reduzir antes.' },
    { id: 'estacionar', placa: 'estacionar', q: 'Círculo vermelho com a letra E cortada. E agora?', ops: ['Proibido estacionar', 'Estacionamento liberado', 'Proibido parar e estacionar'], c: 0, exp: 'Placa R-6a, Proibido estacionar. A barra vermelha em diagonal indica proibição.' },
    { id: 'vel40', placa: 'vel40', q: 'O que essa placa determina?', ops: ['Velocidade mínima de 40 km/h', 'Velocidade máxima permitida de 40 km/h', 'Velocidade só para curvas'], c: 1, exp: 'Placa R-19, Velocidade máxima permitida: é o limite daquele trecho.' },
    { id: 'esquerda', placa: 'esquerda', q: 'Seta virando com a barra vermelha por cima:', ops: ['Proibido virar à esquerda', 'Obrigatório virar à esquerda', 'Proibido virar à direita'], c: 0, exp: 'Placa R-4a, Proibido virar à esquerda.' },
    { id: 'semaforo', placa: 'semaforo', q: 'O sinal ficou amarelo. O que o condutor deve fazer?', ops: ['Acelerar para passar antes do vermelho', 'Seguir normal: amarelo é só aviso', 'Parar o veículo, a não ser que frear ali cause perigo'], c: 2, exp: 'Amarelo é atenção: o certo é parar. Só segue quem já está tão perto que frear seria perigoso.' },
    { id: 'dupla', placa: 'duplaContinua', q: 'Duas linhas amarelas contínuas no meio da pista significam:', ops: ['Ultrapassagem proibida nos dois sentidos', 'Ultrapassagem permitida com cuidado', 'Faixa exclusiva de ônibus'], c: 0, exp: 'A linha amarela separa os sentidos. Contínua quer dizer: não cruza e não ultrapassa.' },
    { id: 'celular', placa: 'celular', q: 'Dirigir segurando ou mexendo no celular é infração:', ops: ['Leve', 'Gravíssima', 'Não é infração se estiver devagar'], c: 1, exp: 'Segurar ou manusear o celular ao volante é infração gravíssima pelo Código de Trânsito.' },
    { id: 'sirene', placa: 'sirene', q: 'Ambulância com sirene e luzes ligadas vindo atrás de você. O que fazer?', ops: ['Acelerar para ficar à frente dela', 'Frear de repente onde estiver', 'Deixar a faixa da esquerda livre, indo para a direita e parando se precisar'], c: 2, exp: 'O Código de Trânsito manda abrir caminho: faixa da esquerda livre, você vai para a direita e para se for preciso.' }
  ];
  function placa(nome) { return '<svg class="placa" viewBox="0 0 120 120" role="img" aria-label="Placa ou situação da pergunta">' + (PLACAS[nome] || '') + '</svg>'; }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function montar(el, op) {
    op = op || {};
    var lista = op.ids ? op.ids.map(function (i) { return PERGUNTAS.filter(function (p) { return p.id === i; })[0]; }).filter(Boolean) : PERGUNTAS.slice();
    var n = 0, acertos = 0, respondida = false;
    function cabeca() {
      return '<div class="sim-cabeca"><span>Pergunta ' + (n + 1) + ' de ' + lista.length + '</span><span class="sim-placar" aria-live="polite">Acertos: <b>' + acertos + '</b></span></div>' +
        '<div class="sim-barra" aria-hidden="true"><span style="transform:scaleX(' + (n / lista.length).toFixed(3) + ')"></span></div>';
    }
    function pergunta() {
      respondida = false;
      var p = lista[n];
      el.innerHTML = cabeca() + '<div class="sim-q">' + placa(p.placa) + '<div><p class="sim-enunciado">' + esc(p.q) + '</p>' +
        '<div class="sim-ops">' + p.ops.map(function (o, i) { return '<button type="button" class="sim-op" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>' +
        '<div class="sim-exp" aria-live="polite"></div></div></div>';
      Array.prototype.forEach.call(el.querySelectorAll('.sim-op'), function (b) { b.addEventListener('click', function () { responde(+b.getAttribute('data-i')); }); });
    }
    function responde(i) {
      if (respondida) return; respondida = true;
      var p = lista[n], certo = i === p.c;
      if (certo) acertos++;
      Array.prototype.forEach.call(el.querySelectorAll('.sim-op'), function (b) {
        var k = +b.getAttribute('data-i'); b.disabled = true;
        if (k === p.c) { b.classList.add('certa'); b.insertAdjacentHTML('afterbegin', '<span class="sim-marca">✓ </span>'); }
        else if (k === i) { b.classList.add('errada'); b.insertAdjacentHTML('afterbegin', '<span class="sim-marca">✗ </span>'); }
      });
      el.querySelector('.sim-placar b').textContent = acertos;
      var ultima = n === lista.length - 1;
      el.querySelector('.sim-exp').innerHTML = '<p><b>' + (certo ? 'Acertou.' : 'Não foi dessa vez.') + '</b> ' + esc(p.exp) + '</p>' +
        '<button type="button" class="bt bt-vermelho sim-prox">' + (ultima ? 'Ver resultado' : 'Próxima pergunta') + '</button>';
      var bt = el.querySelector('.sim-prox');
      bt.addEventListener('click', function () { n++; if (n < lista.length) pergunta(); else fim(); });
      bt.focus({ preventScroll: true });
    }
    function fim() {
      if (!op.mini && window.CP) { var ant = CP.simulado(); if (!ant || acertos > ant.melhor) CP.simulado({ melhor: acertos, de: lista.length, data: CP.hojeISO(0) }); }
      var frase = acertos === lista.length ? 'Gabaritou. Bora marcar as aulas práticas?' : acertos >= lista.length * 0.7 ? 'Mandou bem. Mais um pouco de estudo e é com você.' : 'Ainda dá pra treinar mais. O curso teórico existe pra isso.';
      el.innerHTML = '<div class="sim-fim"><p class="sim-nota"><b>' + acertos + '</b> de ' + lista.length + '</p><p>' + frase + '</p>' +
        '<p class="sim-aviso">Perguntas de exemplo, só para treinar. Não é o banco oficial da prova do Detran.</p>' +
        '<div class="sim-acoes"><button type="button" class="bt bt-contorno sim-refaz">Refazer</button>' +
        (op.mini ? '<a class="bt bt-amarelo" href="simulado.html">Simulado completo</a>' : '<a class="bt bt-vermelho" href="index.html#matricula">Fazer pré-matrícula</a>') + '</div></div>';
      el.querySelector('.sim-refaz').addEventListener('click', function () { n = 0; acertos = 0; pergunta(); });
    }
    pergunta();
  }
  window.SIM = { montar: montar, PERGUNTAS: PERGUNTAS, placa: placa };
})();
