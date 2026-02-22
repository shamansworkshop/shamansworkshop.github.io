/**
 * Documentation Widescreen Optimizer
 * Enhances layout, adds subtle ambient cursor glow, and optimizes typography for screens > 1024px.
 * Designed to preserve and elevate the light/white Material Design UI.
 */
(function optimizeDocsForWidescreen() {
    // 1. Inject Widescreen Styles
    const style = document.createElement('style');
    style.innerHTML = `
        /* WIDESCREEN OPTIMIZATIONS */
        @media (min-width: 1024px) {
            /* Let the container breathe */
            body .container {
                max-width: 1000px !important;
                padding: 40px 60px !important;
            }

            /* Elevate Content Cards */
            .content-card {
                padding: 40px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08) !important;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            /* Subtle lift effect on hover for cards */
            .content-card:hover {
                box-shadow: 0 12px 28px rgba(11, 87, 208, 0.08), 0 4px 8px rgba(11, 87, 208, 0.04) !important;
                transform: translateY(-2px);
            }

            /* Typography Bumps */
            header {
                padding: 40px 20px !important;
            }
            
            header h1 {
                font-size: 38px !important;
                letter-spacing: 0.5px;
            }
            
            .subtitle {
                font-size: 18px !important;
            }

            /* Ensure grids utilize the extra space */
            .grid-list {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 24px !important;
            }
        }

        /* AMBIENT CURSOR GLOW (Light UI Friendly) */
        #ambient-glow {
            position: fixed;
            top: 0; left: 0;
            width: 800px; height: 800px;
            border-radius: 50%;
            /* Faint primary blue glow */
            background: radial-gradient(circle, rgba(11, 87, 208, 0.06) 0%, rgba(0,0,0,0) 60%);
            pointer-events: none;
            z-index: 0; 
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.8s ease;
        }
        
        @media (min-width: 1024px) {
            #ambient-glow { opacity: 1; }
        }

        /* Keep content above the ambient glow */
        .container, header {
            position: relative;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('DOMContentLoaded', () => {

        // 2. Setup the ambient background glow
        const glow = document.createElement('div');
        glow.id = 'ambient-glow';
        document.body.insertBefore(glow, document.body.firstChild);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 3. Smooth animation loop
        function animateGlow() {
            // Add easing to the cursor tracking
            glowX += (mouseX - glowX) * 0.05;
            glowY += (mouseY - glowY) * 0.05;

            // Offset by 400px (half the width/height) to center it on the cursor
            glow.style.transform = `translate(${glowX - 400}px, ${glowY - 400}px)`;
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    });
})();
