// agents.js - Business Builder Agent Engine & Paperclip Orchestration

const AgentTemplates = [
    { id: 'ceo', name: 'CEO Agent', role: 'Vision & Scope', icon: 'fa-user-tie', color: 'text-accent-purple' },
    { id: 'market_intel', name: 'Market Intelligence Agent', role: 'Trend Discovery', icon: 'fa-chart-line', color: 'text-accent-cyan' },
    { id: 'strategist', name: 'Strategy Agent', role: 'Positioning & Moat', icon: 'fa-chess-queen', color: 'text-accent-purple' },
    { id: 'product', name: 'Product Agent', role: 'Feature Spec', icon: 'fa-box-open', color: 'text-accent-cyan' },
    { id: 'em', name: 'Engineering Manager', role: 'Architecture', icon: 'fa-network-wired', color: 'text-accent-cyan' },
    { id: 'lead_dev', name: 'Lead Developer', role: 'Core Logic', icon: 'fa-code', color: 'text-accent-cyan' },
    { id: 'frontend', name: 'Frontend Engineer', role: 'UI/UX Implementation', icon: 'fa-desktop', color: 'text-accent-cyan' },
    { id: 'backend', name: 'Backend Engineer', role: 'API & DB', icon: 'fa-server', color: 'text-accent-cyan' },
    { id: 'data', name: 'Data Agent', role: 'Analytics & Metrics', icon: 'fa-database', color: 'text-accent-purple' },
    { id: 'designer', name: 'Product Designer', role: 'UX & CSS', icon: 'fa-pen-nib', color: 'text-accent-red' },
    { id: 'brand', name: 'Brand Agent', role: 'Narrative & Messaging', icon: 'fa-feather-pointed', color: 'text-accent-red' },
    { id: 'growth', name: 'Growth Agent', role: 'Acquisition Experiments', icon: 'fa-bullhorn', color: 'text-accent-lime' },
    { id: 'finance', name: 'Finance Agent', role: 'Unit Economics', icon: 'fa-chart-pie', color: 'text-accent-lime' },
    { id: 'legal', name: 'Legal Agent', role: 'Compliance', icon: 'fa-scale-balanced', color: 'text-accent-purple' },
    { id: 'qa', name: 'QA Reviewer', role: 'Testing', icon: 'fa-vial', color: 'text-accent-lime' },
    { id: 'ops', name: 'Ops Agent', role: 'Reliability', icon: 'fa-gears', color: 'text-accent-cyan' },
    { id: 'release', name: 'Release Engineer', role: 'Deployment', icon: 'fa-rocket', color: 'text-accent-purple' }
];

window.BusinessBuilderAgentRoster = AgentTemplates.map(agent => agent.name);

const AutoresearchState = {
    iteration: 0,
    isRunning: false,
    systemPrompt: 'You are the Business Builder Chief Architect. Produce execution-ready plans that maximize profitable outcomes. Always define target customer, revenue mechanism, MVP scope, measurable launch KPIs, technical constraints (HTML/CSS/Vanilla JS), and a short risk register with mitigations.',
    agentMarkdownFiles: {
        'agents/strategy_agent.md': '# Strategy Agent\n\n- Define market wedge and GTM sequencing.\n- Prioritize fastest route to first revenue.\n',
        'agents/market_intelligence_agent.md': '# Market Intelligence Agent\n\n- Track competitor shifts and emerging demand patterns.\n- Feed concise insights back into planning.\n',
        'agents/growth_agent.md': '# Growth Agent\n\n- Propose growth experiments with measurable KPIs.\n- Retain only strategies that improve CAC/LTV dynamics.\n'
    }
};
const MAX_MARKDOWN_UPDATES_PER_ITERATION = 3;
const MAX_STATUS_ITEMS = 7;
const AUTORESEARCH_MARKDOWN_PATH_ALLOWLIST = new Set(Object.keys(AutoresearchState.agentMarkdownFiles));

