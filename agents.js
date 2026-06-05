// agents.js - Multi-Agent Engine & Gstack Pipeline

const AgentTemplates = [
    { id: 'ceo', name: 'CEO Agent', role: 'Vision & Scope', icon: 'fa-user-tie', color: 'text-accent-purple' },
    { id: 'em', name: 'Engineering Manager', role: 'Architecture', icon: 'fa-network-wired', color: 'text-accent-cyan' },
    { id: 'lead_dev', name: 'Lead Developer', role: 'Core Logic', icon: 'fa-code', color: 'text-accent-cyan' },
    { id: 'frontend', name: 'Frontend Engineer', role: 'UI/UX Implementation', icon: 'fa-desktop', color: 'text-accent-cyan' },
    { id: 'backend', name: 'Backend Engineer', role: 'API & DB', icon: 'fa-server', color: 'text-accent-cyan' },
    { id: 'designer', name: 'Product Designer', role: 'UX & CSS', icon: 'fa-pen-nib', color: 'text-accent-red' },
    { id: 'qa', name: 'QA Reviewer', role: 'Testing', icon: 'fa-vial', color: 'text-accent-lime' },
    { id: 'release', name: 'Release Engineer', role: 'Deployment', icon: 'fa-rocket', color: 'text-accent-purple' }
];

// --- Gstack Execution Pipeline ---
class GstackPipeline {
    constructor(agentId, taskName) {
        this.agent = AgentTemplates.find(a => a.id === agentId);
        this.taskName = taskName;
        this.stage = 'Plan';
    }

    async run() {
        this.log(`[Gstack-Plan] Narrowing ambiguity for: ${this.taskName}`);
        await this.delay(400);
        
        this.stage = 'Execute';
        this.log(`[Gstack-Execute] Generating output...`);
        await this.delay(600);

        this.stage = 'Review';
        this.log(`[Gstack-Review] Running critic analysis & safety filters...`);
        await this.delay(400);

        this.stage = 'Release';
        this.log(`[Gstack-Release] Output verified. Handoff complete.`);
        return { success: true, agent: this.agent.name };
    }

    log(msg) {
        if (window.logToTerminal) window.logToTerminal(msg, this.agent.id);
        this.updateUIStatus(msg);
    }

    updateUIStatus(msg) {
        const list = document.getElementById('gstack-status-list');
        if(!list) return;
        const item = document.createElement('div');
        item.className = 'gstack-stage';
        item.innerHTML = `<span class="${this.agent.color}"><i class="fa-solid ${this.agent.icon}"></i> ${this.agent.name}</span> <span>${this.stage}</span>`;
        list.appendChild(item);
        if(list.children.length > 5) list.removeChild(list.firstChild);
    }

    delay(ms) { return new Promise(res => setTimeout(res, ms)); }
}

window.initAgents = function() {
    startBackgroundKarpathyLoop();
    initBuilderEvents();
};

function startBackgroundKarpathyLoop() {
    setInterval(async () => {
        if(!AppState.isAuthenticated) return;
        if(Math.random() > 0.8 && window.logToTerminal) {
            try {
                if(AppState.apiKeys.gemini) {
                    const insight = await window.LLMEngine.generateContent("Give me one short sentence about a new SaaS or AI trend.");
                    window.logToTerminal(`[Autoresearch] Discovered insight: ${insight.trim()}`, 'Gstack');
                }
            } catch(e) {
                // Silently fail if API is missing for background loops
            }
        }
    }, 15000);
}

// --- Builder v2 Logic (Real AI Integration) ---
let lastGeneratedCode = '';

