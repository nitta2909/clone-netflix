/**
 * CONTROLE DE SLIDERS PARA COSMIC FLIX
 * Este arquivo implementa a lógica para os carrosséis de conteúdo,
 * permitindo navegação suave entre cards de filmes e séries
 */

document.addEventListener("DOMContentLoaded", function () {
  initAllSliders();
  initTouchSupport();
  initKeyboardNavigation();
  initAutoplay();
  initLazyLoading();
});

/**
 * Inicializa todos os sliders da página
 */
function initAllSliders() {
  // Seleciona todos os containers de slider
  const sliderContainers = document.querySelectorAll(".movies-row");

  sliderContainers.forEach((container, index) => {
    initSingleSlider(container, index);
  });

  console.log("Sliders inicializados: " + sliderContainers.length);
}

/**
 * Inicializa um slider individual com configurações avançadas
 */
function initSingleSlider(container, index) {
  const slider = container.querySelector(".movies-slider");
  const prevBtn = container.querySelector(".prev-btn");
  const nextBtn = container.querySelector(".next-btn");

  if (!slider || !prevBtn || !nextBtn) return;

  // Calcular tamanho dos cards com base no container
  const containerWidth = container.clientWidth;
  const cardWidth = getCardWidth(containerWidth);
  const cardsPerView = Math.floor(containerWidth / cardWidth);

  // Set data attributes para uso posterior
  slider.dataset.index = 0;
  slider.dataset.cardsPerView = cardsPerView;
  slider.dataset.totalCards = slider.children.length;
  slider.dataset.sliderIndex = index;

  // Configuração inicial dos botões
  updateButtonVisibility(slider, prevBtn, nextBtn);

  // Event listeners para os botões
  nextBtn.addEventListener("click", () => {
    navigateSlider(slider, "next", cardWidth, prevBtn, nextBtn);
  });

  prevBtn.addEventListener("click", () => {
    navigateSlider(slider, "prev", cardWidth, prevBtn, nextBtn);
  });

  // Ajustar ao redimensionar a janela
  window.addEventListener("resize", () => {
    const newContainerWidth = container.clientWidth;
    const newCardWidth = getCardWidth(newContainerWidth);
    const newCardsPerView = Math.floor(newContainerWidth / newCardWidth);

    slider.dataset.cardsPerView = newCardsPerView;

    // Reset posição ao redimensionar
    slider.scrollLeft = 0;
    slider.dataset.index = 0;

    updateButtonVisibility(slider, prevBtn, nextBtn);
  });

  // Adicionar listener de scroll para atualizar os botões
  slider.addEventListener("scroll", () => {
    updateButtonVisibility(slider, prevBtn, nextBtn);
  });
}

/**
 * Navega pelo slider na direção especificada
 */
function navigateSlider(slider, direction, cardWidth, prevBtn, nextBtn) {
  const cardsPerView = parseInt(slider.dataset.cardsPerView);
  const totalCards = parseInt(slider.dataset.totalCards);
  let currentIndex = parseInt(slider.dataset.index);

  if (direction === "next") {
    // Limitar o índice máximo
    currentIndex = Math.min(
      currentIndex + cardsPerView,
      totalCards - cardsPerView
    );
  } else {
    // Limitar o índice mínimo
    currentIndex = Math.max(currentIndex - cardsPerView, 0);
  }

  // Atualizar o índice no dataset
  slider.dataset.index = currentIndex;

  // Calcular a posição de scroll
  const scrollPosition = currentIndex * (cardWidth + 15); // 15px é o gap entre cards

  // Aplicar scroll com animação suave
  slider.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  });

  // Atualizar visibilidade dos botões
  updateButtonVisibility(slider, prevBtn, nextBtn);
}

/**
 * Atualiza a visibilidade dos botões de navegação
 */
