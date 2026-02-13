/**
 * HEXON LABS: VALENTINE PATCH (Universal)
 * Targets: 404.html & index-1.html (TGPlugs Collection)
 */
function activateValentineTheme() {
    console.log("💕 HEXON System: Valentine Protocols Engaged.");

    // 1. Inject Thematic CSS Variables & Animations
    const vDayStyle = document.createElement('style');
    vDayStyle.innerHTML = `
        :root {
            /* RECOLORED: Valentine Tokens */
            --md-sys-color-primary: #ff4081 !important;      /* Hot Pink */
            --md-sys-color-on-primary: #ffffff !important;
            --md-sys-color-secondary-container: #5c1125 !important; 
            --md-sys-color-on-secondary-container: #ffd0e0 !important;
            --md-sys-color-surface: #120204 !important;      /* Deep Red/Black Surface */
            --md-sys-color-surface-variant: #26060c !important;
            --md-sys-color-background: #000000 !important;
            --md-sys-color-outline: #ff4081 !important;      /* Pink Outlines */
            
            /* Text Color Overrides */
            --text-secondary: #ffb2c1 !important;
        }

        /* Heart Rain Particle */
        .heart-particle {
            position: fixed;
            top: -10%;
            color: var(--md-sys-color-primary);
            pointer-events: none;
            z-index: 0; 
            animation: fall linear forwards;
            font-family: 'Material Icons Round', sans-serif;
            text-shadow: 0 0 5px rgba(255, 64, 129, 0.5);
        }

        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }

        /* Pulse Animation for Mascot Images */
        .mascot-container {
            animation: heartbeat 2s infinite ease-in-out;
            box-shadow: 0 0 25px rgba(255, 64, 129, 0.3) !important;
            border-color: #ff4081 !important;
        }

        /* Pulse for List Icons (Collection Page) */
        .item-icon {
            color: #ff4081 !important;
            text-shadow: 0 0 10px rgba(255, 64, 129, 0.4);
        }

        @keyframes heartbeat {
            0% { transform: scale(1); }
            15% { transform: scale(1.05); }
            30% { transform: scale(1); }
            45% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        /* Hexagon Background */
        .hexagon-spinner {
            color: #ff4081 !important;
            opacity: 0.1 !important;
        }
    `;
    document.head.appendChild(vDayStyle);

    // 2. Element Modifications

    // A. Title Modification: Add a heart to H1
    const title = document.querySelector('h1');
    if (title) {
        // Prevent double injection if run twice
        if (!title.innerText.includes('♥')) {
            title.innerHTML += ' <span style="color:var(--md-sys-color-primary)">♥</span>';
        }
    }

    // B. Subtitle Modification
    const subtitles = document.querySelectorAll('.subtitle');
    subtitles.forEach(sub => {
        // Simply tint the text slightly pinker via the CSS variable override above
        // But let's add a specific glow to the first subtitle found
        sub.style.textShadow = "0 0 10px rgba(255, 64, 129, 0.2)";
    });

    // 3. Heart Rain System
    function spawnHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart-particle');
        
        // Randomly choose between a Material Icon heart or a text heart
        const shape = Math.random();
        if (shape > 0.5) {
            heart.innerText = 'favorite'; // Material Icon name
            heart.classList.add('material-icons-round');
        } else {
            heart.innerText = '❤'; // Text char
        }
        
        // Randomize position (0-100vw)
        heart.style.left = Math.random() * 100 + "vw";
        
        // Randomize speed (3s to 8s)
        const duration = Math.random() * 5 + 3;
        heart.style.animationDuration = duration + "s";
        
        // Randomize size
        heart.style.fontSize = Math.random() * 20 + 12 + "px";
        
        document.body.appendChild(heart);

        // Cleanup
        setTimeout(() => { heart.remove(); }, duration * 1000);
    }

    // Start the rain (Interval: 400ms)
    setInterval(spawnHeart, 400);
}

// Auto-run on load
document.addEventListener('DOMContentLoaded', activateValentineTheme);