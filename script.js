const puffWaffles = [
  { name: "Dark Fantasy", price: 39, image: "waffle 1.jpg" },
  { name: "Milk Fantasy", price: 39, image: "waffle 1.jpg" },
  { name: "White Fantasy", price: 39, image: "waffle 1.jpg" },
  { name: "Dark & Milk", price: 45, image: "waffle 1.jpg" },
  { name: "Dark & White", price: 45, image: "waffle 1.jpg" },
  { name: "Triple Chocolate", price: 55, image: "waffle 1.jpg" },
  { name: "Crunchy Oreo", price: 55, image: "waffle 1.jpg" },
  { name: "Crunchy KitKat", price: 55, image: "waffle 1.jpg" },
  { name: "Gems with Milk", price: 60, image: "waffle 1.jpg" },
  { name: "Gems with Dark", price: 60, image: "waffle 1.jpg" }
];

const stickWaffles = [
  { name: "Dark Fantasy", price: 69, image: "waffle 1.jpg" },
  { name: "Milk Fantasy", price: 69, image: "waffle 1.jpg" },
  { name: "White Fantasy", price: 69, image: "waffle 1.jpg" },
  { name: "Dark & Milk", price: 75, image: "waffle 1.jpg" },
  { name: "Dark & White", price: 75, image: "waffle 1.jpg" },
  { name: "Triple Chocolate", price: 85, image: "waffle 1.jpg" },
  { name: "Crunchy Oreo", price: 85, image: "waffle 1.jpg" },
  { name: "Crunchy KitKat", price: 85, image: "waffle 1.jpg" },
  { name: "Gems with Milk", price: 90, image: "waffle 1.jpg" },
  { name: "Gems with Dark", price: 90, image: "waffle 1.jpg" }
];

const specialItems = [
  { name: "Dry Fruits", price: 70, image: "waffle 1.jpg" },
  { name: "Special Naughty Nutella", price: 120, image: "waffle 1.jpg" },
  { name: "Almond Cake", price: 180, image: "waffle 1.jpg" }
];

let cart = [];

function createCard(item, category, index) {
  const div = document.createElement('div');
  div.className = 'item-card';
  div.style.setProperty('--index', index);
  div.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>₹${item.price}</p>
    <button onclick="addToCart('${item.name}', ${item.price}, this)">Add to Cart</button>
  `;
  document.querySelector(`#${category} .item-grid`).appendChild(div);
}

function renderItems() {
  puffWaffles.forEach((item, index) => createCard(item, 'puff-waffles', index));
  stickWaffles.forEach((item, index) => createCard(item, 'stick-waffles', index));
  specialItems.forEach((item, index) => createCard(item, 'special-items', index));
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
  document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

function showPopup(message, isError = false) {
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  popupMessage.textContent = message;
  popup.className = `popup ${isError ? 'error' : 'success'}`;
  popup.classList.add('show');
  setTimeout(() => {
    popup.classList.remove('show');
  }, 4000);
}

function addToCart(name, price, btn) {
  cart.push({ name, price });
  btn.classList.add('added-animation');
  setTimeout(() => btn.classList.remove('added-animation'), 500);
  showPopup(`${name} added to cart!`);
  renderCart();
}

function removeFromCart(index) {
  const itemName = cart[index]?.name || 'Item';
  cart.splice(index, 1);
  showPopup(`${itemName} removed from cart!`);
  renderCart();
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
  const upiID = "Q7576846709@ybl"; // Verify this is a valid merchant UPI ID
  const payBtn = document.getElementById('pay-btn');
  const fallbackUrl = encodeURIComponent('https://wafflewhizz.com'); // Replace with your actual website if available
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiID)}&pn=${encodeURIComponent('WaffleWhizz')}&am=${total}&cu=INR&url=${fallbackUrl}`;

  payBtn.href = upiLink;
  payBtn.onclick = (e) => {
    e.preventDefault();
    if (total <= 0) {
      showPopup('Your cart is empty. Add items to proceed.', true);
      return;
    }
    payBtn.classList.add('loading');
    showPopup('Initiating Payment...');
    try {
      setTimeout(() => {
        window.location.href = upiLink;
        setTimeout(() => {
          if (document.hasFocus()) {
            payBtn.classList.remove('loading');
            showPopup('No UPI app detected. Install PhonePe, Google Pay, or another UPI app.', true);
          }
        }, 2000);
      }, 500);
    } catch (error) {
      payBtn.classList.remove('loading');
      showPopup('Failed to initiate payment. Please try again or use the QR code.', true);
      console.error('Payment initiation error:', error);
    }
  };
}

renderItems();