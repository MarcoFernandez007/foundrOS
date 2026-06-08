// app.js - Main Application Logic & Routing

const AppState = {
    isAuthenticated: false,
    user: null,
    theme: 'dark',
    activeView: 'view-dashboard',
    portfolio: [
        { id: '1', name: 'DevFlow AI', category: 'Developer Tools', status: 'Profitable', arr: '$45,000', progress: 100 },
        { id: '2', name: 'MedTranscribe', category: 'Healthcare', status: 'Marketing', arr: '$12,000', progress: 85 },
        { id: '3', name: 'EcoRoute', category: 'Logistics', status: 'Building', arr: '$0', progress: 40 }
    ],
    apiKeys: {
        gemini: localStorage.getItem('foundr_gemini_key') || '',
        github: localStorage.getItem('foundr_github_pat') || ''
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLandingPage();
    initAuth();
    initNavigation();
    initPortfolioActions();
    initModals();
    renderPortfolio();
    initKanban();
});

// --- Theme Management ---
function initTheme() {
    const savedTheme = localStorage.getItem('foundr_theme') || 'dark';
    setTheme(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const newTheme = AppState.theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    AppState.theme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('foundr_theme', theme);
    
    const icon = document.getElementById('theme-icon');
    if (theme === 'light') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// --- Authentication (Local IndexedDB + Crypto) ---
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function initAuth() {
    const savedSession = localStorage.getItem('foundr_session');
    if (savedSession) {
        AppState.isAuthenticated = true;
        AppState.user = JSON.parse(savedSession);
        loginSuccess();
    }

    const authForm = document.getElementById('auth-form');
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        if (email && pass) {
            // Local Crypto Auth Simulation
            const hash = await hashPassword(pass);
            const userStore = JSON.parse(localStorage.getItem('foundr_users') || '{}');
            
            // Sign up if doesn't exist
            if (!userStore[email]) {
                userStore[email] = { hash, name: email.split('@')[0] };
                localStorage.setItem('foundr_users', JSON.stringify(userStore));
            } else {
                if (userStore[email].hash !== hash) {
                    alert('Invalid password.');
                    return;
                }
            }
            simulateLogin({ email, name: userStore[email].name, type: 'standard' });
        }
    });

    const googleBtn = document.getElementById('google-auth-btn');
    const googleModal = document.getElementById('google-auth-modal');
    const closeGoogleBtn = document.getElementById('close-google-auth');
    const confirmGoogleBtn = document.getElementById('btn-confirm-google');

    googleBtn.addEventListener('click', () => googleModal.classList.remove('hidden'));
    closeGoogleBtn.addEventListener('click', () => googleModal.classList.add('hidden'));

    confirmGoogleBtn.addEventListener('click', () => {
        const googleEmail = document.getElementById('google-auth-input').value;
        if (googleEmail) {
            googleModal.classList.add('hidden');
            simulateLogin({ email: googleEmail, name: googleEmail.split('@')[0], type: 'google_oauth' });
        }
    });

    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        AppState.isAuthenticated = false;
        AppState.user = null;
        localStorage.removeItem('foundr_session');
        localStorage.removeItem('foundr_jwt');
        document.getElementById('auth-overlay').classList.add('active');
        document.getElementById('app-container').classList.add('hidden');
    });
}

function simulateLogin(userData) {
    AppState.isAuthenticated = true;
    AppState.user = userData;
    const mockToken = btoa(JSON.stringify({ user: userData, exp: Date.now() + 86400000 }));
    localStorage.setItem('foundr_session', JSON.stringify(userData));
    localStorage.setItem('foundr_jwt', mockToken);
    loginSuccess();
}

function loginSuccess() {
    document.getElementById('landing-page').classList.remove('active');
    document.getElementById('auth-overlay').classList.remove('active');
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('display-user-name').innerText = AppState.user.name;
    if(window.initAgents) window.initAgents();
}

