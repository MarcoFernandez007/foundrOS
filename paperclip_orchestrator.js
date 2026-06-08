// paperclip_orchestrator.js - Lightweight Paperclip-style orchestration for Business Builder

(function() {
    class PaperclipOrchestrator {
        constructor(flow) {
            this.flow = Array.isArray(flow) ? flow : [];
        }

        async run(stepExecutor) {
            if (typeof stepExecutor !== 'function') return;

            for (const stage of this.flow) {
                const stageName = stage?.name || 'Stage';
                const steps = Array.isArray(stage?.steps) ? stage.steps : [];
                if (window.logToTerminal) {
                    window.logToTerminal(`[Paperclip] ${stageName} started (${steps.length} steps).`, 'Gstack');
                }

                for (const step of steps) {
                    await stepExecutor({
                        stageName,
                        agentId: step.agentId,
                        taskName: step.taskName
                    });
                }

                if (window.logToTerminal) {
                    window.logToTerminal(`[Paperclip] ${stageName} completed.`, 'Gstack');
                }
            }
        }

        static createBusinessBuilderFlow(agents) {
            const has = (id) => Array.isArray(agents) && agents.some(a => a.id === id);
            const step = (agentId, taskName) => ({ agentId, taskName });

            return [
                {
                    name: 'Discovery',
                    steps: [
                        step('ceo', 'Set business objective'),
                        step('market_intel', 'Gather competitive and demand signals'),
                        step('strategist', 'Define strategic wedge')
                    ].filter(s => has(s.agentId))
                },
                {
                    name: 'Product & Build',
                    steps: [
                        step('product', 'Translate strategy into product requirements'),
                        step('em', 'Plan architecture'),
                        step('lead_dev', 'Coordinate implementation plan'),
                        step('frontend', 'Build UX surface'),
                        step('backend', 'Build core backend capability'),
                        step('data', 'Define metrics and instrumentation'),
                        step('designer', 'Polish experience')
                    ].filter(s => has(s.agentId))
                },
                {
                    name: 'Go-To-Market',
                    steps: [
                        step('brand', 'Craft messaging'),
                        step('growth', 'Prepare launch experiments'),
                        step('finance', 'Validate unit economics'),
                        step('legal', 'Validate legal constraints')
                    ].filter(s => has(s.agentId))
                },
                {
                    name: 'Validation & Release',
                    steps: [
                        step('qa', 'Run quality gate'),
                        step('ops', 'Validate operational readiness'),
                        step('release', 'Ship and hand off')
                    ].filter(s => has(s.agentId))
                }
            ];
        }
    }

    window.PaperclipOrchestrator = PaperclipOrchestrator;
})();
