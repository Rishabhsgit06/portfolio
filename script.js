
alert("JS CONNECTED");
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    setTimeout(() => {
        loader.classList.add("hide");
    }, 700);
});


// ========================================
// SCROLL PROGRESS
// ========================================

const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = (scrollTop / height) * 100;

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
});


// ========================================
// CUSTOM CURSOR
// ========================================

const cursor = document.querySelector(".cursor");
const cursorDot = document.querySelector(".cursor-dot");

if (cursor && cursorDot) {
    window.addEventListener("mousemove", (e) => {
        cursor.style.transform =
            `translate(${e.clientX}px, ${e.clientY}px)`;

        cursorDot.style.transform =
            `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.querySelectorAll("a, button, .project-card").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("cursor-grow");
        });

        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("cursor-grow");
        });
    });
}


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuBtn.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuBtn.classList.remove("active");
        });
    });
}


// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


// ========================================
// SCROLL REVEAL
// ========================================

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.05
});

revealElements.forEach(el => observer.observe(el));

// Show hero immediately
document.querySelectorAll(".hero .reveal").forEach(el => {
    el.classList.add("active");
});


// ========================================
// MAGNETIC BUTTONS
// ========================================

document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform =
            `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    button.addEventListener("mouseleave", () => {
        button.style.transform = "translate(0, 0)";
    });
});


// ========================================
// PROJECT CARD TILT
// ========================================

document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform =
            "perspective(1000px) rotateX(0) rotateY(0)";
    });
});


// ========================================
// PARALLAX EFFECT
// ========================================

const glowOne = document.querySelector(".glow-one");
const glowTwo = document.querySelector(".glow-two");

window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    if (glowOne) {
        glowOne.style.transform =
            `translate(${x * 40}px, ${y * 40}px)`;
    }

    if (glowTwo) {
        glowTwo.style.transform =
            `translate(${x * -30}px, ${y * -30}px)`;
    }
});


// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");

        if (targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {
            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


// ========================================
// CONTACT FORM
// ========================================

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = contactForm.querySelector(
            'input[name="name"]'
        )?.value.trim();

        const email = contactForm.querySelector(
            'input[name="email"]'
        )?.value.trim();

        const message = contactForm.querySelector(
            'textarea[name="message"]'
        )?.value.trim();

        if (!name || !email || !message) {
            alert("Please fill all the fields.");
            return;
        }

        const subject = encodeURIComponent(
            `Portfolio Contact from ${name}`
        );

        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href =
            `mailto:rishabhshukla9555@gmail.com?subject=${subject}&body=${body}`;
    });
}


// ========================================
// ACTIVE NAV LINK
// ========================================

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});


// ========================================
// CURRENT YEAR
// ========================================

const year = document.querySelector("#year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// ========================================
// ESC KEY - CLOSE MOBILE MENU
// ========================================

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        navLinks?.classList.remove("active");
        menuBtn?.classList.remove("active");
    }
});