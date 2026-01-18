// Mobile Menu Toggle
const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuButton = document.getElementById('close-menu-button');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

if (menuButton && mobileMenu) {
    let isMenuOpen = false;

    function openMenu() {
        isMenuOpen = true;
        mobileMenu.style.display = 'block';
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('active');
        menuButton.classList.add('active');
    }

    function closeMenu() {
        isMenuOpen = false;
        mobileMenu.classList.remove('active');
        mobileMenu.classList.add('hidden');
        menuButton.classList.remove('active');
        mobileMenu.style.display = 'none';
    }

    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close button click handler
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            closeMenu();
        });
    }

    // Close menu when clicking on a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMenu();
        });
    });

    // Close menu when clicking outside (but not on button)
    document.addEventListener('click', (e) => {
        if (isMenuOpen) {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickOnButton = menuButton.contains(e.target);
            const isClickOnCloseButton = closeMenuButton && closeMenuButton.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnButton && !isClickOnCloseButton) {
                closeMenu();
            }
        }
    });

    // Close menu on scroll (only if scrolled significantly)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (isMenuOpen && window.scrollY > 200) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                closeMenu();
            }, 200);
        }
    });
}

const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let currentSlide = 0;
let slideInterval = null;

if (testimonialSlides.length > 0 && testimonialDots.length > 0) {
    function showSlide(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        if (testimonialSlides[index]) {
            testimonialSlides[index].classList.add('active');
        }
        if (testimonialDots[index]) {
            testimonialDots[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    // Add click event listeners to dots
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
            showSlide(index);
            startAutoPlay();
        });
    });

    function startAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // Start auto-play
    startAutoPlay();

    // Pause auto-play on hover
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        });
        
        testimonialsSection.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
}

// Gallery Filter
const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
const galleryImages = document.querySelectorAll('.gallery-image');

galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        // Update active button
        galleryFilterBtns.forEach(b => {
            b.classList.remove('active');
            if (b !== btn) {
                b.classList.remove('btn-primary');
                b.classList.add('btn-outline-secondary');
            }
        });
        btn.classList.add('active');
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-outline-secondary');
        
        // Filter images
        galleryImages.forEach(img => {
            const category = img.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                img.classList.remove('hidden');
            } else {
                img.classList.add('hidden');
            }
        });
    });
});

// Counter Animation for Stats
function animateCounter(element, target, suffix = '', duration = 2000) {
    let start = 0;
    const startTime = Date.now();
    
    const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (target - start) * easeOutQuart);
        
        // Format number with comma if >= 1000, add suffix if exists
        let formattedValue = currentValue >= 1000 ? currentValue.toLocaleString() : currentValue.toString();
        element.textContent = formattedValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Final value
            formattedValue = target >= 1000 ? target.toLocaleString() : target.toString();
            element.textContent = formattedValue + suffix;
        }
    };
    
    updateCounter();
}

// Intersection Observer for Stats Counter
const statsSection = document.querySelector('.stats-section');
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

if (statsSection && statNumbers.length > 0) {
    let hasAnimated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                // Animate all stat numbers
                statNumbers.forEach(statNumber => {
                    const targetValue = parseInt(statNumber.getAttribute('data-target'));
                    const suffix = statNumber.getAttribute('data-suffix') || '';
                    animateCounter(statNumber, targetValue, suffix);
                });
                hasAnimated = true;
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% of the element is visible
    });
    
    observer.observe(statsSection);
}

// Scroll Animation Observer
const scrollAnimateElements = document.querySelectorAll('.scroll-animate');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Optional: Unobserve after animation to improve performance
            // scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Start animation slightly before element enters viewport
});

// Observe all scroll animate elements
scrollAnimateElements.forEach(element => {
    scrollObserver.observe(element);
});

// Navbar scroll effect and scroll progress
const mainNav = document.querySelector('.main-nav');
const scrollProgress = document.querySelector('.scroll-progress');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Navbar scroll effect
    if (currentScroll > 100) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
    
    // Scroll progress bar
    if (scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (currentScroll / windowHeight) * 100;
        scrollProgress.style.width = scrollPercentage + '%';
    }
    
    lastScroll = currentScroll;
});

