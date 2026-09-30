// ================= AUTH + TARIX (Supabase) =================
// i18n.js va app.js dan keyin yuklanadi. t(), $, esc, langListeners, last, RENDER mavjud.
(() => {
  const CFG = window.CYBER_CONFIG || {};
  const authBtn = document.getElementById("authBtn");
  const panel = document.getElementById("authPanel");
  const histTab = document.getElementById("tab-history");

  // Supabase o'chirilgan bo'lsa (kalitlar yo'q) — auth qismini yashiramiz.
  if (!CFG.enabled || !window.supabase) {
    if (authBtn) authBtn.hidden = true;
    return;
  }
  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  let user = null;

  // ---------- Auth panel ----------
  function renderPanel(open) {
    panel.hidden = !open;
    authBtn.textContent = t(user ? "auth_logout" : (open ? "auth_close" : "auth_open"));
    if (!open) { panel.innerHTML = ""; return; }
    if (user) { panel.hidden = true; return; }
    panel.innerHTML = `
      <form class="authcard" id="authForm">
        <div class="row"><input type="email" id="au-email" placeholder="${esc(t("auth_email"))}" autocomplete="email" required></div>
        <div class="row"><input type="password" id="au-pass" placeholder="${esc(t("auth_password"))}" autocomplete="current-password" minlength="6" required></div>
        <div class="err" id="au-err"></div>
        <div class="row">
          <button type="submit" class="btn" id="au-login">${esc(t("auth_login"))}</button>
          <button type="button" class="btn ghost" id="au-signup">${esc(t("auth_signup"))}</button>
        </div>
        <p class="hint">${esc(t("auth_note"))}</p>
      </form>`;
    const email = () => document.getElementById("au-email").value.trim();
    const pass = () => document.getElementById("au-pass").value;
    const err = (m) => { document.getElementById("au-err").textContent = m; };
    document.getElementById("authForm").addEventListener("submit", async (e) => {
      e.preventDefault(); err("");
      const { error } = await sb.auth.signInWithPassword({ email: email(), password: pass() });
      if (error) err(error.message);
    });
    document.getElementById("au-signup").addEventListener("click", async () => {
      err("");
      if (pass().length < 6) return err(t("auth_min6"));
      const { error } = await sb.auth.signUp({ email: email(), password: pass() });
      if (error) err(error.message);
      else err(t("auth_check_email"));
    });
  }

  authBtn.addEventListener("click", async () => {
    if (user) { await sb.auth.signOut(); }
    else renderPanel(panel.hidden);
  });

  // ---------- Auth holati ----------
  sb.auth.onAuthStateChange((_ev, session) => {
    user = session?.user || null;
    authBtn.textContent = t(user ? "auth_logout" : "auth_open");
    histTab.hidden = !user;
    if (user) { panel.hidden = true; panel.innerHTML = ""; }
    // Kirgach, natijalarga "Saqlash" tugmasi paydo bo'ladi; chiqqach yo'qoladi.
    for (const id of Object.keys(last)) reAddSave(id);
  });

  // ---------- Natijani tarixga saqlash ----------
  // Har vosita uchun tilga bog'liq bo'lmagan, MAXFIY BO'LMAGAN qisqacha ma'lumot.
  const SUMMARY = {
    "pw-out": (d) => ({ tool: "password", title: t("labels")[d.score], summary: `${d.entropy} bit`, meta: { score: d.score, len: d.length } }),
    "hash-gen-out": (d) => ({ tool: "hash", title: "hash", summary: "md5/sha1/sha256", meta: {} }),
    "hash-id-out": (d) => ({ tool: "hash", title: (d.candidates || [])[0] || "?", summary: (d.candidates || []).join(", "), meta: { note: d.note } }),
    "url-out": (d) => ({ tool: "url", title: d.host, summary: `${t("lv_" + d.level)} · ${d.risk}/100`, meta: { level: d.level, risk: d.risk } }),
    "scan-out": (d) => ({ tool: "scan", title: d.host, summary: `${(d.open || []).length} ${t("ports_word")}`, meta: { open: (d.open || []).map((p) => p.port) } }),
    "hdr-out": (d) => ({ tool: "headers", title: d.final_url, summary: `${t("grade")}: ${d.grade} (${d.score}%)`, meta: { grade: d.grade } }),
  };

  function reAddSave(outId) {
    const el = document.getElementById(outId);
    if (!el || !SUMMARY[outId]) return;
    el.querySelector(".savebar")?.remove();
    const data = last[outId];
    if (!user || !data || data.error || data.pending) return;
    const bar = document.createElement("div");
    bar.className = "savebar";
    const btn = document.createElement("button");
    btn.className = "btn ghost sm"; btn.type = "button"; btn.textContent = t("save_btn");
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const rec = SUMMARY[outId](data);
      const { error } = await sb.from("tool_history").insert({ ...rec, user_id: user.id });
      btn.textContent = t(error ? "save_err" : "saved");
      if (!error) setTimeout(() => { btn.remove(); }, 1200);
      else btn.disabled = false;
    });
    bar.append(btn);
    el.append(bar);
  }

  // app.js har natijadan keyin window.onToolResult ni chaqiradi
  window.onToolResult = (outId) => reAddSave(outId);

  // ---------- Tarix tabini ko'rsatish ----------
  async function renderHistory() {
    const out = document.getElementById("hist-out");
    if (!user) { out.innerHTML = `<p class="hint">${esc(t("hist_login"))}</p>`; return; }
    out.innerHTML = `<p class="hint">...</p>`;
    const { data, error } = await sb.from("tool_history").select("*").order("created_at", { ascending: false }).limit(50);
    if (error) { out.innerHTML = `<span class="err">${esc(error.message)}</span>`; return; }
    if (!data.length) { out.innerHTML = `<p class="hint">${esc(t("hist_empty"))}</p>`; return; }
    out.innerHTML = `<table class="mt"><tr><th>${t("hist_tool")}</th><th>${t("hist_title")}</th><th>${t("hist_result")}</th><th>${t("hist_when")}</th><th></th></tr>${
      data.map((r) => `<tr data-id="${r.id}">
        <td>${esc(t("tab_" + ({ password: "password", hash: "hash", encode: "encode", url: "url", scan: "scan", headers: "headers" }[r.tool] || "password")))}</td>
        <td>${esc(r.title || "")}</td><td>${esc(r.summary || "")}</td>
        <td class="mono" style="white-space:nowrap">${new Date(r.created_at).toLocaleString()}</td>
        <td><button class="btn ghost sm hist-del" type="button">${esc(t("del"))}</button></td></tr>`).join("")}</table>`;
    out.querySelectorAll(".hist-del").forEach((b) => b.addEventListener("click", async (e) => {
      const tr = e.target.closest("tr"); const id = tr.dataset.id;
      const { error } = await sb.from("tool_history").delete().eq("id", id);
      if (!error) tr.remove();
    }));
  }
  // Tarix tabiga bosilganda yuklanadi
  document.querySelector('[data-tab="history"]').addEventListener("click", renderHistory);

  langListeners.push(() => { authBtn.textContent = t(user ? "auth_logout" : (panel.hidden ? "auth_open" : "auth_close")); if (!document.getElementById("history").classList.contains("active")) return; renderHistory(); });

  // dastlabki sessiya
  sb.auth.getSession();
})();
