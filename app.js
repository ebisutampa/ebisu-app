(() => {
'use strict';
const APP_VERSION = '1.0.0';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => { const n = parseFloat(v); return isFinite(n) ? n : 0; };
const money = v => '$' + num(v).toFixed(2);
const imgUrl = (b, w = 240) => 'https://image.ebisu-work.com/image/' + encodeURIComponent(b) + '?x-oss-process=image/resize,w_' + w;
const hhmm = d => (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

/* ======================= i18n ======================= */
const EN = {
  'Ebisu 店务助手': 'Ebisu Store Assistant', '请用店铺账号登录': 'Sign in with the store account', '店铺账号（邮箱）': 'Store account (email)', '密码': 'Password', '登录': 'Sign in', 'English': '中文',
  '登录中…': 'Signing in…', '账号或密码不对': 'Wrong email or password', '还没有设置好服务器': 'Server is not configured yet',
  '设置': 'Settings', '前场货架': 'Sales floor', '后仓': 'Backroom', '只查询': 'Lookup only', '打开摄像头扫码': 'Scan with camera', '扫码枪扫描 / 输入条码': 'Scan or type a barcode', '查找': 'Find',
  '扫码枪模式：键盘不会弹出，扫完自动录入。': 'Scanner mode: no keyboard; each scan is saved automatically.', '手动输入': 'Type manually', '切回扫码枪': 'Back to scanner', '手动输入模式：输入条码后按“前往”。': 'Manual mode: type the barcode and press Go.',
  '本批次': 'This count', '前场已扫品种': 'Items on floor', '后仓已扫品种': 'Items in backroom', '需要上架': 'Need shelving', '最近扫描': 'Recent scans', '还没有扫描记录': 'No scans yet',
  '全部分类': 'All categories', '搜索品名或条码': 'Search name or barcode', '“系统有库存但两边都没扫到”只有在前场和后仓都扫完一遍后才有参考价值。': '"In stock but not scanned anywhere" only means something after both the floor and backroom are fully scanned.',
  '备货天数': 'Days to cover', '建议数量 = 日均销量 × 备货天数 − 现有库存。日均销量取近7天和近30天中较高的那个。商城起订量请下单时再核对。': 'Suggested qty = daily sales × days to cover − stock. Daily sales uses the higher of the 7-day and 30-day rate. Check minimum order quantities when ordering.',
  '个商品需要补货': 'items to reorder', '复制叫货单': 'Copy order list', '全部': 'All', '手办/盲盒': 'Figures/Blind box', '美妆': 'Beauty', '其他': 'Other', '新品由定时任务从 EBISU 商城自动收集。': 'New items are collected automatically from the EBISU wholesale site.',
  '扫码': 'Scan', '对比': 'Compare', '补货': 'Reorder', '新品': 'New', '完成': 'Done', '把条码放进框里': 'Put the barcode inside the frame',
  '关闭': 'Close', '商品数据': 'Product data', '重新下载商品数据': 'Re-download product data', '盘点批次': 'Count session', '新批次名称，例如 11月第2周': 'Session name, e.g. Nov week 2', '新建批次': 'New session',
  '新建批次后从零开始扫。旧批次的数据会保留，但不再显示。': 'A new session starts from zero. Old sessions are kept but hidden.', '同步通道': 'Sync channel',
  '由 Claude 在店里的电脑上操作：在这个页面上粘贴从银豹导出的数据。': 'Used by Claude on the store computer: data exported from the POS is pasted on this page.', '点这里，然后粘贴（Ctrl+V）': 'Click here, then paste (Ctrl+V)',
  '账号': 'Account', '退出登录': 'Sign out', '取消': 'Cancel', '确定': 'OK',
  '{0} 个商品 · 更新于 {1}': '{0} products · updated {1}', '正在下载商品数据… {0}': 'Downloading products… {0}', '还没有商品数据': 'No product data yet',
  '共 {0} 个商品，含库存与近7/30天销量。最后同步：{1}': '{0} products with stock and 7/30-day sales. Last sync: {1}', '当前批次：{0}（{1} 开始）': 'Current session: {0} (started {1})', '还没有批次，请新建一个。': 'No session yet — create one.',
  '盘点 {0}': 'Count {0}', '保存失败，请检查网络': 'Save failed — check the connection', '请先在“设置”里新建一个盘点批次': 'Start a count session in Settings first', '已撤销一次': 'Undid one scan',
  '前场 ×{0}': 'Floor ×{0}', '前场未扫': 'Not on floor yet', '后仓 ×{0}': 'Backroom ×{0}', '后仓未扫': 'Not in backroom yet', '后仓有货 · 要上架': 'In backroom · put on shelf', '后仓没货': 'Backroom empty', '系统库存 {0}，要核对': 'System stock {0} — check',
  '银豹里没有这个条码': 'Barcode not in POS', '可能是新货还没录入，或条码录入有误。': 'Maybe a new item not entered yet, or a barcode typo.', '系统库存': 'System stock', '近7天销量': 'Sold 7 days', '近30天销量': 'Sold 30 days',
  '前场': 'Floor', '查询': 'Lookup', '未知条码': 'Unknown barcode', '无图': 'No image',
  '后仓有 · 前场没有': 'In backroom · not on floor', '有货没摆出来，要上架': 'Stock not on display — put it out', '前场有 · 后仓没有': 'On floor · none in backroom', '后仓已空，卖完就断货，留意补货': 'Backroom empty — reorder before it sells out',
  '扫到了 · 但系统库存 ≤ 0': 'Scanned · system stock ≤ 0', '库存数据可能不准，或没录入': 'Stock data may be wrong', '系统有库存 · 两边都没扫到': 'In stock · not scanned anywhere', '可能放错位置、丢失，或还没盘到': 'Misplaced, missing, or not counted yet',
  '前场和后仓都有': 'On floor and in backroom', '正常': 'OK', '复制清单': 'Copy list', '只显示前 200 个，用上面的分类或搜索缩小范围。': 'Showing the first 200 — filter to narrow down.', '没有': 'None',
  '前{0} / 后{1}': 'F{0} / B{1}', '系统 {0}': 'System {0}', '已复制': 'Copied', '复制失败': 'Copy failed', '已断货': 'Out of stock', '约 {0} 天卖完': 'Sells out in ~{0} days', '约 {0} 天': '~{0} days',
  '库存 {0} · 7天 {1} · 30天 {2}': 'Stock {0} · 7d {1} · 30d {2}', '只显示前 300 个，复制时会包含全部。': 'Showing the first 300; copy includes all.', '按当前设置，没有需要补的商品': 'Nothing to reorder with these settings',
  '新': 'NEW', '预告': 'Preview', '上架': 'Available', '店里已有': 'In store', '零售 {0}': 'MSRP {0}', '批发 {0}': 'Wholesale {0}', '暂时没有新品记录': 'No new items yet', '没有需要补的商品': 'Nothing to reorder',
  '新建盘点批次？': 'Start a new count session?', '前场和后仓的扫描记录会从零开始。': 'Floor and backroom counts start from zero.', '创建中…': 'Creating…', '新批次已创建': 'Session created', '创建失败': 'Could not create',
  '商城已退出登录，新品监控暂停（{0}）。请在店里电脑上重新登录 EBISU 商城。': 'Wholesale site logged out; checks paused ({0}). Log in again on the store computer.', '最近一次检查：{0}': 'Last check: {0}',
  'Ebisu 叫货单 {0}（备货 {1} 天{2}）': 'Ebisu order list {0} ({1}-day cover{2})', '品名\t条码\t建议数量\t现有库存\t近7天\t近30天': 'Name\tBarcode\tQty\tStock\t7d\t30d',
  '摄像头打不开：{0}': 'Camera unavailable: {0}', '请允许使用摄像头': 'Please allow camera access', '扫到 {0}': 'Scanned {0}',
  '同步中… {0}/{1}': 'Syncing… {0}/{1}', '同步完成：{0} 个商品。': 'Sync done: {0} products.', '新品已更新：{0} 个。': 'New items updated: {0}.', '粘贴的内容不是同步数据。': 'That is not sync data.', '同步失败：{0}': 'Sync failed: {0}',
  '没有网络，扫描会在联网后补存': 'Offline — scans will save when back online',
};
let LANG = 'zh';
try { LANG = localStorage.getItem('eb_lang') || (/^zh/i.test(navigator.language || '') ? 'zh' : 'en'); } catch (e) {}
const t = (s, ...a) => { let r = (LANG === 'en' && EN[s] != null) ? EN[s] : s; a.forEach((v, i) => { r = r.split('{' + i + '}').join(v); }); return r; };
const pname = p => LANG === 'en' ? (p.n || p.cn) : (p.cn || p.n);
const pname2 = p => LANG === 'en' ? ((p.cn && p.cn !== p.n) ? p.cn : '') : ((p.n && p.n !== p.cn) ? p.n : '');
function applyStatic() {
  $$('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  $$('[data-tp]').forEach(el => el.setAttribute('placeholder', t(el.dataset.tp)));
  document.documentElement.lang = LANG === 'en' ? 'en' : 'zh-CN';
  document.title = t('Ebisu 店务助手');
  $('#btnLang').textContent = LANG === 'en' ? '中文' : 'EN';
}
function setLang(l) { LANG = l; try { localStorage.setItem('eb_lang', l); } catch (e) {} applyStatic(); renderKbHint(); updateHeader(); fillCats(); renderRoundInfo(); renderMon(); renderAll(); }

/* ======================= ui helpers ======================= */
let toastT;
function toast(msg, ms = 1800) { const el = $('#toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), ms); }
function confirmBox(title, body) {
  return new Promise(res => {
    $('#cfTitle').textContent = title; $('#cfBody').textContent = body; $('#confirmSheet').classList.add('on');
    const done = v => { $('#confirmSheet').classList.remove('on'); $('#cfYes').onclick = $('#cfNo').onclick = null; res(v); };
    $('#cfYes').onclick = () => done(true); $('#cfNo').onclick = () => done(false);
  });
}
const imgTag = (b, w) => '<img alt="" loading="lazy" src="' + imgUrl(b, w) + '" onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{textContent:\'' + (LANG === 'en' ? 'No image' : '无图') + '\'}))">';

/* ======================= state ======================= */
const S = {
  sb: null, session: null,
  catalog: new Map(), catMeta: null,
  round: null, counts: { f: new Map(), b: new Map() },
  zone: 'f', view: 'scan', recent: [], newItems: [], newKind: '', mon: null,
};
try { const z = localStorage.getItem('eb_zone'); if (z) S.zone = z; } catch (e) {}
const cnt = (z, b) => S.counts[z].get(b) || 0;

/* ======================= storage (IndexedDB cache) ======================= */
const IDB = {
  open() { return new Promise((res, rej) => { const r = indexedDB.open('ebisu-pwa', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); },
  async get(k) { try { const d = await this.open(); return await new Promise(res => { const q = d.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(undefined); }); } catch (e) { return undefined; } },
  async set(k, v) { try { const d = await this.open(); d.transaction('kv', 'readwrite').objectStore('kv').put(v, k); } catch (e) {} },
};

/* ======================= supabase ======================= */
const CFG = window.EBISU_CONFIG || {};
function initSupabase() {
  if (!CFG.supabaseUrl || !CFG.supabaseAnonKey || !window.supabase) return null;
  return window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
}
async function fetchAll(table, cols, filter) {
  const out = []; const page = 1000;
  for (let from = 0; ; from += page) {
    let q = S.sb.from(table).select(cols).range(from, from + page - 1);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw error;
    out.push(...data);
    if (S.view && table === 'products') $('#hdrSub').textContent = t('正在下载商品数据… {0}', out.length.toLocaleString());
    if (data.length < page) break;
  }
  return out;
}

/* ---------- catalog ---------- */
function setCatalog(rows) {
  const m = new Map(); for (const r of rows) m.set(String(r.b), r); S.catalog = m; fillCats();
}
function fillCats() {
  const cats = [...new Set([...S.catalog.values()].map(o => o.cat).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'zh'));
  for (const sel of ['#cmpCat', '#ordCat']) {
    const el = $(sel), cur = el.value;
    el.innerHTML = '<option value="">' + t('全部分类') + '</option>' + cats.map(c => '<option>' + esc(c) + '</option>').join('');
    el.value = cur;
  }
}
async function loadCatalog(force) {
  const { data: meta } = await S.sb.from('meta').select('value').eq('key', 'catalog').maybeSingle();
  S.catMeta = meta ? meta.value : null;
  const cached = await IDB.get('catalog');
  if (!force && cached && S.catMeta && cached.syncedAt === S.catMeta.syncedAt) { setCatalog(cached.rows); updateHeader(); renderAll(); return; }
  if (cached && !S.catalog.size) { setCatalog(cached.rows); renderAll(); }
  try {
    const rows = await fetchAll('products', 'b,cn,n,cat,st,p,s7,s30');
    setCatalog(rows); IDB.set('catalog', { syncedAt: S.catMeta ? S.catMeta.syncedAt : 0, rows });
  } catch (e) { toast(String(e.message || e)); }
  updateHeader(); renderAll();
}
function updateHeader() {
  const m = S.catMeta; const when = m && m.syncedAt ? new Date(m.syncedAt) : null;
  $('#hdrSub').textContent = S.catalog.size ? t('{0} 个商品 · 更新于 {1}', S.catalog.size.toLocaleString(), when ? hhmm(when) : '—') : t('还没有商品数据');
  $('#catInfo').textContent = t('共 {0} 个商品，含库存与近7/30天销量。最后同步：{1}', S.catalog.size.toLocaleString(), when ? when.toLocaleString() : '—');
}

/* ---------- rounds & scans ---------- */
let scanChannel = null;
function renderRoundInfo() {
  $('#roundName').textContent = S.round ? S.round.name : '';
  $('#roundInfo').textContent = S.round ? t('当前批次：{0}（{1} 开始）', S.round.name, new Date(Number(S.round.started_at)).toLocaleDateString()) : t('还没有批次，请新建一个。');
}
async function loadRound() {
  const { data } = await S.sb.from('rounds').select('*').eq('active', true).order('started_at', { ascending: false }).limit(1);
  const r = data && data[0] ? data[0] : null;
  if (S.round && r && S.round.id === r.id) return;
  S.round = r; S.counts = { f: new Map(), b: new Map() }; renderRoundInfo();
  if (scanChannel) { S.sb.removeChannel(scanChannel); scanChannel = null; }
  if (!r) { renderAll(); return; }
  const rows = await fetchAll('scans', 'zone,b,n', q => q.eq('round_id', r.id));
  for (const x of rows) if (x.n > 0) S.counts[x.zone].set(x.b, x.n);
  renderAll();
  scanChannel = S.sb.channel('scans-' + r.id)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'scans', filter: 'round_id=eq.' + r.id }, p => {
      const x = p.new && p.new.b ? p.new : null; if (!x) return;
      if (x.n > 0) S.counts[x.zone].set(x.b, x.n); else S.counts[x.zone].delete(x.b);
      renderKpi(); if (S.view === 'cmp') renderCmp(); if (S.shown === x.b) showProduct(x.b, false);
    }).subscribe();
}
async function newRound(name) {
  await S.sb.from('rounds').update({ active: false }).eq('active', true);
  const row = { id: 'r' + Date.now().toString(36), name: name || t('盘点 {0}', new Date().toLocaleDateString()), started_at: Date.now(), active: true };
  const { error } = await S.sb.from('rounds').insert(row);
  if (error) throw error;
  S.round = null; await loadRound();
}

/* queue so scans survive a flaky connection */
const queue = []; let flushing = false;
async function flushQueue() {
  if (flushing) return; flushing = true;
  while (queue.length) {
    const q = queue[0];
    const { data, error } = await S.sb.rpc('inc_scan', { p_round: q.round, p_zone: q.zone, p_b: q.b, p_delta: q.delta });
    if (error) { toast(navigator.onLine ? t('保存失败，请检查网络') : t('没有网络，扫描会在联网后补存'), 2500); flushing = false; setTimeout(flushQueue, 4000); return; }
    queue.shift();
    if (S.round && q.round === S.round.id && typeof data === 'number') { if (data > 0) S.counts[q.zone].set(q.b, data); else S.counts[q.zone].delete(q.b); }
  }
  flushing = false; renderKpi(); if (S.shown) showProduct(S.shown, false); renderRecent();
}
function addScan(zone, b, delta) {
  const v = Math.max(0, cnt(zone, b) + delta);
  if (v > 0) S.counts[zone].set(b, v); else S.counts[zone].delete(b);
  queue.push({ round: S.round.id, zone, b, delta }); flushQueue();
}

/* ======================= scanning ======================= */
function normalize(code) {
  code = String(code || '').trim().replace(/\s+/g, '');
  if (!code || S.catalog.has(code)) return code;
  if (/^0\d{12}$/.test(code) && S.catalog.has(code.slice(1))) return code.slice(1);
  if (/^\d{12}$/.test(code) && S.catalog.has('0' + code)) return '0' + code;
  return code;
}
let AC = null;
function beep(ok) {
  try { navigator.vibrate && navigator.vibrate(ok ? 40 : [80, 60, 80]); } catch (e) {}
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = ok ? 1500 : 320; g.gain.value = .1;
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + (ok ? .08 : .25));
  } catch (e) {}
}
function onScan(raw) {
  const b = normalize(raw); if (!b) return null;
  const p = S.catalog.get(b); const z = S.zone;
  if (z === 'f' || z === 'b') {
    if (!S.round) { toast(t('请先在“设置”里新建一个盘点批次'), 2500); beep(false); return null; }
    addScan(z, b, 1);
  }
  S.recent.unshift({ b, z, at: Date.now() }); S.recent = S.recent.slice(0, 30);
  beep(!!p); showProduct(b, true); renderRecent(); renderKpi();
  return b;
}
function undo(i) {
  const r = S.recent[i]; if (!r) return;
  if ((r.z === 'f' || r.z === 'b') && S.round) addScan(r.z, r.b, -1);
  S.recent.splice(i, 1); renderRecent(); renderKpi(); if (S.shown === r.b) showProduct(r.b, false);
  toast(t('已撤销一次'));
}
function statusChips(b, p) {
  const f = cnt('f', b), bk = cnt('b', b), out = [];
  out.push(f ? '<span class="chip c-info">' + t('前场 ×{0}', f) + '</span>' : '<span class="chip c-gray">' + t('前场未扫') + '</span>');
  out.push(bk ? '<span class="chip c-warn">' + t('后仓 ×{0}', bk) + '</span>' : '<span class="chip c-gray">' + t('后仓未扫') + '</span>');
  if (bk && !f) out.push('<span class="chip c-red">' + t('后仓有货 · 要上架') + '</span>');
  if (f && !bk && S.counts.b.size) out.push('<span class="chip c-warn">' + t('后仓没货') + '</span>');
  if (p && num(p.st) <= 0 && (f || bk)) out.push('<span class="chip c-red">' + t('系统库存 {0}，要核对', num(p.st)) + '</span>');
  return out.join('');
}
function showProduct(b, flash) {
  S.shown = b;
  const p = S.catalog.get(b);
  const el = $('#prodCard'); const fl = flash ? ' flash' : '';
  if (!p) {
    el.innerHTML = '<div class="card' + fl + '"><div class="prod"><div class="pic">' + imgTag(b, 300) + '</div><div class="meta"><div class="cn">' + t('银豹里没有这个条码') + '</div><div class="bc">' + esc(b) + '</div><div class="hint">' + t('可能是新货还没录入，或条码录入有误。') + '</div><div class="chips">' + statusChips(b, null) + '</div></div></div></div>';
    return;
  }
  const st = num(p.st);
  el.innerHTML = '<div class="card' + fl + '"><div class="prod"><div class="pic">' + imgTag(b, 300) + '</div><div class="meta">' +
    '<div class="cn">' + esc(pname(p)) + '</div>' + (pname2(p) ? '<div class="en">' + esc(pname2(p)) + '</div>' : '') +
    '<div class="bc">' + esc(b) + (p.cat ? ' · ' + esc(p.cat) : '') + '</div><div class="price">' + money(p.p) + '</div></div></div>' +
    '<div class="stats"><div class="stat' + (st <= 0 ? ' neg' : '') + '"><b>' + st + '</b><span>' + t('系统库存') + '</span></div><div class="stat"><b>' + num(p.s7) + '</b><span>' + t('近7天销量') + '</span></div><div class="stat"><b>' + num(p.s30) + '</b><span>' + t('近30天销量') + '</span></div></div>' +
    '<div class="chips">' + statusChips(b, p) + '</div></div>';
}
function renderRecent() {
  const ul = $('#recent');
  if (!S.recent.length) { ul.innerHTML = '<li class="muted" style="justify-content:center">' + t('还没有扫描记录') + '</li>'; return; }
  const zl = { f: t('前场'), b: t('后仓'), q: t('查询') };
  ul.innerHTML = S.recent.slice(0, 12).map((r, i) => {
    const p = S.catalog.get(r.b);
    return '<li data-b="' + esc(r.b) + '"><div class="thumb">' + imgTag(r.b, 120) + '</div><div class="t"><div class="a">' + esc(p ? pname(p) : t('未知条码')) + '</div><div class="b">' + esc(r.b) + ' · ' + zl[r.z] + '</div></div>' +
      (r.z !== 'q' ? '<div class="n">×' + cnt(r.z, r.b) + '</div><button class="btn ghost sm" data-undo="' + i + '">−1</button>' : '') + '</li>';
  }).join('');
}
function renderKpi() {
  let need = 0; for (const k of S.counts.b.keys()) if (!cnt('f', k)) need++;
  $('#kF').textContent = S.counts.f.size; $('#kB').textContent = S.counts.b.size; $('#kN').textContent = need;
}

/* ---------- live camera ---------- */
let camCtl = null, lastCode = '', lastAt = 0;
async function openCamera() {
  if (!window.ZXingBrowser) { toast(t('摄像头打不开：{0}', 'lib')); return; }
  $('#cam').classList.add('on');
  $('#camZone').textContent = { f: t('前场货架'), b: t('后仓'), q: t('只查询') }[S.zone];
  $('#camZone').style.background = { f: 'var(--info)', b: 'var(--warn)', q: 'rgba(0,0,0,.45)' }[S.zone];
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); AC.resume && AC.resume(); } catch (e) {}
  try {
    const hints = new Map();
    const reader = new ZXingBrowser.BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 80, delayBetweenScanSuccess: 300 });
    camCtl = await reader.decodeFromConstraints({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } }, $('#camVideo'), (res) => {
      if (!res) return;
      const code = res.getText(); const now = Date.now();
      // same item again: require a 1.5 s pause so one item isn't counted many times
      if (code === lastCode && now - lastAt < 1500) { lastAt = now; return; }
      lastCode = code; lastAt = now;
      const b = onScan(code); if (!b) return;
      const p = S.catalog.get(b);
      const last = $('#camLast');
      last.innerHTML = '<div class="thumb">' + imgTag(b, 120) + '</div><div class="t"><div class="a">' + esc(p ? pname(p) : t('未知条码')) + '</div><div class="b">' + esc(b) + (p ? ' · ' + money(p.p) + ' · ' + t('系统库存') + ' ' + num(p.st) : '') + '</div></div>' + (S.zone !== 'q' ? '<div class="n">×' + cnt(S.zone, b) + '</div>' : '');
      last.classList.remove('hit'); void last.offsetWidth; last.classList.add('hit');
    });
  } catch (e) {
    closeCamera();
    toast(/Permission|NotAllowed/i.test(String(e && (e.name || e.message))) ? t('请允许使用摄像头') : t('摄像头打不开：{0}', (e && (e.name || e.message)) || e), 3500);
  }
}
function closeCamera() {
  try { camCtl && camCtl.stop(); } catch (e) {}
  camCtl = null; $('#cam').classList.remove('on');
  $('#camLast').innerHTML = '<span class="muted">' + t('把条码放进框里') + '</span>';
}

