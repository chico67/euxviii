/* =====================================================
EUREKA — THE DECADE & EIGHT
Interactions & animations
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

/* ---------------------------------------------------
    FALLING PETALS / GOLD DUST
--------------------------------------------------- */
const petalField = document.getElementById('petals');
const PETAL_COUNT = 28;
for (let i = 0; i < PETAL_COUNT; i++) {
const p = document.createElement('span');
const size = 4 + Math.random() * 6;
p.style.left = Math.random() * 100 + 'vw';
p.style.width = size + 'px';
p.style.height = size + 'px';
p.style.animationDuration = (10 + Math.random() * 14) + 's';
p.style.animationDelay = (Math.random() * -20) + 's';
p.style.opacity = (0.25 + Math.random() * 0.4).toFixed(2);
petalField.appendChild(p);
}

/* ---------------------------------------------------
    SCROLL REVEAL (stagger within each section)
--------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');
revealEls.forEach((el, globalIndex) => {
const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal')) : [];
const localIndex = siblings.indexOf(el);
const delay = Math.min(localIndex, 6) * 0.12;
el.style.setProperty('--d', delay + 's');
});

const revealObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
    }
});
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---------------------------------------------------
    COUNTDOWN
--------------------------------------------------- */
const eventDate = new Date('July 4, 2026 18:00:00').getTime();
const countdownEl = document.getElementById('countdown');

function updateCountdown() {
const now = Date.now();
const diff = Math.max(0, eventDate - now);

const days = Math.floor(diff / (1000 * 60 * 60 * 24));
const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
const mins = Math.floor((diff / (1000 * 60)) % 60);
const secs = Math.floor((diff / 1000) % 60);

setUnit('days', days);
setUnit('hours', hours);
setUnit('mins', mins);
setUnit('secs', secs);
}

function setUnit(unit, value) {
const el = countdownEl.querySelector(`[data-unit="${unit}"]`);
if (!el) return;
const padded = String(value).padStart(2, '0');
if (el.textContent !== padded) {
    el.textContent = padded;
    el.classList.remove('is-tick');
    // restart animation
    requestAnimationFrame(() => el.classList.add('is-tick'));
}
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------------------------------------------------
    ENVELOPE GATE
--------------------------------------------------- */
const gate = document.getElementById('gate');
const envelope = document.getElementById('envelope');
const seal = document.getElementById('seal');
const sparkles = document.getElementById('sparkles');
const main = document.getElementById('main');
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const cinematic = document.getElementById('cinematic');
const cinematicVideo = document.getElementById('cinematicVideo');
const skipCinematic = document.getElementById('skipCinematic');

function isPhonePortrait() {
    return window.matchMedia('(max-width: 760px) and (orientation: portrait)').matches;
}
// idle twinkling sparkles around the envelope
for (let i = 0; i < 18; i++) {
const s = document.createElement('span');
s.style.left = Math.random() * 100 + '%';
s.style.top = Math.random() * 100 + '%';
s.style.animationDuration = (1.8 + Math.random() * 2.4) + 's';
s.style.animationDelay = (Math.random() * 3) + 's';
ambientSparkles.appendChild(s);
}
let opened = false;

function burstSparkles() {
const sealRect = seal.getBoundingClientRect();
const envRect = envelope.getBoundingClientRect();
const cx = sealRect.left - envRect.left + sealRect.width / 2;
const cy = sealRect.top - envRect.top + sealRect.height / 2;

for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 90;
    s.style.left = cx + 'px';
    s.style.top = cy + 'px';
    s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    s.style.animationDelay = (Math.random() * 0.2) + 's';
    sparkles.appendChild(s);
    setTimeout(() => s.remove(), 5000);
}
}