// Add scroll animation classes to elements
document.addEventListener('DOMContentLoaded', () => {
    // Features section
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.classList.add('scroll-animate', 'fade-in-up');
        if (index > 0) {
            item.classList.add(`animate-delay-${Math.min(index, 5)}`);
        }
    });

    // Welcome section elements
    const welcomeText = document.querySelector('.welcome-text');
    const welcomeImage = document.querySelector('.welcome-image');
    const welcomeSidebar = document.querySelector('.welcome-sidebar');
    
    if (welcomeText) {
        welcomeText.classList.add('scroll-animate', 'fade-in-left');
    }
    if (welcomeImage) {
        welcomeImage.classList.add('scroll-animate', 'zoom-in', 'animate-delay-2');
    }
    if (welcomeSidebar) {
        welcomeSidebar.classList.add('scroll-animate', 'fade-in-right', 'animate-delay-3');
    }

    // Service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.classList.add('scroll-animate', 'fade-in-up');
        if (index > 0) {
            card.classList.add(`animate-delay-${Math.min(index % 6, 5)}`);
        }
    });

    // Doctor cards
    const doctorCards = document.querySelectorAll('.doctor-card');
    doctorCards.forEach((card, index) => {
        card.classList.add('scroll-animate', 'zoom-in');
        if (index > 0) {
            card.classList.add(`animate-delay-${Math.min(index % 5, 5)}`);
        }
    });

    // Section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.classList.add('scroll-animate', 'fade-in-down');
    });

    // Department content
    const departmentText = document.querySelector('.department-text');
    const departmentImage = document.querySelector('.department-image');
    
    if (departmentText) {
        departmentText.classList.add('scroll-animate', 'fade-in-left');
    }
    if (departmentImage) {
        departmentImage.classList.add('scroll-animate', 'fade-in-right', 'animate-delay-2');
    }

    // Pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.classList.add('scroll-animate', 'slide-up');
        if (index > 0) {
            card.classList.add(`animate-delay-${Math.min(index % 4, 5)}`);
        }
    });

    // Gallery images
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach((img, index) => {
        img.classList.add('scroll-animate', 'zoom-in');
        if (index > 0) {
            img.classList.add(`animate-delay-${Math.min(index % 8, 5)}`);
        }
    });

    // News cards
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach((card, index) => {
        card.classList.add('scroll-animate', 'fade-in-up');
        if (index > 0) {
            card.classList.add(`animate-delay-${Math.min(index % 4, 5)}`);
        }
    });

    // Appointment section
    const appointmentForm = document.querySelector('.appointment-form-wrapper');
    const appointmentImg = document.querySelector('.appointment-image');
    
    if (appointmentForm) {
        appointmentForm.classList.add('scroll-animate', 'fade-in-left');
    }
    if (appointmentImg) {
        appointmentImg.classList.add('scroll-animate', 'fade-in-right', 'animate-delay-2');
    }

    // Footer columns
    const footerColumns = document.querySelectorAll('.footer-column');
    footerColumns.forEach((column, index) => {
        column.classList.add('scroll-animate', 'fade-in-up');
        if (index > 0) {
            column.classList.add(`animate-delay-${Math.min(index % 5, 5)}`);
        }
    });

    // Info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.classList.add('scroll-animate', 'fade-in-up');
        if (index > 0) {
            card.classList.add(`animate-delay-${Math.min(index % 3, 5)}`);
        }
    });

    // Why Choose Us cards
    const whyChooseCards = document.querySelectorAll('.why-choose-card');
    whyChooseCards.forEach((card, index) => {
        card.classList.add('scroll-animate', 'fade-in-up');
        if (index > 0) {
            card.classList.add(`animate-delay-${Math.min(index % 6, 5)}`);
        }
    });

    // FAQ items
    const faqItemsForAnimation = document.querySelectorAll('.faq-item');
    faqItemsForAnimation.forEach((item, index) => {
        item.classList.add('scroll-animate', 'fade-in-up');
        if (index > 0) {
            item.classList.add(`animate-delay-${Math.min(index % 6, 5)}`);
        }
    });

    // Re-observe all elements after adding classes
    const allScrollElements = document.querySelectorAll('.scroll-animate');
    allScrollElements.forEach(element => {
        scrollObserver.observe(element);
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg-image');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover animations to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});