/* Furugi: static frontend logic (no backend needed yet).
   Orders are sent to WhatsApp for now. A real backend replaces that step later. */

const CONFIG = {
  shopName: "Furugi",          // placeholder name, change freely
  whatsapp: "97517000000",     // your number, country code first, no + or spaces
  currency: "Nu.",
  location: "Thimphu, Bhutan"
};

/* ---------- helpers ---------- */
const fmt = (n) => `${CONFIG.currency} ${n.toLocaleString("en-US")}`;
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- cart (localStorage, with in-memory fallback) ---------- */
let memCart = [];
function getCart() {
  let ids = memCart;
  try { ids = JSON.parse(localStorage.getItem("furugi-cart") || "[]"); } catch (e) {}
  return ids.filter((id) => byId(id) && !byId(id).sold);
}
function setCart(ids) {
  memCart = ids;
  try { localStorage.setItem("furugi-cart", JSON.stringify(ids)); } catch (e) {}
  updateCartCount();
}
function addToCart(id) { const c = getCart(); if (!c.includes(id)) setCart([...c, id]); }
function removeFromCart(id) { setCart(getCart().filter((x) => x !== id)); }
function updateCartCount() { const el = $("#cart-count"); if (el) el.textContent = getCart().length; }

/* ---------- shared header and footer ---------- */
function renderChrome() {
  const page = document.body.dataset.page;
  const cur = (name) => (page === name ? ' aria-current="page"' : "");
  $("#site-header").innerHTML = `
    <header class="site-header"><div class="wrap">
      <a class="brand" href="index.html"><span class="seal" aria-hidden="true">古着</span>${esc(CONFIG.shopName)}</a>
      <nav class="nav" aria-label="Main">
        <a href="shop.html"${cur("shop")}>Shop</a>
        <a href="about.html"${cur("about")}>How it works</a>
        <a href="cart.html"${cur("cart")}>Cart<span class="cart-count" id="cart-count">0</span></a>
      </nav>
    </div></header>`;
  $("#site-footer").innerHTML = `
    <footer class="site-footer"><div class="wrap">
      <div><h3>${esc(CONFIG.shopName)}</h3><p>Secondhand clothes from Japan, sold in ${esc(CONFIG.location)}.</p></div>
      <div><h3>Order</h3><p>Message us on <a href="https://wa.me/${CONFIG.whatsapp}">WhatsApp</a>. Delivery in Thimphu, pickup, or courier to other dzongkhags.</p></div>
      <div><h3>Pay</h3><p>Cash on delivery, mBoB, mPay or bank transfer.</p></div>
    </div></footer>`;
  updateCartCount();
}

/* ---------- templates ---------- */
function tagHTML(p) {
  return `<li><a class="tag" href="product.html?id=${p.id}">
    <span class="tag-hole"></span>
    <span class="tag-no">${p.id}</span>
    <strong>${esc(p.name)}</strong>
    <span class="tag-meta">Size ${esc(p.size)}, grade ${p.grade}</span>
    <span class="tag-price">${fmt(p.price)}</span></a></li>`;
}
function cardHTML(p) {
  const img = p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : "";
  return `<li><a class="card" href="product.html?id=${p.id}">
    <div class="card-img" style="--swatch:${p.color}">${img}<span class="tag-no">${p.id}</span>${p.sold ? '<span class="stamp">Sold</span>' : ""}</div>
    <h3>${esc(p.name)}</h3>
    <p class="meta">Size ${esc(p.size)}, grade ${p.grade}</p>
    <p class="price">${fmt(p.price)}</p></a></li>`;
}
const categories = () => [...new Set(PRODUCTS.map((p) => p.cat))];

/* ---------- pages ---------- */
function initHome() {
  const live = PRODUCTS.filter((p) => !p.sold).sort((a, b) => b.id.localeCompare(a.id));
  $("#rail").innerHTML = live.slice(0, 6).map(tagHTML).join("");
  $("#cats").innerHTML = categories().map((c) => {
    const n = PRODUCTS.filter((p) => p.cat === c && !p.sold).length;
    return `<li><a href="shop.html?cat=${encodeURIComponent(c)}">${esc(c)}<span>${n} in stock</span></a></li>`;
  }).join("");
  $("#latest").innerHTML = live.slice(0, 8).map(cardHTML).join("");
}

