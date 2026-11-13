/* Painel da Autoescola Copiauto — modo demo (localStorage cp_). O login é só porta de vitrine. */
(function () {
  'use strict';
  var esc = CP.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var corpo = $('#corpo');
  var est = { aba: new URLSearchParams(location.search).get('aba') || 'pre', fPre: 'abertas', fEt: 0, dia: CP.hojeISO(0), fIns: '', fVei: '' };
  $('[data-logo]').innerHTML = CP.logo('logo');

  function entrar() { $('#tela-login').hidden = true; $('#tela-painel').hidden = false; aba(est.aba); }
  try { if (sessionStorage.getItem('cp_logado')) entrar(); } catch (e) { /* */ }
  $('#form-login').addEventListener('submit', function (e) {
    e.preventDefault();
    if ($('#l-user').value.trim().toLowerCase() === 'recepcao' && $('#l-senha').value === 'copiauto') { try { sessionStorage.setItem('cp_logado', '1'); } catch (er) { /* */ } entrar(); }
    else $('#login-erro').innerHTML = '<p class="erro">Usuário ou senha não conferem. Use os dados de demonstração acima.</p>';
  });
  $('#sair').addEventListener('click', function () { try { sessionStorage.removeItem('cp_logado'); } catch (e) { /* */ } location.reload(); });
  $$('.adm-abas button').forEach(function (b) { b.addEventListener('click', function () { aba(b.getAttribute('data-aba')); }); });
  function aba(id) {
    var mapa = { pre: pre, alunos: alunos, agenda: agenda, avisos: avisos, ajustes: ajustes };
    if (!mapa[id]) id = 'pre';
    est.aba = id;
    $$('.adm-abas button').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-aba') === id); });
    mapa[id]();
    window.scrollTo(0, 0);
  }
  function wa(tel) { tel = String(tel || '').replace(/\D/g, ''); return tel.length <= 11 ? '55' + tel : tel; }
  function primeiro(n) { return String(n).replace(/ \(.*\)$/, '').split(' ')[0]; }
  function tagCambio(c) { return '<span class="tag' + (c === 'automatico' ? ' auto' : '') + '">' + CP.cambioNome(c) + '</span>'; }
  function opts(lista, sel, vazio) { return (vazio ? '<option value="">' + vazio + '</option>' : '') + lista.map(function (o) { return '<option value="' + o.id + '"' + (o.id === sel ? ' selected' : '') + '>' + esc(o.nome) + '</option>'; }).join(''); }

  /* ---------- pré-matrículas: nova → contato → matriculado ---------- */
  var STP = { nova: 'Nova', contato: 'Em contato', matriculado: 'Matriculado', desistiu: 'Desistiu' };
  function pre() {
    var todas = CP.prematriculas();
    var conta = function (s) { return todas.filter(function (x) { return x.status === s; }).length; };
    var fechadas = conta('matriculado') + conta('desistiu');
    var lista = todas.filter(function (x) {
      if (est.fPre === 'abertas') return x.status === 'nova' || x.status === 'contato';
      if (est.fPre === 'fechadas') return x.status === 'matriculado' || x.status === 'desistiu';
      return true;
    });
    corpo.innerHTML = '<h2>Pré-matrículas</h2>' +
      '<div class="resumo"><div><b>' + conta('nova') + '</b>novas para responder</div><div><b>' + conta('contato') + '</b>em contato</div><div><b>' + conta('matriculado') + '</b>matriculados</div><div><b>' + (fechadas ? Math.round(conta('matriculado') / fechadas * 100) : 0) + '%</b>viraram matrícula</div></div>' +
      '<div class="filtros">' + [['abertas', 'Em aberto'], ['fechadas', 'Concluídas'], ['todas', 'Todas']].map(function (f) { return '<button type="button" data-f="' + f[0] + '" aria-pressed="' + (est.fPre === f[0]) + '">' + f[1] + '</button>'; }).join('') + '</div>' +
      '<div class="caixa">' + (lista.length ? lista.map(function (x) {
        var msg = 'Olá, ' + primeiro(x.nome) + '! Aqui é da Autoescola Copiauto. Recebemos sua pré-matrícula (' + CP.categoria(x.categoria) + ', carro ' + CP.cambioNome(x.cambio).toLowerCase() + '). Podemos seguir?';
        var proximos = x.status === 'nova' ? ['contato', 'matriculado', 'desistiu'] : x.status === 'contato' ? ['matriculado', 'desistiu'] : ['contato'];
        return '<div class="linha-adm"><div><div class="t">' + esc(x.nome) + ' <span class="st st-' + x.status + '">' + STP[x.status] + '</span></div>' +
          '<div class="s">' + esc(CP.categoria(x.categoria)) + ' · ' + tagCambio(x.cambio) + (x.pcd ? ' <span class="tag pcd">PCD</span>' : '') + ' · turno: ' + esc(CP.turno(x.turno)) + ' · ' + CP.dataCurta(x.data) + ' · via ' + esc(x.origem) +
          (x.restricoes ? '<br>Restrições: ' + esc(x.restricoes) : '') + (!x.tel ? '<br><i>Veio pelo site: a conversa chega no WhatsApp da autoescola.</i>' : '') + '</div></div>' +
          '<div class="acoes">' + proximos.map(function (s) { return '<button class="mini-bt' + (s === 'matriculado' ? ' forte' : s === 'desistiu' ? ' perigo' : '') + '" data-st="' + s + '" data-id="' + x.id + '">' + (s === 'contato' ? 'Em contato' : STP[s]) + '</button>'; }).join('') +
          (x.tel ? '<a class="mini-bt wa" target="_blank" rel="noopener" href="https://wa.me/' + wa(x.tel) + '?text=' + encodeURIComponent(msg) + '">WhatsApp</a>' : '') + '</div></div>';
      }).join('') : '<p>Nada por aqui.</p>') + '</div>' +
      '<p class="aviso-demo">Marcar como <b>Matriculado</b> já cria o aluno na aba Alunos, na etapa 1.</p>';
    $$('[data-f]').forEach(function (b) { b.addEventListener('click', function () { est.fPre = b.getAttribute('data-f'); pre(); }); });
    $$('[data-st]').forEach(function (b) {
      b.addEventListener('click', function () {
        var st = b.getAttribute('data-st'), id = b.getAttribute('data-id'), l = CP.prematriculas(), x = null;
        l.forEach(function (i) { if (i.id === id) { i.status = st; x = i; } });
        CP.prematriculas(l);
        if (x && st === 'matriculado') {
          var al = CP.alunos();
          if (!al.some(function (a) { return a.nome === x.nome; })) {
            al.push({ id: CP.id(), nome: x.nome, tel: x.tel, categoria: x.categoria, cambio: x.cambio, pcd: x.pcd, etapa: 1, instrutor: CP.INSTRUTORES[0].id, aulasFeitas: 0 });
            CP.alunos(al);
          }
        }
        pre();
      });
    });
  }

  /* ---------- alunos e etapas ---------- */
  function alunos() {
    var todos = CP.alunos();
    var lista = todos.filter(function (a) { return !est.fEt || a.etapa === est.fEt; });
    corpo.innerHTML = '<h2>Alunos e etapas da CNH</h2>' +
      '<div class="resumo">' + CP.ETAPAS.map(function (e) { return '<div><b>' + todos.filter(function (a) { return a.etapa === e.id; }).length + '</b>' + esc(e.nome) + '</div>'; }).join('') + '</div>' +
      '<div class="filtros"><button type="button" data-et="0" aria-pressed="' + (!est.fEt) + '">Todos</button>' + CP.ETAPAS.map(function (e) { return '<button type="button" data-et="' + e.id + '" aria-pressed="' + (est.fEt === e.id) + '">' + e.id + '. ' + esc(e.nome) + '</button>'; }).join('') + '</div>' +
      '<div class="caixa">' + (lista.length ? lista.map(function (a) {
        var e = CP.ETAPAS[a.etapa - 1];
        return '<div class="linha-adm"><div><div class="t">' + esc(a.nome) + ' <span class="st st-contato">etapa ' + a.etapa + '/6 · ' + esc(e.nome) + '</span></div>' +
          '<div class="s">' + esc(CP.categoria(a.categoria)) + ' · ' + tagCambio(a.cambio) + (a.pcd ? ' <span class="tag pcd">PCD</span>' : '') + ' · ' + esc(CP.instrutor(a.instrutor)) + '</div></div>' +
          '<div class="acoes"><button class="mini-bt" data-mv="-1" data-id="' + a.id + '"' + (a.etapa <= 1 ? ' disabled' : '') + '>Voltar etapa</button><button class="mini-bt forte" data-mv="1" data-id="' + a.id + '"' + (a.etapa >= 6 ? ' disabled' : '') + '>Avançar etapa</button>' +
          (a.tel ? '<a class="mini-bt wa" target="_blank" rel="noopener" href="https://wa.me/' + wa(a.tel) + '">WhatsApp</a>' : '') + '</div></div>';
      }).join('') : '<p>Nenhum aluno nesta etapa.</p>') + '</div>' +
      '<h3>Cadastrar aluno</h3><form class="caixa cheia" id="f-al"><div class="form-linha">' +
      '<div><label for="a-nome">Nome</label><input id="a-nome" required></div><div><label for="a-tel">WhatsApp</label><input id="a-tel" inputmode="tel"></div>' +
      '<div><label for="a-cat">Categoria</label><select id="a-cat">' + opts(CP.CATEGORIAS, 'B') + '</select></div>' +
      '<div><label for="a-cam">Câmbio</label><select id="a-cam"><option value="automatico">Automático</option><option value="manual">Manual</option></select></div>' +
      '<div><label for="a-ins">Instrutor</label><select id="a-ins">' + opts(CP.INSTRUTORES) + '</select></div>' +
      '<div><button class="bt bt-vermelho bt-largo" type="submit">Cadastrar</button></div></div><div id="a-msg" aria-live="polite"></div></form>';
    $$('[data-et]').forEach(function (b) { b.addEventListener('click', function () { est.fEt = +b.getAttribute('data-et'); alunos(); }); });
    $$('[data-mv]').forEach(function (b) {
      b.addEventListener('click', function () {
        var l = CP.alunos(), mv = +b.getAttribute('data-mv');
        l.forEach(function (a) { if (a.id === b.getAttribute('data-id')) a.etapa = Math.min(6, Math.max(1, a.etapa + mv)); });
        CP.alunos(l); alunos();
      });
    });
    $('#f-al').addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = $('#a-nome').value.trim();
      if (nome.length < 2) { $('#a-msg').innerHTML = '<p class="erro">Escreva o nome do aluno.</p>'; return; }
      var l = CP.alunos();
      l.push({ id: CP.id(), nome: nome, tel: $('#a-tel').value.replace(/\D/g, ''), categoria: $('#a-cat').value, cambio: $('#a-cam').value, pcd: false, etapa: 1, instrutor: $('#a-ins').value, aulasFeitas: 0 });
      CP.alunos(l); alunos();
    });
  }

  /* ---------- agenda de aulas por instrutor / carro ---------- */
  var STA = { marcada: 'Marcada', feita: 'Feita', faltou: 'Faltou' };
  function agenda() {
    var dias = []; for (var i = -1; i < 7; i++) dias.push(CP.hojeISO(i));
    var al = CP.alunos();
    var nomeAl = function (id) { var a = al.filter(function (x) { return x.id === id; })[0]; return a ? a.nome : '(aluno removido)'; };
    var lista = CP.aulas().filter(function (u) { return u.data === est.dia && (!est.fIns || u.instrutor === est.fIns) && (!est.fVei || u.veiculo === est.fVei); })
      .sort(function (a, b) { return a.hora.localeCompare(b.hora); });
    corpo.innerHTML = '<h2>Agenda de aulas práticas</h2>' +
      '<div class="filtros">' + dias.map(function (d) { return '<button type="button" data-dia="' + d + '" aria-pressed="' + (est.dia === d) + '">' + (d === CP.hojeISO(0) ? 'Hoje' : CP.dataCurta(d)) + '</button>'; }).join('') + '</div>' +
      '<div class="filtros"><select id="f-ins" aria-label="Filtrar por instrutor">' + opts(CP.INSTRUTORES, est.fIns, 'Todos os instrutores') + '</select>' +
      '<select id="f-vei" aria-label="Filtrar por veículo">' + opts(CP.VEICULOS, est.fVei, 'Todos os veículos') + '</select></div>' +
      '<div class="caixa">' + (lista.length ? lista.map(function (u) {
        var v = CP.veiculo(u.veiculo);
        return '<div class="linha-adm"><div><div class="t">' + esc(u.hora) + ' · ' + esc(nomeAl(u.alunoId)) + ' <span class="st st-' + u.status + '">' + STA[u.status] + '</span></div>' +
          '<div class="s">' + esc(v.nome) + ' ' + (v.cat === 'A' ? '<span class="tag">Moto</span>' : tagCambio(v.cambio)) + ' · ' + esc(CP.instrutor(u.instrutor)) + '</div></div>' +
          '<div class="acoes">' + ['feita', 'faltou', 'marcada'].filter(function (s) { return s !== u.status; }).map(function (s) { return '<button class="mini-bt' + (s === 'feita' ? ' forte' : '') + '" data-ua="' + s + '" data-id="' + u.id + '">' + (s === 'marcada' ? 'Voltar p/ marcada' : STA[s]) + '</button>'; }).join('') +
          '<button class="mini-bt perigo" data-del="' + u.id + '">Cancelar</button></div></div>';
      }).join('') : '<p>Nenhuma aula neste dia' + (est.fIns || est.fVei ? ' com esse filtro' : '') + '.</p>') + '</div>' +
      '<h3>Marcar aula</h3><form class="caixa cheia" id="f-aula"><div class="form-linha">' +
      '<div><label for="u-al">Aluno</label><select id="u-al">' + opts(al) + '</select></div>' +
      '<div><label for="u-data">Dia</label><input type="date" id="u-data" value="' + est.dia + '"></div>' +
      '<div><label for="u-hora">Hora</label><input type="time" id="u-hora" value="08:00" step="1800"></div>' +
      '<div><label for="u-ins">Instrutor</label><select id="u-ins">' + opts(CP.INSTRUTORES) + '</select></div>' +
      '<div><label for="u-vei">Veículo</label><select id="u-vei">' + opts(CP.VEICULOS) + '</select></div>' +
      '<div><button class="bt bt-vermelho bt-largo" type="submit">Marcar</button></div></div><div id="u-msg" aria-live="polite"></div></form>' +
      '<p class="aviso-demo">Instrutores e frota são de exemplo (só o carro automático é real). O painel avisa se o carro ou o instrutor já estiver ocupado no horário.</p>';
    $$('[data-dia]').forEach(function (b) { b.addEventListener('click', function () { est.dia = b.getAttribute('data-dia'); agenda(); }); });
    $('#f-ins').addEventListener('change', function () { est.fIns = this.value; agenda(); });
    $('#f-vei').addEventListener('change', function () { est.fVei = this.value; agenda(); });
    $$('[data-ua]').forEach(function (b) {
      b.addEventListener('click', function () { var l = CP.aulas(); l.forEach(function (u) { if (u.id === b.getAttribute('data-id')) u.status = b.getAttribute('data-ua'); }); CP.aulas(l); agenda(); });
    });
    $$('[data-del]').forEach(function (b) {
      b.addEventListener('click', function () { if (!confirm('Cancelar esta aula?')) return; CP.aulas(CP.aulas().filter(function (u) { return u.id !== b.getAttribute('data-del'); })); agenda(); });
    });
    // sugere o veículo pelo câmbio do aluno
    function sugere() { var a = al.filter(function (x) { return x.id === $('#u-al').value; })[0]; if (!a) return; $('#u-ins').value = a.instrutor || $('#u-ins').value; $('#u-vei').value = /A$/.test(a.categoria) ? 'moto' : a.cambio === 'automatico' ? 'auto' : 'man1'; }
    if ($('#u-al')) { $('#u-al').addEventListener('change', sugere); sugere(); }
    $('#f-aula').addEventListener('submit', function (e) {
      e.preventDefault();
      var n = { id: CP.id(), alunoId: $('#u-al').value, data: $('#u-data').value, hora: $('#u-hora').value, instrutor: $('#u-ins').value, veiculo: $('#u-vei').value, status: 'marcada' };
      if (!n.alunoId || !n.data || !n.hora) { $('#u-msg').innerHTML = '<p class="erro">Escolha aluno, dia e hora.</p>'; return; }
      var l = CP.aulas();
      var choque = l.filter(function (u) { return u.data === n.data && u.hora === n.hora && u.status === 'marcada' && (u.veiculo === n.veiculo || u.instrutor === n.instrutor); })[0];
      if (choque) { $('#u-msg').innerHTML = '<p class="erro">' + (choque.veiculo === n.veiculo ? 'Esse veículo' : 'Esse instrutor') + ' já tem aula nesse horário.</p>'; return; }
      l.push(n); CP.aulas(l); est.dia = n.data; agenda();
    });
  }

  /* ---------- avisos (aparecem na área do aluno) ---------- */
  function avisos() {
    var l = CP.avisos();
    corpo.innerHTML = '<h2>Avisos</h2><p>Aparecem na área do aluno.</p><div class="caixa">' + (l.length ? l.map(function (v) {
      return '<div class="linha-adm"><div><div class="s">' + CP.dataCurta(v.data) + '</div><div class="t">' + esc(v.texto) + '</div></div><div class="acoes"><button class="mini-bt perigo" data-rm="' + v.id + '">Apagar</button></div></div>';
    }).join('') : '<p>Sem avisos.</p>') + '</div>' +
      '<form class="caixa cheia" id="f-av"><label for="v-txt" style="font-weight:700;display:block;margin-bottom:6px">Novo aviso</label><textarea id="v-txt" rows="3"></textarea><button class="bt bt-vermelho" type="submit" style="margin-top:12px">Publicar aviso</button></form>';
    $$('[data-rm]').forEach(function (b) { b.addEventListener('click', function () { CP.avisos(CP.avisos().filter(function (v) { return v.id !== b.getAttribute('data-rm'); })); avisos(); }); });
    $('#f-av').addEventListener('submit', function (e) {
      e.preventDefault(); var t = $('#v-txt').value.trim(); if (!t) return;
      var l2 = CP.avisos(); l2.unshift({ id: CP.id(), data: CP.hojeISO(0), texto: t }); CP.avisos(l2); avisos();
    });
  }

  /* ---------- ajustes ---------- */
  function ajustes() {
    var c = CP.CASA;
    corpo.innerHTML = '<h2>Ajustes</h2><div class="caixa cheia"><p><b>Dados da autoescola no site</b> (vêm de <code>assets/dados.js</code>):</p>' +
      '<p>WhatsApp: ' + esc(c.whatsappTexto) + '<br>Fixos: ' + esc(c.fixos.join(' · ')) + '<br>' + esc(c.endereco) + ' · ' + esc(c.bairro) + ', Salvador · CEP ' + esc(c.cep) + '<br>Instagram: @' + esc(c.instagram) + '</p></div>' +
      '<div class="caixa cheia"><p><b>Modo demonstração.</b> Tudo o que é feito no painel fica só neste navegador.</p><button class="bt bt-contorno" type="button" id="reset">Voltar aos dados de exemplo</button></div>';
    $('#reset').addEventListener('click', function () { if (confirm('Apagar o que foi feito e voltar aos dados de exemplo?')) { CP.resetar(); aba('pre'); } });
  }
})();