function startCelebration() {
main.style.display = 'block';
document.body.style.overflow = 'auto';

// confetti burst
if (window.confetti) {
    confetti({
    particleCount: 220,
    spread: 120,
    startVelocity: 38,
    colors: ['#d9b56a', '#8a5cf6', '#f4e3b3', '#cdb6f5'],
    origin: { y: 0.6 }
    });
}

// music
music.volume = 0.35;
music.play().then(() => {
    musicBtn.classList.add('is-playing');
}).catch(() => {
    /* autoplay blocked — user can press the music button */
});
musicBtn.disabled = false;
musicBtn.classList.add('is-ready');
}

function endCinematic() {
cinematic.classList.remove('is-active');
cinematic.classList.add('is-hidden');
cinematicVideo.pause();
startCelebration();
}


envelope.addEventListener('click', () => {
if (opened) return;
opened = true;

seal.classList.add('is-pressed');
setTimeout(() => seal.classList.remove('is-pressed'), 150);

setTimeout(() => burstSparkles(), 120);

envelope.classList.add('is-open');

setTimeout(() => {
    gate.classList.add('is-hidden');

    // play cinematic intro (with sound), then reveal the celebration
    cinematic.classList.add('is-active');
    cinematicVideo.currentTime = 0;
    cinematicVideo.volume = 0.9;
    music.pause();
    musicBtn.classList.remove('is-playing');

    let cinematicTimer = null;
    let remaining = 10000; // ms left in the cinematic
    let segmentStart = Date.now();

    function pauseForRotate() {
    if (cinematicTimer) {
        clearTimeout(cinematicTimer);
        cinematicTimer = null;
        remaining -= (Date.now() - segmentStart);
        if (remaining < 0) remaining = 0;
    }
    cinematicVideo.pause();
    }

    function resumeAfterRotate() {
    cinematicVideo.play().catch(() => {});
    segmentStart = Date.now();
    cinematicTimer = setTimeout(endCinematic, remaining);
    }

    function checkOrientation() {
    if (isPhonePortrait()) {
        pauseForRotate();
    } else {
        resumeAfterRotate();
    }
    }

    // start playback (paused immediately if already in portrait)
    cinematicVideo.play().catch(() => {
    cinematicVideo.muted = true;
    cinematicVideo.play().catch(() => {});
    });

    if (isPhonePortrait()) {
    pauseForRotate();
    } else {
    cinematicTimer = setTimeout(endCinematic, remaining);
    }

    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    cinematicVideo.addEventListener('ended', () => {
    if (cinematicTimer) clearTimeout(cinematicTimer);
    window.removeEventListener('orientationchange', checkOrientation);
    window.removeEventListener('resize', checkOrientation);
    endCinematic();
    }, { once: true });

    skipCinematic.addEventListener('click', () => {
    if (cinematicTimer) clearTimeout(cinematicTimer);
    window.removeEventListener('orientationchange', checkOrientation);
    window.removeEventListener('resize', checkOrientation);
    endCinematic();
    }, { once: true });

}, 4500);
});

// lock scroll until opened
document.body.style.overflow = 'hidden';

/* ---------------------------------------------------
    MUSIC TOGGLE
--------------------------------------------------- */
musicBtn.addEventListener('click', () => {
if (music.paused) {
    music.play();
    musicBtn.classList.add('is-playing');
} else {
    music.pause();
    musicBtn.classList.remove('is-playing');
}
});

/* ---------------------------------------------------
    SCROLL PROGRESS BAR
--------------------------------------------------- */
const progressFill = document.getElementById('progressFill');
function updateProgress() {
const scrollTop = window.scrollY;
const docHeight = document.documentElement.scrollHeight - window.innerHeight;
const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
progressFill.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ---------------------------------------------------
    SIDE NAV — SCROLL SPY
--------------------------------------------------- */
const navLinks = document.querySelectorAll('.side-nav a');
const navSections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));

const spyObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
    const id = '#' + entry.target.id;
    navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === id);
    });
    }
});
}, { threshold: 0.5 });