/* ======================= compare ======================= */
const cmpOpen = new Set(['need']);
function renderCmp() {
  const cat = $('#cmpCat').value, q = $('#cmpQ').value.trim().toLowerCase();
  const scanned = new Set([...S.counts.f.keys(), ...S.counts.b.keys()]);
  const pass = b => { const p = S.catalog.get(b); if (cat && (!p || p.cat !== cat)) return false; if (q) { const s = (b + ' ' + (p ? (p.cn || '') + ' ' + (p.n || '') : '')).toLowerCase(); if (!s.includes(q)) return false; } return true; };
  const G = { need: [], empty: [], bad: [], miss: [], ok: [] };
  for (const b of scanned) {
    if (!pass(b)) continue;
    const f = cnt('f', b), bk = cnt('b', b), p = S.catalog.get(b);
    if (bk && !f) G.need.push(b); else if (f && !bk) G.empty.push(b); else if (f && bk) G.ok.push(b);
    if (!p || num(p.st) <= 0) G.bad.push(b);
  }
  if (S.catalog.size && scanned.size) for (const [b, p] of S.catalog) if (num(p.st) > 0 && !scanned.has(b) && pass(b)) G.miss.push(b);
  const bySt = arr => arr.sort((a, b) => num((S.catalog.get(b) || {}).st) - num((S.catalog.get(a) || {}).st));
  bySt(G.need); bySt(G.miss);
  const defs = [
    ['need', '后仓有 · 前场没有', '有货没摆出来，要上架', 'var(--red)'],
    ['empty', '前场有 · 后仓没有', '后仓已空，卖完就断货，留意补货', 'var(--warn)'],
    ['bad', '扫到了 · 但系统库存 ≤ 0', '库存数据可能不准，或没录入', 'var(--red)'],
    ['miss', '系统有库存 · 两边都没扫到', '可能放错位置、丢失，或还没盘到', 'var(--ink3)'],
    ['ok', '前场和后仓都有', '正常', 'var(--ok)'],
  ];
  $('#cmpGroups').innerHTML = defs.map(([k, a, d, c]) => {
    const arr = G[k];
    return '<details class="grp" data-g="' + k + '"' + (cmpOpen.has(k) ? ' open' : '') + '><summary><span class="dot" style="background:' + c + '"></span><div class="gt"><b>' + t(a) + '</b><span>' + t(d) + '</span></div><div class="cnt">' + arr.length + '</div></summary><div class="body">' +
      (arr.length ? '<div class="row" style="justify-content:flex-end;margin-bottom:4px"><button class="btn ghost sm" data-copy="' + k + '">' + t('复制清单') + '</button></div><ul class="list">' + arr.slice(0, 200).map(rowHtml).join('') + '</ul>' + (arr.length > 200 ? '<div class="hint">' + t('只显示前 200 个，用上面的分类或搜索缩小范围。') + '</div>' : '') : '<div class="empty">' + t('没有') + '</div>') +
      '</div></details>';
  }).join('');
  S.cmpGroups = G;
}
function rowHtml(b) {
  const p = S.catalog.get(b);
  return '<li data-b="' + esc(b) + '"><div class="thumb">' + imgTag(b, 120) + '</div><div class="t"><div class="a">' + esc(p ? pname(p) : t('未知条码')) + '</div><div class="b">' + esc(b) + (p && p.cat ? ' · ' + esc(p.cat) : '') + '</div></div><div class="n" style="font-size:12.5px;font-weight:600">' +
    t('前{0} / 后{1}', cnt('f', b), cnt('b', b)) + '<br><span class="muted">' + t('系统 {0}', p ? num(p.st) : '—') + '</span></div></li>';
}
const listText = arr => arr.map(b => { const p = S.catalog.get(b); return (p ? pname(p) : '?') + '\t' + b + '\t' + t('前{0} / 后{1}', cnt('f', b), cnt('b', b)) + '\t' + t('系统 {0}', p ? num(p.st) : '-'); }).join('\n');
async function copyText(s) { try { await navigator.clipboard.writeText(s); toast(t('已复制')); } catch (e) { toast(t('复制失败')); } }

