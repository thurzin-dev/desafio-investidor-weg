// Barras 3D da sensibilidade: preço justo para cada WACC e crescimento depois de 2030.
// O plano vermelho fica na altura da cotação (R$ 51,11).
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const caixa = document.getElementById("superficie");
const M = window.Modelo;
if (caixa && M) iniciar();

function iniciar() {
  const gs = [0.03, 0.04, 0.05, 0.06, 0.07];
  const ws = [0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16];
  const cot = M.BASE.cotacao;
  const ALT = 5; // altura do plano da cotação
  const PASSO = 1.15;
  const fmt = (v, d) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1.6, 0.1, 100);
  camera.position.set(10.5, 8.5, 11);

  const render = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  render.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  caixa.appendChild(render.domElement);

  const rotulos = new CSS2DRenderer();
  rotulos.domElement.style.position = "absolute";
  rotulos.domElement.style.top = "0";
  rotulos.domElement.style.pointerEvents = "none";
  caixa.style.position = "relative";
  caixa.appendChild(rotulos.domElement);

  const controle = new OrbitControls(camera, render.domElement);
  controle.enableZoom = false;
  controle.enablePan = false;
  controle.enableDamping = true;
  controle.autoRotate = true;
  controle.autoRotateSpeed = 0.6;
  controle.target.set(0, 2.2, 0);
  controle.minPolarAngle = 0.5;
  controle.maxPolarAngle = 1.35;

  cena.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sol = new THREE.DirectionalLight(0xfff2cc, 1.4);
  sol.position.set(6, 12, 8);
  cena.add(sol);
  const contra = new THREE.DirectionalLight(0x2bd67b, 0.5);
  contra.position.set(-8, 4, -6);
  cena.add(contra);

  // chão
  const grade = new THREE.GridHelper(10, 10, 0x2bd67b, 0x1b4a33);
  grade.material.opacity = 0.35;
  grade.material.transparent = true;
  cena.add(grade);

  // barras
  const barras = [];
  const geo = new THREE.BoxGeometry(0.78, 1, 0.78);
  geo.translate(0, 0.5, 0);
  ws.forEach((w, j) => {
    gs.forEach((g, i) => {
      const v = M.avaliar(M.BASE, w, g).precoJusto;
      const cor = v < 20 ? 0xff5c5c : 0xf5c542;
      const mat = new THREE.MeshStandardMaterial({ color: cor, emissive: cor, emissiveIntensity: 0.18, roughness: 0.45, metalness: 0.25 });
      const m = new THREE.Mesh(geo, mat);
      m.position.set((i - 2) * PASSO, 0, (j - 3) * PASSO);
      m.userData = { alvo: (v / cot) * ALT, v, w, g };
      m.scale.y = 0.001;
      cena.add(m);
      barras.push(m);
    });
  });

  // plano da cotação
  const plano = new THREE.Mesh(
    new THREE.PlaneGeometry(gs.length * PASSO + 1.2, ws.length * PASSO + 1.2),
    new THREE.MeshBasicMaterial({ color: 0xff5c5c, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
  );
  plano.rotation.x = -Math.PI / 2;
  plano.position.y = ALT;
  cena.add(plano);
  const borda = new THREE.LineSegments(new THREE.EdgesGeometry(plano.geometry), new THREE.LineBasicMaterial({ color: 0xff5c5c }));
  borda.rotation.x = -Math.PI / 2;
  borda.position.y = ALT;
  cena.add(borda);

  function rotulo(texto, x, y, z, cls) {
    const d = document.createElement("div");
    d.textContent = texto;
    d.style.cssText = "font:600 12px 'JetBrains Mono',monospace;white-space:nowrap;padding:2px 6px;border-radius:4px;" +
      (cls === "cot" ? "color:#FF8A8A;background:rgba(2,12,7,.85);border:1px solid #FF5C5C;" : "color:#9DBBA7;");
    const o = new CSS2DObject(d);
    o.position.set(x, y, z);
    cena.add(o);
  }
  rotulo("cotação R$ " + fmt(cot, 2), (gs.length / 2) * PASSO + 0.6, ALT + 0.35, -(ws.length / 2) * PASSO, "cot");
  gs.forEach((g, i) => rotulo("g " + fmt(g * 100, 0) + "%", (i - 2) * PASSO, -0.1, (ws.length / 2) * PASSO + 0.5));
  [0, 3, 6].forEach((j) => rotulo("WACC " + fmt(ws[j] * 100, 0) + "%", -(gs.length / 2) * PASSO - 1.1, -0.1, (j - 3) * PASSO));

  // tamanho
  function ajustar() {
    const w = caixa.clientWidth, h = caixa.clientHeight;
    if (!w || !h) return;
    render.setSize(w, h, false);
    render.domElement.style.width = "100%";
    render.domElement.style.height = "100%";
    rotulos.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  if (window.ResizeObserver) new ResizeObserver(ajustar).observe(caixa);
  else window.addEventListener("resize", ajustar);
  ajustar();

  // dica ao passar o mouse
  const raio = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const dica = document.getElementById("dica");
  render.domElement.addEventListener("pointermove", (ev) => {
    const r = render.domElement.getBoundingClientRect();
    mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
    raio.setFromCamera(mouse, camera);
    const hit = raio.intersectObjects(barras)[0];
    barras.forEach((b) => { b.material.emissiveIntensity = 0.18; });
    if (hit && dica) {
      const u = hit.object.userData;
      hit.object.material.emissiveIntensity = 0.6;
      dica.textContent = `WACC ${fmt(u.w * 100, 0)}% e g ${fmt(u.g * 100, 0)}%: R$ ${fmt(u.v, 2)}`;
      dica.hidden = false;
      dica.style.left = Math.min(ev.clientX + 14, window.innerWidth - 290) + "px";
      dica.style.top = ev.clientY + 14 + "px";
    } else if (dica) dica.hidden = true;
  });
  render.domElement.addEventListener("pointerleave", () => {
    if (dica) dica.hidden = true;
    barras.forEach((b) => { b.material.emissiveIntensity = 0.18; });
  });
  controle.addEventListener("start", () => { controle.autoRotate = false; });

  // só desenha quando aparece na tela
  let naTela = false;
  if (window.IntersectionObserver) new IntersectionObserver((e) => { naTela = e[0].isIntersecting; }).observe(caixa);
  else naTela = true;

  const secao = caixa.closest(".tela");
  function quadro() {
    requestAnimationFrame(quadro);
    if (!naTela) return;
    const crescer = secao.classList.contains("visivel");
    barras.forEach((b, k) => {
      const alvo = crescer ? b.userData.alvo : 0.001;
      b.scale.y += (alvo - b.scale.y) * Math.min(1, 0.05 + k * 0.0004);
    });
    controle.update();
    render.render(cena, camera);
    rotulos.render(cena, camera);
  }
  quadro();
}
