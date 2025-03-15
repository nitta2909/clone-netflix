document.addEventListener("DOMContentLoaded", function () {
    initCursorEffect();
    initStarField();
    initHoverEffects();
    initHeaderScroll();
    initParallaxEffects();
    initLogoAnimation();
    initSectionTransitions();
    initButtonEffects();
});

function initCursorEffect() {
    const cursorTrail = document.querySelector(".cursor-trail");
    if (!cursorTrail) return;

    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener("mousemove", (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function animateCursor() {
        const speed = 0.1;
        trailX += (cursorX - trailX) * speed;
        trailY += (cursorY - trailY) * speed;

        cursorTrail.style.left = trailX + "px";
        cursorTrail.style.top = trailY + "px";

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const buttons = document.querySelectorAll(
        ".btn, .movie-btn, .responsive-btn, .social-link"
    );
    buttons.forEach((button) => {
        button.addEventListener("mouseenter", () => {
            cursorTrail.style.width = "20px";
            cursorTrail.style.height = "20px";
            cursorTrail.style.opacity = "0.8";
            cursorTrail.classList.add("glow-effect");
        });

        button.addEventListener("mouseleave", () => {
            cursorTrail.style.width = "10px";
            cursorTrail.style.height = "10px";
            cursorTrail.style.opacity = "0.6";
            cursorTrail.classList.remove("glow-effect");
        });
    });

    if ("ontouchstart" in window) {
        cursorTrail.style.display = "none";
    }
}

function initStarField() {
    const starField = document.getElementById("star-field");
    if (!starField) return;

    starField.innerHTML = "";

    const starsCount = 200;

    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement("div");
        star.className = "particle";
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.width = Math.random() * 2 + "px";
        star.style.height = star.style.width;

        star.style.position = "absolute";
        star.style.backgroundColor = "#fff";
        star.style.borderRadius = "50%";

        if (Math.random() > 0.7) {
            star.style.animation = `starPulse ${Math.random() * 5 + 3}s infinite`;
        }

        starField.appendChild(star);
    }

    if (!document.getElementById("starfield-style")) {
        const styleElement = document.createElement("style");
        styleElement.id = "starfield-style";
        styleElement.textContent = `
              @keyframes starPulse {
                  0%, 100% { opacity: 0.2; }
                  50% { opacity: 1; box-shadow: 0 0 10px #fff, 0 0 20px #fff; }
              }
          `;
        document.head.appendChild(styleElement);
    }
}

function initHoverEffects() {
    const glowElements = document.querySelectorAll(
        ".category, .movie-card, .new-badge"
    );

    glowElements.forEach((element) => {
        element.addEventListener("mouseenter", (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            element.style.setProperty("--glow-x", `${x}px`);
            element.style.setProperty("--glow-y", `${y}px`);
            element.classList.add("glowing");
        });

        element.addEventListener("mousemove", (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            element.style.setProperty("--glow-x", `${x}px`);
            element.style.setProperty("--glow-y", `${y}px`);
        });

        element.addEventListener("mouseleave", () => {
            element.classList.remove("glowing");
        });
    });

    if (!document.getElementById("glow-effect-style")) {
        const styleElement = document.createElement("style");
        styleElement.id = "glow-effect-style";
        styleElement.textContent = `
              .glowing {
                  position: relative;
                  z-index: 1;
              }
              .glowing::before {
                  content: '';
                  position: absolute;
                  top: -5px;
                  left: -5px;
                  right: -5px;
                  bottom: -5px;
                  background: radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(229, 9, 20, 0.8), transparent 70%);
                  z-index: -1;
                  border-radius: inherit;
                  opacity: 0;
                  transition: opacity 0.3s ease;
                  pointer-events: none;
              }
              .glowing:hover::before {
                  opacity: 0.7;
              }
          `;
        document.head.appendChild(styleElement);
    }
}

function initHeaderScroll() {
    const header = document.querySelector("header");
    if (!header) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

function initParallaxEffects() {
    const hero = document.querySelector(".hero");
    const heroBackground = document.querySelector(".hero-background");
    const heroContent = document.querySelector(".hero-content");

    if (hero && heroBackground && heroContent) {
        window.addEventListener("scroll", () => {
            const scrollPosition = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollPosition <= heroHeight) {
                const parallaxValue = scrollPosition * 0.4;
                heroBackground.style.transform = `translateY(${parallaxValue}px)`;
            }
        });
    }

    const sections = document.querySelectorAll(".section-title, .movies-row");

    window.addEventListener("scroll", () => {
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollFactor = Math.min(
                    1,
                    (windowHeight - rect.top) / windowHeight
                );
                section.style.opacity = Math.max(0.5, scrollFactor);
                section.style.transform = `translateY(${(1 - scrollFactor) * 30}px)`;
            }
        });
    });
}

