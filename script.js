// --- Translations Dictionary ---
// Moved to translations.js for better maintainability


// --- DOM Elements ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('.fade-in-section');
const progressBar = document.getElementById('progressBar');
const filterBtns = document.querySelectorAll('.filter-btn');
const skillTags = document.querySelectorAll('.skill-tag');



// --- Mobile Menu ---
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// --- Scroll Progress Bar ---
window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercentage + '%';
});

// --- Skill Filtering ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        skillTags.forEach(tag => {
            if (filter === 'all' || tag.getAttribute('data-category') === filter) {
                tag.classList.remove('hidden');
            } else {
                tag.classList.add('hidden');
            }
        });
    });
});

// --- Intersection Observer (Scroll Animations) ---
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    });
}, observerOptions);
sections.forEach(section => observer.observe(section));

// --- Typewriter Effect ---
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }
    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];
        if (this.isDeleting) { this.txt = fullTxt.substring(0, this.txt.length - 1); }
        else { this.txt = fullTxt.substring(0, this.txt.length + 1); }
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
        let typeSpeed = 100;
        if (this.isDeleting) { typeSpeed /= 2; }
        if (!this.isDeleting && this.txt === fullTxt) { typeSpeed = this.wait; this.isDeleting = true; }
        else if (this.isDeleting && this.txt === '') { this.isDeleting = false; this.wordIndex++; typeSpeed = 500; }
        setTimeout(() => this.type(), typeSpeed);
    }
}
document.addEventListener('DOMContentLoaded', initTypewriter);
function initTypewriter() {
    const txtElement = document.querySelector('.txt-type');
    if (!txtElement) return;
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
}

// --- Canvas Interaction (Network Effect) ---
const canvas = document.getElementById('canvas1');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray;
    let mouse = { x: null, y: null, radius: (canvas.height / 80) * (canvas.width / 80) }

    window.addEventListener('mousemove', function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color; // Use instance color
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
            if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = '#d4a017'; // Keep Gold for contrast/accent
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            // Connect particles
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(10, 31, 51,' + opacityValue + ')'; // Dark Navy Lines
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }

            // Connect to mouse
            let mouseDistance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x)) + ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
            if (mouseDistance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (mouseDistance / 20000);
                ctx.strokeStyle = 'rgba(10, 31, 51,' + opacityValue + ')'; // Dark Navy Lines
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    window.addEventListener('resize', function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
        init();
    });
    window.addEventListener('mouseout', function () {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    animate();
}

// --- KPI Animation ---
const kpiSection = document.querySelector('.kpi-section');
const kpiNumbers = document.querySelectorAll('.kpi-number');

if (kpiSection && kpiNumbers.length > 0) {
    const kpiObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                kpiNumbers.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;

                        // Lower increment for slower, smoother animation
                        const inc = target / 100;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                observer.unobserve(entry.target); // Run only once
            }
        });
    }, { threshold: 0.5 });

    kpiObserver.observe(kpiSection);
}

// --- Leaflet Map ---
if (document.getElementById('map')) {
    const map = L.map('map').setView([48.5, 12.5], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    const locations = [
        { name: "Milan, Italy", coords: [45.4642, 9.1900], role: "Education & Origins" },
        { name: "Berlin, Germany", coords: [52.5200, 13.4050], role: "NIG - Site Manager" },
        { name: "Eisenach, Germany", coords: [50.9740, 10.3182], role: "Opel - Manager Development" },
        { name: "Bratislava, Slovakia", coords: [48.1486, 17.1077], role: "H&O Group - Supervisor" },
        { name: "Nitra, Slovakia", coords: [48.3061, 18.0764], role: "Jaguar Land Rover - Senior Leader" },
        { name: "Levice, Slovakia", coords: [48.2156, 18.6071], role: "Home Base / Serioplast" }
    ];

    const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: '<div style="background-color: #d4a017; width: 15px; height: 15px; border-radius: 50%; border: 3px solid #0a1f33; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    locations.forEach(loc => {
        L.marker(loc.coords, { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${loc.name}</b><br>${loc.role}`);
    });
}


// --- Dynamic Greeting ---
function updateGreeting() {
    const greetingElement = document.querySelector('.dynamic-greeting');
    if (!greetingElement) return;

    const hour = new Date().getHours();
    let key = "greeting_morning"; // Default key

    // Determine time of day
    if (hour < 12) {
        key = "greeting_morning";
    } else if (hour < 18) {
        key = "greeting_afternoon";
    } else {
        key = "greeting_evening";
    }

    // Initial load
    const currentLang = localStorage.getItem('selectedLang') || 'en';
    if (translations[currentLang] && translations[currentLang][key]) {
        greetingElement.textContent = translations[currentLang][key];
    } else {
        // Fallback logic if translation logic isn't fully robust yet
        if (hour < 12) greetingElement.textContent = "Good Morning";
        else if (hour < 18) greetingElement.textContent = "Good Afternoon";
        else greetingElement.textContent = "Good Evening";
    }
}
document.addEventListener('DOMContentLoaded', updateGreeting);

// Add keys to your translation dictionary in script.js to fully support this!

// --- Language Dropdown Selector ---
const langDropdownBtn = document.getElementById('langDropdownBtn');
const langDropdownMenu = document.getElementById('langDropdownMenu');
const langOptions = document.querySelectorAll('.lang-option');

// Language flag mapping
const langFlags = {
    'en': '🇬🇧 EN',
    'it': '🇮🇹 IT',
    'sk': '🇸🇰 SK',
    'de': '🇩🇪 DE',
    'fr': '🇫🇷 FR',
    'es': '🇪🇸 ES'
};

// Toggle dropdown
if (langDropdownBtn) {
    langDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdownMenu.classList.toggle('show');
        langDropdownBtn.classList.toggle('active');
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (langDropdownMenu && !e.target.closest('.language-selector')) {
        langDropdownMenu.classList.remove('show');
        if (langDropdownBtn) {
            langDropdownBtn.classList.remove('active');
        }
    }
});

// Language selection
langOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedLang = option.getAttribute('data-lang');

        // Update active state
        langOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Update button text
        if (langDropdownBtn) {
            const currentLangSpan = langDropdownBtn.querySelector('.current-lang');
            if (currentLangSpan) {
                currentLangSpan.textContent = langFlags[selectedLang];
            }
        }

        // Close dropdown
        langDropdownMenu.classList.remove('show');
        if (langDropdownBtn) {
            langDropdownBtn.classList.remove('active');
        }

        // Apply translations
        changeLanguage(selectedLang);

        // Save preference
        localStorage.setItem('selectedLang', selectedLang);
    });
});

// Translation function
function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update typewriter words if available
    const txtType = document.querySelector('.txt-type');
    if (txtType && translations[lang] && translations[lang]['hero_subtitle_words']) {
        txtType.setAttribute('data-words', JSON.stringify(translations[lang]['hero_subtitle_words']));
    }

    // Update greeting
    updateGreeting();
}

// Load saved language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'en';

    // Set active option
    langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === savedLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Update button
    if (langDropdownBtn) {
        const currentLangSpan = langDropdownBtn.querySelector('.current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = langFlags[savedLang];
        }
    }

    // Apply translations
    if (savedLang !== 'en') {
        changeLanguage(savedLang);
    }
});
