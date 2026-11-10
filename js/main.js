/* global GRUPO, HISTORICO, AREAS, POR_QUE, CENARIO, PREMISSAS, RISCOS, FONTES, NOTAS, RECOMENDACAO, Modelo */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  const CORES = { verde: "#2BD67B", ouro: "#F5C542", vermelho: "#FF5C5C", azul: "#F5C542", amarelo: "#F5C542" };
  const $ = (id) => document.getElementById(id);
  const MENOS = "−";

  // ---------- formatação ----------
  function fmt(v, d = 0) {
    const f = Math.pow(10, d);
    const r = Math.round(Math.abs(v) * f + 1e-7) / f;
    const s = r.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
    return (v < 0 && r !== 0 ? MENOS : "") + s;
  }
  const pct = (v, d = 1) => fmt(v * 100, d) + "%";
  const reais = (v) => "R$ " + fmt(v, 2);
  const mi = (v) => (v < 0 ? MENOS + " " : "") + "R$ " + fmt(Math.abs(v), 0) + " mi";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // célula: texto, [texto, cor] para status, ou {t, cls}
  function celula(c, tag = "td") {
    if (Array.isArray(c)) return `<${tag} class="st ${c[1]}">${esc(c[0])}</${tag}>`;
    if (c && typeof c === "object") return `<${tag} class="${c.cls || ""}">${esc(c.t)}</${tag}>`;
    return `<${tag}>${esc(c)}</${tag}>`;
  }
  function tabela(id, cab, linhas, opts = {}) {
    const head = cab ? "<thead><tr>" + cab.map((c) => celula(c, "th")).join("") + "</tr></thead>" : "";
    const body = "<tbody>" + linhas.map((l) => "<tr>" + l.map((c, j) => {
      if (j === 0 && opts.rotulo !== false && typeof c === "string") return celula({ t: c, cls: "rot" });
      if (opts.num && opts.num.includes(j) && typeof c === "string") return celula({ t: c, cls: "num" });
      return celula(c);
    }).join("") + "</tr>").join("") + "</tbody>";
    $(id).innerHTML = head + body;
  }

  // ---------- dica ----------
  const dica = $("dica");
  function mostrarDica(ev, texto) {
    dica.textContent = texto;
    dica.hidden = false;
    dica.style.left = Math.min(ev.clientX + 14, window.innerWidth - 290) + "px";
    dica.style.top = ev.clientY + 14 + "px";
  }
  const esconderDica = () => { dica.hidden = true; };

  // ---------- gráfico de barras SVG ----------
  let idGrad = 0;
  function grafico(alvo, cfg) {
    const W = 600, H = cfg.altura || 320;
    const topo = 34, base = cfg.series.length > 1 ? 66 : 38;
    const n = cfg.rotulos.length, k = cfg.series.length;
    const max = Math.max(...cfg.series.flatMap((s) => s.valores)) * 1.12;
    const slot = W / n, larg = Math.min(120, (slot * 0.62) / k);
    const util = H - topo - base;
    let defs = "<defs>";
    let corpo = "";
    for (let i = 1; i <= 4; i++) {
      const y = topo + (util / 4) * (i - 1);
      corpo += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(150,230,180,0.08)"/>`;
    }
    corpo += `<line x1="0" y1="${H - base}" x2="${W}" y2="${H - base}" stroke="rgba(150,230,180,0.3)"/>`;
    cfg.rotulos.forEach((rot, i) => {
      const x0 = slot * i + (slot - larg * k) / 2;
      cfg.series.forEach((s, si) => {
        const v = s.valores[i];
        const h = Math.max(1, (util * v) / max);
        const x = x0 + si * larg, y = H - base - h;
        const cor = CORES[(s.cores && s.cores[i]) || s.cor];
        const gid = "g" + idGrad++;
        defs += `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cor}"/><stop offset="1" stop-color="${cor}" stop-opacity="0.35"/></linearGradient>`;
        const sel = cfg.selecionado === i ? " selecionada" : "";
        corpo += `<rect class="barra-g${cfg.aoClicar ? " clicavel" : ""}${sel}" data-i="${i}" data-s="${si}" x="${x}" y="${y}" width="${larg - 5}" height="${h}" rx="4" fill="url(#${gid})"/>`;
        corpo += `<text x="${x + (larg - 5) / 2}" y="${y - 9}" text-anchor="middle" font-size="${cfg.tamValor || 15}" font-weight="700">${esc(cfg.formato(v))}</text>`;
      });
      corpo += `<text class="eixo" x="${slot * i + slot / 2}" y="${H - base + 26}" text-anchor="middle" font-size="${cfg.tamRotulo || 16}">${esc(rot)}</text>`;
    });
    if (k > 1) {
      const larguras = cfg.series.map((s) => 34 + s.nome.length * 8.5);
      let lx = W / 2 - larguras.reduce((a, b) => a + b, 0) / 2;
      cfg.series.forEach((s, si) => {
        corpo += `<rect x="${lx}" y="${H - 22}" width="14" height="14" rx="3" fill="${CORES[s.cor]}"/>`;
        corpo += `<text class="eixo" x="${lx + 20}" y="${H - 10}" font-size="14">${esc(s.nome)}</text>`;
        lx += larguras[si];
      });
    }
    alvo.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(cfg.titulo || "")}">${defs}</defs>${corpo}</svg>`;
    alvo.querySelectorAll(".barra-g").forEach((r) => {
      const i = +r.dataset.i, s = cfg.series[+r.dataset.s];
      r.addEventListener("mousemove", (ev) => mostrarDica(ev, `${s.nome} ${cfg.rotulos[i]}: ${cfg.formato(s.valores[i])}`));
      r.addEventListener("mouseleave", esconderDica);
      if (cfg.aoClicar) r.addEventListener("click", () => cfg.aoClicar(i));
    });
  }

  // =====================================================================
  const base = Modelo.avaliar(Modelo.BASE);
  const B = Modelo.BASE;

  // ---------- faixa de cotações ----------
  const fita = [
    ["WEGE3", reais(B.cotacao), ""],
    ["PREÇO JUSTO", reais(base.precoJusto), "baixa"],
    ["POTENCIAL", pct(base.potencial, 0), "baixa"],
    ["SELIC", "13,75%", ""],
    ["WACC", pct(base.wacc, 2), ""],
    ["TIR", pct(base.tir), "baixa"],
    ["VPL", mi(base.vpl), "baixa"],
    ["RECEITA 2025", "R$ 40,8 bi", "alta"],
    ["LUCRO 2025", "R$ 6,4 bi", "alta"],
    ["ROE 2025", "36,6%", "alta"],
    ["MARGEM EBIT", "19,6%", "alta"],
    ["IPCA+ 2035", "6,93%", ""],
    ["CAPEX 2026", "R$ 3,6 bi", ""],
  ];
  const itens = fita.map(([n, v, c]) => `<span class="fita-item">${esc(n)}<b class="${c}">${esc(v)}</b></span>`).join("");
  $("fita").innerHTML = itens + itens;

  // ---------- capa ----------
  $("fGrupo").textContent = GRUPO.nomes;
  $("fDisciplina").textContent = GRUPO.disciplina;
  $("fData").textContent = GRUPO.data;

  // ---------- empresa ----------
  const ICONES = [
    '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="11" width="22" height="18" rx="3"/><path d="M27 20h9M9 15v10M14 15v10M19 15v10M10 29v4M22 29v4"/></svg>',
    '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="20" cy="20" r="6"/><path d="M20 5v5M20 30v5M5 20h5M30 20h5M9.4 9.4l3.5 3.5M27.1 27.1l3.5 3.5M9.4 30.6l3.5-3.5M27.1 12.9l3.5-3.5"/></svg>',
    '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M23 4L9 23h10l-3 13 15-20H21z"/></svg>',
    '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8h20v8H8zM28 12h4v8H18v6"/><rect x="15" y="26" width="6" height="10" rx="1"/></svg>',
  ];
  $("areas").innerHTML = AREAS.map((a, i) => `<div class="area">${ICONES[i]}<div><b>${esc(a[0])}</b><span>${esc(a[1])}</span></div></div>`).join("");
  $("porQue").innerHTML = POR_QUE.map(([t, s]) => `<li><span>${esc(t)}</span><span class="chip ${s[1]}">${esc(s[0])}</span></li>`).join("");

  // ---------- histórico ----------
  const abas = $("abasHist");
  abas.innerHTML = HISTORICO.botoes.map((b, i) =>
    `<button type="button" class="aba" role="tab" data-i="${i}" aria-selected="${i === 0}">${esc(b.rotulo)}</button>`).join("");
  function desenharHist(i) {
    const b = HISTORICO.botoes[i];
    grafico($("gHist"), {
      titulo: b.rotulo,
      rotulos: HISTORICO.anos,
      series: b.series.map((id) => ({ nome: HISTORICO.series[id].nome, cor: HISTORICO.series[id].cor, valores: HISTORICO.series[id].valores })),
      formato: (v) => fmt(v, 0),
    });
    abas.querySelectorAll(".aba").forEach((a) => a.setAttribute("aria-selected", String(+a.dataset.i === i)));
  }
  abas.addEventListener("click", (e) => { const a = e.target.closest(".aba"); if (a) desenharHist(+a.dataset.i); });
  desenharHist(0);
  tabela("tMargens", ["Indicador", { t: "2023", cls: "num" }, { t: "2024", cls: "num" }, { t: "2025", cls: "num" }, { t: "Status", cls: "num" }],
    HISTORICO.margens, { rotulo: false, num: [1, 2, 3] });

  // ---------- cenário ----------
  $("noticias").innerHTML = CENARIO.map((c, i) => {
    const chip = `<span class="chip ${c[3][1]}">${esc(c[3][0])}</span>`;
    if (i === 0) {
      return `<article class="noticia"><div class="rotulo mono">COPOM ${chip}</div>` +
        `<p class="numerao ouro mono">13,75%</p><h3>Selic ao ano, mantida em 04/11/2026</h3>` +
        `<p class="efeito">${esc(c[2])}</p></article>`;
    }
    return `<article class="noticia"><div class="rotulo mono">${esc(c[0].toUpperCase())} ${chip}</div>` +
      `<h3>${esc(c[1])}</h3><p class="efeito">${esc(c[2])}</p></article>`;
  }).join("");

  // ---------- premissas ----------
  tabela("tPremissas", ["Premissa", "Valor", "Por quê", { t: "Base", cls: "num" }], PREMISSAS);

  // ---------- WACC passo a passo ----------
  const passos = [
    ["1. Juro livre de risco (Rf)", "(1 + 6,93%) × (1 + 4%) " + MENOS + " 1", pct(base.rf, 2)],
    ["2. Custo do acionista (Ke)", pct(base.rf, 2) + " + 0,75 × 5%", pct(base.ke, 2)],
    ["3. Custo da dívida (Kd)", "13,75% × (1 " + MENOS + " 34%)", pct(base.kd, 2)],
    ["4. Pesos", "ações R$ " + fmt(base.E, 0) + " mi e dívida R$ " + fmt(base.D, 0) + " mi", pct(base.wE) + " e " + pct(base.wD)],
    ["5. WACC", pct(base.wE) + " × " + pct(base.ke, 2) + " + " + pct(base.wD) + " × " + pct(base.kd, 2), pct(base.wacc, 2)],
  ];
  $("passos").innerHTML = passos.map((p, i) =>
    `<li class="passo oculto${i === passos.length - 1 ? " final" : ""}"><span class="passo-nome">${esc(p[0])}</span>` +
    `<span class="passo-conta">${esc(p[1])}</span><span class="passo-res">${esc(p[2])}</span></li>`).join("");
  let passoAtual = 0;
  function revelar(ate) {
    $("passos").querySelectorAll(".passo").forEach((li, i) => {
      li.classList.toggle("novo", i === ate - 1);
      if (i < ate) li.classList.remove("oculto");
    });
    passoAtual = ate;
    if (ate >= passos.length) {
      $("waccFinal").textContent = pct(base.wacc, 2);
      $("btnPasso").disabled = true;
    }
  }
  $("btnPasso").addEventListener("click", () => revelar(passoAtual + 1));
  $("btnTodos").addEventListener("click", () => revelar(passos.length));

  // ---------- FCFF ----------
  const anos = base.linhas.map((l) => String(l.ano));
  let anoSel = 0;
  function contaDoAno(i) {
    const l = base.linhas[i];
    tabela("tConta", [`Conta de ${l.ano}`, { t: "R$ mi", cls: "num" }], [
      ["EBIT × (1 " + MENOS + " 18%)", fmt(l.nopat, 0)],
      ["+ depreciação", fmt(l.dep, 0)],
      [MENOS + " CAPEX", fmt(-l.capex, 0)],
      [MENOS + " aumento do capital de giro", fmt(-l.dGiro, 0)],
      [{ t: "= FCFF", cls: "rot" }, [fmt(l.fcff, 0), "ouro"]],
    ], { rotulo: false, num: [1] });
  }
  function desenharFcff() {
    grafico($("gFcff"), {
      titulo: "FCFF projetado",
      rotulos: anos,
      series: [{ nome: "FCFF", cor: "verde", valores: base.fcff }],
      formato: (v) => fmt(v, 0),
      altura: 280,
      selecionado: anoSel,
      aoClicar: (i) => { anoSel = i; contaDoAno(i); desenharFcff(); },
    });
  }
  desenharFcff();
  contaDoAno(0);
  tabela("tProjecao", ["R$ milhões", ...anos.map((a) => ({ t: a, cls: "num proj" }))], [
    ["Receita", ...base.linhas.map((l) => fmt(l.receita, 0))],
    ["EBIT", ...base.linhas.map((l) => fmt(l.ebit, 0))],
    ["Lucro líquido", ...base.linhas.map((l) => fmt(l.lucro, 0))],
  ], { num: [1, 2, 3, 4, 5] });

  // ---------- indicadores ----------
  const kpis = [
    ["VPL", mi(base.vpl), "Aprova se for maior que zero", ["Negativo", "vermelho"]],
    ["TIR", pct(base.tir), "Aprova se for maior que a TMA de " + pct(base.wacc), ["Abaixo da TMA", "vermelho"]],
    ["Payback simples", "cerca de " + fmt(base.paybackSimples, 0) + " anos", "Mais de 5 anos, se o fluxo crescer 5% depois de 2030", ["Não se paga em 5 anos", "vermelho"]],
    ["Payback descontado", "Não se paga", "Nem trazendo tudo a valor presente", ["Não se paga", "vermelho"]],
  ];
  $("kpis").innerHTML = kpis.map(([n, v, r, s]) =>
    `<div class="kpi"><p class="rotulo mono">${esc(n.toUpperCase())}</p><p class="valor">${esc(v)}</p><p class="regra">${esc(r)}</p><span class="chip ${s[1]}">${esc(s[0])}</span></div>`).join("");
  const barrasPb = [
    ["Preço da empresa hoje (T0)", base.ev, "ouro"],
    ["Valor presente de tudo, com valor terminal", base.vpFluxos, "verde"],
    ["Soma dos fluxos de 2026 a 2030", base.soma5, "verde"],
  ];
  $("barrasPayback").innerHTML = barrasPb.map(([rot, v, cor]) => {
    const p = (v / base.ev) * 100;
    return `<div class="bh-linha"><span>${esc(rot)}</span><div class="bh-trilho">` +
      `<div class="bh-barra" data-w="${p.toFixed(1)}" style="background:${CORES[cor]}"></div></div>` +
      `<span class="bh-valor">${esc(mi(v))} <small>(${fmt(p, 0)}%)</small></span></div>`;
  }).join("");

  // ---------- rentabilidade ----------
  const rec = HISTORICO.series.receita.valores, lb = [10801, 12814, 13682];
  const roiHist = rec.map((r, i) => pct(lb[i] / (r - lb[i])));
  tabela("tRent", ["Indicador", ...HISTORICO.anos.map((a) => ({ t: a, cls: "num" })), ...anos.map((a) => ({ t: a + "P", cls: "num proj" })), { t: "Status", cls: "num" }], [
    ["ROE", "33,1%", "27,2%", "36,6%", ...base.linhas.map((l) => pct(l.roe)), ["Acima de 25%", "verde"]],
    ["ROI", ...roiHist, ...base.linhas.map((l) => pct(l.roi)), ["É um markup", "amarelo"]],
    ["Margem líquida", "17,6%", "15,9%", "15,6%", ...base.linhas.map((l) => pct(l.margemLiq)), ["Estável", "verde"]],
  ], { num: [1, 2, 3, 4, 5, 6, 7, 8] });

  // ---------- preço justo ----------
  $("potBase").textContent = pct(base.potencial, 0);
  const gs = [0.03, 0.04, 0.05, 0.06, 0.07], ws = [0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16];
  $("tSens").innerHTML = "<thead><tr><th>WACC \\ g</th>" + gs.map((g) => `<th>${pct(g, 0)}</th>`).join("") + "</tr></thead><tbody>" +
    ws.map((w) => `<tr><th>${pct(w, 0)}</th>` + gs.map((g) => {
      const v = Modelo.avaliar(B, w, g).precoJusto;
      return `<td class="st ${v < 20 ? "vermelho" : "amarelo"}" data-w="${w}" data-g="${g}" data-v="${v}">${fmt(v, 2)}</td>`;
    }).join("") + "</tr>").join("") + "</tbody>";
  $("tSens").querySelectorAll("td").forEach((td) => {
    const txt = () => `WACC de ${pct(+td.dataset.w, 0)} e crescimento de ${pct(+td.dataset.g, 0)} ao ano depois de 2030: preço justo de ${reais(+td.dataset.v)}, ${pct(+td.dataset.v / B.cotacao - 1, 0)} da cotação.`;
    td.addEventListener("mousemove", (ev) => mostrarDica(ev, txt()));
    td.addEventListener("mouseleave", esconderDica);
    td.addEventListener("click", () => { $("sensDica").textContent = txt(); });
  });

  // contagem dos números do placar
  function contar(elm) {
    const alvo = parseFloat(elm.dataset.conta);
    const t0 = performance.now(), dur = 1200;
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      elm.textContent = reais(alvo * e);
      if (p < 1) requestAnimationFrame(passo); else elm.textContent = reais(alvo);
    };
    requestAnimationFrame(passo);
  }

  // =====================================================================
  // simulador
  // =====================================================================
  const CTRL = [
    { id: "jurosReal", rot: "Juro real do Tesouro IPCA+", min: 3, max: 9, passo: 0.01, tipo: "pct", ajuda: "Entra no custo do acionista. É o que mais mexe no WACC." },
    { id: "selic", rot: "Selic (custo da dívida)", min: 6, max: 16, passo: 0.25, tipo: "pct", ajuda: "Quase não muda nada: a dívida é só 2% do total." },
    { id: "beta", rot: "Beta da ação", min: 0.4, max: 1.4, passo: 0.05, tipo: "num" },
    { id: "cresc", rot: "Crescimento da receita em 2026", min: 0, max: 25, passo: 0.5, tipo: "pct", ajuda: "Depois cai 1 ponto por ano até 2030." },
    { id: "margemEbit", rot: "Margem EBIT", min: 12, max: 26, passo: 0.5, tipo: "pct" },
    { id: "g", rot: "Crescimento depois de 2030 (g)", min: 2, max: 9, passo: 0.25, tipo: "pct" },
    { id: "cotacao", rot: "Cotação da ação", min: 20, max: 80, passo: 0.01, tipo: "reais" },
  ];
  const valorBase = {
    jurosReal: B.jurosReal * 100, selic: B.selic * 100, beta: B.beta, cresc: B.crescimento[0] * 100,
    margemEbit: B.margemEbit * 100, g: B.g * 100, cotacao: B.cotacao,
  };
  $("controles").innerHTML = '<p class="painel-titulo mono">PREMISSAS</p>' + CTRL.map((c) =>
    `<div class="ctrl"><label for="r_${c.id}"><span>${esc(c.rot)}</span><b id="v_${c.id}"></b></label>` +
    `<input type="range" id="r_${c.id}" min="${c.min}" max="${c.max}" step="${c.passo}" value="${valorBase[c.id]}">` +
    (c.ajuda ? `<div class="ajuda">${esc(c.ajuda)}</div>` : "") + "</div>").join("");

  const limpar = (s) => s.replace(/(,\d*?)0+$/, "$1").replace(/,$/, "");
  function lerControles() {
    const v = {};
    CTRL.forEach((c) => {
      v[c.id] = parseFloat($("r_" + c.id).value);
      $("v_" + c.id).textContent = c.tipo === "reais" ? reais(v[c.id]) : c.tipo === "pct" ? limpar(fmt(v[c.id], 2)) + "%" : fmt(v[c.id], 2);
    });
    return {
      ...B,
      jurosReal: v.jurosReal / 100, selic: v.selic / 100, beta: v.beta,
      crescimento: [0, 1, 2, 3, 4].map((i) => v.cresc / 100 - i * 0.01),
      margemEbit: v.margemEbit / 100, g: v.g / 100, cotacao: v.cotacao,
    };
  }
  function resolver(f, lo, hi, alvo, crescente) {
    for (let i = 0; i < 80; i++) {
      const m = (lo + hi) / 2;
      if ((f(m) < alvo) === crescente) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
  }
  const corRec = { VENDA: "vermelho", "MANUTENÇÃO": "amarelo", COMPRA: "verde" };
  function simular() {
    const p = lerControles();
    const w = Modelo.wacc(p);
    if (w.wacc - p.g < 0.005) {
      $("tSim").innerHTML = '<tbody><tr><td class="st amarelo" style="white-space:normal">O crescimento depois de 2030 (g) precisa ficar abaixo do WACC (' + pct(w.wacc, 2) + "). Diminua o g ou aumente os juros.</td></tr></tbody>";
      $("pressupoe").innerHTML = "";
      return;
    }
    const r = Modelo.avaliar(p);
    tabela("tSim", ["Resultado", { t: "Grupo", cls: "num" }, { t: "Simulação", cls: "num" }], [
      ["WACC (TMA)", pct(base.wacc, 2), { t: pct(r.wacc, 2), cls: "num rot" }],
      ["Preço justo", reais(base.precoJusto), { t: reais(r.precoJusto), cls: "num rot" }],
      ["Cotação", reais(B.cotacao), { t: reais(p.cotacao), cls: "num" }],
      ["Potencial", pct(base.potencial, 0), { t: pct(r.potencial, 0), cls: "num rot" }],
      ["VPL", mi(base.vpl), { t: mi(r.vpl), cls: "num" }],
      ["TIR", pct(base.tir), { t: r.tir == null ? "não calcula" : pct(r.tir), cls: "num" }],
      ["O modelo diria", [base.recomendacao, corRec[base.recomendacao]], [r.recomendacao, corRec[r.recomendacao]]],
    ], { num: [1] });
    const gPreciso = resolver((g) => Modelo.avaliar(p, r.wacc, g).precoJusto, -0.05, r.wacc - 0.0005, p.cotacao, true);
    const wPreciso = resolver((t) => Modelo.avaliar(p, t, p.g).precoJusto, p.g + 0.0005, 0.6, p.cotacao, false);
    $("pressupoe").innerHTML =
      `<div><b>${pct(gPreciso)}</b>de crescimento ao ano, para sempre, depois de 2030 (com o WACC de ${pct(r.wacc, 2)})</div>` +
      `<div><b>${pct(wPreciso)}</b>de retorno exigido pelo investidor (com crescimento de ${limpar(fmt(p.g * 100, 2))}% depois de 2030)</div>`;
  }
  $("controles").addEventListener("input", simular);
  $("btnVoltar").addEventListener("click", () => {
    CTRL.forEach((c) => { $("r_" + c.id).value = valorBase[c.id]; });
    simular();
  });
  simular();

  // ---------- recomendação, riscos, fontes ----------
  const corSelo = { "MANUTENÇÃO": "amarelo", COMPRA: "verde" }[RECOMENDACAO.palavra];
  $("selo").textContent = RECOMENDACAO.palavra;
  if (corSelo) $("selo").classList.add(corSelo);
  $("tese").textContent = RECOMENDACAO.frase;
  $("motivos").innerHTML = RECOMENDACAO.motivos.map((m, i) => `<li><span>${i + 1}</span>${esc(m)}</li>`).join("");
  $("riscos-lista").innerHTML = RISCOS.map(([t, p, s]) =>
    `<div class="risco revela"><b>${esc(t)}</b><span class="chip ${s[1]}">${esc(s[0])}</span><p>${esc(p)}</p></div>`).join("");
  tabela("tFontes", ["Fonte", "O que usamos"], FONTES);

  // =====================================================================
  // navegação
  // =====================================================================
  const telas = Array.from(document.querySelectorAll(".tela"));
  let atual = -1;

  function entrar(t) {
    if (t.classList.contains("visivel")) return;
    t.classList.add("visivel");
    t.querySelectorAll(".bh-barra").forEach((b) => { b.style.width = b.dataset.w + "%"; });
    t.querySelectorAll("[data-conta]").forEach(contar);
  }
  const revelaveis = Array.from(document.querySelectorAll(".revela"));
  function atualizar() {
    const vh = window.innerHeight, meio = vh * 0.45;
    let i = telas.findIndex((t) => { const r = t.getBoundingClientRect(); return r.top <= meio && r.bottom > meio; });
    if (i < 0) i = Math.max(0, atual);
    if (vh + window.scrollY >= document.documentElement.scrollHeight - 4) i = telas.length - 1;
    telas.forEach((t) => { const r = t.getBoundingClientRect(); if (r.top < vh * 0.75 && r.bottom > vh * 0.2) entrar(t); });
    revelaveis.forEach((el) => { if (!el.classList.contains("dentro") && el.getBoundingClientRect().top < vh * 0.92) el.classList.add("dentro"); });
    if (i !== atual) {
      atual = i;
      const dois = (n) => String(n).padStart(2, "0");
      $("contador").textContent = `${dois(i + 1)} / ${dois(telas.length)}`;
      $("progresso").style.height = (i / (telas.length - 1)) * 100 + "%";
      $("progRotulo").textContent = telas[i].dataset.titulo;
      if (!$("notas").hidden) mostrarNotas();
    }
  }
  let agendado = false;
  window.addEventListener("scroll", () => {
    if (agendado) return;
    agendado = true;
    setTimeout(() => { agendado = false; atualizar(); }, 50);
  }, { passive: true });
  window.addEventListener("resize", atualizar);

  // guarda o destino enquanto a rolagem suave acontece, para várias setas seguidas funcionarem
  let destino = null, destinoAte = 0;
  const base0 = () => (destino != null && performance.now() < destinoAte ? destino : atual);
  function ir(i) {
    i = Math.max(0, Math.min(telas.length - 1, i));
    destino = i;
    destinoAte = performance.now() + 1000;
    window.scrollTo({ top: telas[i].offsetTop, behavior: "smooth" });
  }

  // ---------- notas ----------
  function mostrarNotas() {
    const t = telas[Math.max(0, atual)];
    $("notasTitulo").textContent = "NOTAS · " + t.dataset.titulo.toUpperCase();
    $("notasTexto").innerHTML = (NOTAS[t.id] || []).map((p) => `<p>${esc(p)}</p>`).join("");
  }
  function alternarNotas(forcar) {
    const abrir = forcar != null ? forcar : $("notas").hidden;
    $("notas").hidden = !abrir;
    $("btnNotas").setAttribute("aria-pressed", String(abrir));
    if (abrir) mostrarNotas();
  }
  $("btnNotas").addEventListener("click", () => alternarNotas());
  $("btnFecharNotas").addEventListener("click", () => alternarNotas(false));
  function telaCheia() {
    if (!document.fullscreenElement) { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); }
    else if (document.exitFullscreen) document.exitFullscreen();
  }
  $("btnTela").addEventListener("click", telaCheia);

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === "ArrowRight" || k === "PageDown") { e.preventDefault(); ir(base0() + 1); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); ir(base0() - 1); }
    else if (k === "Home") { e.preventDefault(); ir(0); }
    else if (k === "End") { e.preventDefault(); ir(telas.length - 1); }
    else if (k === "n" || k === "N") alternarNotas();
    else if (k === "f" || k === "F") telaCheia();
    else if (k === "Escape" && !$("notas").hidden) alternarNotas(false);
  });

  // link direto para uma tela (ex.: #preco)
  if (location.hash && $(location.hash.slice(1))) {
    const alvo = $(location.hash.slice(1));
    window.addEventListener("load", () => setTimeout(() => { window.scrollTo({ top: alvo.offsetTop, behavior: "instant" }); atualizar(); }, 30));
  }
  atualizar();
})();
