/**
 * HEXON LABS: UNIVERSAL VALENTINE LAUNCHPAD INJECTOR
 * Works on: TGBrowser Launchpad, Sand Box 3D Launchpad, and Index
 */
function activateValentineLaunchpad() {
    console.log("💕 HEXON Launchpad: Cupid Protocols Active.");

    // 1. Inject Thematic CSS Variables & Animations
    const vDayStyle = document.createElement('style');
    vDayStyle.innerHTML = `
        :root {
            /* RECOLORED: Valentine Tokens */
            --md-sys-color-primary: #ff4081 !important;      /* Hot Pink */
            --md-sys-color-on-primary: #ffffff !important;
            --md-sys-color-secondary-container: #5c1125 !important; /* Deep Red Container */
            --md-sys-color-on-secondary-container: #ffd0e0 !important;
            --md-sys-color-tertiary-container: #3b0a12 !important;
            --md-sys-color-surface: #120204 !important;      /* Almost Black Red */
            --md-sys-color-surface-variant: #26060c !important;
            --md-sys-color-background: #000000 !important;   /* Pure Black */
            --md-sys-color-outline: #8c1c36 !important;      /* Red Outline */
            
            /* Status Colors override */
            --md-sys-color-warning-container: #4a0d18 !important; 
        }

        /* Heart Rain Particle */
        .heart-particle {
            position: fixed;
            top: -10%;
            color: var(--md-sys-color-primary);
            opacity: 0.0;
            z-index: 0; 
            pointer-events: none;
            animation: fall linear forwards;
            font-family: 'Material Icons Round'; /* Ensure it can render icon fonts if needed */
        }

        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }

        /* Gentle Pulse for the Main Logo */
        .logo-placeholder i, .logo-icon {
            animation: heartbeat 2s infinite ease-in-out;
            text-shadow: 0 0 20px rgba(255, 64, 129, 0.4);
        }

        @keyframes heartbeat {
            0% { transform: scale(1); }
            15% { transform: scale(1.15); }
            30% { transform: scale(1); }
            45% { transform: scale(1.15); }
            100% { transform: scale(1); }
        }

        /* Make the hexagon spinner pink and lovely */
        .hexagon-spinner, .loader-hexagon {
            color: #ff4081 !important;
        }
    `;
    document.head.appendChild(vDayStyle);

    // 2. Element Modifications (Universal Selectors)
    
    // Attempt to find the main logo icon. 
    // Checks for 'logo-placeholder i' (Launchpads) AND 'logo-icon' (Index)
    const logoEl = document.querySelector('.logo-placeholder i') || document.querySelector('.logo-icon');
    
    if (logoEl) {
        // Save original icon in case we want to revert (optional), but here we overwrite
        logoEl.innerText = 'favorite'; // Change to Heart Icon
    }

    // Update Subtitles to be festive
    const subTitle = document.querySelector('.header-subtitle') || document.querySelector('.subtitle');
    if (subTitle) {
        // Keep the original text but append a heart, or replace strictly if you prefer
        const currentText = subTitle.innerText;
        if (!currentText.includes("♥")) {
            subTitle.innerHTML = `${currentText} <span style="color:var(--md-sys-color-primary)">♥</span>`;
        }
    }

    // 3. Heart Rain System (Optimized)
    function spawnHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart-particle');
        
        // Randomly choose between a text heart or an icon heart
        const shape = Math.random();
        if (shape > 0.6) {
            heart.innerText = 'favorite'; // Material Icon
            heart.classList.add('material-icons-round');
        } else {
            heart.innerText = '❤'; // Text char
        }
        
        // Randomize position and physics
        heart.style.left = Math.random() * 100 + "vw";
        const duration = Math.random() * 3 + 4; // 4s to 7s
        heart.style.animationDuration = duration + "s";
        heart.style.fontSize = Math.random() * 24 + 10 + "px";
        
        document.body.appendChild(heart);

        // Cleanup
        setTimeout(() => { heart.remove(); }, duration * 1000);
    }

    // Start the rain
    setInterval(spawnHeart, 400); // Slighty slower spawn rate for cleaner look
}

// Auto-run on load
document.addEventListener('DOMContentLoaded', activateValentineLaunchpad);
