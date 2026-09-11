const CART_KEY="bj_cart";

const fmt=n=>Number(n).toLocaleString("en-IN");
function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)||"[]")}catch(e){return[]}}
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c));updateCartUI()}
function addToCart(id,size="M",qty=1){
  const c=getCart(), x=c.find(i=>i.id===id&&i.size===size);
  if(x)x.qty+=qty; else c.push({id,size,qty});
  saveCart(c);
}
function removeFromCart(id,size){saveCart(getCart().filter(i=>!(i.id===id&&i.size===size)))}
function changeQty(id,size,delta){
  const c=getCart(),x=c.find(i=>i.id===id&&i.size===size);
  if(x){x.qty+=delta;if(x.qty<=0)return removeFromCart(id,size);saveCart(c)}
}
function renderProducts(target,list){
  const el=document.getElementById(target);if(!el)return;
  el.innerHTML=list.map(p=>`
  <article class="product-card">
    <a href="product.html?id=${p.id}" class="product-image">
      <img src="${p.image}" alt="${p.name}">
      <span>VIEW</span>
    </a>
    <div class="product-meta">
      <div><p class="product-type">${p.type}</p><h3><a href="product.html?id=${p.id}">${p.name}</a></h3></div>
      <strong>₹${fmt(p.price)}</strong>
    </div>
    <button class="quick-add" data-quick="${p.id}">QUICK ADD +</button>
  </article>`).join("");
  el.querySelectorAll("[data-quick]").forEach(b=>b.onclick=()=>{
    const p=products.find(x=>x.id===b.dataset.quick);
    addToCart(p.id,p.sizes[Math.min(1,p.sizes.length-1)],1);openCart();
  });
}
function updateCartUI(){
  const c=getCart();
  const count=c.reduce((a,i)=>a+Number(i.qty||0),0);
  document.querySelectorAll(".cart-count").forEach(x=>x.textContent=count);

  const items=document.querySelector("[data-cart-items]");
  const totalEl=document.querySelector("[data-cart-total]");
  if(!items)return;

  let total=0;
  if(!c.length){
    items.innerHTML=`<div class="empty-cart"><div>◌</div><p>Your bag is empty.</p><a href="shop.html">EXPLORE THE DROP →</a></div>`;
  }else{
    items.innerHTML=c.map(i=>{
      const p=products.find(x=>x.id===i.id);
      if(!p)return "";
      const line=p.price*i.qty; total+=line;
      return `<div class="cart-item">
        <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
        <div class="cart-item-info">
          <a href="product.html?id=${p.id}"><strong>${p.name}</strong></a>
          <small>Size: <b>${i.size}</b></small>
          <div class="mini-qty">
            <button onclick="changeQty('${i.id}','${i.size}',-1)">−</button>
            <span>${i.qty}</span>
            <button onclick="changeQty('${i.id}','${i.size}',1)">+</button>
          </div>
        </div>
        <div class="cart-item-right"><b>₹${fmt(line)}</b><button onclick="removeFromCart('${i.id}','${i.size}')">Remove</button></div>
      </div>`;
    }).join("");
  }
  if(totalEl)totalEl.textContent="₹"+fmt(total);
  document.querySelectorAll("[data-checkout-total]").forEach(x=>x.textContent="₹"+fmt(total));
}
function openCart(){document.querySelector("[data-cart-drawer]")?.classList.add("open");document.querySelector("[data-overlay]")?.classList.add("show");updateCartUI()}
function closeCart(){document.querySelector("[data-cart-drawer]")?.classList.remove("open");document.querySelector("[data-overlay]")?.classList.remove("show")}

document.addEventListener("DOMContentLoaded",()=>{
  updateCartUI();
  document.querySelectorAll("[data-cart-open]").forEach(x=>x.onclick=openCart);
  document.querySelectorAll("[data-cart-close]").forEach(x=>x.onclick=closeCart);
  document.querySelector("[data-overlay]")?.addEventListener("click",closeCart);
  document.querySelectorAll("[data-menu-open]").forEach(x=>x.onclick=()=>document.querySelector("[data-mobile-menu]")?.classList.add("open"));
  document.querySelectorAll("[data-menu-close]").forEach(x=>x.onclick=()=>document.querySelector("[data-mobile-menu]")?.classList.remove("open"));
  document.querySelectorAll("[data-open-search]").forEach(x=>x.onclick=()=>document.querySelector("[data-search-modal]")?.classList.add("open"));
  document.querySelector("[data-search-close]")?.addEventListener("click",()=>document.querySelector("[data-search-modal]")?.classList.remove("open"));
  document.querySelector("[data-newsletter]")?.addEventListener("submit",e=>{
    e.preventDefault();document.querySelector("[data-newsletter-msg]").textContent="You're on the list. Welcome to the pack.";
  });
});
