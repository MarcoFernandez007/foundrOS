// app.js - Main Application Logic & Routing

const AppState = {
    isAuthenticated: false,
    user: null,
    theme: 'dark',
    activeView: 'view-dashboard',
    portfolio: JSON.parse(localStorage.getItem('foundr_portfolio')) || [
        { id: '1', name: 'DevFlow AI', category: 'Developer Tools', status: 'Profitable', arr: '$45,000', progress: 100 },
        { id: '2', name: 'MedTranscribe', category: 'Healthcare', status: 'Marketing', arr: '$12,000', progress: 85 },
        { id: '3', name: 'EcoRoute', category: 'Logistics', status: 'Building', arr: '$0', progress: 40 }
    ],
    team: JSON.parse(localStorage.getItem('foundr_team')) || [],
    tasks: JSON.parse(localStorage.getItem('foundr_tasks')) || [
        { id: 't1', title: 'Setup Stripe Webhooks', status: 'backlog', points: 3, assigneeId: 'unassigned', type: 'human', desc: '' },
        { id: 't2', title: 'Draft YC Application', status: 'backlog', points: 5, assigneeId: 'ceo', type: 'agent', desc: '' },
        { id: 't3', title: 'Create LLC Operating Agreement', status: 'todo', points: 2, assigneeId: 'legal', type: 'agent', desc: '' },
        { id: 't4', title: 'Implement Dashboard Redesign', status: 'inprogress', points: 8, assigneeId: 'frontend', type: 'agent', desc: '' },
        { id: 't5', title: 'Gemini 2.5 Flash Integration', status: 'done', points: 13, assigneeId: 'unassigned', type: 'system', desc: '' }
    ],
    apiKeys: {
        gemini: localStorage.getItem('foundr_gemini_key') || '',
        github: localStorage.getItem('foundr_github_pat') || ''
    }
};

function savePortfolio() {
    localStorage.setItem('foundr_portfolio', JSON.stringify(AppState.portfolio));
}
function saveTeam() {
    localStorage.setItem('foundr_team', JSON.stringify(AppState.team));
}
function saveTasks() {
    localStorage.setItem('foundr_tasks', JSON.stringify(AppState.tasks));
}


