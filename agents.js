// agents.js - Business Builder Agent Engine & Paperclip Orchestration
// Agent catalog sourced from github.com/msitarzewski/agency-agents (147+ agents, 17 departments)

const AgentDepartments = {
  'FoundrOS Core': [
    { id: 'ceo', name: 'CEO Agent', role: 'Vision & Scope', icon: 'fa-user-tie', color: 'text-accent-purple' },
    { id: 'market_intel', name: 'Market Intelligence Agent', role: 'Trend Discovery', icon: 'fa-chart-line', color: 'text-accent-cyan' },
    { id: 'strategist', name: 'Strategy Agent', role: 'Positioning & Moat', icon: 'fa-chess-queen', color: 'text-accent-purple' },
    { id: 'ops', name: 'Ops Agent', role: 'Reliability', icon: 'fa-gears', color: 'text-accent-cyan' },
    { id: 'release', name: 'Release Engineer', role: 'Deployment', icon: 'fa-rocket', color: 'text-accent-purple' },
    { id: 'advertising', name: 'Advertising Agent', role: 'Bidding & Creative', icon: 'fa-rectangle-ad', color: 'text-accent-red' },
    { id: 'physical_control', name: 'Physical Control (Robots)', role: 'World Model Space', icon: 'fa-robot', color: 'text-accent-lime' },
    { id: 'co_scientist', name: 'Co-Scientist', role: 'Hypothesis Generation', icon: 'fa-flask', color: 'text-accent-cyan' },
    { id: 'research', name: 'Research Agent', role: 'Deep Analysis', icon: 'fa-microscope', color: 'text-accent-purple' }
  ],
  'Engineering': [
    { id: 'eng_ai_data_remediation', name: 'AI Data Remediation Engineer', role: 'Data Quality & Repair', icon: 'fa-database', color: 'text-accent-cyan' },
    { id: 'eng_ai_engineer', name: 'AI Engineer', role: 'ML & AI Systems', icon: 'fa-brain', color: 'text-accent-purple' },
    { id: 'eng_autonomous_opt', name: 'Autonomous Optimization Architect', role: 'Self-Improving Systems', icon: 'fa-wand-magic-sparkles', color: 'text-accent-purple' },
    { id: 'eng_backend_architect', name: 'Backend Architect', role: 'Server & API Design', icon: 'fa-server', color: 'text-accent-cyan' },
    { id: 'eng_cms_developer', name: 'CMS Developer', role: 'Content Management', icon: 'fa-file-code', color: 'text-accent-cyan' },
    { id: 'eng_code_reviewer', name: 'Code Reviewer', role: 'Code Quality', icon: 'fa-magnifying-glass-chart', color: 'text-accent-lime' },
    { id: 'eng_codebase_onboarding', name: 'Codebase Onboarding Engineer', role: 'Developer Ramp-Up', icon: 'fa-person-walking-arrow-right', color: 'text-accent-cyan' },
    { id: 'eng_data_engineer', name: 'Data Engineer', role: 'Pipelines & ETL', icon: 'fa-database', color: 'text-accent-cyan' },
    { id: 'eng_database_optimizer', name: 'Database Optimizer', role: 'Query Performance', icon: 'fa-gauge-high', color: 'text-accent-lime' },
    { id: 'eng_devops_automator', name: 'DevOps Automator', role: 'CI/CD & Infra', icon: 'fa-gears', color: 'text-accent-cyan' },
    { id: 'eng_email_intel', name: 'Email Intelligence Engineer', role: 'Email Systems', icon: 'fa-envelope-open-text', color: 'text-accent-cyan' },
    { id: 'eng_embedded_firmware', name: 'Embedded Firmware Engineer', role: 'IoT & Hardware', icon: 'fa-microchip', color: 'text-accent-lime' },
    { id: 'eng_frontend_developer', name: 'Frontend Developer', role: 'UI Implementation', icon: 'fa-desktop', color: 'text-accent-cyan' },
    { id: 'eng_git_workflow', name: 'Git Workflow Master', role: 'Version Control', icon: 'fa-code-branch', color: 'text-accent-cyan' },
    { id: 'eng_incident_response', name: 'Incident Response Commander', role: 'Crisis Management', icon: 'fa-triangle-exclamation', color: 'text-accent-red' },
    { id: 'eng_it_service_mgr', name: 'IT Service Manager', role: 'ITSM', icon: 'fa-headset', color: 'text-accent-cyan' },
    { id: 'eng_minimal_change', name: 'Minimal Change Engineer', role: 'Surgical Edits', icon: 'fa-scalpel', color: 'text-accent-lime' },
    { id: 'eng_mobile_app', name: 'Mobile App Builder', role: 'iOS & Android', icon: 'fa-mobile-screen-button', color: 'text-accent-cyan' },
    { id: 'eng_multi_agent_arch', name: 'Multi-Agent Systems Architect', role: 'Agent Orchestration', icon: 'fa-sitemap', color: 'text-accent-purple' },
    { id: 'eng_prompt_engineer', name: 'Prompt Engineer', role: 'LLM Prompting', icon: 'fa-terminal', color: 'text-accent-purple' },
    { id: 'eng_rapid_prototyper', name: 'Rapid Prototyper', role: 'Fast MVPs', icon: 'fa-bolt', color: 'text-accent-lime' },
    { id: 'eng_senior_developer', name: 'Senior Developer', role: 'Full-Stack Expert', icon: 'fa-code', color: 'text-accent-cyan' },
    { id: 'eng_software_architect', name: 'Software Architect', role: 'System Design', icon: 'fa-network-wired', color: 'text-accent-purple' },
    { id: 'eng_solidity', name: 'Solidity Smart Contract Engineer', role: 'Web3 & Blockchain', icon: 'fa-cube', color: 'text-accent-purple' },
    { id: 'eng_sre', name: 'Site Reliability Engineer', role: 'Uptime & SLOs', icon: 'fa-shield-halved', color: 'text-accent-lime' },
    { id: 'eng_technical_writer', name: 'Technical Writer', role: 'Documentation', icon: 'fa-file-lines', color: 'text-accent-cyan' },
    { id: 'eng_voice_ai', name: 'Voice AI Integration Engineer', role: 'Speech & NLP', icon: 'fa-microphone', color: 'text-accent-purple' }
  ],
  'Design': [
    { id: 'des_brand_guardian', name: 'Brand Guardian', role: 'Brand Consistency', icon: 'fa-palette', color: 'text-accent-red' },
    { id: 'des_image_prompt', name: 'Image Prompt Engineer', role: 'AI Image Generation', icon: 'fa-image', color: 'text-accent-red' },
    { id: 'des_inclusive_visuals', name: 'Inclusive Visuals Specialist', role: 'Accessibility Design', icon: 'fa-universal-access', color: 'text-accent-red' },
    { id: 'des_persona_walkthrough', name: 'Persona Walkthrough', role: 'User Journey Mapping', icon: 'fa-person-walking', color: 'text-accent-red' },
    { id: 'des_ui_designer', name: 'UI Designer', role: 'Visual Interface', icon: 'fa-pen-nib', color: 'text-accent-red' },
    { id: 'des_ux_architect', name: 'UX Architect', role: 'Information Architecture', icon: 'fa-layer-group', color: 'text-accent-red' },
    { id: 'des_ux_researcher', name: 'UX Researcher', role: 'User Studies', icon: 'fa-users-viewfinder', color: 'text-accent-red' },
    { id: 'des_visual_storyteller', name: 'Visual Storyteller', role: 'Narrative Design', icon: 'fa-book-open', color: 'text-accent-red' },
    { id: 'des_whimsy_injector', name: 'Whimsy Injector', role: 'Delight & Surprise', icon: 'fa-wand-sparkles', color: 'text-accent-red' }
  ],
  'Marketing': [
    { id: 'mkt_content_creator', name: 'Content Creator', role: 'Blog & Copy', icon: 'fa-pen-fancy', color: 'text-accent-lime' },
    { id: 'mkt_growth_hacker', name: 'Growth Hacker', role: 'Viral Experiments', icon: 'fa-chart-line', color: 'text-accent-lime' },
    { id: 'mkt_seo_specialist', name: 'SEO Specialist', role: 'Search Rankings', icon: 'fa-magnifying-glass', color: 'text-accent-lime' },
    { id: 'mkt_email_strategist', name: 'Email Strategist', role: 'Campaigns & Drip', icon: 'fa-envelope', color: 'text-accent-lime' },
    { id: 'mkt_social_media', name: 'Social Media Strategist', role: 'Platform Growth', icon: 'fa-share-nodes', color: 'text-accent-lime' },
    { id: 'mkt_linkedin_creator', name: 'LinkedIn Content Creator', role: 'B2B Social', icon: 'fa-linkedin', color: 'text-accent-lime' },
    { id: 'mkt_twitter_engager', name: 'Twitter/X Engager', role: 'X Platform Growth', icon: 'fa-x-twitter', color: 'text-accent-lime' },
    { id: 'mkt_reddit_builder', name: 'Reddit Community Builder', role: 'Community Growth', icon: 'fa-reddit', color: 'text-accent-lime' },
    { id: 'mkt_instagram', name: 'Instagram Curator', role: 'Visual Social', icon: 'fa-instagram', color: 'text-accent-lime' },
    { id: 'mkt_tiktok', name: 'TikTok Strategist', role: 'Short Video Growth', icon: 'fa-tiktok', color: 'text-accent-lime' },
    { id: 'mkt_podcast', name: 'Podcast Strategist', role: 'Audio Content', icon: 'fa-podcast', color: 'text-accent-lime' },
    { id: 'mkt_pr_comms', name: 'PR Communications Manager', role: 'Press & Media', icon: 'fa-newspaper', color: 'text-accent-lime' },
    { id: 'mkt_video_opt', name: 'Video Optimization Specialist', role: 'Video SEO', icon: 'fa-video', color: 'text-accent-lime' },
    { id: 'mkt_app_store_opt', name: 'App Store Optimizer', role: 'ASO', icon: 'fa-mobile-screen', color: 'text-accent-lime' },
    { id: 'mkt_book_coauthor', name: 'Book Co-Author', role: 'Long-form Content', icon: 'fa-book', color: 'text-accent-lime' },
    { id: 'mkt_carousel_engine', name: 'Carousel Growth Engine', role: 'Carousel Posts', icon: 'fa-images', color: 'text-accent-lime' },
    { id: 'mkt_multi_platform', name: 'Multi-Platform Publisher', role: 'Cross-Channel', icon: 'fa-share-from-square', color: 'text-accent-lime' },
    { id: 'mkt_aeo', name: 'AEO Foundations Specialist', role: 'Answer Engine Optimization', icon: 'fa-robot', color: 'text-accent-lime' },
    { id: 'mkt_ai_citation', name: 'AI Citation Strategist', role: 'LLM Visibility', icon: 'fa-quote-left', color: 'text-accent-lime' },
    { id: 'mkt_x_intel', name: 'X/Twitter Intelligence Analyst', role: 'Social Intel', icon: 'fa-binoculars', color: 'text-accent-lime' }
  ],
  'Paid Media': [
    { id: 'pm_auditor', name: 'Paid Media Auditor', role: 'Campaign Audit', icon: 'fa-clipboard-check', color: 'text-accent-red' },
    { id: 'pm_creative', name: 'Creative Strategist', role: 'Ad Creative', icon: 'fa-paintbrush', color: 'text-accent-red' },
    { id: 'pm_paid_social', name: 'Paid Social Strategist', role: 'Social Ads', icon: 'fa-rectangle-ad', color: 'text-accent-red' },
    { id: 'pm_ppc', name: 'PPC Strategist', role: 'Pay-Per-Click', icon: 'fa-hand-pointer', color: 'text-accent-red' },
    { id: 'pm_programmatic', name: 'Programmatic Buyer', role: 'RTB & Display', icon: 'fa-chart-area', color: 'text-accent-red' },
    { id: 'pm_search_query', name: 'Search Query Analyst', role: 'Keyword Intel', icon: 'fa-magnifying-glass-dollar', color: 'text-accent-red' },
    { id: 'pm_tracking', name: 'Tracking Specialist', role: 'Attribution & Pixels', icon: 'fa-crosshairs', color: 'text-accent-red' }
  ],
  'Product': [
    { id: 'prod_manager', name: 'Product Manager', role: 'Roadmap & Priorities', icon: 'fa-box-open', color: 'text-accent-cyan' },
    { id: 'prod_behavioral_nudge', name: 'Behavioral Nudge Engine', role: 'User Psychology', icon: 'fa-brain', color: 'text-accent-cyan' },
    { id: 'prod_feedback_synth', name: 'Feedback Synthesizer', role: 'Voice of Customer', icon: 'fa-comments', color: 'text-accent-cyan' },
    { id: 'prod_sprint_prioritizer', name: 'Sprint Prioritizer', role: 'Backlog Ranking', icon: 'fa-list-ol', color: 'text-accent-cyan' },
    { id: 'prod_trend_researcher', name: 'Trend Researcher', role: 'Market Signals', icon: 'fa-arrow-trend-up', color: 'text-accent-cyan' }
  ],
  'Project Management': [
    { id: 'pjm_experiment_tracker', name: 'Experiment Tracker', role: 'A/B Test Management', icon: 'fa-flask-vial', color: 'text-accent-purple' },
    { id: 'pjm_jira_steward', name: 'Jira Workflow Steward', role: 'Ticket Management', icon: 'fa-jira', color: 'text-accent-purple' },
    { id: 'pjm_meeting_notes', name: 'Meeting Notes Specialist', role: 'Note-Taking & Actions', icon: 'fa-clipboard', color: 'text-accent-purple' },
    { id: 'pjm_project_shepherd', name: 'Project Shepherd', role: 'Delivery Oversight', icon: 'fa-diagram-project', color: 'text-accent-purple' },
    { id: 'pjm_studio_ops', name: 'Studio Operations', role: 'Studio Workflow', icon: 'fa-building', color: 'text-accent-purple' },
    { id: 'pjm_studio_producer', name: 'Studio Producer', role: 'Production Pipeline', icon: 'fa-film', color: 'text-accent-purple' },
    { id: 'pjm_senior_pm', name: 'Senior Project Manager', role: 'Strategic PM', icon: 'fa-calendar-check', color: 'text-accent-purple' }
  ],
  'Sales': [
    { id: 'sales_account', name: 'Account Strategist', role: 'Key Accounts', icon: 'fa-handshake', color: 'text-accent-lime' },
    { id: 'sales_coach', name: 'Sales Coach', role: 'Rep Training', icon: 'fa-chalkboard-user', color: 'text-accent-lime' },
    { id: 'sales_deal', name: 'Deal Strategist', role: 'Closing Tactics', icon: 'fa-sack-dollar', color: 'text-accent-lime' },
    { id: 'sales_discovery', name: 'Discovery Coach', role: 'Qualification', icon: 'fa-magnifying-glass', color: 'text-accent-lime' },
    { id: 'sales_engineer', name: 'Sales Engineer', role: 'Technical Sales', icon: 'fa-screwdriver-wrench', color: 'text-accent-lime' },
    { id: 'sales_lead_gen', name: 'Lead Gen Strategist', role: 'Pipeline Generation', icon: 'fa-filter', color: 'text-accent-lime' },
    { id: 'sales_outbound', name: 'Outbound Strategist', role: 'Cold Outreach', icon: 'fa-paper-plane', color: 'text-accent-lime' },
    { id: 'sales_pipeline', name: 'Pipeline Analyst', role: 'Funnel Metrics', icon: 'fa-chart-bar', color: 'text-accent-lime' },
    { id: 'sales_proposal', name: 'Proposal Strategist', role: 'RFP & Proposals', icon: 'fa-file-invoice', color: 'text-accent-lime' }
  ],
  'Finance': [
    { id: 'fin_bookkeeper', name: 'Bookkeeper & Controller', role: 'Accounting', icon: 'fa-calculator', color: 'text-accent-lime' },
    { id: 'fin_analyst', name: 'Financial Analyst', role: 'Financial Modeling', icon: 'fa-chart-pie', color: 'text-accent-lime' },
    { id: 'fin_fpa', name: 'FP&A Analyst', role: 'Forecasting', icon: 'fa-chart-line', color: 'text-accent-lime' },
    { id: 'fin_investment', name: 'Investment Researcher', role: 'Market Research', icon: 'fa-money-bill-trend-up', color: 'text-accent-lime' },
    { id: 'fin_tax', name: 'Tax Strategist', role: 'Tax Optimization', icon: 'fa-file-invoice-dollar', color: 'text-accent-lime' }
  ],
  'Testing & QA': [
    { id: 'test_accessibility', name: 'Accessibility Auditor', role: 'WCAG Compliance', icon: 'fa-universal-access', color: 'text-accent-lime' },
    { id: 'test_api', name: 'API Tester', role: 'Endpoint Validation', icon: 'fa-plug', color: 'text-accent-lime' },
    { id: 'test_evidence', name: 'Evidence Collector', role: 'Bug Documentation', icon: 'fa-camera', color: 'text-accent-lime' },
    { id: 'test_performance', name: 'Performance Benchmarker', role: 'Load & Speed', icon: 'fa-gauge-high', color: 'text-accent-lime' },
    { id: 'test_reality_checker', name: 'Reality Checker', role: 'Fact Verification', icon: 'fa-check-double', color: 'text-accent-lime' },
    { id: 'test_results', name: 'Test Results Analyzer', role: 'Results Triage', icon: 'fa-chart-column', color: 'text-accent-lime' },
    { id: 'test_tool_evaluator', name: 'Tool Evaluator', role: 'Tooling Comparison', icon: 'fa-screwdriver-wrench', color: 'text-accent-lime' },
    { id: 'test_workflow_opt', name: 'Workflow Optimizer', role: 'Process Improvement', icon: 'fa-arrows-spin', color: 'text-accent-lime' }
  ],
  'Security': [
    { id: 'sec_appsec', name: 'AppSec Engineer', role: 'Application Security', icon: 'fa-shield-halved', color: 'text-accent-red' },
    { id: 'sec_architect', name: 'Security Architect', role: 'Security Design', icon: 'fa-lock', color: 'text-accent-red' },
    { id: 'sec_blockchain', name: 'Blockchain Security Auditor', role: 'Smart Contract Audit', icon: 'fa-cube', color: 'text-accent-red' },
    { id: 'sec_cloud', name: 'Cloud Security Architect', role: 'Cloud Hardening', icon: 'fa-cloud-arrow-up', color: 'text-accent-red' },
    { id: 'sec_compliance', name: 'Compliance Auditor', role: 'Regulatory Compliance', icon: 'fa-clipboard-check', color: 'text-accent-red' },
    { id: 'sec_incident', name: 'Incident Responder', role: 'Breach Response', icon: 'fa-triangle-exclamation', color: 'text-accent-red' },
    { id: 'sec_pentest', name: 'Penetration Tester', role: 'Ethical Hacking', icon: 'fa-user-secret', color: 'text-accent-red' },
    { id: 'sec_secops', name: 'Senior SecOps', role: 'Security Operations', icon: 'fa-eye', color: 'text-accent-red' },
    { id: 'sec_threat_detect', name: 'Threat Detection Engineer', role: 'SIEM & Alerts', icon: 'fa-bell', color: 'text-accent-red' },
    { id: 'sec_threat_intel', name: 'Threat Intelligence Analyst', role: 'Threat Research', icon: 'fa-binoculars', color: 'text-accent-red' }
  ],
  'Support': [
    { id: 'sup_analytics', name: 'Analytics Reporter', role: 'Dashboard & Reports', icon: 'fa-chart-bar', color: 'text-accent-cyan' },
    { id: 'sup_exec_summary', name: 'Executive Summary Generator', role: 'C-Suite Briefs', icon: 'fa-file-lines', color: 'text-accent-cyan' },
    { id: 'sup_finance_tracker', name: 'Finance Tracker', role: 'Expense Tracking', icon: 'fa-money-check-dollar', color: 'text-accent-cyan' },
    { id: 'sup_infra', name: 'Infrastructure Maintainer', role: 'Server Ops', icon: 'fa-server', color: 'text-accent-cyan' },
    { id: 'sup_legal_compliance', name: 'Legal Compliance Checker', role: 'Policy Review', icon: 'fa-scale-balanced', color: 'text-accent-cyan' },
    { id: 'sup_responder', name: 'Support Responder', role: 'Ticket Resolution', icon: 'fa-headset', color: 'text-accent-cyan' }
  ],
  'Game Development': [
    { id: 'game_audio', name: 'Game Audio Engineer', role: 'Sound & Music', icon: 'fa-volume-high', color: 'text-accent-purple' },
    { id: 'game_designer', name: 'Game Designer', role: 'Mechanics & Systems', icon: 'fa-gamepad', color: 'text-accent-purple' },
    { id: 'game_level', name: 'Level Designer', role: 'World Building', icon: 'fa-map', color: 'text-accent-purple' },
    { id: 'game_narrative', name: 'Narrative Designer', role: 'Story & Dialogue', icon: 'fa-book-open', color: 'text-accent-purple' },
    { id: 'game_tech_artist', name: 'Technical Artist', role: 'Shaders & Pipeline', icon: 'fa-paint-roller', color: 'text-accent-purple' }
  ],
  'Spatial Computing': [
    { id: 'sc_visionos', name: 'VisionOS Spatial Engineer', role: 'Apple Vision Pro', icon: 'fa-vr-cardboard', color: 'text-accent-purple' },
    { id: 'sc_xr_cockpit', name: 'XR Cockpit Interaction Specialist', role: 'XR Interfaces', icon: 'fa-display', color: 'text-accent-purple' },
    { id: 'sc_xr_immersive', name: 'XR Immersive Developer', role: 'VR/AR Apps', icon: 'fa-vr-cardboard', color: 'text-accent-purple' },
    { id: 'sc_xr_architect', name: 'XR Interface Architect', role: 'XR System Design', icon: 'fa-cube', color: 'text-accent-purple' },
    { id: 'sc_macos_spatial', name: 'macOS Spatial Metal Engineer', role: 'Metal Graphics', icon: 'fa-apple-whole', color: 'text-accent-purple' },
    { id: 'sc_terminal', name: 'Terminal Integration Specialist', role: 'CLI Tooling', icon: 'fa-terminal', color: 'text-accent-purple' }
  ],
  'GIS & Geospatial': [
    { id: 'gis_analyst', name: 'GIS Analyst', role: 'Spatial Analysis', icon: 'fa-earth-americas', color: 'text-accent-cyan' },
    { id: 'gis_3d_scene', name: '3D Scene Developer', role: '3D Visualization', icon: 'fa-cubes', color: 'text-accent-cyan' },
    { id: 'gis_bim', name: 'BIM Specialist', role: 'Building Info Modeling', icon: 'fa-building', color: 'text-accent-cyan' },
    { id: 'gis_cartography', name: 'Cartography Designer', role: 'Map Design', icon: 'fa-map-location-dot', color: 'text-accent-cyan' },
    { id: 'gis_drone', name: 'Drone Reality Mapping', role: 'Aerial Survey', icon: 'fa-helicopter', color: 'text-accent-cyan' },
    { id: 'gis_geoai', name: 'GeoAI/ML Engineer', role: 'Spatial ML', icon: 'fa-brain', color: 'text-accent-cyan' },
    { id: 'gis_spatial_data', name: 'Spatial Data Engineer', role: 'Geo Databases', icon: 'fa-database', color: 'text-accent-cyan' },
    { id: 'gis_web', name: 'Web GIS Developer', role: 'Map Applications', icon: 'fa-globe', color: 'text-accent-cyan' }
  ],
  'Academic': [
    { id: 'acad_anthropologist', name: 'Anthropologist', role: 'Cultural Research', icon: 'fa-users', color: 'text-accent-purple' },
    { id: 'acad_geographer', name: 'Geographer', role: 'Spatial Studies', icon: 'fa-earth-americas', color: 'text-accent-purple' },
    { id: 'acad_historian', name: 'Historian', role: 'Historical Research', icon: 'fa-landmark', color: 'text-accent-purple' },
    { id: 'acad_narratologist', name: 'Narratologist', role: 'Story Analysis', icon: 'fa-scroll', color: 'text-accent-purple' },
    { id: 'acad_psychologist', name: 'Psychologist', role: 'Behavioral Science', icon: 'fa-brain', color: 'text-accent-purple' }
  ],
  'Specialized': [
    { id: 'spec_chief_of_staff', name: 'Chief of Staff', role: 'Executive Operations', icon: 'fa-user-tie', color: 'text-accent-purple' },
    { id: 'spec_cfo', name: 'Chief Financial Officer', role: 'Financial Leadership', icon: 'fa-coins', color: 'text-accent-lime' },
    { id: 'spec_business_strategist', name: 'Business Strategist', role: 'Corporate Strategy', icon: 'fa-chess', color: 'text-accent-purple' },
    { id: 'spec_ops_manager', name: 'Operations Manager', role: 'Operations', icon: 'fa-gears', color: 'text-accent-cyan' },
    { id: 'spec_customer_service', name: 'Customer Service Agent', role: 'Support', icon: 'fa-headset', color: 'text-accent-cyan' },
    { id: 'spec_customer_success', name: 'Customer Success Manager', role: 'Retention', icon: 'fa-heart', color: 'text-accent-lime' },
    { id: 'spec_hr_onboarding', name: 'HR Onboarding Specialist', role: 'People Ops', icon: 'fa-id-badge', color: 'text-accent-cyan' },
    { id: 'spec_recruitment', name: 'Recruitment Specialist', role: 'Talent Acquisition', icon: 'fa-user-plus', color: 'text-accent-cyan' },
    { id: 'spec_grant_writer', name: 'Grant Writer', role: 'Funding Applications', icon: 'fa-file-signature', color: 'text-accent-lime' },
    { id: 'spec_dev_advocate', name: 'Developer Advocate', role: 'DevRel', icon: 'fa-bullhorn', color: 'text-accent-cyan' },
    { id: 'spec_mcp_builder', name: 'MCP Builder', role: 'MCP Servers', icon: 'fa-plug-circle-bolt', color: 'text-accent-purple' },
    { id: 'spec_workflow_arch', name: 'Workflow Architect', role: 'Process Design', icon: 'fa-diagram-project', color: 'text-accent-purple' },
    { id: 'spec_doc_generator', name: 'Document Generator', role: 'Auto Documentation', icon: 'fa-file-pdf', color: 'text-accent-cyan' },
    { id: 'spec_pricing_analyst', name: 'Pricing Analyst', role: 'Pricing Strategy', icon: 'fa-tags', color: 'text-accent-lime' },
    { id: 'spec_salesforce_arch', name: 'Salesforce Architect', role: 'CRM Architecture', icon: 'fa-cloud', color: 'text-accent-cyan' },
    { id: 'spec_strategy_duel', name: 'Strategy Duel Agent', role: 'Red Team/Blue Team', icon: 'fa-chess-knight', color: 'text-accent-red' },
    { id: 'spec_data_privacy', name: 'Data Privacy Officer', role: 'GDPR & Privacy', icon: 'fa-user-shield', color: 'text-accent-red' },
    { id: 'spec_esg', name: 'ESG Sustainability Officer', role: 'Sustainability', icon: 'fa-leaf', color: 'text-accent-lime' },
    { id: 'spec_legal_doc_review', name: 'Legal Document Review', role: 'Contract Analysis', icon: 'fa-scale-balanced', color: 'text-accent-purple' },
    { id: 'spec_legal_billing', name: 'Legal Billing & Time Tracking', role: 'Legal Ops', icon: 'fa-clock', color: 'text-accent-purple' },
    { id: 'spec_supply_chain', name: 'Supply Chain Strategist', role: 'Logistics', icon: 'fa-truck-fast', color: 'text-accent-cyan' },
    { id: 'spec_ma_integration', name: 'M&A Integration Manager', role: 'Mergers', icon: 'fa-arrows-rotate', color: 'text-accent-purple' },
    { id: 'spec_org_psych', name: 'Organizational Psychologist', role: 'Culture & Behavior', icon: 'fa-brain', color: 'text-accent-purple' },
    { id: 'spec_personal_growth', name: 'Personal Growth Mentor', role: 'Coaching', icon: 'fa-seedling', color: 'text-accent-lime' },
    { id: 'spec_zk_steward', name: 'ZK Steward', role: 'Zero-Knowledge Proofs', icon: 'fa-lock', color: 'text-accent-purple' },
    { id: 'spec_agents_orch', name: 'Agents Orchestrator', role: 'Multi-Agent Coordination', icon: 'fa-sitemap', color: 'text-accent-purple' },
    { id: 'spec_change_mgmt', name: 'Change Management Consultant', role: 'Org Transformation', icon: 'fa-arrows-rotate', color: 'text-accent-cyan' },
    { id: 'spec_healthcare_cs', name: 'Healthcare Customer Service', role: 'Patient Support', icon: 'fa-hospital', color: 'text-accent-cyan' },
    { id: 'spec_healthcare_mkt', name: 'Healthcare Marketing Compliance', role: 'HIPAA Marketing', icon: 'fa-shield-virus', color: 'text-accent-red' },
    { id: 'spec_hospitality', name: 'Hospitality Guest Services', role: 'Guest Experience', icon: 'fa-hotel', color: 'text-accent-cyan' },
    { id: 'spec_real_estate', name: 'Real Estate Buyer/Seller', role: 'Property Transactions', icon: 'fa-house', color: 'text-accent-lime' },
    { id: 'spec_loan_officer', name: 'Loan Officer Assistant', role: 'Lending', icon: 'fa-money-bill-transfer', color: 'text-accent-lime' },
    { id: 'spec_medical_billing', name: 'Medical Billing & Coding', role: 'Healthcare Billing', icon: 'fa-file-medical', color: 'text-accent-cyan' },
    { id: 'spec_language_translator', name: 'Language Translator', role: 'Translation & i18n', icon: 'fa-language', color: 'text-accent-cyan' }
  ]
};

// Flatten departments into a single array for backwards compatibility
const AgentTemplates = Object.values(AgentDepartments).flat();

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
