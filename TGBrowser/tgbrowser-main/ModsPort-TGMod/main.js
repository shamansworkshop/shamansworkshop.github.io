/**
 * TGPlug: TGSentinel
 * Role: Advanced Security & Mod Filtering
 * TGUID: workshop.shaman.tgsentinel
 */

(function() {
    'use strict';

    const MOD_ID = 'workshop.shaman.tgsentinel';
    const KEY_ACTIVE = 'tgSentinelActive';
    const KEY_MODE = 'tgSentinelMode';
    
    // --- 📝 SHAMAN'S MASTER BLOCKLIST ---
    const SHAMAN_BLOCKLIST = [
        "workshop.shaman.gifloader",
        "com.suspicious.tracker",
        "net.malware.test"
    ];

    function startPlug() {
        // Wait for TGMoLink
        if (window.TGMoLink && window.TGMoLink.register) {
            const registered = window.TGMoLink.register(MOD_ID);
            if (registered) {
                injectSentinelUI();
                setupDualSecurity();
            }
        } else {
            setTimeout(startPlug, 50);
        }
    }

    // --- 🛠️ UI MANIFESTATION ---
    function injectSentinelUI() {
        const dataBarrier = document.getElementById('dataBarrierToggle');
        if (!dataBarrier) return;

        const parentItem = dataBarrier.closest('.menu-item');
        
        // Load saved preferences
        // Default: Active = true, Mode = standard
        const savedActive = localStorage.getItem(KEY_ACTIVE) !== 'disabled';
        const savedMode = localStorage.getItem(KEY_MODE) || 'standard';
        
        // Create the Container
        // We use flex-column to stack the toggle and the mode picker neatly
        const container = document.createElement('div');
        container.className = 'menu-item';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'flex-start';
        container.style.gap = '8px';
        
        // HTML Structure
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                <span>TGSentinel Security</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="tgSentinelToggle">
                    <span class="slider"></span>
                </label>
            </div>
            
            <div id="sentinelModeRow" style="display:flex; justify-content:space-between; width:100%; align-items:center; opacity: 1; transition: opacity 0.3s;">
                <span style="font-size:11px; opacity:0.7; padding-left: 8px;">Protection Level</span>
                <select id="tgSentinelSelect" class="menu-input" style="width: 100px; height: 24px; padding: 0 4px;">
                    <option value="standard">Standard</option>
                    <option value="strict">Strict</option>
                </select>
            </div>
        `;

        // Insert into Menu
        parentItem.parentNode.insertBefore(container, parentItem.nextSibling);
        
        // Get Elements
        const toggle = document.getElementById('tgSentinelToggle');
        const select = document.getElementById('tgSentinelSelect');
        const modeRow = document.getElementById('sentinelModeRow');

        // Apply Saved State
        toggle.checked = savedActive;
        select.value = savedMode;
        updateVisibility();

        // Listeners
        toggle.addEventListener('change', (e) => {
            localStorage.setItem(KEY_ACTIVE, e.target.checked ? 'enabled' : 'disabled');
            updateVisibility();
            console.log(`[TGSentinel]: System ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
        });

        select.addEventListener('change', (e) => {
            localStorage.setItem(KEY_MODE, e.target.value);
            console.log(`[TGSentinel]: Mode set to ${e.target.value.toUpperCase()}`);
        });

        // Helper to dim the dropdown when disabled
        function updateVisibility() {
            if (toggle.checked) {
                modeRow.style.opacity = '1';
                modeRow.style.pointerEvents = 'auto';
                select.disabled = false;
            } else {
                modeRow.style.opacity = '0.4';
                modeRow.style.pointerEvents = 'none';
                select.disabled = true;
            }
        }
        
        console.log(`[TGSentinel]: UI Controls Injected.`);
    }

    function setupDualSecurity() {
        const originalInject = window.TGMoLink.inject;
        const originalRegister = window.TGMoLink.register;

        // Helper to check status
        const isSystemActive = () => document.getElementById('tgSentinelToggle')?.checked;
        const getMode = () => document.getElementById('tgSentinelSelect')?.value || 'standard';

        // --- LAYER 1: INJECTION INTERCEPTOR ---
        window.TGMoLink.inject = function(path) {
            // 1. If Disabled, allow everything
            if (!isSystemActive()) {
                return originalInject.apply(this, arguments);
            }

            const mode = getMode();
            const folderName = path.split('/').filter(Boolean).pop();

            // 2. Strict Mode Logic
            if (mode === 'strict') {
                console.warn(`[TGSentinel]: STRICT MODE blocked injection of "${folderName}".`);
                return; 
            }

            // 3. Standard Mode Logic
            if (mode === 'standard' && SHAMAN_BLOCKLIST.includes(folderName)) {
                console.warn(`[TGSentinel]: Standard Protocol blocked "${folderName}" (Blacklisted).`);
                return;
            }

            originalInject.apply(this, arguments);
        };

        // --- LAYER 2: REGISTRATION INTERCEPTOR ---
        window.TGMoLink.register = function(tgUid) {
            // Allow self to always register (prevent suicide)
            if (tgUid === MOD_ID) return originalRegister.apply(this, arguments);

            // 1. If Disabled, allow everything
            if (!isSystemActive()) {
                return originalRegister.apply(this, arguments);
            }

            const mode = getMode();

            // 2. Strict Mode Logic
            if (mode === 'strict') {
                console.error(`[TGSentinel]: STRICT MODE rejected registration of "${tgUid}".`);
                return false; 
            }

            // 3. Standard Mode Logic
            if (mode === 'standard' && SHAMAN_BLOCKLIST.includes(tgUid)) {
                console.error(`[TGSentinel]: Standard Protocol rejected "${tgUid}" (Blacklisted).`);
                return false; 
            }
            
            return originalRegister.apply(this, arguments);
        };
    }

    startPlug();
})();