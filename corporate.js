// corporate.js - Cofounder Corporate Suite (Finance, Cap Table, Legal) - Real LLM

let financeChart;

window.initCorporateSuite = function() {
    initCorpTabs();
    initFinanceChart();
    renderCapTable();
    initLegalChat();
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

function initLegalChat() {
    const transcript = document.getElementById('legal-chat-transcript');
    const input = document.getElementById('legal-chat-input');
    const sendBtn = document.getElementById('legal-send-btn');
    const starterChips = document.getElementById('legal-starter-chips');
    const previewContent = document.getElementById('legal-preview-content');
    const previewActions = document.getElementById('legal-preview-actions');
    const copyBtn = document.getElementById('legal-copy-btn');
    const downloadBtn = document.getElementById('legal-download-btn');
    const regenBtn = document.getElementById('legal-regen-btn');

    if (!sendBtn) return;

    let lastDocContent = '';
    let lastPromptForRegen = '';
    let chipsHidden = false;

    const LEGAL_SYSTEM_PROMPT = `You are an expert international legal AI assistant specializing in corporate and commercial law across all jurisdictions worldwide.
Your role is to draft comprehensive, professional legal documents for any entity type (LLC, C-Corp, GmbH, PLC, SAS, nonprofit, partnership, sole proprietor, etc.) in any country, state, province, or region.

Rules for every document you generate:
1. Start with this exact disclaimer on line 1: "DRAFT DOCUMENT - FOR REVIEW BY LICENSED ATTORNEY ONLY. THIS IS NOT LEGAL ADVICE."
2. Use jurisdiction-appropriate legal language, structure, and statutory references.
3. Include ALL standard clauses for the document type (definitions, operative clauses, representations & warranties, indemnification, limitation of liability, confidentiality, termination, governing law, dispute resolution, signature block, etc.).
4. Mark every party name, date, address, or jurisdiction-specific value that the user must fill in with [PLACEHOLDER] in square brackets.
5. If a language other than English is requested, draft the entire document in that language. Keep [PLACEHOLDER] markers in brackets regardless of language.
6. Adapt governing law, dispute resolution mechanism (arbitration vs. litigation), and regulatory citations to the specified jurisdiction.
7. Number all sections and sub-sections clearly (e.g. 1. Definitions, 1.1, 1.2, 2. Term, etc.).
8. If the user's request is ambiguous, ask ONE clarifying question before drafting.
9. Never refuse to draft based on jurisdiction — you serve every country and legal system.`;

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function appendMessage(role, content, isTyping) {
        const msg = document.createElement('div');
        msg.className = `legal-msg ${role}`;

        const avatar = document.createElement('div');
        avatar.className = 'legal-msg-avatar';
        avatar.innerHTML = role === 'user'
            ? '<i class="fa-regular fa-user"></i>'
            : '<i class="fa-solid fa-scale-balanced"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'legal-msg-bubble';

        if (isTyping) {
            bubble.innerHTML = '<div class="legal-thinking"><span></span><span></span><span></span></div>';
            msg.id = 'legal-typing-indicator';
        } else {
            bubble.textContent = content;
        }

        if (role === 'user') {
            msg.appendChild(bubble);
            msg.appendChild(avatar);
        } else {
            msg.appendChild(avatar);
            msg.appendChild(bubble);
        }

        transcript.appendChild(msg);
        transcript.scrollTop = transcript.scrollHeight;
        return msg;
    }

    async function sendMessage(userText) {
        const text = (userText || '').trim();
        if (!text) return;

        if (!chipsHidden && starterChips) {
            starterChips.classList.add('hidden');
            chipsHidden = true;
        }

        // Build enriched prompt with optional metadata context
        const docType = document.getElementById('legal-doc-type')?.value;
        const companyType = document.getElementById('legal-company-type')?.value;
        const jurisdiction = document.getElementById('legal-jurisdiction')?.value?.trim();
        const language = document.getElementById('legal-language')?.value?.trim();

        const meta = [];
        if (docType) meta.push(`Document Type: ${docType}`);
        if (companyType) meta.push(`Company Type: ${companyType}`);
        if (jurisdiction) meta.push(`Jurisdiction: ${jurisdiction}`);
        if (language) meta.push(`Language: ${language}`);

        const enrichedPrompt = meta.length > 0
            ? `[Context — ${meta.join(' | ')}]\n\n${text}`
            : text;

        lastPromptForRegen = enrichedPrompt;

        appendMessage('user', text);
        const typingMsg = appendMessage('ai', '', true);

        sendBtn.disabled = true;
        if (input) input.disabled = true;

        try {
            const docContent = await window.LLMEngine.generateContent(enrichedPrompt, LEGAL_SYSTEM_PROMPT);

            typingMsg.remove();

            const previewLine = docContent.split('\n').find(l => l.trim()) || 'Document generated.';
            appendMessage('ai', `Document ready — see the preview panel → "${previewLine.slice(0, 70)}…"`);

            previewContent.innerHTML = `<pre class="legal-doc-text">${escapeHtml(docContent)}</pre>`;
            previewActions.classList.remove('hidden');
            lastDocContent = docContent;

            if (window.logToTerminal) {
                window.logToTerminal('Legal AI: Document generated successfully.', 'system');
            }
        } catch (err) {
            typingMsg.remove();
            appendMessage('ai', `Error generating document: ${err.message}. Please check your API key and try again.`);
        } finally {
            sendBtn.disabled = false;
            if (input) {
                input.disabled = false;
                input.value = '';
                input.focus();
            }
        }
    }

    // Send button click
    sendBtn.addEventListener('click', () => sendMessage(input?.value));

    // Enter = send, Shift+Enter = newline
    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input.value);
        }
    });

    // Starter chips
    document.querySelectorAll('.legal-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (input) input.value = prompt;
            sendMessage(prompt);
        });
    });

    // Copy to clipboard
    copyBtn?.addEventListener('click', () => {
        if (!lastDocContent) return;
        navigator.clipboard.writeText(lastDocContent).then(() => {
            const orig = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
        }).catch(() => {
            // Fallback for browsers that block clipboard
            const ta = document.createElement('textarea');
            ta.value = lastDocContent;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            const orig = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
        });
    });

    // Download as .txt
    downloadBtn?.addEventListener('click', () => {
        if (!lastDocContent) return;
        const docType = document.getElementById('legal-doc-type')?.value || 'legal_document';
        const blob = new Blob([lastDocContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${docType.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    // Regenerate last document
    regenBtn?.addEventListener('click', () => {
        if (!lastPromptForRegen) return;
        sendMessage(lastPromptForRegen);
    });
}