function initShop() {
  const params = new URLSearchParams(location.search);
  const catSel = $("#f-cat"), sizeSel = $("#f-size"), sortSel = $("#f-sort"), stockSel = $("#f-stock");
  catSel.innerHTML = '<option value="">All</option>' + categories().map((c) => `<option>${esc(c)}</option>`).join("");
  const sizes = [...new Set(PRODUCTS.map((p) => p.size))];
  sizeSel.innerHTML = '<option value="">All</option>' + sizes.map((s) => `<option>${esc(s)}</option>`).join("");
  if (params.get("cat")) catSel.value = params.get("cat");

  function render() {
    let list = PRODUCTS.filter((p) =>
      (!catSel.value || p.cat === catSel.value) &&
      (!sizeSel.value || p.size === sizeSel.value) &&
      (stockSel.value === "all" || !p.sold));
    if (sortSel.value === "low") list.sort((a, b) => a.price - b.price);
    else if (sortSel.value === "high") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.id.localeCompare(a.id));
    $("#count").textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
    $("#grid").innerHTML = list.map(cardHTML).join("");
    $("#empty").hidden = list.length > 0;
  }
  [catSel, sizeSel, sortSel, stockSel].forEach((el) => el.addEventListener("change", render));
  render();
}

function initProduct() {
  const p = byId(new URLSearchParams(location.search).get("id"));
  const root = $("#product");
  if (!p) {
    root.innerHTML = '<div class="empty"><h1>Piece not found</h1><p>This item number does not exist. <a class="link-plain" href="shop.html">Back to the shop</a>.</p></div>';
    return;
  }
  document.title = `${p.name} | ${CONFIG.shopName}`;
  const img = p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">` : "";
  const measures = [
    p.chest ? `<dt>Chest</dt><dd>${p.chest * 2} cm around (${p.chest} cm flat, armpit to armpit)</dd>` : "",
    `<dt>Length</dt><dd>${p.length} cm</dd>`
  ].join("");
  const inCart = getCart().includes(p.id);
  const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Hi, I have a question about ${p.id} (${p.name}).`)}`;
  root.innerHTML = `
    <div class="card-img" style="--swatch:${p.color}">${img}<span class="tag-no">${p.id}</span>${p.sold ? '<span class="stamp">Sold</span>' : ""}</div>
    <div class="product-info">
      <h1>${esc(p.name)}</h1>
      <p class="product-price">${fmt(p.price)}</p>
      <dl class="specs">
        <dt>Size</dt><dd>${esc(p.size)}</dd>
        <dt>Grade</dt><dd>${p.grade} (${p.grade === "A" ? "like new" : "visible wear, listed below"})</dd>
        ${measures}
      </dl>
      <p><strong>Condition:</strong> ${esc(p.note)}</p>
      <p class="note">Japanese sizes run small. Compare these measurements with a piece you already own.</p>
      <div class="hero-actions">
        <button class="btn" id="add" ${p.sold || inCart ? "disabled" : ""}>${p.sold ? "Sold" : inCart ? "In your cart" : "Add to cart"}</button>
        <a class="btn btn-ghost" href="${wa}">Ask about this piece</a>
      </div>
      <p class="note">Each piece is one of one. The first confirmed order gets it.</p>
    </div>`;
  const add = $("#add");
  add.addEventListener("click", () => { addToCart(p.id); add.disabled = true; add.textContent = "In your cart"; });
}

function initCart() {
  const list = $("#cart-list"), form = $("#order-form");
  function render() {
    const items = getCart().map(byId);
    const total = items.reduce((s, p) => s + p.price, 0);
    list.innerHTML = items.map((p) => `
      <li>
        <div class="thumb" style="--swatch:${p.color}"></div>
        <div><h3>${esc(p.name)}</h3><p class="note">${p.id}, size ${esc(p.size)}, grade ${p.grade}</p><p>${fmt(p.price)}</p></div>
        <button type="button" data-remove="${p.id}">Remove</button>
      </li>`).join("");
    $("#cart-empty").hidden = items.length > 0;
    $("#cart-body").hidden = items.length === 0;
    $("#total").textContent = fmt(total);
  }
  list.addEventListener("click", (e) => {
    const id = e.target.dataset.remove;
    if (id) { removeFromCart(id); render(); }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const items = getCart().map(byId);
    if (!items.length) return;
    const f = new FormData(form);
    const lines = items.map((p) => `- ${p.id} ${p.name} (size ${p.size}) ${fmt(p.price)}`);
    const total = items.reduce((s, p) => s + p.price, 0);
    const msg = [
      `Hi ${CONFIG.shopName}, I'd like to order:`, ...lines, `Total: ${fmt(total)}`, "",
      `Name: ${f.get("name")}`, `Phone: ${f.get("phone")}`,
      `Delivery: ${f.get("delivery")}`, `Address: ${f.get("address") || "-"}`,
      `Payment: ${f.get("payment")}`
    ].join("\n");
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });
  render();
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  const init = { home: initHome, shop: initShop, product: initProduct, cart: initCart }[document.body.dataset.page];
  if (init) init();
});
