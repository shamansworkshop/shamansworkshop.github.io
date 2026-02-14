/**
 * TGPlug: TGSentinel v2
 * Role: Heuristic Security & Pre-Injection Scanning
 * TGUID: workshop.shaman.tgsentinel
 */

(function() {
    'use strict';

    const MOD_ID = 'workshop.shaman.tgsentinel';
    const KEY_ACTIVE = 'tgSentinelActive';
    const KEY_MODE = 'tgSentinelMode';
    
    // --- 🚫 KNOWN THREATS ---
    const BLOCKLIST = [
        "SumTingWong",
        "workshop.shaman.devkitui" // Example conflict
    ];

    // --- ☣️ HEURISTIC PATTERNS ---
    // Code patterns that trigger immediate rejection
    const RISK_PATTERNS = [
        { id: 'wipe_storage', regex: /localStorage\.clear\(\)/ },
        { id: 'wipe_dom', regex: /document\.body\.innerHTML\s*=\s*['"`]['"`]/ },
        { id: 'infinite_loop', regex: /while\s*\(\s*true\s*\)/ },
        { id: 'cookie_theft', regex: /document\.cookie/ } // Context-sensitive
    ];

    function startPlug() {
        if (window.TGMoLink && window.TGMoLink.register) {
            const registered = window.TGMoLink.register(MOD_ID);
            if (registered) {
                injectSentinelUI();
                setupActiveDefense();
            }
        } else {
            setTimeout(startPlug, 50);
        }
    }

    // --- 🛡️ ACTIVE DEFENSE SYSTEM ---
    function setupActiveDefense() {
        const originalInject = window.TGMoLink.inject;
        const originalRegister = window.TGMoLink.register;
        const statusBar = document.getElementById('securityStatus');
        const mainStatus = document.getElementById('status');

        // Helper: Get Current Security State
        const getSecurityState = () => {
            const toggle = document.getElementById('tgSentinelToggle');
            const modeSelect = document.getElementById('tgSentinelSelect');
            const dataBarrier = document.getElementById('dataBarrierToggle');

            // If Anti-Cookies is ON, force STRICT mode
            let mode = modeSelect ? modeSelect.value : 'standard';
            if (dataBarrier && dataBarrier.checked) mode = 'strict';

            return {
                active: toggle ? toggle.checked : true,
                mode: mode,
                barrierActive: dataBarrier ? dataBarrier.checked : false
            };
        };

        // --- LAYER 1: ASYNC PRE-SCAN (Scan-then-Initialize) ---
        window.TGMoLink.inject = async function(path) {
            const state = getSecurityState();
            if (!state.active) return originalInject.apply(this, arguments);

            // UI Feedback
            if(statusBar) statusBar.textContent = "Scanning...";

            const folderName = path.split('/').filter(Boolean).pop();
            const scriptPath = path.endsWith('/') ? path + 'main.js' : path + '/main.js';

            try {
                // 1. Fetch Source Code before execution
                const response = await fetch(scriptPath);
                if (!response.ok) throw new Error("Network Error");
                const sourceCode = await response.text();

                // 2. Run Heuristics
                const scanResult = scanCode(sourceCode, state);

                if (!scanResult.safe) {
                    triggerSecurityAlert(folderName, scanResult.reason);
                    return; // BLOCK INJECTION
                }

                // 3. Pass to Original Loader
                if(statusBar) {
                    statusBar.textContent = state.mode === 'strict' ? "Shield Active" : "Protected";
                    statusBar.style.color = "var(--primary)";
                }
                originalInject.apply(this, arguments);

            } catch (err) {
                console.warn(`[TGSentinel] Scan failed for ${folderName}:`, err);
                // In Strict Mode, fail closed (block if can't scan)
                if (state.mode === 'strict') {
                    triggerSecurityAlert(folderName, "Scan Error (Network)");
                } else {
                    originalInject.apply(this, arguments);
                }
            }
        };

        // --- LAYER 2: REGISTRATION ENFORCEMENT ---
        window.TGMoLink.register = function(tgUid) {
            if (tgUid === MOD_ID) return originalRegister.apply(this, arguments);
            
            const state = getSecurityState();
            if (!state.active) return originalRegister.apply(this, arguments);

            // 1. Strict TGUID Format Check
            // Must be workshop.shaman.(name)
            const validFormat = /^workshop\.shaman\.[a-z0-9_-]+$/i.test(tgUid);

            if (!validFormat) {
                console.warn(`[TGSentinel] Invalid TGUID Format: ${tgUid}`);
                if (state.mode === 'strict') {
                    triggerSecurityAlert(tgUid, "Invalid ID Format");
                    return false;
                }
            }

            // 2. Blocklist Check
            if (BLOCKLIST.includes(tgUid)) {
                triggerSecurityAlert(tgUid, "Blacklisted ID");
                return false;
            }

            return originalRegister.apply(this, arguments);
        };

        // Helper: Analyze Code Text
        function scanCode(text, state) {
            for (let risk of RISK_PATTERNS) {
                // Skip cookie check if Barrier is OFF
                if (risk.id === 'cookie_theft' && !state.barrierActive) continue;

                if (risk.regex.test(text)) {
                    return { safe: false, reason: risk.id };
                }
            }
            return { safe: true };
        }

        // Helper: Visual & Console Alerts
        function triggerSecurityAlert(source, reason) {
            console.error(`[TGSentinel] THREAT NEUTRALIZED | Source: ${source} | Reason: ${reason}`);
            
            if (mainStatus) {
                mainStatus.textContent = `Security Block: ${reason.toUpperCase()}`;
                mainStatus.classList.add('status-error');
                // Remove shake class after animation
                setTimeout(() => mainStatus.classList.remove('status-error'), 1000);
            }
            
            const menuBtn = document.getElementById('menuBtn');
            if(menuBtn) {
                menuBtn.style.color = 'red';
                setTimeout(() => menuBtn.style.color = '', 2000);
            }
        }
    }

    // --- 🛠️ UI INJECTION (Menu Control) ---
    function injectSentinelUI() {
        const dataBarrier = document.getElementById('dataBarrierToggle');
        if (!dataBarrier) return;

        const parentItem = dataBarrier.closest('.menu-item');
        
        // Settings
        const savedActive = localStorage.getItem(KEY_ACTIVE) !== 'disabled';
        const savedMode = localStorage.getItem(KEY_MODE) || 'standard';
        
        const container = document.createElement('div');
        container.className = 'menu-item';
        container.style.flexDirection = 'column';
        container.style.gap = '8px';
        container.style.borderLeft = "3px solid var(--primary)"; // Distinct look
        
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                <span>TGSentinel Shield</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="tgSentinelToggle">
                    <span class="slider"></span>
                </label>
            </div>
            
            <div id="sentinelModeRow" style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                <span style="font-size:10px; opacity:0.7; text-transform:uppercase;">Protocol</span>
                <select id="tgSentinelSelect" class="menu-input" style="width: 90px; height: 22px;">
                    <option value="standard">Standard</option>
                    <option value="strict">Strict</option>
                </select>
            </div>
            <div id="sentinelStatus" style="font-size:9px; color:var(--text-light); width:100%;">
                Ready to scan.
            </div>
        `;

        parentItem.parentNode.insertBefore(container, parentItem.nextSibling);
        
        const toggle = document.getElementById('tgSentinelToggle');
        const select = document.getElementById('tgSentinelSelect');
        const statusText = document.getElementById('sentinelStatus');

        toggle.checked = savedActive;
        select.value = savedMode;

        // Sync with Data Barrier
        dataBarrier.addEventListener('change', () => {
            if (dataBarrier.checked) {
                select.value = 'strict';
                select.disabled = true;
                statusText.textContent = "Data Barrier Override: STRICT forced.";
                statusText.style.color = "var(--primary)";
            } else {
                select.disabled = false;
                select.value = localStorage.getItem(KEY_MODE) || 'standard';
                statusText.textContent = "Ready to scan.";
                statusText.style.color = "";
            }
        });

        // Trigger initial check
        if(dataBarrier.checked) dataBarrier.dispatchEvent(new Event('change'));

        toggle.addEventListener('change', (e) => {
            localStorage.setItem(KEY_ACTIVE, e.target.checked ? 'enabled' : 'disabled');
        });

        select.addEventListener('change', (e) => {
            localStorage.setItem(KEY_MODE, e.target.value);
        });
        
        console.log(`[TGSentinel]: v2 Online.`);
    }

    startPlug();
})();