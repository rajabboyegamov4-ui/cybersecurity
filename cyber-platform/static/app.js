// Cyber Toolkit — frontend (i18n.js'dan keyin yuklanadi: t(), fmtTime(), setLang())
const $ = (id) => document.getElementById(id);

// XSS'dan himoya: serverdan kelgan har qanday matnni HTML'ga qo'yishdan oldin tozalaymiz
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Backend xatoni kalit bilan qaytaradi: {"error": "scan_forbidden", "params": {...}}
class ApiError extends Error {
  constructor(key, params = {}) { super(key); this.key = key; this.params = params; }
  get text() { return t("e_" + this.key, this.params); }
}

async function api(path, payload) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!data) throw new ApiError("bad_response");
  if (!res.ok) throw data.error ? new ApiError(data.error, data.params) : new ApiError("http", { status: res.status });
  return data;
}

// Har bir vositaning oxirgi natijasi: til o'zgarsa, qayta chizamiz
const last = {};
const RENDER = {};
function show(outId, data) { last[outId] = data; $(outId).innerHTML = data.error ? errHtml(data.error) : RENDER[outId](data); if (!data.error && !data.pending && window.onToolResult) try { window.onToolResult(outId, data); } catch {} }
const errHtml = (e) => `<span class="err">⚠ ${esc(e.text || e.message)}</span>`;

// Tugmani bosganda yuklanish holati + xatolarni ko'rsatish
function action(btnId, outId, fn) {
  const btn = $(btnId);
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.classList.add("busy");
    try { await fn(); }
    catch (e) { if (outId) show(outId, { error: e }); }
    finally { btn.disabled = false; btn.classList.remove("busy"); }
  });
}
function enter(inputId, btnId) {
  $(inputId).addEventListener("keydown", (e) => { if (e.key === "Enter") $(btnId).click(); });
}

// ---------- Til va tablar ----------
document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab, .panel").forEach((el) => el.classList.remove("active"));
    tab.classList.add("active");
    $(tab.dataset.tab).classList.add("active");
  });
});

// ---------- Parol ----------
const COLORS = ["#f2555a", "#f2555a", "#f5b942", "#8fd14f", "#22d39a"];
RENDER["pw-out"] = (r) => `
  <div class="big s${r.score}">${esc(t("labels")[r.score])}</div>
  <div class="kv mt">
    <span>${t("len")}</span><span>${r.length} ${t("chars")}</span>
    <span>${t("entropy")}</span><span>${r.entropy} bit</span>
    <span>${t("crack_time")}</span><span>${esc(fmtTime(r.crack_seconds))} <small>${t("crack_note")}</small></span>
  </div>
  ${r.issues.length ? `<ul class="list">${r.issues.map((i) => `<li>${esc(t("i_" + i.key, i))}</li>`).join("")}</ul>`
                    : `<p class="good">${t("no_issues")}</p>`}`;
let pwTimer;
$("pw-input").addEventListener("input", () => {
  clearTimeout(pwTimer);
  pwTimer = setTimeout(async () => {
    const pw = $("pw-input").value;
    if (!pw) { $("pw-out").innerHTML = ""; delete last["pw-out"]; $("pw-bar").style.width = "0"; return; }
    try {
      const r = await api("/api/password", { password: pw });
      $("pw-bar").style.width = `${(r.score + 1) * 20}%`;
      $("pw-bar").style.background = COLORS[r.score];
      show("pw-out", r);
    } catch (e) { show("pw-out", { error: e }); }
  }, 250);
});
const pwToggleLabel = () => { $("pw-toggle").textContent = t($("pw-input").type === "password" ? "show" : "hide"); };
$("pw-toggle").addEventListener("click", () => {
  const inp = $("pw-input");
  inp.type = inp.type === "password" ? "text" : "password";
  pwToggleLabel();
});

// ---------- Hash ----------
RENDER["hash-gen-out"] = (r) => `<div class="kv">${
  Object.entries(r).map(([k, v]) => `<span>${esc(k.toUpperCase())}</span><span>${esc(v)}</span>`).join("")}</div>`;
action("hash-gen", "hash-gen-out", async () => show("hash-gen-out", await api("/api/hash/generate", { text: $("hash-text").value })));
enter("hash-text", "hash-gen");

RENDER["hash-id-out"] = (r) => r.candidates.length
  ? `<div>${t("candidates")} ${r.candidates.map((c) => `<span class="pill">${esc(c)}</span>`).join(" ")}</div>
     <p class="hint mt">${esc(t("n_" + r.note))}</p>`
  : `<span class="mid">${esc(t("n_" + r.note))}</span>`;
