// three-scenes.js - Three.js Visualizations (RTS Map & Agent Office Scene)

(function() {
    const OFFICE_VISIBLE_AGENT_COUNT = 17;
    const OFFICE_ANIMATION_TIME_SCALE = 0.001;
    const OFFICE_WAVE_FREQUENCY = 2;
    const OFFICE_WAVE_AMPLITUDE = 0.08;
    const OFFICE_PERSON_ROTATION_SPEED = 0.0025;
    const OFFICE_GROUP_ROTATION_SPEED = 0.001;

    let scene, camera, renderer;
    let rtsGroup, officeGroup;
    let animationId;
    let packets = [];
    let officePeople = [];
    let isRTSMode = true;

    window.initThreeJS = function() {
        const container = document.getElementById('three-canvas-container');
        if (!container || container.children.length > 0) return; // Prevent double init

        // Setup Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0c);

        // Camera setup
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 15, 20);
        camera.lookAt(0, 0, 0);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        // Groups for switching views
        rtsGroup = new THREE.Group();
        officeGroup = new THREE.Group();
        scene.add(rtsGroup);
        scene.add(officeGroup);
        officeGroup.visible = false;

        buildRTSMap();
        buildAgentOffice();

        // Event Listeners for Toggles
        document.getElementById('btn-toggle-rts')?.addEventListener('click', (e) => {
            isRTSMode = true;
            rtsGroup.visible = true;
            officeGroup.visible = false;
            camera.position.set(0, 15, 20);
            camera.lookAt(0, 0, 0);
            e.currentTarget.classList.add('active-toggle');
        });

        window.addEventListener('resize', () => {
            if(!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });

        animate();
    };

    function buildRTSMap() {
        // Grid helper
        const grid = new THREE.GridHelper(30, 30, 0x1E3A8A, 0x333333);
        grid.position.y = -0.5;
        rtsGroup.add(grid);

        const nodes = [
            { pos: new THREE.Vector3(0, 0, -5), color: 0xFF2E93, name: 'CEO' },
            { pos: new THREE.Vector3(-6, 0, 0), color: 0x1E3A8A, name: 'Dev' },
            { pos: new THREE.Vector3(6, 0, 0), color: 0x39FF14, name: 'Mkt' },
            { pos: new THREE.Vector3(0, 0, 5), color: 0x1D4ED8, name: 'Hexa' }
        ];

        const nodeMaterial = new THREE.MeshPhongMaterial({ shininess: 100 });
        const nodeGeo = new THREE.SphereGeometry(0.8, 32, 32);

        nodes.forEach((n, i) => {
            const mesh = new THREE.Mesh(nodeGeo, nodeMaterial.clone());
            mesh.material.color.setHex(n.color);
            mesh.position.copy(n.pos);
            rtsGroup.add(mesh);

            // Connect to center (CEO) if not CEO
            if(i > 0) {
                const lineMat = new THREE.LineBasicMaterial({ color: 0x555555 });
                const pts = [nodes[0].pos, n.pos];
                const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
                const line = new THREE.Line(lineGeo, lineMat);
                rtsGroup.add(line);

                // Add simulated packets
                createPacket(nodes[0].pos, n.pos, n.color);
                createPacket(n.pos, nodes[0].pos, n.color);
            }
        });
    }

    function createPacket(start, end, color) {
        const geo = new THREE.SphereGeometry(0.2, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(start);
        rtsGroup.add(mesh);
        packets.push({ mesh, start: start.clone(), end: end.clone(), progress: Math.random() });
    }

    function buildAgentOffice() {
        // Agent Office-inspired virtual workspace with FoundrOS agents represented as animated people.
        const floorGeo = new THREE.PlaneGeometry(24, 24);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.5;
        officeGroup.add(floor);

        // Room shell
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x111827 });
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(24, 6, 0.4), wallMaterial);
        backWall.position.set(0, 2.5, -12);
        officeGroup.add(backWall);
        const sideWallL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 24), wallMaterial);
        sideWallL.position.set(-12, 2.5, 0);
        officeGroup.add(sideWallL);
        const sideWallR = sideWallL.clone();
        sideWallR.position.set(12, 2.5, 0);
        officeGroup.add(sideWallR);

        const defaultRoster = (typeof AgentTemplates !== 'undefined' && Array.isArray(AgentTemplates))
            ? AgentTemplates.map(agent => agent.name)
            : Array.from({ length: OFFICE_VISIBLE_AGENT_COUNT }, (_, i) => `FoundrOS Agent ${i + 1}`);
        const agentNames = Array.isArray(window.BusinessBuilderAgentRoster) && window.BusinessBuilderAgentRoster.length
            ? window.BusinessBuilderAgentRoster.slice(0, OFFICE_VISIBLE_AGENT_COUNT)
            : defaultRoster.slice(0, OFFICE_VISIBLE_AGENT_COUNT);

        officePeople = [];
        const deskCount = agentNames.length;

        for(let i = 0; i < deskCount; i++) {
            const deskGeo = new THREE.BoxGeometry(2.6, 0.8, 1.3);
            const deskMat = new THREE.MeshStandardMaterial({ color: 0x374151 });
            const desk = new THREE.Mesh(deskGeo, deskMat);
            
            const angle = (i / deskCount) * Math.PI * 2;
            const radius = 7;
            desk.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            desk.lookAt(0,0,0);
            
            const monitorGeo = new THREE.BoxGeometry(1.2, 0.8, 0.1);
            const monitorMat = new THREE.MeshBasicMaterial({ color: 0x1E3A8A });
            const monitor = new THREE.Mesh(monitorGeo, monitorMat);
            monitor.position.set(0, 0.9, 0);
            desk.add(monitor);

            officeGroup.add(desk);

            const person = createOfficePerson(agentNames[i], i);
            person.group.position.set(Math.cos(angle) * (radius - 1.6), 0, Math.sin(angle) * (radius - 1.6));
            person.group.lookAt(0, 0.7, 0);
            officeGroup.add(person.group);
            officePeople.push(person);
        }
    }

    function createOfficePerson(name, index) {
        const group = new THREE.Group();
        const palette = [0x1D4ED8, 0xFF2E93, 0x39FF14, 0x2563EB];
        const bodyColor = palette[index % palette.length];

        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.28, 0.3, 0.8, 10),
            new THREE.MeshStandardMaterial({ color: bodyColor })
        );
        body.position.y = 0.45;
        group.add(body);

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xf5d0a9 })
        );
        head.position.y = 0.95;
        group.add(head);

        const badge = new THREE.Mesh(
            new THREE.PlaneGeometry(1.8, 0.35),
            new THREE.MeshBasicMaterial({ color: 0x111827, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
        );
        badge.position.y = 1.45;
        group.add(badge);

        const label = createNameSprite(name);
        label.position.y = 1.45;
        group.add(label);

        return {
            group,
            baseY: 0,
            waveOffset: Math.random() * Math.PI * 2
        };
    }

    function createNameSprite(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        context.fillStyle = '#E5E7EB';
        context.font = '42px Outfit, Arial';
        context.textAlign = 'center';
        context.fillText(text, canvas.width / 2, 80);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(2.5, 0.65, 1);
        return sprite;
    }

    function animate() {
        animationId = requestAnimationFrame(animate);

        // Rotate scene slightly
        if(isRTSMode) {
            rtsGroup.rotation.y += 0.002;
            // Move packets
            packets.forEach(p => {
                p.progress += 0.005;
                if(p.progress > 1) p.progress = 0;
                p.mesh.position.lerpVectors(p.start, p.end, p.progress);
            });
        } else {
            officePeople.forEach((agent, index) => {
                const t = performance.now() * OFFICE_ANIMATION_TIME_SCALE + agent.waveOffset;
                agent.group.position.y = agent.baseY + Math.sin(t * OFFICE_WAVE_FREQUENCY + index) * OFFICE_WAVE_AMPLITUDE;
                agent.group.rotation.y += OFFICE_PERSON_ROTATION_SPEED;
            });
            officeGroup.rotation.y += OFFICE_GROUP_ROTATION_SPEED;
        }

        renderer.render(scene, camera);
    }

})();
