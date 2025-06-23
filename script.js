const puffWaffles = [
  { name: "Dark Fantasy", price: 39, image: "darkpuff.jpg" },
  { name: "Milk Fantasy", price: 39, image: "waffle2.avif" },
  { name: "White Fantasy", price: 39, image: "whitepuff.jpg" },
  { name: "Dark & Milk", price: 45, image: "waffle3.avif" },
  { name: "Dark & White", price: 45, image: "dark and white.jpg" },
  { name: "Triple Chocolate", price: 55, image: "waffle 1.jpg" },
  { name: "Crunchy Oreo", price: 55, image: "waffle4.webp" },
  { name: "Crunchy KitKat", price: 55, image: "kitkatepuff.jpg" },
  { name: "Gems with Milk", price: 60, image: "waffle5.webp" },
  { name: "Gems with Dark", price: 60, image: "waffle 1.jpg" }
];

const stickWaffles = [
  { name: "Dark Fantasy", price: 69, image: "darkstick.jpg" },
  { name: "Milk Fantasy", price: 69, image: "waffle 1.jpg" },
  { name: "White Fantasy", price: 69, image: "waffle stick.jpg" },
  { name: "Dark & Milk", price: 75, image: "waffle 1.jpg" },
  { name: "Dark & White", price: 75, image: "waffle3.avif" },
  { name: "Triple Chocolate", price: 85, image: "waffle5.webp" },
  { name: "Crunchy Oreo", price: 85, image: "waffle stick.jpg" },
  { name: "Crunchy KitKat", price: 85, image: "waffle 1.jpg" },
  { name: "Gems with Milk", price: 90, image: "waffle1.avif" },
  { name: "Gems with Dark", price: 90, image: "darkstick.jpg" }
];

const specialItems = [
  { name: "Dry Fruits", price: 70, image: "dry fruits-puff.jpg" },
  { name: "Special Naughty Nutella", price: 120, image: "waffle stick.jpg" },
  { name: "Almond Cake", price: 220, image: "waffle5.webp" }
];

let cart = [];
let favorites = [];
let modalItem = null;

function createCard(item, category, index) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.style.setProperty('--index', index);
  div.onclick = () => openModal(item);
  const isLiked = favorites.some(f => f.name === item.name);

  div.innerHTML = `
    <button class="like-btn ${isLiked ? 'liked' : ''}" 
      onclick="event.stopPropagation(); toggleFavorite(${JSON.stringify(item).replace(/"/g, '&quot;')})">
      ❤️
    </button>
    <img src="${item.image}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>₹${item.price}</p>
  `;

  document.querySelector(`#${category} .item-grid`).appendChild(div);
}

function renderItems() {
  document.querySelectorAll('.item-grid').forEach(grid => grid.innerHTML = '');
  puffWaffles.forEach((item, index) => createCard(item, 'puff-waffles', index));
  stickWaffles.forEach((item, index) => createCard(item, 'stick-waffles', index));
  specialItems.forEach((item, index) => createCard(item, 'special-items', index));
  renderFavorites();
}

function renderFavorites() {
  const favGrid = document.getElementById('favorite-grid');
  favGrid.innerHTML = '';
  favorites.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.onclick = () => openModal(item);
    div.innerHTML = `
      <button class="like-btn liked" 
        onclick="event.stopPropagation(); toggleFavorite(${JSON.stringify(item).replace(/"/g, '&quot;')})">
        ❤️
      </button>
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
    `;
    favGrid.appendChild(div);
  });
}

function toggleFavorite(item) {
  const index = favorites.findIndex(f => f.name === item.name);
  if (index >= 0) {
    favorites.splice(index, 1);
    showPopup(`${item.name} removed from favorites`);
  } else {
    favorites.push(item);
    showPopup(`${item.name} added to favorites`);
  }
  renderItems();
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

function showPopup(message) {
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  popupMessage.textContent = message;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 3000);
}

function openModal(item) {
  modalItem = item;
  document.getElementById('modal-img').src = item.image;
  document.getElementById('modal-title').textContent = item.name;
  document.getElementById('modal-price').textContent = `Price: ₹${item.price}`;
  document.getElementById('modal-qty').value = 1;
  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function addModalToCart() {
  const qty = parseInt(document.getElementById('modal-qty').value);
  if (modalItem && qty > 0) {
    for (let i = 0; i < qty; i++) {
      cart.push({ name: modalItem.name, price: modalItem.price });
    }
    showPopup(`${modalItem.name} x${qty} added to cart`);
    renderCart();
    closeModal();
  }
}

function renderCart() {
  const list = document.getElementById('cart-list');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ₹${item.price}`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeFromCart(i);
    li.appendChild(removeBtn);
    list.appendChild(li);
    total += item.price;
  });
  document.getElementById('total').textContent = `Total: ₹${total}`;
  document.getElementById('cart-count').textContent = cart.length;
}

function removeFromCart(index) {
  const item = cart[index];
  cart.splice(index, 1);
  showPopup(`${item.name} removed from cart`);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
  showPopup("Cart cleared!");
}

function scrollToCart() {
  document.querySelector(".cart-section").scrollIntoView({ behavior: "smooth" });
}

document.getElementById('search').addEventListener('input', function () {
  const term = this.value.toLowerCase();
  document.querySelectorAll('.item-card').forEach(card => {
    const name = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = name.includes(term) ? '' : 'none';
  });
});

renderItems();