/* ======================= reorder ======================= */
function calcOrder() {
  const days = num($('#ordDays').value) || 14, cat = $('#ordCat').value, out = [];
  for (const [b, p] of S.catalog) {
    if (cat && p.cat !== cat) continue;
    const s7 = num(p.s7), s30 = num(p.s30); if (!s7 && !s30) continue;
    const daily = Math.max(s7 / 7, s30 / 30), st = Math.max(0, num(p.st));
    const need = Math.ceil(daily * days - st); if (need <= 0) continue;
    out.push({ b, p, daily, need, left: daily ? st / daily : 999 });
  }
  return out.sort((a, b) => a.left - b.left || b.daily - a.daily);
}
function renderOrd() {
  const L = calcOrder(); $('#ordCount').textContent = L.length;
  $('#ordList').innerHTML = L.length ? L.slice(0, 300).map(x => {
    const d = x.left < 0.5 ? '<span class="chip c-red">' + t('已断货') + '</span>' : x.left < 7 ? '<span class="chip c-warn">' + t('约 {0} 天卖完', Math.ceil(x.left)) + '</span>' : '<span class="chip c-gray">' + t('约 {0} 天', Math.ceil(x.left)) + '</span>';
    return '<li data-b="' + esc(x.b) + '"><div class="thumb">' + imgTag(x.b, 120) + '</div><div class="t"><div class="a">' + esc(pname(x.p)) + '</div><div class="b">' + t('库存 {0} · 7天 {1} · 30天 {2}', num(x.p.st), num(x.p.s7), num(x.p.s30)) + '</div><div style="margin-top:3px">' + d + '</div></div><div class="n" style="font-size:20px">' + x.need + '</div></li>';
  }).join('') + (L.length > 300 ? '<li class="muted">' + t('只显示前 300 个，复制时会包含全部。') + '</li>' : '') : '<li class="empty">' + t('按当前设置，没有需要补的商品') + '</li>';
}