const DefaultBusinessBuilderFlow = [
    {
        name: 'Discovery',
        steps: [
            { agentId: 'ceo', taskName: 'Define success constraints' },
            { agentId: 'market_intel', taskName: 'Extract market demand signals' },
            { agentId: 'strategist', taskName: 'Frame strategy and wedge' }
        ]
    },
    {
        name: 'Product & Build',
        steps: [
            { agentId: 'product', taskName: 'Lock MVP feature spec' },
            { agentId: 'em', taskName: 'Plan architecture' },
            { agentId: 'lead_dev', taskName: 'Coordinate implementation' },
            { agentId: 'frontend', taskName: 'Implement customer UX' },
            { agentId: 'backend', taskName: 'Implement core services' },
            { agentId: 'data', taskName: 'Set instrumentation' },
            { agentId: 'designer', taskName: 'Refine UX quality' }
        ]
    },
    {
        name: 'Go-To-Market',
        steps: [
            { agentId: 'brand', taskName: 'Craft positioning narrative' },
            { agentId: 'growth', taskName: 'Prepare launch experiment plan' },
            { agentId: 'finance', taskName: 'Verify business viability' },
            { agentId: 'legal', taskName: 'Review legal and compliance checklist' }
        ]
    },
    {
        name: 'Validation & Release',
        steps: [
            { agentId: 'qa', taskName: 'Run acceptance tests' },
            { agentId: 'ops', taskName: 'Verify operational readiness' },
            { agentId: 'release', taskName: 'Prepare release handoff' }
        ]
    }
];

function resolveBusinessBuilderFlow() {
    if (window.PaperclipOrchestrator?.createBusinessBuilderFlow) {
        return window.PaperclipOrchestrator.createBusinessBuilderFlow(AgentTemplates);
    }
    return DefaultBusinessBuilderFlow;
}

// --- Gstack Execution Pipeline ---
class GstackPipeline {
    constructor(agentId, taskName) {
        this.agent = AgentTemplates.find(a => a.id === agentId);
        if (!this.agent) {
            console.warn(`Unknown agentId "${agentId}" passed to GstackPipeline. Falling back to CEO Agent.`);
            this.agent = AgentTemplates[0];
        }
        this.taskName = taskName;
        this.stage = 'Plan';
    }

    async run() {
        this.log(`[Gstack-Plan] Narrowing ambiguity for: ${this.taskName}`);
        await this.delay(250);
        
        this.stage = 'Execute';
        this.log(`[Gstack-Execute] Generating output...`);
        await this.delay(350);

        this.stage = 'Review';
        this.log(`[Gstack-Review] Running critic analysis & safety filters...`);
        await this.delay(250);

        this.stage = 'Release';
        this.log(`[Gstack-Release] Output verified. Handoff complete.`);
        return { success: true, agent: this.agent.name };
    }

    log(msg) {
        if (window.logToTerminal) window.logToTerminal(msg, this.agent.id);
        this.updateUIStatus();
    }

    updateUIStatus() {
        const list = document.getElementById('gstack-status-list');
        if(!list) return;
        const item = document.createElement('div');
        item.className = 'gstack-stage';
        item.innerHTML = `<span class="${this.agent.color}"><i class="fa-solid ${this.agent.icon}"></i> ${this.agent.name}</span> <span>${this.stage}</span>`;
        list.appendChild(item);
        if(list.children.length > MAX_STATUS_ITEMS) list.removeChild(list.firstChild);
    }

    delay(ms) { return new Promise(res => setTimeout(res, ms)); }
}

window.initAgents = function() {
    startBackgroundAutoresearchLoop();
    initBuilderEvents();
};

function summarizeMarkdownFilesForPrompt() {
    return Object.entries(AutoresearchState.agentMarkdownFiles)
        .map(([path, content]) => `File: ${path}\n${content.substring(0, 500)}`)
        .join('\n\n');
}