const BUSINESS_BUILDER_STARTER_PROMPT = 'Build a B2B AI workflow automation startup for small operations teams. Include MVP, monetization, and launch KPIs.';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLandingPage();
    initAuth();
    initNavigation();
    initPortfolioActions();
    initPortfolioModal();
    initModals();
    renderPortfolio();
    initKanban();
    initTeamActions();
    initWorkflows();
    initBuilderAutomations();
    initVoiceInput();
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
        const promptArea = document.getElementById('builder-prompt');
        if(promptArea && !promptArea.value.trim()) {
            promptArea.value = BUSINESS_BUILDER_STARTER_PROMPT;
        }

        if(Array.isArray(AppState.portfolio)) {
            AppState.portfolio.unshift({
                id: (window.crypto && window.crypto.randomUUID) ? `d${window.crypto.randomUUID()}` : `d${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                name: 'New Venture Draft',
                category: 'Business Builder',
                status: 'Building',
                arr: '$0',
                progress: 5
            });
            renderPortfolio();
        } else {
            window.logToTerminal?.('Portfolio state unavailable. Opening Business Builder now, but this draft will not appear in Portfolio until state is restored.', 'system');
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
                <div style="display:flex;gap:6px;align-items:center;">
                    <span class="badge" style="background: rgba(255,255,255,0.1)">${company.category}</span>
                    <button onclick="openEditPortfolio('${company.id}')" style="background:none;border:none;color:var(--secondary);cursor:pointer;"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deletePortfolioItem('${company.id}')" style="background:none;border:none;color:var(--accent-red);cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
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

window.openEditPortfolio = function(id) {
    const company = AppState.portfolio.find(c => c.id === id);
    if (!company) return;
    document.getElementById('edit-portfolio-id').value = company.id;
    document.getElementById('edit-portfolio-name').value = company.name;
    document.getElementById('edit-portfolio-category').value = company.category;
    document.getElementById('edit-portfolio-status').value = company.status;
    document.getElementById('edit-portfolio-arr').value = company.arr;
    document.getElementById('edit-portfolio-progress').value = company.progress;
    document.getElementById('portfolio-edit-modal').classList.remove('hidden');
};

window.deletePortfolioItem = function(id) {
    if (confirm('Remove this venture from your portfolio?')) {
        AppState.portfolio = AppState.portfolio.filter(c => c.id !== id);
        savePortfolio();
        renderPortfolio();
    }
};

function initPortfolioModal() {
    document.getElementById('close-portfolio-modal')?.addEventListener('click', () => {
        document.getElementById('portfolio-edit-modal').classList.add('hidden');
    });
    document.getElementById('btn-save-portfolio')?.addEventListener('click', () => {
        const id = document.getElementById('edit-portfolio-id').value;
        const company = AppState.portfolio.find(c => c.id === id);
        if (company) {
            company.name     = document.getElementById('edit-portfolio-name').value;
            company.category = document.getElementById('edit-portfolio-category').value;
            company.status   = document.getElementById('edit-portfolio-status').value;
            company.arr      = document.getElementById('edit-portfolio-arr').value;
            company.progress = parseInt(document.getElementById('edit-portfolio-progress').value, 10) || 0;
            savePortfolio();
            renderPortfolio();
        }
        document.getElementById('portfolio-edit-modal').classList.add('hidden');
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

// --- Kanban Logic (Dynamic) ---
function initKanban() {
    renderKanban();

    document.getElementById('btn-create-task')?.addEventListener('click', () => {
        document.getElementById('task-id').value = '';
        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
        document.getElementById('task-points').value = '1';
        document.getElementById('task-status').value = 'backlog';
        document.getElementById('task-modal-title').innerText = 'Create Task';
        document.getElementById('btn-delete-task').classList.add('hidden');
        populateAssigneeDropdown();
        document.getElementById('task-modal').classList.remove('hidden');
    });

    document.getElementById('btn-save-task')?.addEventListener('click', () => {
        const id = document.getElementById('task-id').value;
        const assigneeId = document.getElementById('task-assignee').value;
        let type = 'unassigned';
        if (assigneeId !== 'unassigned') {
            const member = AppState.team.find(m => m.id === assigneeId);
            if (member) type = member.type === 'human' ? 'human' : 'agent';
        }
        const taskData = {
            id: id || 't' + Date.now(),
            title: document.getElementById('task-title').value || 'Untitled Task',
            desc: document.getElementById('task-desc').value,
            points: parseInt(document.getElementById('task-points').value) || 1,
            status: document.getElementById('task-status').value || 'backlog',
            assigneeId,
            type
        };
        if (id) {
            const idx = AppState.tasks.findIndex(t => t.id === id);
            if (idx !== -1) AppState.tasks[idx] = taskData;
        } else {
            AppState.tasks.push(taskData);
        }
        saveTasks();
        renderKanban();
        document.getElementById('task-modal').classList.add('hidden');
    });

    document.getElementById('btn-delete-task')?.addEventListener('click', () => {
        const id = document.getElementById('task-id').value;
        AppState.tasks = AppState.tasks.filter(t => t.id !== id);
        saveTasks();
        renderKanban();
        document.getElementById('task-modal').classList.add('hidden');
    });

    document.getElementById('close-task-modal')?.addEventListener('click', () => {
        document.getElementById('task-modal').classList.add('hidden');
    });
}

function populateAssigneeDropdown(selectedId = 'unassigned') {
    const select = document.getElementById('task-assignee');
    if (!select) return;
    let html = `<option value="unassigned">Unassigned</option>`;
    AppState.team.forEach(m => {
        html += `<option value="${m.id}" ${m.id === selectedId ? 'selected' : ''}>${m.name}</option>`;
    });
    select.innerHTML = html;
}

window.editTask = function(id) {
    const task = AppState.tasks.find(t => t.id === id);
    if (!task) return;
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.desc;
    document.getElementById('task-points').value = task.points;
    document.getElementById('task-status').value = task.status;
    document.getElementById('task-modal-title').innerText = 'Edit Task';
    document.getElementById('btn-delete-task').classList.remove('hidden');
    populateAssigneeDropdown(task.assigneeId);
    document.getElementById('task-modal').classList.remove('hidden');
};

function renderKanban() {
    const colIds = ['backlog', 'todo', 'inprogress', 'done'];
    colIds.forEach(col => {
        const container = document.getElementById(`kanban-${col}`);
        if (!container) return;
        container.innerHTML = '';
        let count = 0;
        AppState.tasks.filter(t => t.status === col).forEach(task => {
            count++;
            let assigneeHtml = `<span class="assignee-badge"><i class="fa-solid fa-user-slash"></i> Unassigned</span>`;
            if (task.assigneeId && task.assigneeId !== 'unassigned') {
                const member = AppState.team.find(m => m.id === task.assigneeId);
                const icon = member ? (member.icon || 'fa-robot') : (task.type === 'human' ? 'fa-user' : 'fa-robot');
                const name = member ? member.name : task.assigneeId;
                assigneeHtml = `<span class="assignee-badge type-${task.type}"><i class="fa-solid ${icon}"></i> @${name}</span>`;
            }
            const card = document.createElement('div');
            card.className = 'kanban-card glass-panel';
            card.draggable = true;
            card.dataset.id = task.id;
            card.innerHTML = `
                <div class="kanban-card-title" style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <span style="flex:1;">${task.title}</span>
                    <button style="background:none;border:none;color:var(--secondary);cursor:pointer;padding:2px 6px;" onclick="editTask('${task.id}')"><i class="fa-solid fa-pen"></i></button>
                </div>
                <div class="kanban-card-footer mt-2" style="display:flex;justify-content:space-between;align-items:center;">
                    ${assigneeHtml}
                    <span class="badge" style="background:rgba(255,255,255,0.1)">${task.points} pts</span>
                </div>`;
            container.appendChild(card);
        });
        const countEl = document.getElementById(`count-${col}`);
        if (countEl) countEl.innerText = count;
    });
    setupKanbanDnd();
}

function setupKanbanDnd() {
    document.querySelectorAll('.kanban-card').forEach(card => {
        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend',   () => card.classList.remove('dragging'));
    });
    document.querySelectorAll('.kanban-col .kanban-cards').forEach(col => {
        col.addEventListener('dragover', e => {
            e.preventDefault();
            col.parentElement.classList.add('drag-over');
            const after = getDragAfterElement(col, e.clientY);
            const drag  = document.querySelector('.dragging');
            if (!drag) return;
            after ? col.insertBefore(drag, after) : col.appendChild(drag);
        });
        col.addEventListener('dragleave', () => col.parentElement.classList.remove('drag-over'));
        col.addEventListener('drop', () => {
            col.parentElement.classList.remove('drag-over');
            const drag = document.querySelector('.dragging');
            if (!drag) return;
            const taskId   = drag.dataset.id;
            const newStatus = col.dataset.col;
            const task = AppState.tasks.find(t => t.id === taskId);
            if (task && task.status !== newStatus) {
                task.status = newStatus;
                saveTasks();
                renderKanban();
                if ((newStatus === 'todo' || newStatus === 'inprogress') && task.type === 'agent') {
                    if (window.logToTerminal) window.logToTerminal(`Task "${task.title}" assigned to AI agent. Starting...`, 'system');
                    setTimeout(() => {
                        if (window.logToTerminal) window.logToTerminal(`Agent completed: "${task.title}". Moving to Done.`, 'HexaSAI');
                        const t = AppState.tasks.find(x => x.id === taskId);
                        if (t) { t.status = 'done'; saveTasks(); renderKanban(); }
                    }, 4000);
                }
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const els = [...container.querySelectorAll('.kanban-card:not(.dragging)')];
    return els.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- Team Logic ---
function initTeamActions() {
    renderTeam();
    document.getElementById('btn-add-team-member')?.addEventListener('click', () => {
        const sel = document.getElementById('team-agent-template');
        if (sel && typeof AgentTemplates !== 'undefined') {
            sel.innerHTML = AgentTemplates.map(a => `<option value="${a.id}">${a.name} (${a.role})</option>`).join('');
        }
        document.getElementById('team-member-type').value = 'agent';
        document.getElementById('team-agent-select').classList.remove('hidden');
        document.getElementById('team-custom-fields').classList.add('hidden');
        document.getElementById('add-team-member-modal').classList.remove('hidden');
    });
    document.getElementById('team-member-type')?.addEventListener('change', e => {
        const type = e.target.value;
        document.getElementById('team-agent-select').classList.toggle('hidden', type !== 'agent');
        document.getElementById('team-custom-fields').classList.toggle('hidden', type === 'agent');
        document.getElementById('team-human-email-group').classList.toggle('hidden', type !== 'human');
    });
    document.getElementById('btn-save-team-member')?.addEventListener('click', () => {
        const type = document.getElementById('team-member-type').value;
        let member = { id: 'm' + Date.now(), type };
        if (type === 'agent') {
            const tplId = document.getElementById('team-agent-template').value;
            const tpl = (typeof AgentTemplates !== 'undefined') ? AgentTemplates.find(a => a.id === tplId) : null;
            if (!tpl) { alert('Select an agent template.'); return; }
            Object.assign(member, { name: tpl.name, role: tpl.role, icon: tpl.icon || 'fa-robot', color: tpl.color || 'text-accent-cyan' });
        } else {
            member.name  = document.getElementById('team-custom-name').value || 'Member';
            member.role  = document.getElementById('team-custom-role').value || 'Role';
            member.icon  = type === 'human' ? 'fa-user' : 'fa-robot';
            member.color = type === 'human' ? 'text-accent-lime' : 'text-accent-cyan';
            if (type === 'human') member.email = document.getElementById('team-human-email').value;
        }
        AppState.team.push(member);
        saveTeam();
        renderTeam();
        renderKanban();
        document.getElementById('add-team-member-modal').classList.add('hidden');
    });
    document.getElementById('close-team-modal')?.addEventListener('click', () => {
        document.getElementById('add-team-member-modal').classList.add('hidden');
    });
}

function renderTeam() {
    const grid = document.getElementById('team-grid');
    if (!grid) return;
    if (AppState.team.length === 0) {
        grid.innerHTML = `<p class="text-secondary" style="grid-column:1/-1;">No team members yet. Click "Add Member" to build your team.</p>`;
        return;
    }
    grid.innerHTML = AppState.team.map(m => {
        const badge = m.type === 'human' ? 'Human' : m.type === 'custom_agent' ? 'Custom AI' : 'Template AI';
        return `
        <div class="glass-panel" style="padding:18px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <i class="fa-solid ${m.icon} ${m.color}" style="font-size:1.6rem;"></i>
                    <div><h4 style="margin:0;">${m.name}</h4><span class="text-xs text-secondary">${m.role}</span></div>
                </div>
                <button class="btn btn-sm btn-outline" style="border-color:var(--accent-red);color:var(--accent-red);" onclick="removeTeamMember('${m.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div style="margin-top:10px;">
                <span class="badge" style="background:rgba(255,255,255,0.1);">${badge}</span>
                ${m.email ? `<span class="text-xs text-secondary" style="margin-left:8px;">${m.email}</span>` : ''}
            </div>
        </div>`;
    }).join('');
}

window.removeTeamMember = function(id) {
    if (confirm('Remove this team member?')) {
        AppState.team = AppState.team.filter(m => m.id !== id);
        saveTeam(); renderTeam(); renderKanban();
    }
};

// --- Workflows (God Mode) ---
function initWorkflows() {
    const btn      = document.getElementById('btn-start-workflow');
    const input    = document.getElementById('workflow-goal-input');
    const terminal = document.getElementById('workflow-terminal-output');
    if (!btn || !input || !terminal) return;

    btn.addEventListener('click', () => {
        const goal = input.value.trim();
        if (!goal) return;
        const log = (color, who, msg) => {
            terminal.innerHTML += `<p><span class="${color}">${who}</span>:~$ ${msg}</p>`;
            terminal.scrollTop = terminal.scrollHeight;
        };
        log('text-accent-cyan', 'User', '/goal ' + goal);
        input.value = '';
        setTimeout(() => log('text-accent-purple', 'System', 'Analyzing goal constraints and team capabilities...'), 600);
        setTimeout(() => log('text-accent-lime',   'HexaSAI', 'Breaking down goal into execution tree...'), 1600);
        setTimeout(() => log('text-accent-cyan',   'CEO Agent', 'Validating alignment with market thesis.'), 2600);
        setTimeout(() => {
            log('text-accent-lime', 'HexaSAI', 'Generated 4 sub-tasks. Dispatching to Kanban...');
            const now = Date.now();
            AppState.tasks.push(
                { id: 't' + (now + 1), title: 'Analyze market competitors for Q3', status: 'todo', points: 3, assigneeId: 'unassigned', type: 'agent', desc: 'Generated by Workflow' },
                { id: 't' + (now + 2), title: 'Design growth experiment A/B test',   status: 'todo', points: 5, assigneeId: 'unassigned', type: 'agent', desc: 'Generated by Workflow' }
            );
            saveTasks(); renderKanban();
        }, 4000);
        setTimeout(() => log('text-accent-purple', 'System', 'Workflow loop active. Agents self-assigning and reporting.'), 5600);
    });
}

// --- Builder Automations ---
function initBuilderAutomations() {
    const showOutput = (title, lines) => {
        const modal = document.getElementById('automation-output-modal') || createAutomationModal();
        document.getElementById('automation-modal-title').innerText = title;
        const body = document.getElementById('automation-modal-body');
        body.innerHTML = '';
        lines.forEach((line, i) => {
            setTimeout(() => {
                body.innerHTML += `<p>${line}</p>`;
                body.scrollTop = body.scrollHeight;
            }, i * 400);
        });
        modal.classList.remove('hidden');
    };

    document.getElementById('btn-auto-social')?.addEventListener('click', () => {
        showOutput('Auto Post to X & LinkedIn', [
            '🔍 Reading your latest product updates...',
            '✍️ Drafting thread for X (Twitter)...',
            '📋 Post: "Big update! Our AI pipeline just hit 99.9% uptime. Here\'s how we did it 🧵"',
            '📤 Posting to X... Done ✅',
            '✍️ Adapting for LinkedIn audience...',
            '📤 Posting to LinkedIn... Done ✅',
            '📊 Engagement tracking started. Check back in 24h.'
        ]);
    });

    document.getElementById('btn-auto-email')?.addEventListener('click', () => {
        showOutput('Cold Email Outreach', [
            '🎯 Identifying 50 qualified leads from CRM...',
            '✍️ Personalizing subject lines with AI...',
            '📧 Subject: "Quick question about your {pain_point}"',
            '📤 Sending batch 1/5 (10 emails)...',
            '📤 Sending batch 2/5 (10 emails)...',
            '📤 Sending batch 3/5 (10 emails)...',
            '✅ 50 emails sent. Expected 12-15% open rate.',
            '📊 Replies will auto-route to your CRM.'
        ]);
    });

    document.getElementById('btn-auto-blog')?.addEventListener('click', () => {
        showOutput('Auto-Generate Blog Articles', [
            '🔍 Analyzing top-ranking content in your niche...',
            '📝 Article 1: "10 Ways AI Is Transforming Small Business Operations"',
            '📝 Article 2: "The Future of Autonomous Workflows: A 2026 Guide"',
            '✍️ Generating 1,500-word drafts with SEO metadata...',
            '🖼️ AI-generating hero images...',
            '✅ 2 articles ready for review.',
            '📤 Publishing to blog... Done.'
        ]);
    });

    document.getElementById('btn-auto-ads')?.addEventListener('click', () => {
        showOutput('Auto Ads (Meta, Google, ChatGPT)', [
            '🎯 Analyzing best-performing ad copy from competitors...',
            '✍️ Generating 5 ad variations...',
            '🖼️ Creating visual assets with AI...',
            '📤 Uploading to Meta Ads Manager...',
            '📤 Uploading to Google Ads...',
            '📤 Submitting to ChatGPT search ads...',
            '✅ Campaigns live! Daily budget: $25. Estimated reach: 8,000/day.',
            '📊 Performance dashboard updated.'
        ]);
    });
}

function createAutomationModal() {
    const existing = document.getElementById('automation-output-modal');
    if (existing) return existing;
    const el = document.createElement('div');
    el.id = 'automation-output-modal';
    el.className = 'modal';
    el.innerHTML = `
        <div class="modal-content glass-panel" style="max-width:560px;">
            <div class="modal-header">
                <h3 id="automation-modal-title">Running...</h3>
                <button class="close-btn" onclick="document.getElementById('automation-output-modal').classList.add('hidden')"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body" id="automation-modal-body" style="min-height:200px;max-height:60vh;overflow-y:auto;font-family:monospace;font-size:0.9em;line-height:1.8;"></div>
        </div>`;
    document.body.appendChild(el);
    return el;
}

// --- Voice Mic Input ---
function initVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Speech Recognition API not supported in this browser.");
        // Hide mic buttons if unsupported
        document.querySelectorAll('.btn-mic').forEach(b => b.style.display = 'none');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let activeTargetInput = null;
    let activeMicBtn = null;

    recognition.onstart = () => {
        if (activeMicBtn) {
            activeMicBtn.style.color = '#ff5f56'; // Pulsing or red mic
            activeMicBtn.innerHTML = '<i class="fa-solid fa-microphone-lines fa-pulse"></i>';
        }
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        if (activeTargetInput) {
            if (activeTargetInput.tagName === 'TEXTAREA' || activeTargetInput.tagName === 'INPUT') {
                const currentText = activeTargetInput.value;
                activeTargetInput.value = currentText ? (currentText.trim() + " " + text) : text;
                activeTargetInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        resetMicButton();
    };

    recognition.onend = () => {
        resetMicButton();
    };

    function resetMicButton() {
        if (activeMicBtn) {
            activeMicBtn.style.color = 'var(--text-secondary)';
            activeMicBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>' + (activeMicBtn.id === 'mic-builder-prompt' ? '' : '');
        }
        activeTargetInput = null;
        activeMicBtn = null;
    }

    function setupMic(btnId, targetInputId) {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(targetInputId);
        if (!btn || !input) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (activeMicBtn === btn) {
                recognition.stop();
            } else {
                if (activeMicBtn) {
                    recognition.stop();
                }
                activeTargetInput = input;
                activeMicBtn = btn;
                recognition.start();
            }
        });
    }

    setupMic('mic-terminal-input', 'terminal-input');
    setupMic('mic-builder-prompt', 'builder-prompt');
    setupMic('mic-workflow-goal-input', 'workflow-goal-input');
    setupMic('mic-legal-chat-input', 'legal-chat-input');
}