function initLogoAnimation() {
    const logo = document.querySelector(".logo");
    if (!logo) return;

    if (logo.dataset.initialized) return;
    logo.dataset.initialized = true;

    const originalContent = logo.innerHTML;
    const textParts = originalContent.split("<span>");
    const firstPart = textParts[0];
    let secondPart = "";

    if (textParts.length > 1) {
        secondPart = textParts[1].replace("</span>", "");
    }

    let newContent = "";

    [...firstPart].forEach((letter, index) => {
        newContent += `<span class="logo-letter" style="animation-delay: ${index * 0.05}s">${letter}</span>`;
    });

    if (secondPart) {
        newContent += '<span class="flix-part">';
        [...secondPart].forEach((letter, index) => {
            newContent += `<span class="logo-letter" style="animation-delay: ${(firstPart.length + index) * 0.05}s">${letter}</span>`;
        });
        newContent += "</span>";
    }

    logo.innerHTML = newContent;

    if (!document.getElementById("logo-animation-style")) {
        const styleElement = document.createElement("style");
        styleElement.id = "logo-animation-style";
        styleElement.textContent = `
              .logo-letter {
                  display: inline-block;
                  transform: translateY(0);
                  transition: transform 0.3s ease, text-shadow 0.3s ease;
              }
              
              .flix-part {
                  color: #E50914;
                  position: relative;
              }
              
              .flix-part::after {
                  content: '';
                  position: absolute;
                  bottom: -5px;
                  left: 0;
                  width: 100%;
                  height: 2px;
                  background: #E50914;
                  box-shadow: 0 0 10px #E50914;
                  transform: scaleX(0);
                  transform-origin: left;
                  transition: transform 0.3s ease;
              }
              
              .logo:hover .flix-part::after {
                  transform: scaleX(1);
              }
              
              .logo:hover .logo-letter {
                  animation: logoFloat 1s infinite alternate ease-in-out;
              }
              
              @keyframes logoFloat {
                  0% {
                      transform: translateY(0);
                      text-shadow: 0 0 5px rgba(229, 9, 20, 0.5);
                  }
                  100% {
                      transform: translateY(-5px);
                      text-shadow: 0 0 15px rgba(229, 9, 20, 0.8), 0 0 30px rgba(229, 9, 20, 0.6);
                  }
              }
          `;
        document.head.appendChild(styleElement);
    }
}

function initSectionTransitions() {
    const sections = document.querySelectorAll(
        "section, .movies-row, .footer-content"
    );

    if (!sections.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("section-visible");

                const childElements = entry.target.querySelectorAll(
                    ".movie-card, .category, .footer-section"
                );
                childElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add("element-visible");
                    }, index * 100);
                });

                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach((section) => {
        section.classList.add("section-hidden");
        sectionObserver.observe(section);
    });

    if (!document.getElementById("section-transition-style")) {
        const styleElement = document.createElement("style");
        styleElement.id = "section-transition-style";
        styleElement.textContent = `
              .section-hidden {
                  opacity: 0;
                  transform: translateY(30px);
                  transition: opacity 0.6s ease, transform 0.6s ease;
              }
              
              .section-visible {
                  opacity: 1;
                  transform: translateY(0);
              }
              
              .movie-card, .category, .footer-section {
                  opacity: 0;
                  transform: translateY(20px);
                  transition: opacity 0.5s ease, transform 0.5s ease;
              }
              
              .element-visible {
                  opacity: 1;
                  transform: translateY(0);
              }
          `;
        document.head.appendChild(styleElement);
    }
}

function initButtonEffects() {
    const buttons = document.querySelectorAll(".responsive-btn, .btn");

    buttons.forEach((button) => {
        button.addEventListener("click", function (e) {
            if (button.tagName === "A" && button.getAttribute("href")) return;

            const ripples = this.querySelectorAll(".ripple");
            ripples.forEach((ripple) => ripple.remove());

            const ripple = document.createElement("span");
            ripple.className = "ripple";
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

            setTimeout(() => {
                if (ripple.parentNode === this) {
                    this.removeChild(ripple);
                }
            }, 600);
        });
    });

    if (!document.getElementById("button-ripple-style")) {
        const styleElement = document.createElement("style");
        styleElement.id = "button-ripple-style";
        styleElement.textContent = `
              .btn, .movie-btn, .responsive-btn {
                  position: relative;
                  overflow: hidden;
              }
              
              .ripple {
                  position: absolute;
                  border-radius: 50%;
                  background-color: rgba(255, 255, 255, 0.4);
                  transform: scale(0);
                  animation: ripple-effect 0.6s linear;
                  pointer-events: none;
              }
              
              @keyframes ripple-effect {
                  to {
                      transform: scale(1);
                      opacity: 0;
                  }
              }
          `;
        document.head.appendChild(styleElement);
    }

    const primaryButtons = document.querySelectorAll(".btn-primary");
    primaryButtons.forEach((button) => {
        button.addEventListener("mouseenter", () => {
            createParticles(button, 5);
        });

        button.addEventListener("click", () => {
            createParticles(button, 10);
        });
    });
}

function createParticles(element, count = 5) {
    if (!document.getElementById("particles-style")) {
        const styleElement = document.createElement("style");
        styleElement.id = "particles-style";
        styleElement.textContent = `
              .particle {
                  position: absolute;
                  background-color: #E50914;
                  border-radius: 50%;
                  pointer-events: none;
                  opacity: 0.8;
                  z-index: 10;
              }
              
              @keyframes particleFade {
                  0% {
                      opacity: 0.8;
                      transform: translate(0, 0) scale(1);
                  }
                  100% {
                      opacity: 0;
                      transform: translate(var(--tx, 0), var(--ty, -50px)) scale(0);
                  }
              }
          `;
        document.head.appendChild(styleElement);
    }

    for (let i = 0; i < count; i++) {
        const particle = document.createElement("span");
        particle.className = "particle";

        const x = (Math.random() - 0.5) * 60;
        const y = (Math.random() - 0.5) * 60;

        const tx = (Math.random() - 0.5) * 100;
        const ty = (Math.random() - 0.5) * 100;

        particle.style.setProperty("--tx", `${tx}px`);
        particle.style.setProperty("--ty", `${ty}px`);

        particle.style.left = `calc(50% + ${x}px)`;
        particle.style.top = `calc(50% + ${y}px)`;

        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const duration = Math.random() * 1 + 0.5;
        particle.style.animation = `particleFade ${duration}s forwards`;

        element.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode === element) {
                element.removeChild(particle);
            }
        }, duration * 1000);
    }
}
