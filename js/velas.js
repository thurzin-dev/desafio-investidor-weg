// Gráfico de velas animado no fundo da capa.
(function () {
  "use strict";
  const canvas = document.getElementById("velas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const LARG = 16; // largura de cada vela em px
  let W = 0, H = 0, dpr = 1, velas = [], desloc = 0, rodando = true, ultimo = 0;

  // gerador com semente, para o desenho ficar igual toda vez
  let semente = 7;
  const rnd = () => { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };

  function novaVela(anterior) {
    const abre = anterior ? anterior.fecha : 50;
    const tendencia = Math.sin(velas.length / 23) * 0.35;
    const fecha = Math.max(8, abre + (rnd() - 0.5 + tendencia * 0.4) * 5.5);
    const max = Math.max(abre, fecha) + rnd() * 2.6;
    const min = Math.min(abre, fecha) - rnd() * 2.6;
    return { abre, fecha, max, min };
  }

  function preencher() {
    const precisa = Math.ceil(W / LARG) + 4;
    while (velas.length < precisa) velas.push(novaVela(velas[velas.length - 1]));
  }

  function tamanho() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    preencher();
    desenhar();
  }

  function desenhar() {
    ctx.clearRect(0, 0, W, H);
    const vis = velas;
    let lo = Infinity, hi = -Infinity;
    vis.forEach((v) => { lo = Math.min(lo, v.min); hi = Math.max(hi, v.max); });
    const pad = (hi - lo) * 0.25 + 1;
    lo -= pad; hi += pad;
    const y = (p) => H * 0.12 + (1 - (p - lo) / (hi - lo)) * H * 0.8;

    // grade
    ctx.strokeStyle = "rgba(150,230,180,0.06)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 8; i++) { const yy = (H / 8) * i; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }

    // velas
    vis.forEach((v, i) => {
      const x = i * LARG - desloc;
      const sobe = v.fecha >= v.abre;
      const cor = sobe ? "rgba(43,214,123,0.85)" : "rgba(255,92,92,0.8)";
      ctx.strokeStyle = cor; ctx.fillStyle = cor;
      ctx.beginPath(); ctx.moveTo(x + LARG / 2, y(v.max)); ctx.lineTo(x + LARG / 2, y(v.min)); ctx.stroke();
      const top = y(Math.max(v.abre, v.fecha)), alt = Math.max(2, Math.abs(y(v.abre) - y(v.fecha)));
      ctx.fillRect(x + 3, top, LARG - 6, alt);
    });

    // média móvel dourada
    ctx.strokeStyle = "rgba(245,197,66,0.9)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(245,197,66,0.6)"; ctx.shadowBlur = 10;
    ctx.beginPath();
    vis.forEach((v, i) => {
      const ini = Math.max(0, i - 8);
      const media = vis.slice(ini, i + 1).reduce((a, b) => a + b.fecha, 0) / (i + 1 - ini);
      const x = i * LARG - desloc + LARG / 2;
      if (i === 0) ctx.moveTo(x, y(media)); else ctx.lineTo(x, y(media));
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function quadro(t) {
    if (rodando) {
      const dt = ultimo ? Math.min(50, t - ultimo) : 16;
      desloc += dt * 0.012;
      if (desloc >= LARG) {
        desloc -= LARG;
        velas.shift();
        velas.push(novaVela(velas[velas.length - 1]));
      }
      desenhar();
    }
    ultimo = t;
    requestAnimationFrame(quadro);
  }

  if (window.ResizeObserver) new ResizeObserver(tamanho).observe(canvas);
  else window.addEventListener("resize", tamanho);
  const parado = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  rodando = !parado;
  if (window.IntersectionObserver) {
    new IntersectionObserver((e) => { rodando = e[0].isIntersecting && !parado; }).observe(canvas);
  }
  tamanho();
  requestAnimationFrame(quadro);
})();