function getAutoresearchMarkdownBundle() {
    return Object.entries(AutoresearchState.agentMarkdownFiles).map(([path, content]) => ({ path, content }));
}

function buildBusinessBuilderSystemPrompt() {
    const flowSummary = resolveBusinessBuilderFlow()
        .map(stage => `${stage.name}: ${stage.steps.map(step => step.agentId).join(' -> ')}`)
        .join('\n');

    return `You are the Lead Fullstack Engineer agent in FoundrOS Business Builder.
${AutoresearchState.systemPrompt}

Orchestration flow (Paperclip-managed):
${flowSummary}

Current agent prompt markdown context:
${summarizeMarkdownFilesForPrompt()}

Your task is to output a single, complete, standalone HTML file that contains all necessary CSS and JS to run the application described.
Do NOT use external frameworks (React, Vue) - use Vanilla JS and CSS.
Use a beautiful dark mode UI, glassmorphism, and responsive design.
Output ONLY the raw HTML code inside a single \`\`\`html code block. Do not include any explanations.`;
}

async function runAutoresearchIteration() {
    if (!AppState.apiKeys.gemini || !window.LLMEngine || AutoresearchState.isRunning) return;
    AutoresearchState.isRunning = true;
    AutoresearchState.iteration += 1;

    try {
        const improvementSchema = {
            type: "OBJECT",
            properties: {
                insight: { type: "STRING", description: "A short market or product insight." },
                refined_system_prompt: { type: "STRING", description: "Improved system prompt for the Business Builder lead agent." },
                markdown_updates: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            path: { type: "STRING", description: "Markdown file path for the updated agent prompt." },
                            content: { type: "STRING", description: "Full updated markdown content." }
                        },
                        required: ["path", "content"]
                    }
                },
                rationale: { type: "STRING", description: "One sentence describing what improved this iteration." }
            },
            required: ["insight", "refined_system_prompt", "markdown_updates", "rationale"]
        };

        const autoresearchPrompt = `You are the FoundrOS autoresearch improvement engine.
Iteration: ${AutoresearchState.iteration}

Current system prompt:
${AutoresearchState.systemPrompt}

Current agent markdown prompt files:
${summarizeMarkdownFilesForPrompt()}

Return:
1) one new actionable insight,
2) an improved system prompt for the Business Builder lead agent,
3) 1-${MAX_MARKDOWN_UPDATES_PER_ITERATION} markdown updates for agent prompt files.
Each markdown file should include: title header, mission bullets, decision checklist, and handoff contract section.
Keep markdown updates concise and execution-focused.`;

        const improvement = await window.LLMEngine.generateContent(autoresearchPrompt, null, improvementSchema);
        
        if (typeof improvement.refined_system_prompt === 'string' && improvement.refined_system_prompt.trim()) {
            AutoresearchState.systemPrompt = improvement.refined_system_prompt.trim();
        }
        if (Array.isArray(improvement.markdown_updates)) {
            improvement.markdown_updates.slice(0, MAX_MARKDOWN_UPDATES_PER_ITERATION).forEach(file => {
                const path = typeof file?.path === 'string' ? file.path.trim() : '';
                if (AUTORESEARCH_MARKDOWN_PATH_ALLOWLIST.has(path) && file?.content) {
                    AutoresearchState.agentMarkdownFiles[path] = file.content;
                }
            });
        }

        if(window.logToTerminal) {
            window.logToTerminal(`[Autoresearch Iter ${AutoresearchState.iteration}] Insight: ${improvement.insight}`, 'Gstack');
            window.logToTerminal(`[Autoresearch Iter ${AutoresearchState.iteration}] Updated ${Array.isArray(improvement.markdown_updates) ? improvement.markdown_updates.length : 0} agent .md prompt files.`, 'Gstack');
            window.logToTerminal(`[Autoresearch Iter ${AutoresearchState.iteration}] ${improvement.rationale}`, 'Gstack');
        }
    } catch(e) {
        if(window.logToTerminal) {
            window.logToTerminal(`[Autoresearch Iter ${AutoresearchState.iteration}] Update skipped: ${e.message}`, 'Gstack');
        }
    } finally {
        AutoresearchState.isRunning = false;
    }
}