action("hash-identify", "hash-id-out", async () => show("hash-id-out", await api("/api/hash/identify", { hash: $("hash-id").value })));
enter("hash-id", "hash-identify");

// ---------- Kodlash ----------
async function doEncode(act) {
  try {
    const r = await api("/api/encode", { text: $("enc-text").value, mode: $("enc-mode").value, action: act });
    $("enc-out").value = r.result;
  } catch (e) { $("enc-out").value = "⚠ " + (e.text || e.message); }
}
action("enc-do", null, () => doEncode("encode"));
action("dec-do", null, () => doEncode("decode"));

// ---------- URL ----------
RENDER["url-out"] = (r) => {
  const cls = { high: "badc", mid: "mid", low: "good" }[r.level] || "";
  return `
    <div class="big ${cls}">${t("risk")}: ${esc(t("lv_" + r.level))} (${r.risk}/100)</div>
    <div class="kv mt"><span>${t("domain")}</span><span>${esc(r.host)}</span>
    <span>${t("protocol")}</span><span>${esc(r.scheme)}</span></div>
    ${r.findings.length
      ? `<table class="mt"><tr><th>${t("th_sign")}</th><th>${t("th_weight")}</th></tr>${
          r.findings.map((f) => `<tr><td>${esc(t("f_" + f.key, f.params))}</td><td>+${f.weight}</td></tr>`).join("")}</table>`
      : `<p class="good">${t("no_findings")}</p>`}`;
};
action("url-go", "url-out", async () => show("url-out", await api("/api/url", { url: $("url-input").value })));
enter("url-input", "url-go");

// ---------- Port scanner ----------
fetch("/api/meta").then((r) => r.json()).then((m) => {
  $("scan-host").innerHTML = m.scan_hosts.map((h) => `<option>${esc(h)}</option>`).join("");
});
RENDER["scan-out"] = (r) => r.pending ? `<span class="hint">${t("scanning")}</span>` : `
  <div class="kv"><span>${t("host")}</span><span>${esc(r.host)} (${esc(r.ip)})</span>
  <span>${t("scanned")}</span><span>${r.scanned} ${t("ports_word")}</span></div>
  ${r.open.length
    ? `<table class="mt"><tr><th>${t("th_port")}</th><th>${t("th_service")}</th><th>${t("th_note")}</th></tr>${
        r.open.map((p) => `<tr><td><code>${p.port}</code></td><td>${esc(p.service)}</td>
          <td class="${p.warning ? "mid" : ""}">${p.warning ? esc(t("r_" + p.warning)) : ""}</td></tr>`).join("")}</table>`
    : `<p>${t("no_open")}</p>`}`;
action("scan-go", "scan-out", async () => {
  show("scan-out", { pending: true });
  show("scan-out", await api("/api/scan", { host: $("scan-host").value }));
});

// ---------- Headers ----------
RENDER["hdr-out"] = (r) => {
  const cls = "AB".includes(r.grade) ? "good" : r.grade === "C" ? "mid" : "badc";
  const row = (h, ok) => `<tr><td><code>${esc(h.header)}</code></td><td class="${ok ? "good" : "badc"}">${ok ? "✓" : "✗"}</td><td>${esc(t("w_" + h.header))}</td></tr>`;
  return `
    <div class="big ${cls}">${t("grade")}: ${esc(r.grade)} (${r.score}%)</div>
    <div class="kv mt"><span>${t("address")}</span><span>${esc(r.final_url)}</span>
    <span>HTTPS</span><span>${r.https ? t("yes") : t("no")}</span>
    <span>Status</span><span class="${r.status >= 400 ? "badc" : ""}">${r.status}${r.status >= 400 ? " — " + t("status_err") : ""}</span></div>
    <table class="mt"><tr><th>${t("th_header")}</th><th>${t("th_state")}</th><th>${t("th_why")}</th></tr>
    ${r.present.map((h) => row(h, true)).join("")}${r.missing.map((h) => row(h, false)).join("")}
    </table>
    ${r.leaks.length ? `<p class="mid mt">${t("leaks")} ${
      r.leaks.map((l) => `<code>${esc(l.header)}: ${esc(l.value)}</code>`).join(", ")}</p>` : ""}`;
};
action("hdr-go", "hdr-out", async () => show("hdr-out", await api("/api/headers", { url: $("hdr-input").value })));
enter("hdr-input", "hdr-go");

// ---------- Til o'zgarganda hammasini qayta chizish ----------
langListeners.push(() => {
  for (const [id, data] of Object.entries(last)) show(id, data);
  pwToggleLabel();
});
applyStatic();
