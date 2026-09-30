// ================= KIBER FON: tarmoq/konstellatsiya effekti =================
// Canvas generativ animatsiya. Sarlavha ortida bir-biriga ulanadigan nuqtalar suzadi.
// prefers-reduced-motion bo'lsa harakatsiz, faqat statik naqsh chiziladi.
(() => {
  const canvas = document.getElementById("bgfx");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2);
  let nodes = [], raf = null;

  // Joriy mavzuning urg'u rangini olamiz (light/dark ikkalasida ishlaydi)
  function accent() {
    const c = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    return c || "#2f5bea";
  }
  function isDark() {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    return matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Nuqtalar soni ekran o'lchamiga qarab (juda ko'p bo'lmasin)
    const target = Math.min(70, Math.round((W * H) / 22000));
    nodes = [];
    for (let i = 0; i < target; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      });
    }
  }

  function draw() {
    const col = accent();
    const dark = isDark();
    const lineBase = dark ? 0.22 : 0.16;   // chiziqlar shaffofligi
    const dotBase = dark ? 0.55 : 0.4;
    ctx.clearRect(0, 0, W, H);
    // Yuqori qismda (sarlavha atrofida) effekt kuchliroq, pastga tomon so'nadi
    const fade = (y) => Math.max(0, 1 - y / (H * 0.85));

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 130 * 130) {
          const o = (1 - Math.sqrt(d2) / 130) * lineBase * fade((a.y + b.y) / 2);
          if (o <= 0.003) continue;
          ctx.strokeStyle = col; ctx.globalAlpha = o; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = col; ctx.globalAlpha = dotBase * fade(n.y);
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function step() {
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }
    draw();
    raf = requestAnimationFrame(step);
  }

  function start() {
    resize();
    if (raf) cancelAnimationFrame(raf);
    if (reduce) draw(); else step();
  }

  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(start, 200); }, { passive: true });
  // Mavzu o'zgarsa (toggle) rang yangilanishi uchun katamiz
  new MutationObserver(() => { if (reduce) draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  // Sahifa ko'rinmasa animatsiyani to'xtatamiz (batareya/tejamkorlik)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
    else if (!reduce && !raf) step();
  });
  start();
})();
