// IELTS Speaking Wonderland Main Page Logic

let currentVideoId = '';

// --- 1. CANVAS ANIMATION ---
const canvas = document.getElementById('animal-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let width, height;
let animals = [];

const animalImages = [
    'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    'https://cdn-icons-png.flaticon.com/512/616/616430.png',
    'https://cdn-icons-png.flaticon.com/512/616/616554.png',
    'https://cdn-icons-png.flaticon.com/512/375/375112.png'
];

class ChubbyAnimal {
    constructor() {
        this.img = new Image();
        this.img.src = animalImages[Math.floor(Math.random() * animalImages.length)];
        this.loaded = false;
        this.img.onload = () => { this.loaded = true; };
        this.size = Math.random() * 80 + 100;
        this.x = Math.random() * (width || window.innerWidth);
        this.y = Math.random() * (height || window.innerHeight);
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.angle = 0;
        this.spinSpeed = (Math.random() - 0.5) * 0.01;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.spinSpeed;
        if (this.x < -100 || this.x > width + 100) this.vx *= -1;
        if (this.y < -100 || this.y > height + 100) this.vy *= -1;
    }
    draw() {
        if (!this.loaded || !ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = 0.6;
        ctx.drawImage(this.img, -this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

function initCanvas() {
    if (!canvas || !ctx) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    animals = [];
    for(let i = 0; i < 8; i++) {
        animals.push(new ChubbyAnimal());
    }
}

function animateCanvas() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, width, height);
    animals.forEach(animal => {
        animal.update();
        animal.draw();
    });
    requestAnimationFrame(animateCanvas);
}

// --- 2. LESSON DATA (40 TOPICS) ---
const lessonData = {
    section1: [
        { icon: "📚", tag: "Introduction", title: "Giới thiệu chung", videoId: "1xmqYGFs1jHCaxe6lQ6qRKWPU6oj8M9jG" }, 
        { icon: "❤️", tag: "Strategy", title: "Bảng lý do thích/ghét", videoId: "1x0-nvdrib56qqUe9l5MyLUX9vPtRYXhl" },
        { icon: "👍", tag: "Questions", title: "Do you like X", videoId: "1fE_NTxlljI9Z6iIu2OfhI7dg1sMUWmjP" },
        { icon: "⭐", tag: "Strategy", title: "Chiến thuật Favourite", videoId: "1Xn6g9KxWJjCgv3xuOmGaYkrhx9o_7dgz" },
        { icon: "🎯", tag: "Questions", title: "What kind of X", videoId: "1BGuqWmtUDstWHRgKECWOq-sYw6eIkkVW" },
        { icon: "⚖️", tag: "Questions", title: "Do you prefer X or Y", videoId: "1_do2EEWY56pk4wsPguEg5JtEL3N4KI-q" },
        { icon: "🌍", tag: "Questions", title: "Is X popular", videoId: "1lSNNWG2BdItJnLBPVkAgrtB71N5fhgSu" },
        { icon: "⏰", tag: "Questions", title: "Best time to do X", videoId: "16ua4cyRxjAfOzVrzLEbpjNQseoVt-9QG" },
        { icon: "📅", tag: "Questions", title: "First/Last time", videoId: "1vIPS3qUBNppCnJdGclPrpqoRlkpkBVcp" },
        { icon: "👶", tag: "Questions", title: "Childhood memories", videoId: "1YFvASfP5J4m2cKo9ZRwpavqnihdv5aIB" }
    ],
    section2: [
        { icon: "✅", tag: "Questions", title: "Is X suitable for", videoId: "1FtTgbNJjz_HBLwebBLgtIMhbOjlsMnyT" },
        { icon: "🤔", tag: "Questions", title: "Easy or difficult", videoId: "1ZHkAnQqmER0p5ktwWPhOSm6NCDob2_N4" },
        { icon: "👎", tag: "Questions", title: "Dislike about X", videoId: "1h3ECFP1je3X156sKvAKp-u1WsD5g3z2A" },
        { icon: "🔄", tag: "Questions", title: "How often", videoId: "1qC8yV3bH8Snj7caUIdnx6AjrBzWq6c_Y" },
        { icon: "📈", tag: "Questions", title: "How has X changed", videoId: "1Y8AJSfTPuj-EUIJVxl8MrdMhAwQmk2dy" },
        { icon: "👴", tag: "Describe", title: "Describe a person", videoId: "18Ksu2YuM4Fm6ap5e2TjruKgRNufnkNgY" },
        { icon: "👨", tag: "Describe", title: "Describe a friend", videoId: "1Cq1vGI_kglTMrZE0xs_SV0BiAw18JDZq" },
        { icon: "👔", tag: "Describe", title: "Describe a teacher", videoId: "11Ff2mj2SNAZJm6s3DNJQ6MWfhXX5KuPw" },
        { icon: "☕", tag: "Describe", title: "Describe a cafe", videoId: "1agRMlsWBi5eBAP8fz7aWMRqwUpgIgSxz" },
        { icon: "🍜", tag: "Describe", title: "Describe a restaurant", videoId: "1qoZId3iHQLLwOwyOUhs27Yqfvi-zR7xS" }
    ],
    section3: [
        { icon: "🏛️", tag: "Describe", title: "Describe a museum", videoId: "1WZkiaYTzGd3G6nZRrBXq0bZp2fHgesum" },
        { icon: "🇰🇷", tag: "Describe", title: "Describe a country", videoId: "1vAFAhjw9FQWnwHQmLV_T9cTngpMeN3gA" },
        { icon: "🏖️", tag: "Describe", title: "Describe a city", videoId: "1CfopiP9Z4S0H7peyZOFZfRr42o-vNWxA" },
        { icon: "🇬🇧", tag: "Describe", title: "Describe a foreign country", videoId: "17SGGPxG5a92-otXSOwLtE0DY1QruaUNC" },
        { icon: "🎉", tag: "Describe", title: "Describe a holiday", videoId: "1cMDj08kGmQZIDMyEq1xd3KOW4xsbpw5K" },
        { icon: "🎂", tag: "Describe", title: "Describe a party", videoId: "116RK7E2Fh-0fqmKcoB6U_Mh5ecarmI5n" },
        { icon: "🛠️", tag: "Describe", title: "Describe a skill", videoId: "1dwiVxfh1PZObKDC7g5LLBE4AcTC4ap2e" },
        { icon: "🗺️", tag: "Describe", title: "Describe a situation", videoId: "1J7OVTOd_q06m7b2XpXEIyC8op1SjC38n" },
        { icon: "⏱️", tag: "Describe", title: "Describe being late", videoId: "h1Uw08-dS2Uk_h0ikBCHFf9jy_K3-zgxZh" },
        { icon: "👮", tag: "Describe", title: "Describe a rule", videoId: "1XVKZTS8u9kdRbBeChrPCaISDO-vK-Kw5" }
    ],
    section4: [
        { icon: "🪑", tag: "Describe", title: "Describe furniture", videoId: "1Fup51iuEL_VstqBPT-wVmEg3BXJ24Q94" },
        { icon: "👗", tag: "Describe", title: "Describe clothing", videoId: "1f4J5dXedPZqy3s99BTpoxLR3ugRcfxjb" },
        { icon: "🎁", tag: "Describe", title: "Describe a gift", videoId: "1R_oTzFUdNpoaBtvF2AKrIchwrhjnMh4n" },
        { icon: "💻", tag: "Favourite", title: "Favourite website", videoId: "1gzPg08qbtlKMWHQxVPrEyd27NQ2l7ePR" },
        { icon: "🌅", tag: "Favourite", title: "Favourite time", videoId: "1oVQGaXAgiHnY64ZUGqb-gfic0z2kGfjR" },
        { icon: "🦁", tag: "Favourite", title: "Favourite animal", videoId: "13uUUimq_BF7KxzcppsHf9UqbTlGgTzZI" },
        { icon: "🤝", tag: "Discussion", title: "Agree/Disagree", videoId: "1gdlfnrVdO_6MRYAHorgmoj7lTy3iQSSc" },
        { icon: "⚖️", tag: "Discussion", title: "Pros and Cons", videoId: "1AibU3zZNe_lh1ALzrnEgeWE3Mnoj86TV" },
        { icon: "🔮", tag: "Discussion", title: "Predictions", videoId: "1qLFJ30BclvvVig0_wBxPmwwWqhM-lvx6" },
        { icon: "🔄", tag: "Discussion", title: "Differences", videoId: "1Gjocw5Ykb9yArV5hYO3K2zvnb_rnu_6a" }
    ]
};

function createLessons(sectionData, gridId, startNum) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    sectionData.forEach((lesson, index) => {
        const lessonNum = startNum + index;
        const card = document.createElement('div');
        card.classList.add('lesson-card');
        card.innerHTML = `
            <div class="lesson-number">${lessonNum}</div>
            <div class="card-content">
                <div class="lesson-icon">${lesson.icon}</div>
                <div>
                    <span class="lesson-tag">${lesson.tag}</span>
                    <h3 class="lesson-title">Day ${lessonNum}:<br>${lesson.title}</h3>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openLesson(lessonNum, lesson)); 
        grid.appendChild(card);
    });
}

function scrollToLessons() {
    const section = document.getElementById('lessons');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// Modal and Fullscreen video playback functions
function openLesson(id, data) {
    const overlay = document.getElementById('overlay');
    const modalTitle = document.getElementById('modal-title');
    const overlayContent = document.querySelector('.overlay-content');
    
    if (!overlay || !modalTitle || !overlayContent) return;

    modalTitle.innerText = "Day " + id + ": " + data.title;
    currentVideoId = data.videoId;

    overlay.classList.add('active');
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(overlayContent,
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(0.8, 0.6)" }
        );
    }
}

function closeLesson() {
    const overlay = document.getElementById('overlay');
    const overlayContent = document.querySelector('.overlay-content');
    if (!overlay || !overlayContent) return;

    if (typeof gsap !== 'undefined') {
        gsap.to(overlayContent,
            { scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => {
                overlay.classList.remove('active');
            }}
        );
    } else {
        overlay.classList.remove('active');
    }
}

function playVideo() {
    if (!currentVideoId) {
        alert("Video đang được cập nhật!");
        return;
    }
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenContainer = document.getElementById('fullscreen-video-container');

    if (!fullscreenOverlay || !fullscreenContainer) return;

    fullscreenContainer.innerHTML = `
        <iframe 
            src="https://drive.google.com/file/d/${currentVideoId}/preview" 
            width="100%" 
            height="100%" 
            style="border: none;"
            allow="autoplay; fullscreen">
        </iframe>
    `;

    fullscreenOverlay.classList.add('active');

    if (typeof gsap !== 'undefined') {
        gsap.fromTo(fullscreenContainer, 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
        );
    }
}

function closeFullscreenVideo() {
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenContainer = document.getElementById('fullscreen-video-container');
    if (!fullscreenOverlay || !fullscreenContainer) return;

    if (typeof gsap !== 'undefined') {
        gsap.to(fullscreenContainer, {
            scale: 0.5, opacity: 0, duration: 0.3, ease: "power2.in",
            onComplete: () => {
                fullscreenOverlay.classList.remove('active');
                fullscreenContainer.innerHTML = "";
            }
        });
    } else {
        fullscreenOverlay.classList.remove('active');
        fullscreenContainer.innerHTML = "";
    }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    animateCanvas();
    window.addEventListener('resize', initCanvas);

    createLessons(lessonData.section1, 'section-1-grid', 1);
    createLessons(lessonData.section2, 'section-2-grid', 11);
    createLessons(lessonData.section3, 'section-3-grid', 21);
    createLessons(lessonData.section4, 'section-4-grid', 31);

    // Initial GSAP Animations
    if (typeof gsap !== 'undefined') {
        gsap.from("h1", { y: -100, opacity: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" });
        gsap.from(".subtitle", { scale: 0.8, opacity: 0, duration: 1, delay: 0.5, ease: "back.out(2)" });
        gsap.from("header .btn-cute", { y: 50, opacity: 0, duration: 1, delay: 0.8, ease: "elastic.out(1, 0.6)" });

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            gsap.utils.toArray('.section-container').forEach(section => {
                gsap.from(section.querySelectorAll('.lesson-card'), {
                    scrollTrigger: { trigger: section, start: "top 85%" },
                    scale: 0.5, opacity: 0, duration: 1.2, stagger: 0.04, 
                    ease: "elastic.out(1, 0.5)", clearProps: "all"
                });
            });
        }
    }

    const overlay = document.getElementById('overlay');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLesson();
        });
    }

    if (fullscreenOverlay) {
        fullscreenOverlay.addEventListener('click', (e) => {
            if (e.target === fullscreenOverlay) closeFullscreenVideo();
        });
    }
});