/* ======================= new items ======================= */
async function loadNew() {
  const { data } = await S.sb.from('new_items').select('*').order('first_seen', { ascending: false }).limit(300);
  S.newItems = data || []; renderNew();
  const { data: m } = await S.sb.from('meta').select('value').eq('key', 'monitor').maybeSingle();
  S.mon = m ? m.value : null; renderMon();
}
function renderMon() {
  const m = S.mon; if (!m) { $('#monHint').textContent = ''; return; }
  const tm = hhmm(new Date(m.lastRun || Date.now()));
  $('#monHint').innerHTML = m.status === 'need_login' ? '<span class="chip c-red">' + t('商城已退出登录，新品监控暂停（{0}）。请在店里电脑上重新登录 EBISU 商城。', tm) + '</span>' : t('最近一次检查：{0}', tm);
}
function renderNew() {
  const L = S.newItems.filter(x => !S.newKind || x.kind === S.newKind);
  $('#newList').innerHTML = L.length ? L.map(x => {
    const d = new Date(Number(x.first_seen)); const inStore = S.catalog.has(String(x.b));
    return '<li data-b="' + esc(x.b) + '"><div class="thumb">' + imgTag(x.b, 120) + '</div><div class="t"><div class="a">' + (x.is_new ? '<span class="tag newtag">' + t('新') + '</span> ' : '') + esc(x.name) + '</div><div class="b">' + esc(x.b) + ' · ' + (x.section === 'preview' ? t('预告') : t('上架')) + ' · ' + hhmm(d) + (inStore ? ' · ' + t('店里已有') : '') + '</div></div><div class="n">' + (x.price ? t('批发 {0}', money(x.price)) : '') + (x.msrp && x.msrp < 900 ? '<br><span class="muted" style="font-weight:400;font-size:12px">' + t('零售 {0}', money(x.msrp)) + '</span>' : '') + '</div></li>';
  }).join('') : '<li class="empty">' + t('暂时没有新品记录') + '</li>';
}

