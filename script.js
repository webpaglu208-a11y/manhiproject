const slides = document.querySelectorAll('.slide');
const nextSlideBtn = document.getElementById('nextSlide');
const prevSlideBtn = document.getElementById('prevSlide');
let activeSlide = 0;

const setSlide = (index) => {
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
};

const nextSlide = () => {
  activeSlide = (activeSlide + 1) % slides.length;
  setSlide(activeSlide);
};

const previousSlide = () => {
  activeSlide = (activeSlide - 1 + slides.length) % slides.length;
  setSlide(activeSlide);
};

nextSlideBtn?.addEventListener('click', nextSlide);
prevSlideBtn?.addEventListener('click', previousSlide);
setInterval(nextSlide, 5000);

const cartSidebar = document.getElementById('cartSidebar');
const cartTrigger = document.getElementById('cartTrigger');
const closeCart = document.getElementById('closeCart');
const cartItemsRoot = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const addCartButtons = document.querySelectorAll('.add-cart');

const CART_KEY = 'superhero-cart-v1';
const readCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

const renderCart = () => {
  const cart = readCart();
  if (cartCount) {
    cartCount.textContent = cart.length;
  }

  if (cartItemsRoot) {
    cartItemsRoot.innerHTML = cart
      .map(
        (item, index) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <p>$${Number(item.price).toFixed(2)}</p>
        </div>
        <button data-remove="${index}" aria-label="remove item">Remove</button>
      </div>
    `
      )
      .join('');

    if (!cart.length) {
      cartItemsRoot.innerHTML = '<p>Your cart is empty.</p>';
    }
  }

  if (cartTotal) {
    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
};

const openCart = () => {
  cartSidebar?.classList.add('open');
  cartSidebar?.setAttribute('aria-hidden', 'false');
};

const closeCartPanel = () => {
  cartSidebar?.classList.remove('open');
  cartSidebar?.setAttribute('aria-hidden', 'true');
};

addCartButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const card = event.currentTarget.closest('.product-card');
    if (!card) return;

    const updated = [
      ...readCart(),
      {
        name: card.dataset.name,
        price: card.dataset.price,
      },
    ];
    saveCart(updated);
    renderCart();
    openCart();
  });
});

cartTrigger?.addEventListener('click', openCart);
closeCart?.addEventListener('click', closeCartPanel);

cartItemsRoot?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-remove]');
  if (!button) return;

  const index = Number(button.dataset.remove);
  const cart = readCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
});

const checkoutItems = document.getElementById('checkoutItems');
const checkoutTotal = document.getElementById('checkoutTotal');

if (checkoutItems && checkoutTotal) {
  const cart = readCart();
  checkoutItems.innerHTML = cart
    .map(
      (item) => `<li><span>${item.name}</span><strong>$${Number(item.price).toFixed(2)}</strong></li>`
    )
    .join('');

  if (!cart.length) {
    checkoutItems.innerHTML = '<li>Your cart is empty. Add products from the homepage.</li>';
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

if (typeof gsap !== 'undefined') {
  gsap.from('.section', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: undefined,
  });

  gsap.to('#productScroller', {
    x: -120,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

renderCart();
