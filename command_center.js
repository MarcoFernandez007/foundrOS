// command_center.js - Logic for the Gamified RTS Command Center

const CommandCenter = {
    agents: [
        { id: 'ceo', name: 'CEO Agent', icon: 'fa-user-tie', x: 20, y: 30, color: 'var(--accent-purple)', status: 'Idle', energy: 100 },
        { id: 'cto', name: 'CTO Agent', icon: 'fa-laptop-code', x: 40, y: 50, color: 'var(--accent-cyan)', status: 'Compiling', energy: 85 },
        { id: 'cmo', name: 'CMO Agent', icon: 'fa-bullhorn', x: 70, y: 20, color: 'var(--accent-red)', status: 'Scraping', energy: 90 },
        { id: 'cfo', name: 'CFO Agent', icon: 'fa-chart-pie', x: 80, y: 60, color: 'var(--accent-lime)', status: 'Idle', energy: 100 },
        { id: 'legal', name: 'Legal Agent', icon: 'fa-scale-balanced', x: 10, y: 70, color: 'var(--accent-purple)', status: 'Reviewing', energy: 60 },
        { id: 'design', name: 'Design Agent', icon: 'fa-pen-nib', x: 50, y: 80, color: 'var(--accent-cyan)', status: 'Drafting', energy: 75 },
        { id: 'hr', name: 'HR Agent', icon: 'fa-users', x: 90, y: 90, color: 'var(--accent-red)', status: 'Idle', energy: 100 },
        { id: 'sales', name: 'Sales Agent', icon: 'fa-handshake', x: 30, y: 10, color: 'var(--accent-lime)', status: 'Pitching', energy: 40 },
        { id: 'data', name: 'Data Agent', icon: 'fa-database', x: 60, y: 40, color: 'var(--accent-cyan)', status: 'Analyzing', energy: 95 },
        { id: 'devops', name: 'DevOps Agent', icon: 'fa-server', x: 85, y: 35, color: 'var(--accent-purple)', status: 'Deploying', energy: 50 },
        { id: 'qa', name: 'QA Agent', icon: 'fa-bug', x: 25, y: 85, color: 'var(--accent-red)', status: 'Testing', energy: 80 },
        { id: 'support', name: 'Support Agent', icon: 'fa-headset', x: 55, y: 15, color: 'var(--accent-lime)', status: 'Idle', energy: 100 },
        { id: 'product', name: 'Product Agent', icon: 'fa-box-open', x: 15, y: 50, color: 'var(--accent-cyan)', status: 'Planning', energy: 90 },
        { id: 'growth', name: 'Growth Agent', icon: 'fa-rocket', x: 75, y: 75, color: 'var(--accent-purple)', status: 'Optimizing', energy: 70 },
        { id: 'market', name: 'Market Intel Agent', icon: 'fa-chart-line', x: 45, y: 22, color: 'var(--accent-cyan)', status: 'Signal Mining', energy: 88 },
        { id: 'brand', name: 'Brand Agent', icon: 'fa-feather-pointed', x: 65, y: 88, color: 'var(--accent-red)', status: 'Messaging', energy: 84 },
        { id: 'strategy', name: 'Strategy Agent', icon: 'fa-chess-queen', x: 12, y: 28, color: 'var(--accent-purple)', status: 'Positioning', energy: 92 }
    ],
    selectedAgent: null,

    init() {
        this.renderBattlefield();
        this.renderMinimap();
        this.setupActionGrid();
    },

    renderBattlefield() {
        const field = document.getElementById('rts-battlefield');
        if (!field) return;
        
        field.innerHTML = '';
        
        this.agents.forEach(agent => {
            const el = document.createElement('div');
            el.className = 'rts-unit';
            el.style.left = `${agent.x}%`;
            el.style.top = `${agent.y}%`;
            // Give them slight random offsets so they don't perfectly align to the grid visually
            el.style.transform = `translate(-50%, -50%)`;
            
            el.innerHTML = `
                <i class="fa-solid ${agent.icon}" style="color: ${agent.color}"></i>
                <div class="rts-unit-name" style="color: ${agent.color}">${agent.name}</div>
            `;
            
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectAgent(agent, el);
            });
            
            field.appendChild(el);
            agent.element = el;
        });

        // Click on empty space to deselect
        field.addEventListener('click', () => {
            this.deselectAll();
        });
    },

    renderMinimap() {
        const minimap = document.getElementById('rts-minimap');
        if (!minimap) return;

        // Keep the scanner, add blips
        const scanner = minimap.querySelector('.minimap-scanner');
        minimap.innerHTML = '';
        if (scanner) minimap.appendChild(scanner);

        this.agents.forEach(agent => {
            const blip = document.createElement('div');
            blip.className = 'minimap-blip';
            blip.style.left = `${agent.x}%`;
            blip.style.top = `${agent.y}%`;
            blip.style.backgroundColor = agent.color;
            minimap.appendChild(blip);
        });
    },

    selectAgent(agent, el) {
        this.deselectAll();
        this.selectedAgent = agent;
        el.classList.add('selected');
        
        // Update HUD
        document.getElementById('rts-selected-name').innerText = agent.name;
        document.getElementById('rts-selected-name').style.color = agent.color;
        
        const statusEl = document.getElementById('rts-selected-status');
        statusEl.innerText = `${agent.status} | Energy: ${agent.energy}%`;
        
        const statFill = document.querySelector('.rts-unit-stats .stat-fill');
        statFill.style.width = `${agent.energy}%`;
        statFill.style.backgroundColor = agent.color;

        // Enable action buttons
        const btns = document.querySelectorAll('.rts-btn');
        btns.forEach(btn => btn.disabled = false);
    },

    deselectAll() {
        this.selectedAgent = null;
        this.agents.forEach(a => {
            if(a.element) a.element.classList.remove('selected');
        });
        
        document.getElementById('rts-selected-name').innerText = 'NO UNIT SELECTED';
        document.getElementById('rts-selected-name').style.color = 'var(--accent-cyan)';
        
        const statusEl = document.getElementById('rts-selected-status');
        statusEl.innerText = 'Awaiting Orders';
        
        const statFill = document.querySelector('.rts-unit-stats .stat-fill');
        statFill.style.width = '100%';
        statFill.style.backgroundColor = 'var(--accent-lime)';

        // Disable action buttons
        const btns = document.querySelectorAll('.rts-btn');
        btns.forEach(btn => btn.disabled = true);
    },

    setupActionGrid() {
        const btns = document.querySelectorAll('.rts-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                if(!this.selectedAgent) return;
                
                const action = btn.innerText.trim();
                console.log(`Commanding ${this.selectedAgent.name} to ${action}...`);
                
                // Visual feedback
                const statusEl = document.getElementById('rts-selected-status');
                statusEl.innerText = `Executing: ${action}...`;
                
                // Deduct energy
                this.selectedAgent.energy = Math.max(0, this.selectedAgent.energy - 15);
                document.querySelector('.rts-unit-stats .stat-fill').style.width = `${this.selectedAgent.energy}%`;
                
                // Spend AP
                const apEl = document.getElementById('rts-ap');
                let ap = parseInt(apEl.innerText);
                ap = Math.max(0, ap - 50);
                apEl.innerText = ap;
                
                setTimeout(() => {
                    if(this.selectedAgent) {
                        statusEl.innerText = 'Task Complete.';
                    }
                }, 2000);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CommandCenter.init();
});
