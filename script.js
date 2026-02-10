/* =========================
   SMOOTH SCROLLING
   ========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});


/* =========================
   CONTACT FORM
   ========================= */
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name')?.trim() || '',
            company: '', // Not in new form, send empty string
            email: formData.get('email')?.trim() || '',
            role: formData.get('service')?.trim() || '', // Map service selection to role field
            message: formData.get('message')?.trim() || '',
            phone: formData.get('phone')?.trim() || '' // Additional field
        };

        // Enhance message with phone number if provided
        if (data.phone) {
            data.message = `Phone: ${data.phone}\n\n${data.message}`;
        }

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const res = await fetch('/api/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (json.success) {
                alert('Thank you! We will get back to you shortly.');
                form.reset();
            } else {
                alert('Server error. Please try again later.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Server error. Please try again later.');
        }
    });
}


/* =========================
   NAVBAR SHADOW ON SCROLL
   ========================= */
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    navbar.style.boxShadow =
        window.scrollY > 50 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
});


/* =========================
   MOBILE NAV (HAMBURGER)
   ========================= */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.site-header');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Lock body scroll
        document.body.style.overflow =
            navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}





/* =========================
   BOOK A CALL WIDGET
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
    const widget = document.getElementById('bookCallWidget');
    const closeBtn = document.querySelector('.book-call-close');

    if (!widget || !closeBtn) return;

    let isVisible = false;
    let cooldown = false;

    function showWidget() {
        if (isVisible || cooldown) return;
        widget.style.display = 'flex';
        isVisible = true;
    }

    function hideWidget() {
        widget.style.display = 'none';
        isVisible = false;
        cooldown = true;

        setTimeout(() => {
            cooldown = false;
        }, 15000);
    }

    // Scroll intent (~15%)
    window.addEventListener('scroll', () => {
        const scrollPercent =
            (window.scrollY + window.innerHeight) / document.body.scrollHeight;

        if (scrollPercent > 0.15) showWidget();
    });

    // Exit intent (desktop)
    document.addEventListener('mouseout', e => {
        if (e.clientY < 50) showWidget();
    });

    closeBtn.addEventListener('click', hideWidget);
});
// Tier switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tierBtns = document.querySelectorAll('.tier-btn');
    const tierContents = document.querySelectorAll('.tier-content');
    
    tierBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tier = this.getAttribute('data-tier');
            
            // Remove active class from all buttons and contents
            tierBtns.forEach(b => b.classList.remove('active'));
            tierContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tier).classList.add('active');
            
            // Smooth scroll to tier content
            document.getElementById(tier).scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });
});

/* =========================
   FAQ ACCORDION
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;

            document.querySelectorAll('.faq-item').forEach(faq => {
                if (faq !== item) faq.classList.remove('active');
            });

            item.classList.toggle('active');
        });
    });
});


/* =========================
   UPDATE YEAR
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});