function updateButtonVisibility(slider, prevBtn, nextBtn) {
  const cardsPerView = parseInt(slider.dataset.cardsPerView) || 1;
  const totalCards = parseInt(slider.dataset.totalCards) || 1;
  const currentIndex = parseInt(slider.dataset.index) || 0;

  // Verificar se estamos no início ou fim do slider
  if (currentIndex <= 0) {
    prevBtn.classList.add("disabled");
    prevBtn.style.opacity = "0";
  } else {
    prevBtn.classList.remove("disabled");
    prevBtn.style.opacity = "1";
  }

  if (currentIndex >= totalCards - cardsPerView) {
    nextBtn.classList.add("disabled");
    nextBtn.style.opacity = "0";
  } else {
    nextBtn.classList.remove("disabled");
    nextBtn.style.opacity = "1";
  }
}

/**
 * Calcula a largura dos cards com base no tamanho do container
 */
function getCardWidth(containerWidth) {
  if (containerWidth < 480) {
    return 140; // Mobile
  } else if (containerWidth < 768) {
    return 160; // Tablet
  } else if (containerWidth < 1024) {
    return 180; // Small desktop
  } else {
    return 215; // Large desktop
  }
}

/**
 * Adiciona suporte a gestos de toque para os sliders
 */
function initTouchSupport() {
  const sliders = document.querySelectorAll(".movies-slider");

  sliders.forEach((slider) => {
    let startX,
      startScrollLeft,
      isDragging = false;

    // Event listeners para toques e arrastar
    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      slider.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = slider.scrollLeft;
      e.preventDefault();
    });

    slider.addEventListener("touchstart", (e) => {
      isDragging = true;
      slider.classList.add("dragging");
      startX = e.touches[0].pageX;
      startScrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const x = e.pageX;
      const walk = (x - startX) * 2; // Velocidade do arrasto
      slider.scrollLeft = startScrollLeft - walk;
    });

    slider.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX;
      const walk = (x - startX) * 2;
      slider.scrollLeft = startScrollLeft - walk;
      e.preventDefault();
    });

    // Event listeners para finalizar o arrasto
    window.addEventListener("mouseup", () => {
      isDragging = false;
      slider.classList.remove("dragging");
    });

    window.addEventListener("touchend", () => {
      isDragging = false;
      slider.classList.remove("dragging");
    });
  });

  // Adiciona estilo para o slider quando está sendo arrastado
  if (!document.getElementById("drag-style")) {
    const styleElement = document.createElement("style");
    styleElement.id = "drag-style";
    styleElement.textContent = `
          .dragging {
              cursor: grabbing;
              scroll-behavior: auto !important;
          }
          
          .movies-slider {
              cursor: grab;
          }
      `;
    document.head.appendChild(styleElement);
  }
}

/**
 * Adiciona navegação por teclado para os sliders
 */
function initKeyboardNavigation() {
  let focusedSliderIndex = -1;
  const sliders = document.querySelectorAll(".movies-slider");

  // Detectar quando um usuário foca em um card dentro de um slider
  document.addEventListener("focusin", (e) => {
    if (e.target.closest(".movie-card")) {
      const slider = e.target.closest(".movies-slider");
      if (slider && slider.dataset.sliderIndex) {
        focusedSliderIndex = parseInt(slider.dataset.sliderIndex);
      }
    }
  });

  // Navegação com setas do teclado
  document.addEventListener("keydown", (e) => {
    if (focusedSliderIndex === -1) return;

    const slider = sliders[focusedSliderIndex];
    if (!slider) return;

    const prevBtn = slider.parentElement.querySelector(".prev-btn");
    const nextBtn = slider.parentElement.querySelector(".next-btn");

    if (!prevBtn || !nextBtn) return;

    switch (e.key) {
      case "ArrowRight":
        // Navegação para a direita
        if (!nextBtn.classList.contains("disabled")) {
          navigateSlider(
            slider,
            "next",
            getCardWidth(slider.parentElement.clientWidth),
            prevBtn,
            nextBtn
          );
        }
        break;
      case "ArrowLeft":
        // Navegação para a esquerda
        if (!prevBtn.classList.contains("disabled")) {
          navigateSlider(
            slider,
            "prev",
            getCardWidth(slider.parentElement.clientWidth),
            prevBtn,
            nextBtn
          );
        }
        break;
    }
  });
}

/**
 * Inicializa o carregamento preguiçoso de imagens
 */
