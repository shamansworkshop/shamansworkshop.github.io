/**
 * HEXON Widescreen Optimizer
 * Enhances layout, adds ambient cursor glow, and subtle parallax for screens > 1024px.
 */
(function optimizeForWidescreen() {
    // 1. Inject Widescreen Styles
    const style = document.createElement('style');
    style.innerHTML = `
        /* WIDESCREEN OPTIMIZATIONS */
        @media (min-width: 1024px) {
            /* Expand and enrich the main container */
            body .container {
                max-width: 850px !important;
                padding: 60px 50px !important;
                background: rgba(15, 15, 15, 0.65) !important;
                backdrop-filter: blur(24px);
                -webkit-backdrop-filter: blur(24px);
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            }

            /* Convert lists into 2-column grids */
            .list-group, .category-grid, .beta-list {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 16px !important;
            }

            /* Typography Bumps */
            header h1 {
                font-size: 42px !important;
                letter-spacing: 0.5px;
            }
            .subtitle, .header-subtitle {
                font-size: 18px !important;
            }

            /* Center and size primary actions */
            .primary-action-container {
                margin: 16px 0 !important;
            }
            .fab-primary, .fab-extended {
                padding: 20px 40px !important;
                font-size: 18px !important;
                max-width: 350px;
                margin: 0 auto;
            }

            /* Expand Modals */
            .modal-box {
                max-width: 650px !important;
                padding: 32px !important;
            }
        }

        /* AMBIENT CURSOR GLOW (Global) */
        #ambient-glow {
            position: fixed;
            top: 0; left: 0;
            width: 800px; height: 800px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 60%);
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.8s ease;
        }
        
        @media (min-width: 1024px) {
            #ambient-glow { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('DOMContentLoaded', () => {

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

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.05;
            glowY += (mouseY - glowY) * 0.05;

            glow.style.transform = `translate(${glowX - 400}px, ${glowY - 400}px)`;
            requestAnimationFrame(animateGlow);
        }
        animateGlow();

        const bgContainer = document.querySelector('.bg-shape-container');
        if (bgContainer) {
            bgContainer.style.transition = 'transform 0.1s ease-out';

            document.addEventListener('mousemove', (e) => {
                if (window.innerWidth >= 1024) {
                    const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
                    const yOffset = (e.clientY / window.innerHeight - 0.5) * 40;

                    bgContainer.style.transform = `translate(${-xOffset}px, ${-yOffset}px)`;
                } else {
                    bgContainer.style.transform = 'none';
                }
            });
        }
    });
})();
