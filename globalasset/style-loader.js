/**
 * HEXON ASSET LOADER
 * Automatically injects global styles, fonts, and background effects.
 */

(function() {
    'use strict';

    // 1. Define paths (Adjust 'docs.css' if your folder structure changes)
    const CSS_PATH = 'docs.css'; 

    // 2. Helper to create link tags
    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // 3. Load Fonts (Roboto + Material Icons)
    loadCSS('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap');
    loadCSS('https://fonts.googleapis.com/icon?family=Material+Icons+Round');

    // 4. Load the Global Theme
    loadCSS(CSS_PATH);

    // 5. Inject the Hexagon Background (Visual Flair)
    document.addEventListener('DOMContentLoaded', () => {
        // Only inject if it doesn't already exist
        if (!document.querySelector('.bg-shape-container')) {
            const bgContainer = document.createElement('div');
            bgContainer.className = 'bg-shape-container';
            bgContainer.innerHTML = `
                <svg class="hexagon-spinner" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="50 5, 95 27.5, 95 72.5, 50 95, 5 72.5, 5 27.5" fill="none" stroke="currentColor" stroke-width="1" />
                    <polygon points="50 25, 72.5 36.25, 72.5 63.75, 50 75, 27.5 63.75, 27.5 36.25" fill="currentColor" opacity="0.3"/>
                </svg>
            `;
            document.body.prepend(bgContainer);
        }
    });

    console.log("HEXON UI: Global styles and assets loaded.");
})();