function initLazyLoading() {
  // Verificar se o navegador suporta IntersectionObserver
  if ("IntersectionObserver" in window) {
    const imgOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const dataSrc = img.getAttribute("data-src");

          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute("data-src");
            img.classList.add("loaded");
          }

          observer.unobserve(img);
        }
      });
    }, imgOptions);

    // Selecionar todas as imagens com atributo data-src
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      imgObserver.observe(img);
    });
  } else {
    // Fallback para navegadores que não suportam IntersectionObserver
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
  }

  // Adiciona estilo para o efeito de carregamento
  if (!document.getElementById("lazy-loading-style")) {
    const styleElement = document.createElement("style");
    styleElement.id = "lazy-loading-style";
    styleElement.textContent = `
          img:not(.loaded) {
              opacity: 0;
              transition: opacity 0.5s ease;
          }
          
          img.loaded {
              opacity: 1;
          }
      `;
    document.head.appendChild(styleElement);
  }
}

/**
 * Inicializa o autoplay para sliders destacados
 */
function initAutoplay() {
  // Selecionar apenas o primeiro slider para autoplay (geralmente o de destaques)
  const featuredSlider = document.querySelector(
    ".movies-row:first-of-type .movies-slider"
  );

  if (!featuredSlider) return;

  const prevBtn = featuredSlider.parentElement.querySelector(".prev-btn");
  const nextBtn = featuredSlider.parentElement.querySelector(".next-btn");
  const cardWidth = getCardWidth(featuredSlider.parentElement.clientWidth);

  // Configurar intervalo de autoplay
  const autoplayInterval = 8000; // 8 segundos
  let autoplayTimer;

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      // Verificar se o botão próximo não está desativado
      if (!nextBtn.classList.contains("disabled")) {
        navigateSlider(featuredSlider, "next", cardWidth, prevBtn, nextBtn);
      } else {
        // Voltar ao início quando chegar ao fim
        featuredSlider.dataset.index = 0;
        featuredSlider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
        updateButtonVisibility(featuredSlider, prevBtn, nextBtn);
      }
    }, autoplayInterval);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  // Iniciar autoplay
  startAutoplay();

  // Parar autoplay quando o usuário interagir
  featuredSlider.addEventListener("mouseenter", stopAutoplay);
  prevBtn.addEventListener("mouseenter", stopAutoplay);
  nextBtn.addEventListener("mouseenter", stopAutoplay);

  // Reiniciar quando o mouse sair
  featuredSlider.addEventListener("mouseleave", startAutoplay);
  prevBtn.addEventListener("mouseleave", startAutoplay);
  nextBtn.addEventListener("mouseleave", startAutoplay);

  // Parar em dispositivos de toque
  featuredSlider.addEventListener("touchstart", stopAutoplay);

  // Parar se o usuário mudar de aba
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });
}

/**
 * Cria um efeito de carregamento inicial para os sliders
 */
function createSkeletonLoading() {
  const sliders = document.querySelectorAll(".movies-slider");

  sliders.forEach((slider) => {
    // Verifica se já tem cards
    if (slider.children.length === 0) {
      // Adiciona cards de esqueleto para simulação de carregamento
      for (let i = 0; i < 5; i++) {
        const skeletonCard = document.createElement("div");
        skeletonCard.className = "movie-card skeleton";
        slider.appendChild(skeletonCard);
      }
    }
  });

  // Adiciona estilo para o efeito de esqueleto se não existir
  if (!document.getElementById("skeleton-style")) {
    const styleElement = document.createElement("style");
    styleElement.id = "skeleton-style";
    styleElement.textContent = `
          .skeleton {
              background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
              background-size: 200% 100%;
              animation: skeleton-loading 1.5s infinite;
          }
          
          @keyframes skeleton-loading {
              0% {
                  background-position: 200% 0;
              }
              100% {
                  background-position: -200% 0;
              }
          }
      `;
    document.head.appendChild(styleElement);
  }

  // Remove os esqueletos após um tempo simulando o carregamento
  setTimeout(() => {
    document.querySelectorAll(".skeleton").forEach((skeleton) => {
      skeleton.classList.remove("skeleton");
    });
  }, 2000);
}

// Executa o carregamento de esqueleto se configurado
if (window.loadWithSkeleton) {
  createSkeletonLoading();
}