// --- Landing Page Logic ---
function initLandingPage() {
    const landingPage = document.getElementById('landing-page');
    const authOverlay = document.getElementById('auth-overlay');
    
    const showAuth = (tabName) => {
        if(landingPage) landingPage.classList.remove('active');
        if(authOverlay) authOverlay.classList.add('active');
        const tab = document.querySelector(`.auth-tab[data-tab="${tabName}"]`);
        if(tab) tab.click();
    };

    document.getElementById('btn-landing-login')?.addEventListener('click', () => showAuth('login'));
    document.getElementById('btn-landing-start')?.addEventListener('click', () => showAuth('signup'));
    document.getElementById('btn-hero-start')?.addEventListener('click', () => showAuth('signup'));
}

// --- Navigation & Routing ---
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            setActiveView(targetId);
            
            if (targetId === 'view-3d-map' && window.initThreeJS) window.initThreeJS();
            if (targetId === 'view-corporate' && window.initCorporateSuite) window.initCorporateSuite();
            if (targetId === 'view-hexasai' && window.initHexaSAI) window.initHexaSAI();
        });
    });
}

function setActiveView(targetId) {
    if(!targetId) return;

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-target') === targetId);
    });

    document.querySelectorAll('.view-section').forEach(section => {
        const isTarget = section.id === targetId;
        section.classList.toggle('hidden', !isTarget);
        section.classList.toggle('active', isTarget);
    });

    AppState.activeView = targetId;
}

// --- Modals ---
function initModals() {
    const stripeBtn = document.getElementById('btn-stripe-billing');
    const stripeModal = document.getElementById('stripe-modal');
    stripeBtn.addEventListener('click', () => stripeModal.classList.remove('hidden'));
    document.getElementById('close-stripe').addEventListener('click', () => stripeModal.classList.add('hidden'));
    
    document.getElementById('btn-stripe-checkout').addEventListener('click', () => {
        document.getElementById('stripe-status').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Redirecting to Stripe Checkout...';
        setTimeout(() => {
            document.getElementById('stripe-status').innerText = 'Simulated Payment Successful!';
        }, 1500);
    });

    const apiBtn = document.getElementById('btn-api-settings');
    const apiModal = document.getElementById('api-modal');
    apiBtn.addEventListener('click', () => {
        document.getElementById('gemini-api-key').value = AppState.apiKeys.gemini;
        document.getElementById('github-pat-key').value = AppState.apiKeys.github;
        apiModal.classList.remove('hidden');
    });
    document.getElementById('close-api').addEventListener('click', () => apiModal.classList.add('hidden'));
    
    document.getElementById('btn-save-api').addEventListener('click', () => {
        const key = document.getElementById('gemini-api-key').value;
        const pat = document.getElementById('github-pat-key').value;
        AppState.apiKeys.gemini = key;
        AppState.apiKeys.github = pat;
        localStorage.setItem('foundr_gemini_key', key);
        localStorage.setItem('foundr_github_pat', pat);
        apiModal.classList.add('hidden');
    });
}

