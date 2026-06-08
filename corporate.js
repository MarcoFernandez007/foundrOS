// corporate.js - Cofounder Corporate Suite (Finance, Cap Table, Legal) - Real LLM

let financeChart;

window.initCorporateSuite = function() {
    initCorpTabs();
    initFinanceChart();
    renderCapTable();
    initIncorporationWizard();
    initLegalDocs();
};

function initCorpTabs() {
    const tabs = document.querySelectorAll('.corp-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const targetId = e.target.getAttribute('data-target');
            document.querySelectorAll('.corp-panel').forEach(p => p.classList.add('hidden'));
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
}

function initFinanceChart() {
    const ctx = document.getElementById('finance-chart');
    if(!ctx || financeChart) return;

    financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [
                {
                    label: 'Revenue (ARR)',
                    data: [120000, 350000, 1200000, 3500000, 8000000],
                    backgroundColor: 'rgba(30, 58, 138, 0.7)',
                    borderColor: '#1E3A8A',
                    borderWidth: 1
                },
                {
                    label: 'Expenses (Burn)',
                    data: [80000, 150000, 400000, 1100000, 2500000],
                    backgroundColor: 'rgba(255, 46, 147, 0.7)',
                    borderColor: '#FF2E93',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { 
                        color: '#A1A1AA',
                        callback: function(value) {
                            return '$' + (value/1000) + 'k';
                        }
                    }
                },
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#A1A1AA' }
                }
            },
            plugins: {
                legend: { labels: { color: '#FFFFFF' } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function renderCapTable() {
    const tbody = document.getElementById('cap-table-body');
    if(!tbody) return;

    const data = [
        { name: 'Founder (User)', role: 'CEO', shares: '5,000,000', ownership: '50%', vesting: '4 Yr / 1 Yr Cliff' },
        { name: 'Polsia foundrOS', role: 'AI Orchestrator', shares: '1,000,000', ownership: '10%', vesting: 'Fully Vested' },
        { name: 'Seed Investors', role: 'Investors', shares: '2,000,000', ownership: '20%', vesting: 'N/A' },
        { name: 'Option Pool', role: 'Future Hires', shares: '2,000,000', ownership: '20%', vesting: 'Unallocated' }
    ];

    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${row.name}</strong></td>
            <td class="text-secondary">${row.role}</td>
            <td class="font-mono text-accent-cyan">${row.shares}</td>
            <td class="font-bold">${row.ownership}</td>
            <td class="text-sm">${row.vesting}</td>
        `;
        tbody.appendChild(tr);
    });
}

function initIncorporationWizard() {
    const btn = document.getElementById('btn-incorporate');
    const status = document.getElementById('incorp-status');
    if(!btn) return;

    btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing Incorporation...';
        
        try {
            const companyName = AppState.user?.name ? `${AppState.user.name}Co` : 'NewVentureCo';
            
            status.innerText = 'Generating Articles of Organization via AI...';

            const articlesPrompt = `Draft a concise summary of Articles of Organization for a Delaware C-Corp named "${companyName} Inc." Include:
1. Company name and state of incorporation
2. Registered agent placeholder
3. Number of authorized shares (10,000,000 common)
4. Incorporator name placeholder
5. Business purpose (general)
Keep it under 300 words. Output as plain text, not markdown.`;

            const articles = await window.LLMEngine.generateContent(articlesPrompt);
            
            status.innerHTML = `<div style="max-height:150px; overflow-y:auto; background:rgba(0,0,0,0.3); padding:12px; border-radius:8px; font-size:0.8rem; line-height:1.5; white-space:pre-wrap; margin-bottom:8px;">${articles}</div>
            <span class="text-green"><i class="fa-solid fa-check-circle"></i> Articles generated. Ready for filing.</span>`;

            btn.innerHTML = '<i class="fa-solid fa-check"></i> Incorporation Drafted';
            btn.classList.replace('btn-primary', 'btn-outline');
            btn.style.color = '#39FF14';
            btn.style.borderColor = '#39FF14';

        } catch(err) {
            status.innerHTML = `<span class="text-accent-red">Error: ${err.message}</span>`;
            btn.innerHTML = 'Incorporate (Delaware C-Corp)';
            btn.disabled = false;
        }
    });
}

function initLegalDocs() {
    const buttons = document.querySelectorAll('.dl-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const docType = e.target.getAttribute('data-doc-type') || e.target.innerText.trim();
            const originalText = e.target.innerText;
            e.target.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
            e.target.disabled = true;

            try {
                const companyName = AppState.user?.name ? `${AppState.user.name}Co Inc.` : 'NewVentureCo Inc.';

                const docPrompt = `You are a corporate lawyer AI. Draft a professional ${docType} for a startup called "${companyName}".
The document should be comprehensive, include standard clauses, placeholder fields marked with [PLACEHOLDER], and be ready for review by a real attorney.
Output the full document as plain text. Do not use markdown formatting.`;

                const docContent = await window.LLMEngine.generateContent(docPrompt);

                // Create and trigger a real download
                const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${docType.replace(/\s+/g, '_').toLowerCase()}_${companyName.replace(/\s+/g, '_')}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                e.target.innerHTML = '<i class="fa-solid fa-check"></i> Downloaded';
                e.target.style.color = '#39FF14';
                
                if(window.logToTerminal) {
                    window.logToTerminal(`Legal document "${docType}" generated and downloaded.`, 'system');
                }

                setTimeout(() => {
                    e.target.innerHTML = originalText;
                    e.target.style.color = '';
                    e.target.disabled = false;
                }, 4000);

            } catch(err) {
                alert(`Document generation failed: ${err.message}`);
                e.target.innerHTML = originalText;
                e.target.disabled = false;
            }
        });
    });
}
