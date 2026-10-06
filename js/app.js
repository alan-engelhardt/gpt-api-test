const API="/api";
const IMAGE_BASE="/images/webp/640";
const state={products:[],category:null,sort:"default",cart:JSON.parse(localStorage.getItem("nord-cart")||"[]")};
const $=s=>document.querySelector(s);
const grid=$("#productGrid"),categories=$("#categories"),status=$("#status"),sort=$("#sort");

async function getJson(url){const res=await fetch(url);if(!res.ok)throw new Error(`API-fejl ${res.status} på ${url}`);return res.json()}
function productName(p){return p.productdisplayname||p.name||"Produkt"}
function price(p){return Number(p.price)||0}
function image(p){return p.id?IMAGE_BASE+"/"+p.id+".webp":""}
function saveCart(){localStorage.setItem("nord-cart",JSON.stringify(state.cart));renderCart()}
function renderProducts(){
 let products=[...state.products];
 if(state.sort==="price-asc")products.sort((a,b)=>price(a)-price(b));
 if(state.sort==="price-desc")products.sort((a,b)=>price(b)-price(a));
 if(state.sort==="name")products.sort((a,b)=>productName(a).localeCompare(productName(b),"da"));
 grid.innerHTML=products.map(p=>`<article class="card">
 <a class="card-image" href="product.html?id=${p.id}"><img src="${image(p)}" alt="${productName(p)}"></a>
 <div class="card-info"><p class="card-brand">${p.brandname||""}</p><h3 class="card-title"><a href="product.html?id=${p.id}">${productName(p)}</a></h3>
 <span class="price">${price(p)} kr.</span>${p.discount?`<span class="discount">-${p.discount}%</span>`:""}</div></article>`).join("");
 status.textContent=products.length?`${products.length} produkter`:"Ingen produkter fundet";
}
function renderCategories(data){
 const list=Array.isArray(data)?data:(data.categories||data.data||[]);
 categories.innerHTML='<button class="category active" data-category="">Alle</button>'+list.map(c=>{
  const id=c.id??c.categoryid??c.category_id;
  const name=c.categoryname??c.category??c.name??c.title;
  return id!=null&&name?`<button class="category" data-category="${id}">${name}</button>`:"";
 }).join("");
}
async function loadProducts(category=""){
 state.category=category;
 try{status.textContent="Henter produkter…";const endpoint=category?`${API}/productlist/${category}?limit=20`:`${API}/productlist/1?limit=20`;state.products=await getJson(endpoint);renderProducts()}
 catch(e){console.error("Kunne ikke hente produkter:",e);status.textContent="Kunne ikke hente produkter fra API'et."}
}
categories.addEventListener("click",e=>{const btn=e.target.closest(".category");if(!btn)return;categories.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));btn.classList.add("active");loadProducts(btn.dataset.category)});
sort.addEventListener("change",e=>{state.sort=e.target.value;renderProducts()});

function renderCart(){
 const items=$("#cartItems");$("#cartCount").textContent=state.cart.reduce((n,i)=>n+i.qty,0);
 if(!state.cart.length){items.innerHTML="<p>Kurven er tom.</p>";$("#cartTotal").textContent="0 kr.";return}
 items.innerHTML=state.cart.map(i=>`<div class="cart-row"><img src="${i.image}" alt=""><div><h3>${i.name}</h3><div>${i.price} kr.</div><div class="qty"><button data-id="${i.id}" data-action="minus">−</button><span>${i.qty}</span><button data-id="${i.id}" data-action="plus">+</button></div></div><button class="remove" data-id="${i.id}" data-action="remove">Fjern</button></div>`).join("");
 $("#cartTotal").textContent=state.cart.reduce((n,i)=>n+i.price*i.qty,0)+" kr.";
}
function addToCart(p){const found=state.cart.find(i=>String(i.id)===String(p.id));if(found)found.qty++;else state.cart.push({id:p.id,name:productName(p),price:price(p),image:image(p),qty:1});saveCart()}
$("#cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(!b)return;const item=state.cart.find(i=>String(i.id)===String(b.dataset.id));if(!item)return;if(b.dataset.action==="plus")item.qty++;if(b.dataset.action==="minus")item.qty--;if(b.dataset.action==="remove"||item.qty<=0)state.cart=state.cart.filter(i=>i!==item);saveCart()});
function toggleCart(open){$("#cartDrawer").classList.toggle("open",open);$("#overlay").classList.toggle("show",open);$("#cartDrawer").setAttribute("aria-hidden",String(!open))}
$("#cartButton").addEventListener("click",()=>toggleCart(true));$("#closeCart").addEventListener("click",()=>toggleCart(false));$("#overlay").addEventListener("click",()=>toggleCart(false));$("#checkout").addEventListener("click",()=>alert("Checkout er ikke koblet til en betalingsløsning endnu."));
(async()=>{try{renderCart();const cats=await getJson(API+"/categories");renderCategories(cats);await loadProducts()}catch(e){console.error("API-fejl:",e);status.textContent="Kunne ikke hente data fra API'et."}})();