/* ======================= sync (paste from the store computer) ======================= */
async function handleSync(text) {
  const st = $('#syncStatus');
  let data; try { data = JSON.parse(text); } catch (e) { st.textContent = t('粘贴的内容不是同步数据。'); return; }
  try {
    if (data.kind === 'ebisu-catalog') {
      const F = data.fields, ix = {}; F.forEach((f, i) => ix[f] = i);
      const at = data.at || Date.now();
      const rows = data.rows.map(r => ({ b: String(r[ix.b]), cn: r[ix.cn] || '', n: r[ix.n] || '', cat: r[ix.cat] || '', st: num(r[ix.st]), p: num(r[ix.p]), s7: num(r[ix.s7]), s30: num(r[ix.s30]), synced_at: at }));
      const seen = new Set(), uniq = rows.filter(r => r.b && !seen.has(r.b) && seen.add(r.b));
      for (let i = 0; i < uniq.length; i += 1000) {
        st.textContent = t('同步中… {0}/{1}', Math.min(i + 1000, uniq.length).toLocaleString(), uniq.length.toLocaleString());
        const { error } = await S.sb.from('products').upsert(uniq.slice(i, i + 1000), { onConflict: 'b' });
        if (error) throw error;
      }
      await S.sb.from('products').delete().lt('synced_at', at);
      await S.sb.from('meta').upsert({ key: 'catalog', value: { syncedAt: at, count: uniq.length }, updated_at: new Date().toISOString() });
      st.textContent = t('同步完成：{0} 个商品。', uniq.length.toLocaleString());
      document.body.dataset.lastSync = 'catalog:' + at + ':' + uniq.length;
      await loadCatalog(true);
    } else if (data.kind === 'ebisu-newitems') {
      const items = (data.items || []).filter(x => x && x.b);
      const { data: existing } = await S.sb.from('new_items').select('b,first_seen,is_new').in('b', items.map(x => String(x.b)));
      const ex = new Map((existing || []).map(r => [r.b, r]));
      const rows = items.map(it => { const old = ex.get(String(it.b)); return { b: String(it.b), name: String(it.name || '').slice(0, 200), price: num(it.price), msrp: num(it.msrp), section: it.section === 'preview' ? 'preview' : 'new', kind: ['figure', 'beauty'].includes(it.kind) ? it.kind : 'other', first_seen: old ? old.first_seen : Date.now(), is_new: old ? old.is_new || !!it.isNew : !!it.isNew }; });
      if (rows.length) { const { error } = await S.sb.from('new_items').upsert(rows, { onConflict: 'b' }); if (error) throw error; }
      const mon = { status: 'ok', lastRun: Date.now(), lastCount: rows.length };
      await S.sb.from('meta').upsert({ key: 'monitor', value: mon, updated_at: new Date().toISOString() });
      st.textContent = t('新品已更新：{0} 个。', rows.length);
      document.body.dataset.lastSync = 'newitems:' + mon.lastRun + ':' + rows.length;
      await loadNew();
    } else if (data.kind === 'ebisu-monitor') {
      // status update only (e.g. the wholesale site logged out)
      const mon = Object.assign({ lastRun: Date.now() }, data.value || {});
      await S.sb.from('meta').upsert({ key: 'monitor', value: mon, updated_at: new Date().toISOString() });
      document.body.dataset.lastSync = 'monitor:' + mon.lastRun;
      await loadNew();
    } else { st.textContent = t('粘贴的内容不是同步数据。'); }
  } catch (e) { st.textContent = t('同步失败：{0}', (e && (e.message || e.code)) || e); document.body.dataset.lastSync = 'error'; }
}

