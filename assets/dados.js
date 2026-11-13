/* =====================================================================
   Autoescola Copiauto · Itaigara, Salvador/BA — dados da autoescola + "banco" do modo demo.
   ÚNICO lugar com informação da autoescola. Site, simulado, área do aluno e painel leem daqui.
   Modo demo: tudo fica no navegador (localStorage, prefixo cp_).
   Regra: nada de preço, ano, equipe, horário de funcionamento ou nº de aprovados inventado.
   Fonte: bio e legendas do Instagram @copiauto (coleta de 13/11/2026).
   ===================================================================== */
(function () {
  'use strict';

  var CASA = {
    nome: 'Autoescola Copiauto',
    whatsapp: '5571991556090',             // REAL: bio e todas as artes do @copiauto
    whatsappTexto: '(71) 99155-6090',
    fixos: ['(71) 3358-2499', '(71) 3353-1195'],  // bio
    endereco: 'Av. ACM, 846 · Ed. Max Center, salas 226 e 227',
    bairro: 'Itaigara',
    cidade: 'Salvador · Bahia',
    cep: '41825-902',
    mapa: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Avenida ACM 846 Edificio Max Center Itaigara Salvador BA'),
    instagram: 'copiauto'
  };

  // Categorias da pré-matrícula (bio: primeira habilitação + adição de categoria moto e carro)
  var CATEGORIAS = [
    { id: 'B',    nome: '1ª habilitação · carro (B)' },
    { id: 'A',    nome: '1ª habilitação · moto (A)' },
    { id: 'AB',   nome: '1ª habilitação · carro e moto (AB)' },
    { id: 'addA', nome: 'Adição de categoria · moto (A)' },
    { id: 'addB', nome: 'Adição de categoria · carro (B)' }
  ];

  var TURNOS = [{ id: 'manha', nome: 'Manhã' }, { id: 'tarde', nome: 'Tarde' }, { id: 'noite', nome: 'Noite' }, { id: 'qualquer', nome: 'Tanto faz' }];

  // "Sua CNH em 6 etapas" — arte do @copiauto. Os textos curtos explicam a etapa (processo geral) e
  // só citam a Copiauto quando a frase é das legendas.
  var ETAPAS = [
    { id: 1, nome: 'Matrícula', txt: 'Você escolhe a categoria e o carro (manual ou automático). Início imediato.' },
    { id: 2, nome: 'Documentação', txt: 'Seus documentos e o cadastro no Detran. A lista certinha a gente manda no WhatsApp.' },
    { id: 3, nome: 'Exames médico e psicológico', txt: 'Ainda não tirou o seu laudo? Na Autoescola Copiauto você tira o seu laudo.' },
    { id: 4, nome: 'Curso teórico', txt: 'Legislação, sinalização e direção defensiva. Dá pra treinar no simulado do site.' },
    { id: 5, nome: 'Aulas práticas', txt: 'Mínimo de 2 aulas práticas (cat. A e B), em horários flexíveis, adaptadas à sua rotina.' },
    { id: 6, nome: 'Prova prática', txt: 'Veículo para o exame com acompanhamento do instrutor(a). Pode ser no automático.' }
  ];

  // Frota e instrutores DE EXEMPLO (a Copiauto confirma). O carro automático é real (legendas); os nomes não.
  var VEICULOS = [
    { id: 'auto', nome: 'Carro automático', cambio: 'automatico', cat: 'B' },
    { id: 'man1', nome: 'Carro manual 1 (exemplo)', cambio: 'manual', cat: 'B' },
    { id: 'man2', nome: 'Carro manual 2 (exemplo)', cambio: 'manual', cat: 'B' },
    { id: 'moto', nome: 'Moto (exemplo)', cambio: 'manual', cat: 'A' }
  ];
  var INSTRUTORES = [
    { id: 'i1', nome: 'Instrutor 1 (exemplo)' },
    { id: 'i2', nome: 'Instrutora 2 (exemplo)' },
    { id: 'i3', nome: 'Instrutor 3 (exemplo)' }
  ];

  var PFX = 'cp_', VERSAO = 'demo_v1';
  function le(k, pad) { try { var v = localStorage.getItem(PFX + k); return v ? JSON.parse(v) : pad; } catch (e) { return pad; } }
  function grava(k, v) { try { localStorage.setItem(PFX + k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  function hojeISO(desloc) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + (desloc || 0)); return d.toISOString().slice(0, 10); }
  function id() { return Math.random().toString(36).slice(2, 9); }

  // Dados fictícios: nomes de exemplo, telefones 7190000000x.
  function semear(forcar) {
    if (!forcar) { try { if (localStorage.getItem(PFX + VERSAO)) return; } catch (e) { return; } }
    grava('prematriculas', [
      { id: 'p1', nome: 'Fulana de Tal (exemplo)', tel: '71900000001', categoria: 'B', cambio: 'automatico', pcd: false, restricoes: '', turno: 'noite', status: 'nova', data: hojeISO(0), origem: 'site' },
      { id: 'p2', nome: 'Ciclano Teste (exemplo)', tel: '71900000002', categoria: 'addA', cambio: 'manual', pcd: false, restricoes: '', turno: 'manha', status: 'nova', data: hojeISO(-1), origem: 'site' },
      { id: 'p3', nome: 'Beltrana Exemplo (exemplo)', tel: '71900000003', categoria: 'B', cambio: 'automatico', pcd: true, restricoes: 'Usa cadeira de rodas (exemplo)', turno: 'tarde', status: 'contato', data: hojeISO(-2), origem: 'site' },
      { id: 'p4', nome: 'João Fictício (exemplo)', tel: '71900000004', categoria: 'AB', cambio: 'manual', pcd: false, restricoes: '', turno: 'qualquer', status: 'contato', data: hojeISO(-4), origem: 'WhatsApp' },
      { id: 'p5', nome: 'Ana Demonstração (exemplo)', tel: '71900000005', categoria: 'B', cambio: 'automatico', pcd: false, restricoes: '', turno: 'manha', status: 'matriculado', data: hojeISO(-9), origem: 'site' }
    ]);
    grava('alunos', [
      { id: 'demo', nome: 'Aluno Demonstração (fictício)', tel: '71900000010', categoria: 'B', cambio: 'automatico', pcd: false, etapa: 5, instrutor: 'i2', aulasFeitas: 1 },
      { id: 'a2', nome: 'Ana Demonstração (exemplo)', tel: '71900000005', categoria: 'B', cambio: 'automatico', pcd: false, etapa: 2, instrutor: 'i1', aulasFeitas: 0 },
      { id: 'a3', nome: 'Pedro Exemplo (exemplo)', tel: '71900000011', categoria: 'addA', cambio: 'manual', pcd: false, etapa: 5, instrutor: 'i3', aulasFeitas: 2 },
      { id: 'a4', nome: 'Carla Teste (exemplo)', tel: '71900000012', categoria: 'B', cambio: 'manual', pcd: false, etapa: 6, instrutor: 'i1', aulasFeitas: 3 },
      { id: 'a5', nome: 'Rita Fictícia (exemplo)', tel: '71900000013', categoria: 'B', cambio: 'automatico', pcd: true, etapa: 4, instrutor: 'i2', aulasFeitas: 0 }
    ]);
    grava('aulas', [
      { id: 'u1', alunoId: 'demo', data: hojeISO(1), hora: '08:00', instrutor: 'i2', veiculo: 'auto', status: 'marcada' },
      { id: 'u2', alunoId: 'demo', data: hojeISO(3), hora: '18:00', instrutor: 'i2', veiculo: 'auto', status: 'marcada' },
      { id: 'u0', alunoId: 'demo', data: hojeISO(-3), hora: '08:00', instrutor: 'i2', veiculo: 'auto', status: 'feita' },
      { id: 'u3', alunoId: 'a3', data: hojeISO(0), hora: '10:00', instrutor: 'i3', veiculo: 'moto', status: 'marcada' },
      { id: 'u4', alunoId: 'a4', data: hojeISO(0), hora: '14:00', instrutor: 'i1', veiculo: 'man1', status: 'marcada' },
      { id: 'u5', alunoId: 'a4', data: hojeISO(2), hora: '07:00', instrutor: 'i1', veiculo: 'man1', status: 'marcada' },
      { id: 'u6', alunoId: 'a3', data: hojeISO(1), hora: '15:00', instrutor: 'i3', veiculo: 'moto', status: 'marcada' }
    ]);
    grava('avisos', [
      { id: 'v1', data: hojeISO(-1), texto: 'Canal oficial: a Copiauto não faz cobrança por boleto nem pede pagamento por link. Dúvida? Fale com a equipe.' },
      { id: 'v2', data: hojeISO(0), texto: 'Aviso de exemplo: leve documento com foto em todas as aulas práticas.' }
    ]);
    try { localStorage.setItem(PFX + VERSAO, '1'); } catch (e) { /* */ }
  }
  semear(false);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function achar(lista, i) { for (var k = 0; k < lista.length; k++) if (lista[k].id === i) return lista[k]; return null; }
  var DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  function dataCurta(iso) { var d = new Date(iso + 'T12:00:00'); return DIAS[d.getDay()] + ', ' + ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2); }

  window.CP = {
    CASA: CASA, CATEGORIAS: CATEGORIAS, TURNOS: TURNOS, ETAPAS: ETAPAS, VEICULOS: VEICULOS, INSTRUTORES: INSTRUTORES,
    esc: esc, id: id, hojeISO: hojeISO, dataCurta: dataCurta,
    categoria: function (i) { var c = achar(CATEGORIAS, i); return c ? c.nome : i; },
    turno: function (i) { var t = achar(TURNOS, i); return t ? t.nome : i; },
    veiculo: function (i) { return achar(VEICULOS, i) || { nome: i, cambio: '' }; },
    instrutor: function (i) { var t = achar(INSTRUTORES, i); return t ? t.nome : '—'; },
    cambioNome: function (c) { return c === 'automatico' ? 'Automático' : 'Manual'; },
    wa: function (msg, tel) { return 'https://wa.me/' + (tel || CASA.whatsapp) + '?text=' + encodeURIComponent(msg); },
    // escolha manual/automático, lembrada entre páginas
    cambio: function (v) { if (v) grava('cambio', v); return le('cambio', 'automatico'); },
    prematriculas: function (v) { if (v) grava('prematriculas', v); return le('prematriculas', []); },
    alunos: function (v) { if (v) grava('alunos', v); return le('alunos', []); },
    aulas: function (v) { if (v) grava('aulas', v); return le('aulas', []); },
    avisos: function (v) { if (v) grava('avisos', v); return le('avisos', []); },
    simulado: function (v) { if (v) grava('simulado', v); return le('simulado', null); },
    resetar: function () { semear(true); },
    // logo oval (branco, letras vermelhas), desenhado em SVG
    logo: function (cls) {
      return '<svg class="' + (cls || 'logo') + '" viewBox="0 0 220 96" role="img" aria-label="Autoescola Copiauto">' +
        '<ellipse cx="110" cy="48" rx="106" ry="44" fill="#fff" stroke="#C8102E" stroke-width="5"/>' +
        '<ellipse cx="110" cy="48" rx="97" ry="36" fill="none" stroke="#C8102E" stroke-width="1.5"/>' +
        '<text x="110" y="38" text-anchor="middle" font-family="Overpass,Arial,sans-serif" font-weight="800" font-size="15" letter-spacing="1.5" fill="#C8102E">AUTOESCOLA</text>' +
        '<text x="110" y="68" text-anchor="middle" font-family="Overpass,Arial,sans-serif" font-weight="900" font-style="italic" font-size="31" fill="#C8102E">COPIAUTO</text></svg>';
    }
  };
})();
