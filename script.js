/* =============================================
   TOMÁS MARTÍN — PORTFOLIO JS
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // ===== NAVBAR MOBILE TOGGLE =====
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Cerrar nav al hacer click en un link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });

  // ===== SCROLL ANIMATIONS =====
  const fadeElements = document.querySelectorAll(
    ".bio-card, .bio-photo-frame, .trayectoria-block, .video-container, .galeria-item, .contacto-info, .contacto-form, .section-header"
  );

  fadeElements.forEach((el) => {
    el.classList.add("fade-in");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  fadeElements.forEach((el) => observer.observe(el));

  // ===== ACTIVE NAV LINK =====
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((link) => {
            link.style.color = "";
            const href = link.getAttribute("href").replace("#", "");
            if (href === entry.target.id) {
              link.style.color = "#e01e32";
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let galeriaImages = [];
  let currentIndex = 0;


  // Lightbox prev/next navega las imágenes del carrusel

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lbPrev.addEventListener("click", () => {
    if (galeriaImages.length === 0) return;
    currentIndex = (currentIndex - 1 + galeriaImages.length) % galeriaImages.length;
    lbImg.src = galeriaImages[currentIndex].src;
  });

  lbNext.addEventListener("click", () => {
    if (galeriaImages.length === 0) return;
    currentIndex = (currentIndex + 1) % galeriaImages.length;
    lbImg.src = galeriaImages[currentIndex].src;
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lbPrev.click();
    if (e.key === "ArrowRight") lbNext.click();
  });

  // ===== SMOOTH SCROLL for CTA =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ===== CARRUSEL =====
  const track = document.getElementById("carouselTrack");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const images = Array.from(track.querySelectorAll("img"));
  const total = images.length;
  let index = 0;

  // Crear dots
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "carousel-dots";
  images.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Foto ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  track.parentElement.after(dotsContainer);

  function goTo(n) {
    index = (n + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll(".carousel-dot").forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  nextBtn.addEventListener("click", () => goTo(index + 1));
  prevBtn.addEventListener("click", () => goTo(index - 1));

  // Swipe táctil
  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? index + 1 : index - 1);
  });

  // Click en imagen del carrusel → lightbox
  track.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    // Sync lightbox index con carrusel
    currentIndex = index;
    galeriaImages = images;
  });

});