/* ======================= views & events ======================= */
function setView(v) {
  S.view = v;
  $$('nav button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  ['scan', 'cmp', 'ord', 'new'].forEach(x => $('#v-' + x).classList.toggle('hidden', x !== v));
  renderAll(); window.scrollTo(0, 0); if (v === 'scan') focusScan();
}
function renderAll() {
  if (!S.sb) return;
  renderKpi();
  if (S.view === 'scan') { renderRecent(); if (S.shown) showProduct(S.shown, false); }
  if (S.view === 'cmp') renderCmp();
  if (S.view === 'ord') renderOrd();
  if (S.view === 'new') renderNew();
}
function setZone(z) {
  S.zone = z; try { localStorage.setItem('eb_zone', z); } catch (e) {}
  $$('#zoneSeg button').forEach(b => b.classList.toggle('on', b.dataset.z === z)); focusScan();
}
let kbMode = false;
function renderKbHint() {
  $('#scanHint').textContent = kbMode ? t('手动输入模式：输入条码后按“前往”。') : t('扫码枪模式：键盘不会弹出，扫完自动录入。');
  $('#kbToggle').textContent = kbMode ? t('切回扫码枪') : t('手动输入');
}
function focusScan() { if (S.view === 'scan' && !$('.sheet.on') && !$('#cam.on') && !$('#app').classList.contains('hidden')) $('#scanInput').focus({ preventScroll: true }); }
function submitScan() { const v = $('#scanInput').value; $('#scanInput').value = ''; if (v.trim()) onScan(v); }
function jumpTo(b) { setView('scan'); showProduct(b, true); }

function bindEvents() {
  $('#nav').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setView(b.dataset.v); });
  $('#zoneSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setZone(b.dataset.z); });
  $('#scanForm').addEventListener('submit', e => { e.preventDefault(); submitScan(); });
  $('#scanInput').addEventListener('keydown', e => { if (e.key === 'Enter' || e.keyCode === 13 || (e.key === 'Tab' && $('#scanInput').value.trim())) { e.preventDefault(); submitScan(); } });
  $('#kbToggle').addEventListener('click', e => { e.preventDefault(); kbMode = !kbMode; $('#scanInput').setAttribute('inputmode', kbMode ? 'text' : 'none'); renderKbHint(); $('#scanInput').blur(); setTimeout(focusScan, 50); });
  $('#btnCam').addEventListener('click', openCamera);
  $('#camClose').addEventListener('click', () => { closeCamera(); focusScan(); });
  $('#recent').addEventListener('click', e => { const u = e.target.closest('[data-undo]'); if (u) { undo(+u.dataset.undo); return; } const li = e.target.closest('li[data-b]'); if (li) showProduct(li.dataset.b, true); });
  $('#cmpGroups').addEventListener('toggle', e => { const d = e.target; if (d.tagName !== 'DETAILS') return; d.open ? cmpOpen.add(d.dataset.g) : cmpOpen.delete(d.dataset.g); }, true);
  $('#cmpGroups').addEventListener('click', e => { const c = e.target.closest('[data-copy]'); if (c) { e.preventDefault(); copyText(listText(S.cmpGroups[c.dataset.copy] || [])); return; } const li = e.target.closest('li[data-b]'); if (li) jumpTo(li.dataset.b); });
  ['#ordList', '#newList'].forEach(s => $(s).addEventListener('click', e => { const li = e.target.closest('li[data-b]'); if (li) jumpTo(li.dataset.b); }));
  ['#cmpCat', '#cmpQ'].forEach(s => $(s).addEventListener('input', renderCmp));
  ['#ordDays', '#ordCat'].forEach(s => $(s).addEventListener('input', renderOrd));
  $('#ordCopy').addEventListener('click', () => {
    const L = calcOrder(); if (!L.length) { toast(t('没有需要补的商品')); return; }
    const head = t('Ebisu 叫货单 {0}（备货 {1} 天{2}）', new Date().toLocaleDateString(), $('#ordDays').value, $('#ordCat').value ? ' · ' + $('#ordCat').value : '') + '\n' + t('品名\t条码\t建议数量\t现有库存\t近7天\t近30天') + '\n';
    copyText(head + L.map(x => pname(x.p) + '\t' + x.b + '\t' + x.need + '\t' + num(x.p.st) + '\t' + num(x.p.s7) + '\t' + num(x.p.s30)).join('\n'));
  });
  $('#newSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.newKind = b.dataset.k; $$('#newSeg button').forEach(x => x.classList.toggle('on', x === b)); renderNew(); });
  $('#btnLang').addEventListener('click', () => { setLang(LANG === 'en' ? 'zh' : 'en'); focusScan(); });
  $$('.langlink').forEach(a => a.addEventListener('click', e => { e.preventDefault(); setLang(LANG === 'en' ? 'zh' : 'en'); }));
  $('#btnSettings').addEventListener('click', () => $('#settings').classList.add('on'));
  $$('[data-close]').forEach(b => b.addEventListener('click', () => { b.closest('.sheet').classList.remove('on'); focusScan(); }));
  $('#settings').addEventListener('click', e => { if (e.target.id === 'settings') { e.target.classList.remove('on'); focusScan(); } });
  $('#btnReload').addEventListener('click', () => { loadCatalog(true); $('#settings').classList.remove('on'); });
  $('#btnNewRound').addEventListener('click', async () => {
    const ok = await confirmBox(t('新建盘点批次？'), t('前场和后仓的扫描记录会从零开始。')); if (!ok) return;
    const btn = $('#btnNewRound'); btn.disabled = true; btn.textContent = t('创建中…');
    try { await newRound($('#roundNameInput').value.trim()); $('#roundNameInput').value = ''; toast(t('新批次已创建')); $('#settings').classList.remove('on'); }
    catch (e) { toast(t('创建失败')); }
    btn.disabled = false; btn.textContent = t('新建批次');
  });
  $('#btnLogout').addEventListener('click', async () => { await S.sb.auth.signOut(); location.reload(); });
  // sync data can be pasted anywhere on the page
  document.addEventListener('paste', e => {
    const text = (e.clipboardData || window.clipboardData).getData('text') || '';
    if (!/^\s*\{"kind":"ebisu-/.test(text.slice(0, 40))) return;
    e.preventDefault(); $('#scanInput').value = '';
    $('#settings').classList.add('on'); $('#pasteBox').textContent = Math.round(text.length / 1024) + ' KB';
    handleSync(text);
  }, true);
  // a hardware scanner types into the page: keep the scan box focused
  document.addEventListener('keydown', e => {
    if (S.view !== 'scan' || $('.sheet.on') || $('#cam.on')) return;
    const a = document.activeElement; if (a && (a.tagName === 'INPUT' || a.tagName === 'SELECT' || a.isContentEditable)) return;
    if (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey) $('#scanInput').focus();
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.session) { loadRound(); flushQueue(); } else if (document.visibilityState === 'hidden') closeCamera(); });
  window.addEventListener('online', flushQueue);
}

/* ======================= login & boot ======================= */
async function showApp() {
  $('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
  $('#acctInfo').textContent = (S.session && S.session.user && S.session.user.email) || '';
  setZone(S.zone); renderKbHint(); updateHeader(); renderAll();
  await loadCatalog(false);
  await loadRound();
  loadNew();
}
function showLogin(msg) {
  $('#app').classList.add('hidden'); $('#login').classList.remove('hidden');
  $('#loginMsg').textContent = msg || '';
}
async function boot() {
  applyStatic(); bindEvents(); renderKbHint();
  $('#verInfo').textContent = 'v' + APP_VERSION;
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  S.sb = initSupabase();
  if (!S.sb) { showLogin(t('还没有设置好服务器')); $('#loginBtn').disabled = true; return; }
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault(); const btn = $('#loginBtn'); btn.disabled = true; btn.textContent = t('登录中…');
    const { data, error } = await S.sb.auth.signInWithPassword({ email: $('#loginEmail').value.trim(), password: $('#loginPass').value });
    btn.disabled = false; btn.textContent = t('登录');
    if (error) { $('#loginMsg').textContent = t('账号或密码不对'); return; }
    S.session = data.session; $('#loginPass').value = ''; showApp();
  });
  const { data } = await S.sb.auth.getSession();
  S.session = data.session;
  S.sb.auth.onAuthStateChange((ev, session) => { S.session = session; if (ev === 'SIGNED_OUT') showLogin(); });
  if (S.session) showApp(); else showLogin();
}
boot();
})();