navSections.forEach(sec => { if (sec) spyObserver.observe(sec); });

/* ---------------------------------------------------
    18 CELEBRATIONS TABS
--------------------------------------------------- */
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const indicator = document.querySelector('.tab-indicator');

function positionIndicator(tab) {
indicator.style.width = tab.offsetWidth + 'px';
indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
}

tabs.forEach(tab => {
tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    panels.forEach(p => p.classList.remove('is-active'));

    tab.classList.add('is-active');
    document.getElementById(tab.dataset.target).classList.add('is-active');
    positionIndicator(tab);
});
});

// initial indicator position (after fonts/layout settle)
window.addEventListener('load', () => {
const active = document.querySelector('.tab.is-active');
if (active) positionIndicator(active);
});
setTimeout(() => {
const active = document.querySelector('.tab.is-active');
if (active) positionIndicator(active);
}, 400);

/* ---------------------------------------------------
    LIGHTBOX (gallery + dress code)
--------------------------------------------------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.querySelector('.lightbox__close');

document.querySelectorAll('[data-src]').forEach(el => {
el.addEventListener('click', () => {
    lightboxImg.src = el.dataset.src;
    lightboxImg.alt = el.querySelector('img')?.alt || '';
    lightbox.classList.add('is-open');
});
});

function closeLightbox() {
lightbox.classList.remove('is-open');
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') closeLightbox();
});

/* ---------------------------------------------------
    RSVP FORM
--------------------------------------------------- */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

rsvpForm.addEventListener('submit', (e) => {
e.preventDefault();

rsvpSuccess.classList.add('is-visible');

if (window.confetti) {
    confetti({
    particleCount: 140,
    spread: 90,
    colors: ['#d9b56a', '#8a5cf6', '#f4e3b3'],
    origin: { y: 0.7 }
    });
}

rsvpForm.reset();
setTimeout(() => rsvpSuccess.classList.remove('is-visible'), 4500);
});

});

/* ---------------------------------------------------
    RSVP FORM — sends submissions to Google Sheet
--------------------------------------------------- */
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzRheItZxEn8Ve_OOIrb-ENqc1cqmp5VbLYhSvkSyNbqBUiFbTBNWNt-yN9DDS7SX7Wdg/exec';

const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const rsvpSubmitBtn = rsvpForm.querySelector('button[type="submit"]');

rsvpForm.addEventListener('submit', (e) => {
e.preventDefault();

const payload = {
    name: document.getElementById('rsvpName').value.trim(),
    status: document.getElementById('rsvpStatus').value === 'attend'
    ? 'Joyfully Accepts' : 'Regretfully Declines',
    guests: document.getElementById('rsvpGuests').value || '1',
    message: document.getElementById('rsvpMessage').value.trim()
};

rsvpSubmitBtn.disabled = true;
const originalLabel = rsvpSubmitBtn.innerHTML;
rsvpSubmitBtn.innerHTML = '<span>Sending...</span>';

fetch(RSVP_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors', // Apps Script doesn't return CORS headers; this still delivers the POST
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
})
    .then(() => {
    rsvpSuccess.textContent = 'Thank you! Your RSVP has been received. \u2713';
    rsvpSuccess.classList.add('is-visible');

    if (window.confetti) {
        confetti({
        particleCount: 140,
        spread: 90,
        colors: ['#d9b56a', '#8a5cf6', '#f4e3b3'],
        origin: { y: 0.7 }
        });
    }

    rsvpForm.reset();
    })
    .catch(() => {
    rsvpSuccess.textContent = 'Something went wrong. Please try again or message us directly.';
    rsvpSuccess.classList.add('is-visible');
    })
    .finally(() => {
    rsvpSubmitBtn.disabled = false;
    rsvpSubmitBtn.innerHTML = originalLabel;
    setTimeout(() => rsvpSuccess.classList.remove('is-visible'), 5000);
    });
});

