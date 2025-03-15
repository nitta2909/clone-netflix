function initStarField() {
  const starField = document.getElementById("star-field");
  if (!starField) return;

  const starsCount = 200;

  for (let i = 0; i < starsCount; i++) {
    const star = document.createElement("div");
    star.className = "particle";
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    star.style.width = Math.random() * 2 + "px";
    star.style.height = star.style.width;

    if (Math.random() > 0.7) {
      star.style.animation = `pulseGlow ${Math.random() * 5 + 3}s infinite`;
    }

    starField.appendChild(star);
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

function initSearchBox() {
  const searchBox = document.querySelector(".search-box");
  const searchBtn = document.querySelector(".search-btn");
  const searchInput = document.querySelector(".search-box input");

  if (!searchBox || !searchBtn || !searchInput) {
    console.log("Elementos de busca não encontrados");
    return;
  }

  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
      setTimeout(() => searchInput.focus(), 50);
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target) && !searchBtn.contains(e.target)) {
      searchBox.classList.remove("active");
    }
  });
}

function initProfileMenu() {
  const profile = document.querySelector(".profile");
  const profileMenu = document.querySelector(".profile-menu");

  if (!profile || !profileMenu) {
    console.log("Elemento de perfil não encontrado");
    return;
  }

  profile.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!profile.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.remove("active");
    }
  });
}

function initMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (!mobileMenuToggle || !mobileMenu) return;

  mobileMenuToggle.addEventListener("click", () => {
    mobileMenuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains("active")) {
      mobileMenuToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
}

function initSliders() {
  document.querySelectorAll(".movies-row").forEach((row) => {
    const slider = row.querySelector(".movies-slider");
    const prevBtn = row.querySelector(".prev-btn");
    const nextBtn = row.querySelector(".next-btn");

    if (!slider || !prevBtn || !nextBtn) return;

    const cardWidth = 215;

    nextBtn.addEventListener("click", () => {
      slider.scrollBy({
        left: cardWidth * 3,
        behavior: "smooth",
      });
    });

    prevBtn.addEventListener("click", () => {
      slider.scrollBy({
        left: -cardWidth * 3,
        behavior: "smooth",
      });
    });

    function checkButtonsVisibility() {
      if (slider.scrollLeft <= 0) {
        prevBtn.style.opacity = "0";
      } else {
        prevBtn.style.opacity = "1";
      }

      if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth) {
        nextBtn.style.opacity = "0";
      } else {
        nextBtn.style.opacity = "1";
      }
    }

    slider.addEventListener("scroll", checkButtonsVisibility);
    window.addEventListener("resize", checkButtonsVisibility);

    setTimeout(checkButtonsVisibility, 100);
  });
}

function initStaggeredAnimation() {
  const items = document.querySelectorAll(
    ".category, .movie-card, .trending-card, .modern-card"
  );

  if (items.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("staggered-item");
            entry.target.style.animationDelay = `${index * 0.1}s`;
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  items.forEach((item) => {
    observer.observe(item);
  });
}

function initMovieCards() {
  const movieCards = document.querySelectorAll(
    ".movie-card, .trending-card, .modern-card"
  );
  const modal = document.getElementById("movieModal");

  if (!movieCards.length || !modal) return;

  const closeModal = modal.querySelector(".close-modal");

  movieCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title =
        card.querySelector(".movie-title")?.textContent ||
        "Título não disponível";
      const poster = card.querySelector("img")?.src || "";
      const description =
        card.querySelector(".movie-description")?.textContent || "";

      modal.querySelector(".modal-title").textContent = title;
      modal.querySelector(".modal-description").textContent = description;

      modal.classList.add("active");
    });
  });

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

function initViewModeToggle() {
  const viewModeToggle = document.getElementById("viewModeToggle");
  const moviesRow = document.querySelectorAll(".movies-row");
  const moviesModernGrid = document.querySelector(".movies-modern-grid");

  if (!viewModeToggle || !moviesRow.length || !moviesModernGrid) return;

  viewModeToggle.addEventListener("change", () => {
    if (viewModeToggle.checked) {
      moviesRow.forEach((row) => {
        row.style.display = "none";
      });
      moviesModernGrid.style.display = "grid";

      createModernCards();
    } else {
      moviesRow.forEach((row) => {
        row.style.display = "block";
      });
      moviesModernGrid.style.display = "none";
    }
  });

  function createModernCards() {
    moviesModernGrid.innerHTML = "";

    const allMovieCards = document.querySelectorAll(".movie-card");

    const maxCards = Math.min(allMovieCards.length, 12);

    for (let i = 0; i < maxCards; i++) {
      const originalCard = allMovieCards[i];
      const title =
        originalCard.querySelector(".movie-title")?.textContent ||
        "Título não disponível";
      const poster = originalCard.querySelector("img")?.src || "";
      const description =
        originalCard.querySelector(".movie-description")?.textContent || "";
      const metaItems = originalCard.querySelectorAll(".movie-meta span");

      let metaHTML = "";
      metaItems.forEach((meta) => {
        metaHTML += `<span>${meta.textContent}</span>`;
      });

      const modernCard = document.createElement("div");
      modernCard.className = "modern-card glow-border";
      modernCard.innerHTML = `
                <img src="${poster}" alt="${title}" class="modern-poster">
                <div class="modern-content">
                    <h3 class="modern-title">${title}</h3>
                    <div class="modern-meta">
                        ${metaHTML}
                    </div>
                    <p class="modern-description">${description}</p>
                    <div class="modern-buttons">
                        <button class="modern-btn responsive-btn">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 2L13 8L3 14V2Z" fill="white"/>
                            </svg>
                            <span>Assistir</span>
                        </button>
                        <button class="modern-btn responsive-btn">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 2V14M2 8H14" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <span>Adicionar</span>
                        </button>
                    </div>
                </div>
            `;

      moviesModernGrid.appendChild(modernCard);
    }

    initStaggeredAnimation();
  }
}

function initFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  if (!filterButtons.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      const filterType = button.textContent.trim();
      console.log(`Filtrando por: ${filterType}`);

      const reasonElement = document.querySelector(".recommendation-reasons");
      if (reasonElement) {
        if (filterType === "Todos") {
          reasonElement.textContent =
            'Porque você assistiu "Eclipse Lunar" e "Colônia Marte" recentemente';
        } else if (filterType === "Filmes") {
          reasonElement.textContent =
            "Filmes recomendados com base no seu histórico";
        } else if (filterType === "Séries") {
          reasonElement.textContent = "Séries que achamos que você vai gostar";
        } else if (filterType === "Sci-Fi") {
          reasonElement.textContent = "Porque você gosta de ficção científica";
        } else if (filterType === "Ação") {
          reasonElement.textContent =
            "Conteúdo de ação com mais de 85% de correspondência";
        }
      }
    });
  });
}

function initEpisodeSelector() {
  const seasonButtons = document.querySelectorAll(".season-btn");
  const episodeCards = document.querySelectorAll(".episode-card");

  if (!seasonButtons.length) return;

  seasonButtons.forEach((button) => {
    button.addEventListener("click", () => {
      seasonButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      const seasonText = button.textContent.trim();
      console.log(`Selecionado: ${seasonText}`);

      episodeCards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 100 + index * 50);
      });
    });
  });

  episodeCards.forEach((card) => {
    card.addEventListener("click", () => {
      const episodeTitle = card.querySelector(".episode-title").textContent;
      const episodeNumber = card.querySelector(".episode-number").textContent;

      alert(`Reproduzindo ${episodeTitle} (${episodeNumber})`);
    });
  });
}

function initTMDBApiIntegration() {
  const trendingCards = document.querySelectorAll(".trending-card");

  if (!trendingCards.length) return;

  console.log("Conectando à API TMDB...");

  setTimeout(() => {
    console.log("Dados recebidos da API");

    trendingCards.forEach((card, index) => {
      const rating = card.querySelector(".trending-rating span");
      if (rating) {
        const originalRating = parseFloat(rating.textContent);
        const newRating = (
          originalRating +
          (Math.random() * 0.4 - 0.2)
        ).toFixed(1);
        rating.textContent = newRating;
      }

      card.addEventListener("mouseenter", () => {
        card.classList.add("api-hover-effect");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("api-hover-effect");
      });
    });
  }, 1500);
}

function initRippleEffect() {
  const buttons = document.querySelectorAll(".responsive-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();

      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className = "ripple-effect";

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initCursorEffect();
  initStarField();
  initHeaderScroll();
  initSearchBox();
  initProfileMenu();
  initSliders();
  initStaggeredAnimation();
  initMovieCards();
  initMobileMenu();
  initViewModeToggle();
  initFilterButtons();
  initEpisodeSelector();
  initTMDBApiIntegration();
  initRippleEffect();
});

function initCursorEffect() {
  const cursorTrail = document.createElement("div");
  cursorTrail.className = "cursor-trail";
  document.body.appendChild(cursorTrail);

  let cursorX = 0,
    cursorY = 0;
  let trailX = 0,
    trailY = 0;

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
    ".btn, .movie-btn, .neo-button, .responsive-btn, .filter-btn, .season-btn"
  );
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      cursorTrail.style.width = "20px";
      cursorTrail.style.height = "20px";
    });

    button.addEventListener("mouseleave", () => {
      cursorTrail.style.width = "10px";
      cursorTrail.style.height = "10px";
    });
  });
}

const navLinks = document.querySelectorAll("nav ul li a");

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    if (this.parentElement.parentElement.tagName === "UL") {
      this.classList.add("active");
    }

    const targetId = this.getAttribute("href");
    
    if (targetId && targetId !== "#") {
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  initStarField();
  initHeaderScroll();
  initSearchBox();
  initProfileMenu();
  initSliders();
  initStaggeredAnimation();
  initMovieCards();
  initMobileMenu();
  initViewModeToggle();
  initFilterButtons();
  initEpisodeSelector();
  initTMDBApiIntegration();
  initRippleEffect();
  initCursorEffect();
});