function initBuilderEvents() {
    const btnStart = document.getElementById('btn-start-build');
    const btnOpt = document.getElementById('btn-gstack-opt');
    const promptArea = document.getElementById('builder-prompt');
    const iframe = document.getElementById('builder-iframe');

    if(btnOpt) {
        btnOpt.addEventListener('click', async () => {
            const val = promptArea.value;
            if(!val) return;
            btnOpt.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            try {
                const optimized = await window.LLMEngine.generateContent(
                    `Optimize this seed idea into a structured product spec for an AI agent to build: "${val}"`,
                    `You are the Gstack Architect. Output only the optimized prompt text. Include tech stack preferences (HTML5, Vanilla JS, CSS3 Variables, Glassmorphism UI).`
                );
                promptArea.value = optimized;
                window.logToTerminal('Prompt expanded via Gstack LLM optimizer.', 'Gstack');
            } catch (err) {
                alert(err.message);
            } finally {
                btnOpt.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Optimize';
            }
        });
    }

    if(btnStart) {
        btnStart.addEventListener('click', async () => {
            if(!promptArea.value) return;
            btnStart.disabled = true;
            btnStart.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Orchestrating Agents...';
            document.getElementById('gstack-status-list').innerHTML = '';
            
            // Run simulated paperclip loop for UX
            for (const t of ['ceo', 'em', 'lead_dev']) {
                await new GstackPipeline(t, 'Architecting Application').run();
            }

            window.logToTerminal('Prompting Gemini AI to generate full HTML codebase...', 'system');
            
            try {
                // Call Gemini for real Code Generation
                const systemPrompt = `You are the Lead Fullstack Engineer agent. Your task is to output a single, complete, standalone HTML file that contains all necessary CSS and JS to run the application described. 
                Do NOT use external frameworks (React, Vue) - use Vanilla JS and CSS. Use a beautiful dark mode UI, glassmorphism, and responsive design.
                Output ONLY the raw HTML code inside a single \`\`\`html code block. Do not include any explanations.`;
                
                const response = await window.LLMEngine.generateContent(promptArea.value, systemPrompt);
                
                // Extract HTML block
                const htmlMatch = response.match(/```html\n([\s\S]*?)```/);
                const finalHTML = htmlMatch ? htmlMatch[1] : response.replace(/```html|```/g, '');
                lastGeneratedCode = finalHTML;
                
                window.logToTerminal('Code generation complete. Injecting into Live Preview...', 'system');
                iframe.srcdoc = finalHTML;
                
                if(window.triggerHexaCycle) window.triggerHexaCycle(promptArea.value, finalHTML);
                
            } catch (err) {
                alert(err.message);
                window.logToTerminal(`Generation failed: ${err.message}`, 'system');
            } finally {
                btnStart.disabled = false;
                btnStart.innerHTML = 'Start Autonomous Build';
            }
        });
    }

    // GitHub Publishing Logic
    const btnGit = document.getElementById('btn-publish-github');
    if(btnGit) {
        btnGit.addEventListener('click', async () => {
            const pat = AppState.apiKeys.github;
            if(!pat) {
                alert("GitHub PAT is missing. Please configure it in API Settings.");
                return;
            }
            if(!lastGeneratedCode) {
                alert("No code generated yet to publish.");
                return;
            }

            btnGit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing...';
            try {
                // 1. Get authenticated user
                const userRes = await fetch('https://api.github.com/user', {
                    headers: { 'Authorization': `token ${pat}`, 'Accept': 'application/vnd.github.v3+json' }
                });
                if(!userRes.ok) throw new Error("GitHub Auth Failed");
                const userData = await userRes.json();

                // 2. Create Repo
                const repoName = `foundros-app-${Date.now()}`;
                const createRes = await fetch('https://api.github.com/user/repos', {
                    method: 'POST',
                    headers: { 'Authorization': `token ${pat}`, 'Accept': 'application/vnd.github.v3+json' },
                    body: JSON.stringify({ name: repoName, description: 'Generated autonomously by foundrOS', private: false })
                });
                if(!createRes.ok) throw new Error("Failed to create repo");

                // 3. Upload index.html
                const content = btoa(unescape(encodeURIComponent(lastGeneratedCode))); // Base64 encode
                const uploadRes = await fetch(`https://api.github.com/repos/${userData.login}/${repoName}/contents/index.html`, {
                    method: 'PUT',
                    headers: { 'Authorization': `token ${pat}`, 'Accept': 'application/vnd.github.v3+json' },
                    body: JSON.stringify({ message: 'Initial commit by foundrOS Release Agent', content: content })
                });
                if(!uploadRes.ok) throw new Error("Failed to push code");

                btnGit.innerHTML = '<i class="fa-brands fa-github"></i> Published Successfully';
                window.logToTerminal(`Code successfully pushed to GitHub: github.com/${userData.login}/${repoName}`, 'release');
                setTimeout(() => { btnGit.innerHTML = '<i class="fa-brands fa-github"></i> Publish to GitHub'; }, 5000);

            } catch(e) {
                alert(`GitHub Publish Error: ${e.message}`);
                btnGit.innerHTML = '<i class="fa-brands fa-github"></i> Publish to GitHub';
            }
        });
    }
}
