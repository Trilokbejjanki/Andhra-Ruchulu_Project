// ==================== HAMBURGER MENU ==================== //
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ==================== FORM SUBMISSION ==================== //
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        
        // Show success message
        alert(`Thank you ${name}! We received your message and will contact you at ${email} soon.`);
        contactForm.reset();
    });
}

// ==================== SCROLL ANIMATION ==================== //
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe menu items and gallery items
document.querySelectorAll('.menu-item, .gallery-item, .info-item').forEach(item => {
    observer.observe(item);
});

// ==================== SMOOTH SCROLL ACTIVE LINK ==================== //
const sections = document.querySelectorAll('section[id]');

const scrollSpy = () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#D2691E';
        }
    });
};

window.addEventListener('scroll', scrollSpy);

// ==================== SCROLL TO TOP BUTTON ==================== //
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '⬆️';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #D2691E, #FF6B35);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    z-index: 99;
    font-size: 24px;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 20px rgba(210, 105, 30, 0.4);
    transition: all 0.4s ease;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollToTopBtn.addEventListener('mouseover', () => {
    scrollToTopBtn.style.transform = 'translateY(-5px)';
});

scrollToTopBtn.addEventListener('mouseout', () => {
    scrollToTopBtn.style.transform = 'translateY(0)';
});

// ==================== BUTTON CLICK EFFECTS ==================== //
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes rippleEffect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== PAGE LOAD ANIMATION ==================== //
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ==================== SIMPLE CART & AUTH LOGIC (localStorage) ==================== //

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((s, i) => s + (i.qty || 1), 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = `(${count})`;
}

// Add to cart button handling
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    const itemEl = btn.closest('.gallery-item');
    if (!itemEl) return;

    const id = itemEl.dataset.id;
    const name = itemEl.dataset.name;
    const price = Number(itemEl.dataset.price || 0);

    const cart = getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    saveCart(cart);
    alert(`${name} added to cart`);
});

// Render cart page if present
function renderCartPage() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    const cart = getCart();
    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('cart-total').textContent = '₹0';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');
    let total = 0;
    cart.forEach(item => {
        const tr = document.createElement('tr');
        const subtotal = item.price * (item.qty || 1);
        total += subtotal;
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td><input type="number" min="1" value="${item.qty || 1}" data-id="${item.id}" class="cart-qty" style="width:60px"></td>
            <td>₹${subtotal}</td>
            <td><button class="btn remove-item" data-id="${item.id}">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });

    container.appendChild(table);
    document.getElementById('cart-total').textContent = `₹${total}`;
}

// handle qty change and remove
document.addEventListener('change', (e) => {
    if (!e.target.classList.contains('cart-qty')) return;
    const id = e.target.dataset.id;
    let val = Number(e.target.value || 1);
    if (val < 1) val = 1;
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty = val;
        saveCart(cart);
        renderCartPage();
    }
});

document.addEventListener('click', (e) => {
    const rem = e.target.closest('.remove-item');
    if (!rem) return;
    const id = rem.dataset.id;
    const cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
});

// Checkout (clear cart)
document.addEventListener('click', (e) => {
    if (!e.target.matches('#checkout-btn')) return;
    localStorage.removeItem('cart');
    updateCartCount();
    renderCartPage();
    alert('Thanks! Your order has been placed (mock).');
});

// Simple auth: signup/login using localStorage (mock)
function signupUser(email, password, name) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) return { ok: false, msg: 'User exists' };
    users.push({ email, password, name });
    localStorage.setItem('users', JSON.stringify(users));
    return { ok: true };
}

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const u = users.find(u => u.email === email && u.password === password);
    if (!u) return { ok: false };
    localStorage.setItem('currentUser', JSON.stringify({ email: u.email, name: u.name }));
    return { ok: true, user: { email: u.email, name: u.name } };
}

// handle signup form
const signupForm = document.querySelector('#signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = signupForm.querySelector('input[name="name"]').value;
        const email = signupForm.querySelector('input[name="email"]').value;
        const pwd = signupForm.querySelector('input[name="password"]').value;
        const res = signupUser(email, pwd, name);
        if (!res.ok) return alert(res.msg);
        alert('Signup successful — you can now login.');
        window.location.href = 'login.html';
    });
}

// handle login form
const loginForm = document.querySelector('#login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[name="email"]').value;
        const pwd = loginForm.querySelector('input[name="password"]').value;
        const res = loginUser(email, pwd);
        if (!res.ok) return alert('Invalid credentials');
        alert(`Welcome back, ${res.user.name || res.user.email}`);
        window.location.href = 'index.html';
    });
}

// Initialize cart count on load
updateCartCount();
// Render cart page if present
renderCartPage();

// ==================== HERO CAROUSEL INIT ==================== //
function initHeroCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const dotsContainer = carousel.querySelector('.carousel-dots');
    slides.forEach((s, i) => {
        const btn = document.createElement('button');
        btn.className = 'dot';
        if (i === 0) btn.classList.add('active');
        btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
        btn.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(btn);
    });
    let current = 0;
    let interval = null;

    function goTo(idx) {
        slides[current].classList.remove('active');
        dotsContainer.children[current].classList.remove('active');
        current = idx;
        slides[current].classList.add('active');
        dotsContainer.children[current].classList.add('active');
    }

    function next() { goTo((current + 1) % slides.length); }

    function start() { if (interval) clearInterval(interval); interval = setInterval(next, 4000); }
    function stop() { if (interval) clearInterval(interval); interval = null; }

    carousel.addEventListener('mouseover', stop);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('mouseout', start);
    carousel.addEventListener('focusout', start);

    start();
}

// Initialize carousel (will no-op on non-home pages)
initHeroCarousel();
