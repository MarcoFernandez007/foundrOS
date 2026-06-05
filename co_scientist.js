// co_scientist.js - Google Co-Scientist Autonomous Innovation Engine (Real LLM)

const CoScientist = {
    hypotheses: [],
    isDebating: false
};

document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start-co-scientist');
    if(btnStart) {
        btnStart.addEventListener('click', initiateDebate);
    }
    renderLeaderboard();
});

async function initiateDebate() {
    if(CoScientist.isDebating) return;
    CoScientist.isDebating = true;
    
    const sourceInput = document.getElementById('co-source-domain').value || 'Unspecified';
    const targetInput = document.getElementById('co-target-domain').value || 'General B2B';
    const generatorSpeech = document.getElementById('co-generator-speech');
    const criticSpeech = document.getElementById('co-critic-speech');
    const btnStart = document.getElementById('btn-start-co-scientist');

    btnStart.disabled = true;
    btnStart.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Debating...';
    generatorSpeech.innerHTML = '';
    criticSpeech.innerHTML = '';

    try {
        // --- GENERATOR AGENT (Real LLM Call) ---
        generatorSpeech.innerHTML = `<p class="text-accent-cyan">> Synthesizing literature on "${sourceInput}"...</p>`;

        const generatorPrompt = `You are the Generator Agent in a Google Co-Scientist style debate.
Source Domain: "${sourceInput}"
Target Domain: "${targetInput}"

Your task: Synthesize a novel, specific, and actionable business hypothesis that transfers a key insight or methodology from the Source Domain into the Target Domain. 
Output a single, concise hypothesis title (max 20 words) on line 1, then a blank line, then a 2-3 sentence explanation of the idea and why it has product-market fit potential.`;

        const generatorResponse = await window.LLMEngine.generateContent(generatorPrompt);
        const lines = generatorResponse.trim().split('\n');
        const hypothesisTitle = lines[0].replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
        const hypothesisExplanation = lines.slice(1).join('\n').trim();

        generatorSpeech.innerHTML += `<p class="text-green">> Hypothesis: ${hypothesisTitle}</p>`;
        generatorSpeech.innerHTML += `<p class="text-secondary" style="font-size:0.85rem; margin-top:4px;">${hypothesisExplanation}</p>`;

        // --- CRITIC AGENT (Real LLM Call with JSON Schema) ---
        criticSpeech.innerHTML = `<p class="text-yellow">> Stress-testing hypothesis against market realities...</p>`;

        const criticPrompt = `You are the Critic Agent in a Co-Scientist debate. A Generator has proposed this business hypothesis:

Title: "${hypothesisTitle}"
Explanation: "${hypothesisExplanation}"

Evaluate this hypothesis rigorously. Consider market size, technical feasibility, competitive moat, regulatory risk, and time-to-revenue. Return your evaluation as JSON.`;

        const criticSchema = {
            type: "OBJECT",
            properties: {
                passed: { type: "BOOLEAN", description: "true if the hypothesis is viable enough to pursue" },
                elo: { type: "INTEGER", description: "An Elo rating between 900 and 1600 reflecting overall quality" },
                feasibility: { type: "STRING", enum: ["High", "Medium", "Low"], description: "Overall feasibility rating" },
                strengths: { type: "STRING", description: "Key strengths in 1-2 sentences" },
                weaknesses: { type: "STRING", description: "Key weaknesses in 1-2 sentences" },
                verdict: { type: "STRING", description: "A one-sentence final verdict" }
            },
            required: ["passed", "elo", "feasibility", "strengths", "weaknesses", "verdict"]
        };

        const criticResult = await window.LLMEngine.generateContent(criticPrompt, null, criticSchema);

        criticSpeech.innerHTML += `<p class="text-secondary" style="font-size:0.85rem;">Strengths: ${criticResult.strengths}</p>`;
        criticSpeech.innerHTML += `<p class="text-secondary" style="font-size:0.85rem;">Weaknesses: ${criticResult.weaknesses}</p>`;

        if(criticResult.passed) {
            criticSpeech.innerHTML += `<p class="text-green">> PASSED (Elo: ${criticResult.elo}). ${criticResult.verdict}</p>`;

            CoScientist.hypotheses.push({
                id: `h${Date.now()}`,
                title: hypothesisTitle,
                elo: criticResult.elo,
                feasibility: criticResult.feasibility
            });

            // Run tournament: re-sort by Elo
            CoScientist.hypotheses.sort((a,b) => b.elo - a.elo);
        } else {
            criticSpeech.innerHTML += `<p class="text-accent-red">> REJECTED (Elo: ${criticResult.elo}). ${criticResult.verdict}</p>`;
        }

    } catch(err) {
        generatorSpeech.innerHTML += `<p class="text-accent-red">> Error: ${err.message}. Ensure your Gemini API key is configured.</p>`;
    }

    CoScientist.isDebating = false;
    btnStart.disabled = false;
    btnStart.innerHTML = 'Initiate Debate';
    renderLeaderboard();
}

function renderLeaderboard() {
    const tbody = document.getElementById('co-leaderboard');
    if(!tbody) return;
    tbody.innerHTML = '';

    if(CoScientist.hypotheses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-secondary);">No hypotheses yet. Start a debate to generate ideas.</td></tr>';
        return;
    }

    CoScientist.hypotheses.sort((a,b) => b.elo - a.elo).forEach((hyp, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${idx + 1}</td>
            <td>${hyp.title}</td>
            <td class="font-bold text-accent-cyan">${hyp.elo}</td>
            <td><span class="badge ${hyp.feasibility === 'High' ? 'badge-purple' : ''}">${hyp.feasibility}</span></td>
            <td><button class="btn btn-sm btn-primary" onclick="deployHypothesis('${hyp.id}')">Deploy to Portfolio</button></td>
        `;
        tbody.appendChild(tr);
    });
}

window.deployHypothesis = function(id) {
    const hyp = CoScientist.hypotheses.find(h => h.id === id);
    if(!hyp) return;

    AppState.portfolio.push({
        id: `c${Date.now()}`,
        name: hyp.title.substring(0, 25) + '...',
        category: 'Co-Scientist Gen',
        status: 'Building',
        arr: '$0',
        progress: 10
    });
    
    window.logToTerminal(`Deployed hypothesis "${hyp.title}" to Portfolio.`, 'system');
    
    // Switch to portfolio view
    document.querySelectorAll('.view-section').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active');
    });
    document.getElementById('view-portfolio').classList.remove('hidden');
    document.getElementById('view-portfolio').classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector('.nav-item[data-target="view-portfolio"]')?.classList.add('active');

    renderPortfolio();
};
