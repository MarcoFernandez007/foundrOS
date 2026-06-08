# Business Builder Agent Architecture

## Agent Count

Business Builder uses **17 specialized agents**:

1. CEO Agent
2. Market Intelligence Agent
3. Strategy Agent
4. Product Agent
5. Engineering Manager
6. Lead Developer
7. Frontend Engineer
8. Backend Engineer
9. Data Agent
10. Product Designer
11. Brand Agent
12. Growth Agent
13. Finance Agent
14. Legal Agent
15. QA Reviewer
16. Ops Agent
17. Release Engineer

## Orchestration Flow (Paperclip Layer)

The flow is orchestrated by `paperclip_orchestrator.js`:

1. **Discovery**
   - objective setting, demand analysis, positioning
2. **Product & Build**
   - product scoping, architecture, implementation, design, metrics
3. **Go-To-Market**
   - brand narrative, growth experiments, financial validation, legal readiness
4. **Validation & Release**
   - QA gate, ops readiness, release handoff

## Iterative Autoresearch Prompt Improvement

`agents.js` runs an autoresearch loop that continuously:

1. Generates new insight signals
2. Refines the Business Builder system prompt
3. Updates agent markdown prompt files in-memory (exported in ZIP builds)