function initPortfolioActions() {
    const launchBtn = document.getElementById('btn-launch-new');
    if(!launchBtn) return;

    launchBtn.addEventListener('click', () => {
        const starterPrompt = 'Build a B2B AI workflow automation startup for small operations teams. Include MVP, monetization, and launch KPIs.';
        const promptArea = document.getElementById('builder-prompt');
        if(promptArea && !promptArea.value.trim()) {
            promptArea.value = starterPrompt;
        }

        if(Array.isArray(AppState.portfolio)) {
            AppState.portfolio.unshift({
                id: `d${Date.now()}`,
                name: 'New Venture Draft',
                category: 'Business Builder',
                status: 'Building',
                arr: '$0',
                progress: 5
            });
            renderPortfolio();
        } else {
            const grid = document.getElementById('portfolio-grid');
            if(grid) {
                grid.insertAdjacentHTML('afterbegin', `
                    <div class="portfolio-card glass-panel">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <h3>New Venture Draft</h3>
                            <span class="badge" style="background: rgba(255,255,255,0.1)">Business Builder</span>
                        </div>
                        <div class="mt-4">
                            <p class="text-sm text-secondary">Status: <span class="text-yellow">Building</span></p>
                            <p class="text-sm text-secondary">ARR: <span class="text-primary font-bold">$0</span></p>
                        </div>
                        <div class="mt-4" style="height: 4px; background: var(--panel-border); border-radius: 2px;">
                            <div style="height: 100%; width: 5%; background: var(--accent-cyan);"></div>
                        </div>
                        <button class="btn btn-sm btn-outline btn-block mt-4">Manage Engine</button>
                    </div>
                `);
            }
        }

        setActiveView('view-builder');

        if(promptArea) {
            promptArea.focus();
            promptArea.setSelectionRange(promptArea.value.length, promptArea.value.length);
        }
        if(window.logToTerminal) {
            window.logToTerminal('New business draft launched. Refine the seed idea, then click Start Autonomous Build.', 'system');
        }
    });
}

// --- Render Helpers ---
function renderPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    AppState.portfolio.forEach(company => {
        const statusColor = company.status === 'Profitable' ? 'text-green' : (company.status === 'Marketing' ? 'text-accent-purple' : 'text-yellow');
        const card = document.createElement('div');
        card.className = 'portfolio-card glass-panel';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3>${company.name}</h3>
                <span class="badge" style="background: rgba(255,255,255,0.1)">${company.category}</span>
            </div>
            <div class="mt-4">
                <p class="text-sm text-secondary">Status: <span class="${statusColor}">${company.status}</span></p>
                <p class="text-sm text-secondary">ARR: <span class="text-primary font-bold">${company.arr}</span></p>
            </div>
            <div class="mt-4" style="height: 4px; background: var(--panel-border); border-radius: 2px;">
                <div style="height: 100%; width: ${company.progress}%; background: var(--accent-cyan);"></div>
            </div>
            <button class="btn btn-sm btn-outline btn-block mt-4">Manage Engine</button>
        `;
        grid.appendChild(card);
    });
}

// Global utility for appending logs
window.logToTerminal = function(message, source = 'system') {
    const terminal = document.getElementById('terminal-output');
    if (!terminal) return;
    const p = document.createElement('p');
    let sourceColor = 'text-accent-cyan';
    if (source === 'HexaSAI') sourceColor = 'text-accent-lime';
    if (source === 'Gstack') sourceColor = 'text-accent-purple';
    
    p.innerHTML = `<span class="${sourceColor}">${source}@foundrOS</span>:~$ ${message}`;
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
}

// --- Kanban Logic ---
function initKanban() {
    const cards = document.querySelectorAll('.kanban-card');
    const cols = document.querySelectorAll('.kanban-col');

    cards.forEach(card => {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            updateKanbanCounts();
        });
    });

    cols.forEach(col => {
        col.addEventListener('dragover', e => {
            e.preventDefault();
            col.classList.add('drag-over');
            const afterElement = getDragAfterElement(col.querySelector('.kanban-cards'), e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                col.querySelector('.kanban-cards').appendChild(draggable);
            } else {
                col.querySelector('.kanban-cards').insertBefore(draggable, afterElement);
            }
        });
        col.addEventListener('dragleave', () => {
            col.classList.remove('drag-over');
        });
        col.addEventListener('drop', () => {
            col.classList.remove('drag-over');
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.kanban-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateKanbanCounts() {
    document.querySelectorAll('.kanban-col').forEach(col => {
        const count = col.querySelectorAll('.kanban-card').length;
        const countBadge = col.querySelector('.kanban-count');
        if(countBadge) countBadge.innerText = count;
    });
}