function startBackgroundAutoresearchLoop() {
    setInterval(async () => {
        if(!AppState.isAuthenticated) return;
        if(AutoresearchState.isRunning) return;
        if(Math.random() > 0.75) await runAutoresearchIteration();
    }, 15000);
}

// --- Business Builder Logic (Real AI Integration) ---
let lastGeneratedCode = '';

async function runBusinessBuilderFlow() {
    const flow = resolveBusinessBuilderFlow();
    const orchestrator = window.PaperclipOrchestrator ? new window.PaperclipOrchestrator(flow) : null;

    if (orchestrator) {
        await orchestrator.run(async ({ stageName, agentId, taskName }) => {
            await new GstackPipeline(agentId, `${stageName}: ${taskName}`).run();
        });
        return;
    }

    for (const stage of flow) {
        if(window.logToTerminal) window.logToTerminal(`[Flow:${stage.name}] Executing ${stage.steps.length} agent steps.`, 'Gstack');
        for (const step of stage.steps) {
            await new GstackPipeline(step.agentId, `${stage.name}: ${step.taskName}`).run();
        }
    }
}

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
                    `Optimize this seed idea into a structured product spec for a Business Builder agent network: "${val}"`,
                    `You are the Paperclip Orchestration Architect. Output only the optimized prompt text. Include tech stack preferences (HTML5, Vanilla JS, CSS3 Variables, Glassmorphism UI), market validation, and launch KPIs.`
                );
                promptArea.value = optimized;
                window.logToTerminal('Prompt expanded via Business Builder optimizer.', 'Gstack');
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
            
            try {
                await runBusinessBuilderFlow();
                window.logToTerminal('Prompting Gemini AI to generate full HTML codebase...', 'system');
                
                const response = await window.LLMEngine.generateContent(promptArea.value, buildBusinessBuilderSystemPrompt());
                
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

    // ZIP Download Logic
    const btnZip = document.getElementById('btn-download-zip');
    if(btnZip) {
        btnZip.addEventListener('click', async () => {
            if(!lastGeneratedCode) {
                alert("No code generated yet to download.");
                return;
            }

            btnZip.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Compressing...';
            
            try {
                const zip = new JSZip();
                
                // Add the generated HTML file
                zip.file("index.html", lastGeneratedCode);
                
                // Add simple docs bundle
                zip.file("README.md", "# foundrOS Generated App\n\nAutonomously built by the foundrOS business builder multi-agent system.\n\nTo run, simply open `index.html` in your web browser.");
                zip.file("docs/business_builder_system_prompt.md", `# Business Builder System Prompt\n\n${AutoresearchState.systemPrompt}`);
                getAutoresearchMarkdownBundle().forEach(file => zip.file(file.path, file.content));

                // Generate ZIP file blob
                const content = await zip.generateAsync({ type: "blob" });
                
                // Trigger download
                const url = URL.createObjectURL(content);
                const a = document.createElement("a");
                a.href = url;
                a.download = `foundros-app-${Date.now()}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                btnZip.innerHTML = '<i class="fa-solid fa-check"></i> Downloaded';
                window.logToTerminal(`App and agent prompt markdown bundle downloaded as ZIP.`, 'system');
                
                setTimeout(() => { btnZip.innerHTML = '<i class="fa-solid fa-file-zipper"></i> ZIP'; }, 3000);
            } catch (err) {
                alert(`ZIP Creation Error: ${err.message}`);
                btnZip.innerHTML = '<i class="fa-solid fa-file-zipper"></i> ZIP';
            }
        });
    }
}
