// Hexmolt - Main JavaScript File

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            if (this.hash) {
                const activeLink = document.querySelector(`.nav-links a[href="${this.hash}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }
    });
});

// Highlight current section on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Button click handlers
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Responsive navigation menu toggle
function setupMobileNav() {
    const nav = document.querySelector('.nav-links');
    
    // Check if menu already toggled
    if (nav && !nav.hasListener) {
        nav.hasListener = true;
        
        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-content')) {
                nav.style.display = '';
            }
        });
    }
}

setupMobileNav();

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Policy page - Table of contents active state
if (document.querySelector('.policy-sidebar')) {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.policy-section');
        const tocLinks = document.querySelectorAll('.toc a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.style.color = '';
            link.style.borderLeftColor = '';
            
            const href = link.getAttribute('href');
            if (href && href.substring(1) === current) {
                link.style.color = 'var(--color-red)';
                link.style.borderLeftColor = 'var(--color-red)';
            }
        });
    });
}

// Add copy to clipboard functionality for contact info
document.querySelectorAll('.contact-info a').forEach(link => {
    if (link.href.startsWith('mailto:')) {
        link.addEventListener('click', function(e) {
            // Allow default mailto behavior
            // You could add a toast notification here
        });
    }
});

// Performance: Lazy load images if any
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Cookie consent banner (optional)
function showCookieConsent() {
    if (localStorage.getItem('cookieConsent')) {
        return;
    }
    
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <p>We use cookies to improve your experience. By continuing, you consent to our use of cookies.</p>
            <div class="cookie-buttons">
                <button class="btn btn-primary cookie-accept">Accept</button>
                <button class="btn btn-secondary cookie-decline">Decline</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cookie-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(10, 10, 10, 0.98);
            border-top: 1px solid rgba(220, 38, 38, 0.3);
            padding: 20px;
            z-index: 9999;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        
        .cookie-content {
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
        }
        
        .cookie-content p {
            color: var(--color-text-secondary);
            margin: 0;
            flex: 1;
        }
        
        .cookie-buttons {
            display: flex;
            gap: 10px;
            white-space: nowrap;
        }
        
        @media (max-width: 768px) {
            .cookie-content {
                flex-direction: column;
            }
            
            .cookie-buttons {
                width: 100%;
            }
            
            .cookie-buttons button {
                flex: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.querySelector('.cookie-accept').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.style.animation = 'slideDown 0.3s ease forwards';
        setTimeout(() => banner.remove(), 300);
    });
    
    document.querySelector('.cookie-decline').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        banner.style.animation = 'slideDown 0.3s ease forwards';
        setTimeout(() => banner.remove(), 300);
    });
}

// Uncomment to enable cookie banner
// document.addEventListener('DOMContentLoaded', showCookieConsent);

console.log('Hexmolt - Privacy & Security Focused Cloud Storage');
