
// EmailJS settings. Replace these values with your EmailJS account details.
const emailJsPublicKey = "laU9fptRN-JTBVb6g";
const emailJsServiceId = "service_9tt06lv";
const emailJsTemplateId = "template_a9kooag";
const emailJsConfigured = ![
    emailJsPublicKey,
    emailJsServiceId,
    emailJsTemplateId
].some((value) => value.startsWith("YOUR_"));

if (window.emailjs && emailJsConfigured) {
    emailjs.init({ publicKey: emailJsPublicKey });
}

// Hide the loading screen after the initial page animation.
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    if (loader) {
        setTimeout(() => loader.classList.add("hide"), 700);
    }
});

// Custom cursor and hover expansion for interactive elements.

const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

if (cursor && cursorFollower) {
    window.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursorFollower.style.left = `${e.clientX}px`;
        cursorFollower.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll("a, button, .project").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("cursor-grow");
            cursorFollower.classList.add("cursor-grow");
        });

        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("cursor-grow");
            cursorFollower.classList.remove("cursor-grow");
        });
    });
}

// Toggle the mobile navigation and close it after a link is selected.

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

// Elements used by the shared scroll-state handler.
const navbar = document.querySelector(".navbar");
const progressBar = document.querySelector(".progress");
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");
const heroOrbs = document.querySelectorAll(".hero .orb");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Keep scroll progress, navbar styling, and the active link in sync.
function updateScrollState() {
    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    const progress = scrollHeight > 0
        ? (window.scrollY / scrollHeight) * 100
        : 0;

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }

    if (!reduceMotion) {
        heroOrbs.forEach((orb, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            const offset = Math.min(window.scrollY * 0.12, 120) * direction;
            orb.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
    }

    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    navItems.forEach((link) => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`
        );
    });
}

window.addEventListener("scroll", updateScrollState);
updateScrollState();

// Reveal content when it enters the viewport.
const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.05 });

revealElements.forEach((element) => observer.observe(element));
document.querySelectorAll(".hero .reveal").forEach((element) => {
    element.classList.add("active");
});

// Tilt project cards toward the pointer.

document.querySelectorAll(".project").forEach((card) => {
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

// Smoothly scroll internal links to their target sections.

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

// Send the contact form through EmailJS or open a pre-filled email draft.

const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = contactForm.elements.name.value.trim();
        const email = contactForm.elements.email.value.trim();
        const message = contactForm.elements.message.value.trim();

        if (!name || !email || !message) {
            if (formStatus) {
                formStatus.textContent = "Please fill in all fields.";
            }
            return;
        }

        if (formStatus) {
            formStatus.textContent = "Sending message...";
        }

        if (emailJsConfigured && window.emailjs) {
            try {
                await emailjs.sendForm(
                    emailJsServiceId,
                    emailJsTemplateId,
                    contactForm
                );

                contactForm.reset();
                if (formStatus) {
                    formStatus.textContent = "Message sent successfully.";
                }
                return;
            } catch (error) {
                console.error("EmailJS send failed:", error);
            }
        }

        const subject = encodeURIComponent(
            `Portfolio Contact from ${name}`
        );

        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        if (formStatus) {
            formStatus.textContent = "Opening your email app...";
        }

        window.location.href =
            `mailto:rishabhshukla9555@gmail.com?subject=${subject}&body=${body}`;
    });
}

// Populate the footer year when a matching element exists.

const year = document.querySelector("#year");

if (year) {
    year.textContent = new Date().getFullYear();
}

// Allow Escape to close the mobile menu.
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        navLinks?.classList.remove("active");
        menuBtn?.classList.remove("active");
    }
});
/* ================================
   RISHABH AI CHATBOT
================================ */

const aiBotButton = document.getElementById("aiBotButton");
const aiChat = document.getElementById("aiChat");
const closeAi = document.getElementById("closeAi");
const aiForm = document.getElementById("aiForm");
const aiInput = document.getElementById("aiInput");
const aiMessages = document.getElementById("aiMessages");

const botInteraction = {
    clickCount: 0,
    isMoving: false,
    originalPosition: null,
    lastDodgePosition: null
};

const botMoveDuration = 900;

function setBotBubble(title, message){
    const bubble = document.querySelector(".ai-bubble");

    if (!bubble) return;

    bubble.innerHTML =
        '<span class="ai-dot"></span>' +
        `<strong>${title}</strong>` +
        `<small>${message}</small>`;

    bubble.classList.remove("dodge-message");
    void bubble.offsetWidth;
    bubble.classList.add("dodge-message");
}

function getSafeBotTarget(currentPosition, dodgeNumber){
    const margin = window.innerWidth <= 600 ? 20 : 28;
    const maxLeft = Math.max(
        margin,
        window.innerWidth - currentPosition.width - margin
    );
    const maxTop = Math.max(
        margin,
        window.innerHeight - currentPosition.height - margin
    );
    const maxTravel = window.innerWidth <= 600 ? 70 : 120;
    const minimumDistance = window.innerWidth <= 600 ? 35 : 60;
    const previousPosition = {
        left: currentPosition.left,
        top: currentPosition.top
    };

    for (let attempt = 0; attempt < 12; attempt++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = maxTravel * (.7 + Math.random() * .3);
        const target = {
            left: Math.min(
                maxLeft,
                Math.max(margin, previousPosition.left + Math.cos(angle) * distance)
            ),
            top: Math.min(
                maxTop,
                Math.max(margin, previousPosition.top + Math.sin(angle) * distance)
            )
        };

        const movedEnough = Math.hypot(
            target.left - previousPosition.left,
            target.top - previousPosition.top
        ) >= minimumDistance;
        const differentFromFirstDodge = dodgeNumber === 1 ||
            !botInteraction.lastDodgePosition ||
            Math.hypot(
                target.left - botInteraction.lastDodgePosition.left,
                target.top - botInteraction.lastDodgePosition.top
            ) >= minimumDistance;

        if (movedEnough && differentFromFirstDodge) {
            return target;
        }
    }

    return {
        left: Math.min(maxLeft, Math.max(margin, previousPosition.left + maxTravel)),
        top: Math.min(maxTop, Math.max(margin, previousPosition.top))
    };
}

function moveBotTo(target, onComplete){
    const bot = document.querySelector(".ai-bot");
    const character = document.querySelector(".ai-character");

    if (!bot || !character) return;

    bot.style.position = "fixed";
    bot.style.right = "auto";
    bot.style.bottom = "auto";
    bot.style.left = `${target.left}px`;
    bot.style.top = `${target.top}px`;

    botInteraction.isMoving = true;
    character.classList.remove("caught");
    character.classList.add("dodging");

    window.setTimeout(() => {
        character.classList.remove("dodging");
        botInteraction.isMoving = false;

        if (onComplete) {
            onComplete();
        }
    }, botMoveDuration);
}

function dodgeBot(){
    const bot = document.querySelector(".ai-bot");

    if (!bot) return;

    const currentPosition = bot.getBoundingClientRect();
    const target = getSafeBotTarget(
        currentPosition,
        botInteraction.clickCount
    );

    botInteraction.lastDodgePosition = target;
    moveBotTo(target);
}

function openAiChat(){
    aiChat.classList.add("open");
    aiInput.focus();

    const firstMessage = aiMessages.querySelector(".bot-message");

    if (firstMessage) {
        firstMessage.innerHTML =
            "😂 <strong>Nice reflex!</strong><br><br>" +
            "Okay, you got me. What would you like to know about Rishabh?";
        firstMessage.classList.add("dodge-message");
    }

    botInteraction.clickCount = 0;
    botInteraction.originalPosition = null;
    botInteraction.lastDodgePosition = null;
}

if (aiBotButton && aiChat && aiInput && aiMessages) {
    // Clicks 1 and 2 dodge; click 3 returns home before opening chat.
    aiBotButton.addEventListener("click", () => {
        if (botInteraction.isMoving) return;

        const bot = document.querySelector(".ai-bot");

        if (!bot) return;

        if (botInteraction.clickCount === 0) {
            const originalPosition = bot.getBoundingClientRect();

            botInteraction.originalPosition = {
                left: originalPosition.left,
                top: originalPosition.top
            };
        }

        botInteraction.clickCount += 1;

        if (botInteraction.clickCount < 3) {
            setBotBubble(
                botInteraction.clickCount === 1 ? "Hehe... too slow 👀" : "Again?! 😂",
                botInteraction.clickCount === 1 ? "Try again..." : "Almost got me 👀"
            );
            dodgeBot();
            return;
        }

        setBotBubble("Okay okay 😂", "You caught me!");
        moveBotTo(botInteraction.originalPosition, openAiChat);
    });
}

if (closeAi && aiChat) {
    closeAi.addEventListener("click", () => {
        aiChat.classList.remove("open");
        botInteraction.clickCount = 0;
        botInteraction.originalPosition = null;
        botInteraction.lastDodgePosition = null;

        const bot = document.querySelector(".ai-bot");

        if (bot) {
            bot.style.position = "";
            bot.style.left = "";
            bot.style.top = "";
            bot.style.right = "";
            bot.style.bottom = "";
        }
    });
}


function addAiMessage(text, type){

    const message = document.createElement("div");

    message.className =
        "ai-message " +
        (type === "user" ? "user-message" : "bot-message");

    message.innerHTML = text;

    aiMessages.appendChild(message);

    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function addTypingIndicator(){
    const typingMessage = document.createElement("div");

    typingMessage.className = "ai-message bot-message typing-message";
    typingMessage.setAttribute("aria-label", "Rishabh AI is typing");
    typingMessage.innerHTML = "<span></span><span></span><span></span>";

    aiMessages.appendChild(typingMessage);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    return typingMessage;
}


/* BASIC KNOWLEDGE BASE */

const rishabhKnowledge = {

    name: "Rishabh Shukla",

    location: "Lucknow, Uttar Pradesh, India",

    education:
        "Rishabh is a third-year B.Tech Computer Science & Engineering student at BBD NIIT, Lucknow. His B.Tech is from 2024 to 2028.",

    skills:
        "Rishabh's technical skills include C++, Python, JavaScript, HTML and CSS. He also has hands-on exposure to AI tools.",

    nexus:
        "Rishabh is the Co-Founder and Tech Lead of NEXUS at BBDNIIT. He helped establish the club with an initial team of 7 active participants and leads technical initiatives and student-focused activities.",

    hackathons:
        "Rishabh has participated in Chandigarh University Hackathon, Odoo Hackathon and Smart India Hackathon. He was shortlisted in the offline round of Smart India Hackathon at BBDNIIT.",

    coderush:
        "Rishabh is an Organizer and Team Lead for Coderush, a college-level coding sprint and competition. He has helped organize it for two consecutive years and led a team of 7.",

    contact:
        "You can contact Rishabh at rishabhshukla9555@gmail.com or through his LinkedIn and GitHub profiles.",

    competencies:
        "His core competencies include project coordination, team leadership, event management, planning and execution, communication, stakeholder coordination, problem solving and time management."

};


function getBotReply(question){

    const q = question.toLowerCase();

    if(q.includes("name") || q.includes("who is"))
        return `Rishabh's full name is <strong>Rishabh Shukla</strong>. 👋`;

    if(
        q.includes("where") ||
        q.includes("city") ||
        q.includes("from")
    )
        return `Rishabh is from <strong>Lucknow, Uttar Pradesh, India</strong>. 📍`;

    if(
        q.includes("education") ||
        q.includes("college") ||
        q.includes("study") ||
        q.includes("degree")
    )
        return rishabhKnowledge.education;

    if(
        q.includes("skill") ||
        q.includes("tech") ||
        q.includes("language") ||
        q.includes("stack")
    )
        return rishabhKnowledge.skills;

    if(q.includes("nexus"))
        return rishabhKnowledge.nexus;

    if(
        q.includes("hackathon") ||
        q.includes("smart india") ||
        q.includes("siH")
    )
        return rishabhKnowledge.hackathons;

    if(
        q.includes("coderush") ||
        q.includes("coding sprint")
    )
        return rishabhKnowledge.coderush;

    if(
        q.includes("contact") ||
        q.includes("email") ||
        q.includes("linkedin") ||
        q.includes("github")
    )
        return rishabhKnowledge.contact;

    if(
        q.includes("leadership") ||
        q.includes("strength") ||
        q.includes("competenc")
    )
        return rishabhKnowledge.competencies;

    return `Hmm 👀 I don't have that information yet. Try asking me about Rishabh's <strong>skills, education, NEXUS, hackathons, Coderush, achievements or contact details.</strong>`;
}


/* FORM */

aiForm.addEventListener("submit", e => {

    e.preventDefault();

    const question = aiInput.value.trim();

    if(!question) return;

    addAiMessage(question, "user");

    aiInput.value = "";
    const typingIndicator = addTypingIndicator();

    setTimeout(() => {
        typingIndicator.remove();
        const answer = getBotReply(question);
        addAiMessage(answer, "bot");

    }, 600);

});


/* QUICK QUESTIONS */

document.querySelectorAll(".ai-suggestions button")
.forEach(button => {

    button.addEventListener("click", () => {

        const question = button.textContent;

        addAiMessage(question, "user");
        const typingIndicator = addTypingIndicator();

        setTimeout(() => {
            typingIndicator.remove();
            addAiMessage(getBotReply(question), "bot");

        }, 500);

    });

});