// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});

// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
});

// Auto-rotate testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Domain Search Functionality
const searchBtn = document.getElementById('searchBtn');
const domainInput = document.getElementById('domainInput');
const searchModal = document.getElementById('searchModal');
const searchResults = document.getElementById('searchResults');
const closeModal = document.querySelector('.close-modal');
const popularDomains = document.querySelectorAll('.popular-domain');

searchBtn.addEventListener('click', function() {
    const domain = domainInput.value.trim();
    
    if (domain) {
        // Show loading state
        const originalText = searchBtn.innerHTML;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        searchBtn.disabled = true;
        
        // Simulate API delay
        setTimeout(() => {
            // Restore button
            searchBtn.innerHTML = originalText;
            searchBtn.disabled = false;
            
            // Show results
            simulateDomainSearch(domain);
        }, 1500);
    } else {
        alert('Please enter a domain name to search');
    }
});

// Popular domain click handlers
popularDomains.forEach(domain => {
    domain.addEventListener('click', function(e) {
        e.preventDefault();
        const domainExt = this.getAttribute('data-domain');
        domainInput.value = 'example' + domainExt;
        searchBtn.click();
    });
});

// Allow search on Enter key
domainInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Simulate domain search results
function simulateDomainSearch(domain) {
    // Remove common protocol prefixes if present
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    // Generate random availability results for demo
    const extensions = ['.com', '.net', '.org', '.io', '.co', '.biz'];
    let resultsHTML = '';
    
    extensions.forEach(ext => {
        const isAvailable = Math.random() > 0.5;
        const price = isAvailable ? getRandomPrice(ext) : null;
        
        resultsHTML += `
            <div class="result-item">
                <div class="domain-name">${cleanDomain}${ext}</div>
                ${isAvailable ? 
                    `<div class="available">Available - $${price}/yr</div>
                     <button class="add-to-cart" data-domain="${cleanDomain}${ext}" data-price="${price}">Add to Cart</button>` : 
                    `<div class="unavailable">Unavailable</div>`}
            </div>
        `;
    });
    
    searchResults.innerHTML = resultsHTML;
    searchModal.style.display = 'flex';
}

function getRandomPrice(extension) {
    const basePrices = {
        '.com': 12.99,
        '.net': 14.99,
        '.org': 10.99,
        '.io': 39.99,
        '.co': 29.99,
        '.biz': 9.99
    };
    
    // Add some random variation
    const variation = (Math.random() * 5) - 2.5; // -2.5 to +2.5
    return (basePrices[extension] + variation).toFixed(2);
}

// Close modal when clicking X
closeModal.addEventListener('click', function() {
    searchModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === searchModal) {
        searchModal.style.display = 'none';
    }
});

// Cart functionality
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const totalAmount = document.getElementById('totalAmount');
const checkoutBtn = document.getElementById('checkoutBtn');
let cart = [];

// Open cart sidebar
cartBtn.addEventListener('click', function(e) {
    e.preventDefault();
    cartSidebar.style.display = 'block';
    updateCartDisplay();
});

// Close cart sidebar
closeCart.addEventListener('click', function() {
    cartSidebar.style.display = 'none';
});

// Close cart when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === cartSidebar) {
        cartSidebar.style.display = 'none';
    }
});

// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const domainItem = e.target.closest('.result-item');
        const domainName = e.target.getAttribute('data-domain');
        const domainPrice = e.target.getAttribute('data-price');
        
        addToCart(domainName, domainPrice);
        searchModal.style.display = 'none';
    }
});

function addToCart(name, price) {
    cart.push({
        name: name,
        price: parseFloat(price)
    });
    
    updateCartCount();
    updateCartDisplay();
    
    // Show confirmation
    alert(`Added ${name} ($${price}) to your cart!`);
}

function updateCartCount() {
    cartCount.textContent = cart.length;
}

function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        cartTotal.style.display = 'none';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="remove-item" data-index="${index}"><i class="fas fa-times"></i></div>
            </div>
        `;
        total += item.price;
    });
    
    cartItems.innerHTML = itemsHTML;
    totalAmount.textContent = total.toFixed(2);
    cartTotal.style.display = 'block';
    checkoutBtn.style.display = 'block';
}

// Remove item from cart
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
        const index = e.target.classList.contains('remove-item') ? 
            e.target.getAttribute('data-index') : 
            e.target.closest('.remove-item').getAttribute('data-index');
        
        cart.splice(index, 1);
        updateCartCount();
        updateCartDisplay();
    }
});

// Checkout button
checkoutBtn.addEventListener('click', function() {
    alert(`Proceeding to checkout with ${cart.length} items. Total: $${totalAmount.textContent}`);
    // In a real implementation, this would redirect to checkout page
});

// Settings menu functionality
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const closeSettings = document.querySelector('.close-settings');

settingsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    settingsMenu.style.display = 'block';
});

closeSettings.addEventListener('click', function() {
    settingsMenu.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === settingsMenu) {
        settingsMenu.style.display = 'none';
    }
});

// Theme switcher
const themeSelect = document.getElementById('themeSelect');
themeSelect.addEventListener('change', function() {
    if (this.value === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
});

// Login modal functionality
const signInBtn = document.getElementById('signInBtn');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.querySelector('.close-login');

signInBtn.addEventListener('click', function(e) {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

closeLogin.addEventListener('click', function() {
    loginModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Help modal functionality
const helpBtn = document.getElementById('helpBtn');
const phoneHelp = document.getElementById('phoneHelp');
const helpModal = document.getElementById('helpModal');
const closeHelp = document.querySelector('.close-help');

helpBtn.addEventListener('click', function(e) {
    e.preventDefault();
    helpModal.style.display = 'flex';
});

phoneHelp.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Calling customer support at 1-800-GODADDY');
});

closeHelp.addEventListener('click', function() {
    helpModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === helpModal) {
        helpModal.style.display = 'none';
    }
});

// Product buttons functionality
const productBtns = document.querySelectorAll('.product-btn');
productBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        let message = '';
        
        switch(product) {
            case 'web_hosting':
                message = 'Web Hosting selected. Starting at $5.99/month';
                break;
            case 'professional_email':
                message = 'Professional Email selected. Starting at $1.99/month';
                break;
            case 'ssl_security':
                message = 'SSL Security selected. Starting at $47.99/year';
                break;
            case 'wordpress_hosting':
                message = 'WordPress Hosting selected. Starting at $6.99/month';
                break;
        }
        
        alert(message);
        // In a real implementation, this would redirect to product page
    });
});

// Navigation links functionality
const navLinks = document.querySelectorAll('.nav-links a:not(#settingsBtn)');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.textContent.toLowerCase();
        alert(`Navigating to ${section} section`);
        // In a real implementation, this would scroll to or load the section
    });
});

// Footer links functionality
const footerLinks = document.querySelectorAll('.footer-section a');
footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.textContent;
        alert(`Navigating to ${section} section`);
        // In a real implementation, this would load the appropriate page
    });
});

// Social media links
const socialLinks = document.querySelectorAll('.social-links a');
socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.querySelector('i').className.split('-')[1];
        alert(`Opening GoDaddy's ${platform} page in a new tab`);
        // In a real implementation, this would open the social media page
    });
});