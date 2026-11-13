/* Copiauto · site: cena da prova prática (rolagem), seletor manual/automático, estrada das 6 etapas,
   pré-matrícula → WhatsApp. JS puro (sem biblioteca). Só transform / opacity / clip-path animam. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var reduz = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  /* ---------- logo ---------- */
  $$('[data-logo]').forEach(function (el) { el.innerHTML = CP.logo('logo'); el.setAttribute('aria-label', 'Autoescola Copiauto, início'); });
  $$('[data-logo-mini]').forEach(function (el) { el.innerHTML = CP.logo('logo-mini'); });

  /* ---------- seletor MANUAL ↔ AUTOMÁTICO ---------- */
  var modo = CP.cambio();
  function aplicaModo(m, salvar) {
    modo = m === 'manual' ? 'manual' : 'automatico';
    if (salvar) CP.cambio(modo);
    document.body.classList.toggle('modo-auto', modo === 'automatico');
    document.body.classList.toggle('modo-manual', modo === 'manual');
    $$('[data-seletor]').forEach(function (b) {
      b.setAttribute('aria-checked', modo === 'automatico' ? 'true' : 'false');
      b.setAttribute('aria-label', 'Câmbio: ' + (modo === 'automatico' ? 'automático' : 'manual') + '. Toque para trocar.');
    });
    var r = $('#form-mat input[name="cambio"][value="' + modo + '"]'); if (r) r.checked = true;
    atualizaCNH(); pede();
  }
  $$('[data-seletor]').forEach(function (b) { b.addEventListener('click', function () { aplicaModo(modo === 'automatico' ? 'manual' : 'automatico', true); }); });

  /* ---------- CENA: a prova prática no Detran ---------- */
  var cena = $('#cena'), mundo = $('#mundo'), carro = $('#carro'), tampa = $('#tampa'), freio = $('#freio');
  var revela = $('#revela'), marcha = $('#marcha'), trajeto = $('#trajeto');
  var legs = $$('#legendas .leg');
  // [progresso, y do carro no mundo, x, giro]
  var KF = [[0, 2250, 255, 0], [0.10, 2050, 255, 0], [0.19, 1590, 255, 0], [0.25, 1680, 298, -28], [0.30, 1732, 340, 0],
    [0.34, 1732, 340, 0], [0.38, 1640, 292, -22], [0.41, 1555, 255, 0], [0.45, 1430, 255, 0], [0.53, 1250, 255, 0],
    [0.58, 1070, 255, 0], [0.67, 925, 255, 0], [0.73, 800, 255, 0], [0.87, 390, 255, 0], [0.92, 262, 255, 0], [1, 262, 255, 0]];
  // a faixa central é pintada atrás do carro, sem "despintar" na baliza
  var KT = [[0, 2294], [0.10, 2094], [0.19, 1634], [0.38, 1634], [0.41, 1599], [0.45, 1474], [0.53, 1294], [0.58, 1114], [0.67, 969], [0.73, 844], [0.87, 434], [0.92, 306], [1, 306]];
  function interp(tab, p, col) {
    for (var i = 1; i < tab.length; i++) {
      if (p <= tab[i][0]) {
        var a = tab[i - 1], b = tab[i], t = (p - a[0]) / (b[0] - a[0] || 1);
        t = t * t * (3 - 2 * t);
        return a[col] + (b[col] - a[col]) * t;
      }
    }
    return tab[tab.length - 1][col];
  }
  function marchaEm(p) {
    var auto = modo === 'automatico';
    if (p >= 0.92) return 'P';
    if (p >= 0.19 && p < 0.30) return 'R';
    if (p >= 0.30 && p < 0.34) return auto ? 'P' : 'N';
    if (auto) return 'D';
    if (p < 0.08) return '1';
    if (p < 0.19) return '2';
    if (p < 0.53) return '1';
    if (p < 0.58) return '3';
    if (p < 0.70) return '2';
    return '3';
  }
  var viva = false, atual = 0, alvo = 0, raf = 0;
  function progresso() {
    var r = cena.getBoundingClientRect(), total = cena.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-r.top / total) : 0;
  }
  function render(p) {
    var y = interp(KF, p, 1), x = interp(KF, p, 2), g = interp(KF, p, 3);
    carro.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + g.toFixed(1) + ')');
    tampa.setAttribute('transform', 'translate(0 ' + interp(KT, p, 1).toFixed(1) + ')');
    var palcoH = cena.firstElementChild.clientHeight, s = mundo.clientWidth / 400;
    var frac = window.innerWidth < 760 ? 0.62 : 0.58;
    var ty = palcoH * frac - y * s;
    ty = Math.min(0, Math.max(palcoH - 2400 * s, ty));
    mundo.style.transform = 'translate3d(0,' + ty.toFixed(1) + 'px,0)';
    var freando = (p > 0.17 && p < 0.34) || (p > 0.55 && p < 0.67) || p > 0.86;
    freio.setAttribute('opacity', freando ? '1' : '0');
    var m = marchaEm(p); if (marcha.textContent !== m) marcha.textContent = m;
    trajeto.style.transform = 'scaleX(' + p.toFixed(3) + ')';
    legs.forEach(function (l) {
      var de = +l.getAttribute('data-de'), ate = +l.getAttribute('data-ate');
      var a = (de === 0 ? 1 : clamp((p - de) / 0.025)) * clamp((ate - p) / 0.025);
      l.style.opacity = a.toFixed(3);
      l.style.transform = 'translate3d(0,' + ((1 - a) * 18).toFixed(1) + 'px,0)';
      l.classList.toggle('ativa', a > 0.5);
    });
    var r = clamp((p - 0.89) / 0.08);
    revela.style.clipPath = 'circle(' + (r * 115).toFixed(1) + '% at 50% 60%)';
    revela.style.webkitClipPath = revela.style.clipPath;
    revela.classList.toggle('aberta', r > 0.85);
  }
  function tick() {
    raf = 0;
    if (!viva) return;
    alvo = progresso();
    atual += (alvo - atual) * 0.2;
    if (Math.abs(alvo - atual) < 0.0004) atual = alvo;
    render(atual);
    if (atual !== alvo) raf = requestAnimationFrame(tick);
  }
  function pede() { if (!raf) raf = requestAnimationFrame(function () { tick(); estrada(); }); else estrada(); }
  function liga() {
    viva = !reduz.matches && !!mundo;
    document.documentElement.classList.toggle('cena-viva', viva);
    if (viva) { atual = alvo = progresso(); render(atual); }
    else if (revela) { revela.style.clipPath = ''; revela.style.webkitClipPath = ''; legs.forEach(function (l) { l.style.opacity = ''; l.style.transform = ''; }); }
  }
  if (reduz.addEventListener) reduz.addEventListener('change', liga);
  window.addEventListener('scroll', pede, { passive: true });
  window.addEventListener('resize', function () { if (viva) render(atual); pede(); });

  /* ---------- Sua CNH em 6 etapas: uma estrada com paradas ---------- */
  var paradas = $('#paradas'), carrinho = $('#estrada-carro'), estradaEl = $('#estrada');
  if (paradas) {
    paradas.innerHTML = CP.ETAPAS.map(function (e) {
      var extra = e.id === 4 ? ' <a href="simulado.html">Treinar no simulado</a>' : e.id === 1 ? ' <a href="#matricula">Fazer pré-matrícula</a>' : '';
      return '<li class="parada"><span class="parada-marco" aria-hidden="true"><small>etapa</small>' + e.id + '</span><h3>' + CP.esc(e.nome) + '</h3><p>' + CP.esc(e.txt) + extra + '</p></li>';
    }).join('');
  }
  var itens = paradas ? $$('.parada', paradas) : [];
  function estrada() {
    if (!estradaEl || !carrinho) return;
    var r = estradaEl.getBoundingClientRect(), vh = window.innerHeight;
    var p = clamp((vh * 0.75 - r.top) / (r.height * 0.9));
    if (reduz.matches) p = 1;
    var deitado = window.innerWidth >= 900;
    var pista = deitado ? estradaEl.clientWidth - 120 : r.height - 80;
    carrinho.style.transform = deitado ? 'translate3d(' + (p * pista).toFixed(0) + 'px,0,0) rotate(90deg)' : 'translate3d(0,' + (p * pista).toFixed(0) + 'px,0) rotate(180deg)';
    itens.forEach(function (li, i) { li.classList.toggle('passou', p >= (i + 0.35) / itens.length); });
    if (wa) wa.classList.toggle('mostra', !viva || cena.getBoundingClientRect().bottom < window.innerHeight * 0.5);
  }
  var wa = $('.wa-flutua');

  /* ---------- simulado (amostra de 3) ---------- */
  if ($('#sim-mini') && window.SIM) SIM.montar($('#sim-mini'), { ids: ['lombada', 'pare', 'semaforo'], mini: true });

  /* ---------- pré-matrícula ---------- */
  var form = $('#form-mat');
  function valor(n) { var el = form && form.querySelector('[name="' + n + '"]:checked'); return el ? el.value : ''; }
  function atualizaCNH() {
    if (!form) return;
    var nome = $('#m-nome').value.trim();
    $('#c-nome').textContent = nome || 'Seu nome aqui';
    $('#c-cat').textContent = CP.categoria($('#m-cat').value);
    $('#c-cambio').textContent = CP.cambioNome(valor('cambio'));
    $('#c-turno').textContent = CP.turno(valor('turno'));
    var pcd = valor('pcd') === 'sim';
    $('#c-pcd').hidden = !pcd; $('#m-restr-caixa').hidden = !pcd;
  }
  if (form) {
    $('#m-cat').innerHTML = CP.CATEGORIAS.map(function (c) { return '<option value="' + c.id + '">' + CP.esc(c.nome) + '</option>'; }).join('');
    form.addEventListener('input', atualizaCNH);
    form.addEventListener('change', function (e) {
      if (e.target.name === 'cambio' && e.target.value !== modo) aplicaModo(e.target.value, true);
      atualizaCNH();
    });
    $$('.serv-ir').forEach(function (a) {
      a.addEventListener('click', function () {
        if (a.getAttribute('data-cat')) $('#m-cat').value = a.getAttribute('data-cat');
        if (a.getAttribute('data-pcd')) form.querySelector('[name="pcd"][value="sim"]').checked = true;
        if (a.getAttribute('data-cambio')) aplicaModo(a.getAttribute('data-cambio'), true);
        atualizaCNH();
        setTimeout(function () { $('#m-nome').focus({ preventScroll: true }); }, 400);
      });
    });
    var q = new URLSearchParams(location.search);
    if (q.get('cat') && CP.categoria(q.get('cat')) !== q.get('cat')) $('#m-cat').value = q.get('cat');
    if (q.get('pcd') === '1') form.querySelector('[name="pcd"][value="sim"]').checked = true;
    if (q.get('cambio') === 'manual' || q.get('cambio') === 'automatico') modo = q.get('cambio');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = $('#m-nome').value.trim();
      if (nome.length < 2) { $('#m-erro').innerHTML = '<p class="erro">Escreva seu nome para a gente saber com quem fala.</p>'; $('#m-nome').focus(); return; }
      $('#m-erro').innerHTML = '';
      var d = { nome: nome, categoria: $('#m-cat').value, cambio: valor('cambio'), pcd: valor('pcd') === 'sim', restricoes: $('#m-restr').value.trim(), turno: valor('turno') };
      var msg = 'Olá, Copiauto! Quero fazer minha pré-matrícula.\n' +
        'Nome: ' + d.nome + '\nQuero: ' + CP.categoria(d.categoria) + '\nCarro da aula e da prova: ' + CP.cambioNome(d.cambio) +
        '\nHabilitação PCD: ' + (d.pcd ? 'sim' + (d.restricoes ? ' (' + d.restricoes + ')' : '') : 'não') +
        '\nMelhor turno: ' + CP.turno(d.turno) + '\n(enviado pelo site)';
      var lista = CP.prematriculas();
      lista.unshift({ id: CP.id(), nome: d.nome, tel: '', categoria: d.categoria, cambio: d.cambio, pcd: d.pcd, restricoes: d.restricoes, turno: d.turno, status: 'nova', data: CP.hojeISO(0), origem: 'site' });
      CP.prematriculas(lista);
      var url = CP.wa(msg);
      $('#m-erro').innerHTML = '<p class="ok">Pronto! Abrimos o WhatsApp com a sua mensagem. Se não abriu, <a href="' + url + '" target="_blank" rel="noopener">toque aqui</a>.</p>';
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (er) { /* */ } } else location.href = url;
    });
  }

  aplicaModo(modo, false);
  liga();
  estrada();
})();
