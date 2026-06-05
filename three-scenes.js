// three-scenes.js - Three.js Visualizations (RTS Map & Claw3D Office)

(function() {
    // IIFE scoping to prevent collision bugs (Bug: 3D visualization fixed)
    
    let scene, camera, renderer;
    let rtsGroup, clawGroup;
    let animationId;
    let packets = [];
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
        clawGroup = new THREE.Group();
        scene.add(rtsGroup);
        scene.add(clawGroup);
        clawGroup.visible = false;

        buildRTSMap();
        buildClawOffice();

        // Event Listeners for Toggles
        document.getElementById('btn-toggle-rts')?.addEventListener('click', (e) => {
            isRTSMode = true;
            rtsGroup.visible = true;
            clawGroup.visible = false;
            camera.position.set(0, 15, 20);
            camera.lookAt(0, 0, 0);
            e.target.classList.add('active-toggle');
            document.getElementById('btn-toggle-claw').classList.remove('active-toggle');
        });

        document.getElementById('btn-toggle-claw')?.addEventListener('click', (e) => {
            isRTSMode = false;
            rtsGroup.visible = false;
            clawGroup.visible = true;
            camera.position.set(0, 8, 15);
            camera.lookAt(0, 0, 0);
            e.target.classList.add('active-toggle');
            document.getElementById('btn-toggle-rts').classList.remove('active-toggle');
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
        const grid = new THREE.GridHelper(30, 30, 0x00F2FE, 0x333333);
        grid.position.y = -0.5;
        rtsGroup.add(grid);

        const nodes = [
            { pos: new THREE.Vector3(0, 0, -5), color: 0xFF2E93, name: 'CEO' },
            { pos: new THREE.Vector3(-6, 0, 0), color: 0x00F2FE, name: 'Dev' },
            { pos: new THREE.Vector3(6, 0, 0), color: 0x39FF14, name: 'Mkt' },
            { pos: new THREE.Vector3(0, 0, 5), color: 0x7F00FF, name: 'Hexa' }
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

    function buildClawOffice() {
        // Simple floor
        const floorGeo = new THREE.PlaneGeometry(20, 20);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.5;
        clawGroup.add(floor);

        // Desks (Boxes)
        for(let i=0; i<4; i++) {
            const deskGeo = new THREE.BoxGeometry(3, 1, 1.5);
            const deskMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
            const desk = new THREE.Mesh(deskGeo, deskMat);
            
            const angle = (i / 4) * Math.PI * 2;
            const radius = 5;
            desk.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            desk.lookAt(0,0,0);
            
            // Computer monitor
            const monitorGeo = new THREE.BoxGeometry(1.2, 0.8, 0.1);
            const monitorMat = new THREE.MeshBasicMaterial({ color: 0x00F2FE }); // glowing screen
            const monitor = new THREE.Mesh(monitorGeo, monitorMat);
            monitor.position.set(0, 0.9, 0);
            desk.add(monitor);

            clawGroup.add(desk);
        }
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
            clawGroup.rotation.y += 0.003;
        }

        renderer.render(scene, camera);
    }

})();
