/* ── Scroll Reveal ── */
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });
sections.forEach(s => observer.observe(s));

/* ── Slideshow ── */
const track = document.getElementById('slidesTrack');
const dotsEl = document.getElementById('slideDots');
const slides = track.querySelectorAll('.slide');
let current = 0;
let autoTimer;

// Build dots
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to project ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
});

function updateDots() {
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
    });
}

function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
}

document.getElementById('prevBtn').addEventListener('click', () => {
    goTo(current - 1);
    resetAuto();
});
document.getElementById('nextBtn').addEventListener('click', () => {
    goTo(current + 1);
    resetAuto();
});

// Auto-advance every 5 seconds
function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
}
function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
}
startAuto();

// Touch / swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetAuto();
    }
});

/* ── Project Card Modals ── */
function openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Open modal on card click (but not when clicking the "View Project" link)
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', e => {
        // Don't open modal if the user clicked the external link
        if (e.target.closest('.project-link')) return;
        const modalId = card.dataset.modal;
        if (modalId) openModal(modalId);
    });
});

// Close on ✕ button click
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const overlay = btn.closest('.modal-overlay');
        closeModal(overlay);
    });
});

// Close on overlay backdrop click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay);
    });
});

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
    }
});