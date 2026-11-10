// Modelo de valuation da WEG. Mesmas fórmulas da Planilha_Valuation_WEG.xlsx.
// Valores em R$ milhões.
(function (root) {
  const BASE = {
    // 2025 real (CVM, DFP consolidada)
    receita2025: 40804.11,
    giro2025: 7837.018 + 9911.053 - 2789.346, // receber + estoques - fornecedores
    plControladora2025: 18553.364 - 1136.179,
    plMinoritarios2025: 1136.179,
    dividaBruta: 3549.314 + 1041.508,
    caixa: 6296.498 + 983.367,
    acoes: 4197.317998, // milhões
    // premissas
    crescimento: [0.10, 0.09, 0.08, 0.07, 0.06],
    margemBruta: 0.335,
    margemEbit: 0.195,
    ir: 0.18,
    resFinanceiro: 0.004,
    minoritarios: 0.06,
    depreciacao: 0.025,
    capex2026: 3600,
    capexPct: [null, 0.06, 0.05, 0.045, 0.04],
    giroPct: 0.35,
    payout: 0.55,
    g: 0.05,
    // taxa de desconto
    jurosReal: 0.0693,
    inflacao: 0.04,
    beta: 0.75,
    premio: 0.05,
    selic: 0.1375,
    irDivida: 0.34,
    cotacao: 51.11,
  };

  function wacc(p) {
    const rf = (1 + p.jurosReal) * (1 + p.inflacao) - 1;
    const ke = rf + p.beta * p.premio;
    const kd = p.selic * (1 - p.irDivida);
    const E = p.cotacao * p.acoes;
    const D = p.dividaBruta;
    const wE = E / (E + D), wD = D / (E + D);
    return { rf, ke, kd, E, D, wE, wD, wacc: wE * ke + wD * kd };
  }

  function irr(fluxos) {
    const npv = (r) => fluxos.reduce((s, f, t) => s + f / Math.pow(1 + r, t), 0);
    let lo = -0.99, hi = 1.0;
    if (npv(lo) * npv(hi) > 0) return null;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid;
    }
    return (lo + hi) / 2;
  }

  function projetar(p, taxa) {
    const anos = [2026, 2027, 2028, 2029, 2030];
    let receita = p.receita2025, giroAnt = p.giro2025, pl = p.plControladora2025;
    const linhas = anos.map((ano, i) => {
      receita = receita * (1 + p.crescimento[i]);
      const cpv = receita * (1 - p.margemBruta);
      const ebit = receita * p.margemEbit;
      const lair = ebit + receita * p.resFinanceiro;
      const lucroCons = lair * (1 - p.ir);
      const lucro = lucroCons * (1 - p.minoritarios);
      const dep = receita * p.depreciacao;
      const capex = i === 0 ? p.capex2026 : receita * p.capexPct[i];
      const giro = receita * p.giroPct;
      const dGiro = giro - giroAnt;
      giroAnt = giro;
      const nopat = ebit * (1 - p.ir);
      const fcff = nopat + dep - capex - dGiro;
      pl = pl + lucro * (1 - p.payout);
      return { ano, receita, cpv, ebit, lucro, dep, capex, dGiro, nopat, fcff, pl,
        roe: lucro / pl, margemLiq: lucro / receita, roi: (receita - cpv) / cpv };
    });
    return linhas;
  }

  function avaliar(p, taxaForcada, gForcado) {
    const w = wacc(p);
    const taxa = taxaForcada != null ? taxaForcada : w.wacc;
    const g = gForcado != null ? gForcado : p.g;
    const linhas = projetar(p);
    const fcff = linhas.map((l) => l.fcff);
    const vt = fcff[4] * (1 + g) / (taxa - g);
    const caixaLiq = p.caixa - p.dividaBruta;
    const ev = w.E - caixaLiq; // T0
    const fluxos = [-ev, fcff[0], fcff[1], fcff[2], fcff[3], fcff[4] + vt];
    const vpFluxos = fluxos.slice(1).reduce((s, f, i) => s + f / Math.pow(1 + taxa, i + 1), 0);
    const vpl = vpFluxos - ev;
    const valorAcoes = vpFluxos + caixaLiq - p.plMinoritarios2025;
    const precoJusto = valorAcoes / p.acoes;
    const potencial = precoJusto / p.cotacao - 1;
    const recomendacao = potencial > 0.15 ? "COMPRA" : potencial < -0.15 ? "VENDA" : "MANUTENÇÃO";
    // payback simples depois de 2030 (fluxo crescendo g ao ano)
    const soma5 = fcff.reduce((a, b) => a + b, 0);
    let paybackSimples = null;
    if (soma5 >= ev) paybackSimples = "até 2030";
    else {
      const falta = ev - soma5, base = fcff[4] * (1 + g);
      paybackSimples = 5 + Math.log(1 + falta * g / base) / Math.log(1 + g);
    }
    return { ...w, taxa, g, linhas, fcff, vt, caixaLiq, ev, fluxos, vpFluxos, vpl, valorAcoes,
      precoJusto, potencial, recomendacao, tir: irr(fluxos), soma5, paybackSimples,
      pagaDescontado: vpFluxos >= ev };
  }

  root.Modelo = { BASE, wacc, projetar, avaliar, irr };
})(typeof window !== "undefined" ? window : globalThis);
