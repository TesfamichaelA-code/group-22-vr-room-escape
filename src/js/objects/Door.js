export class Door {
    constructor() {
        this.doorGroup = null;
        this.doorMesh = null;
    }

    create(position, rotation = 0) {
        this.doorGroup = new THREE.Group();
        this.doorGroup.position.copy(position);
        
        // Door frame - more realistic
        const frameGeometry = new THREE.BoxGeometry(3.2, 4.8, 0.3);
        const frameMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a3c2a, // Warmer wood color
            shininess: 15,
        });
        const doorFrame = new THREE.Mesh(frameGeometry, frameMaterial);
        doorFrame.position.set(0, 2.4, 0);
        this.doorGroup.add(doorFrame);

        // Door - with panels for realism
        const doorGeometry = new THREE.BoxGeometry(2.6, 4.2, 0.25);
        const doorMaterial = new THREE.MeshPhongMaterial({
            color: 0x6b4e37, // Rich wood color
            shininess: 25,
            specular: 0x111111,
        });
        this.doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
        this.doorMesh.position.set(0, 2.1, 0);
        this.doorMesh.castShadow = true;
        this.doorMesh.userData = { 
            type: "door", 
            locked: true,
            open: false,
            opening: false,
            hingePosition: new THREE.Vector3(-1.3, 0, 0) // Hinge on left side
        };
        this.doorGroup.add(this.doorMesh);

        // Add door panels for realism
        this.addDoorPanels();

        // Add hinges
        this.addHinges();

        // Door handle
        const handleGroup = new THREE.Group();
        
        // Handle base plate
        const plateGeometry = new THREE.BoxGeometry(0.15, 0.25, 0.05);
        const plateMaterial = new THREE.MeshPhongMaterial({
            color: 0x8b7355, // Brass color
            shininess: 80,
        });
        const handlePlate = new THREE.Mesh(plateGeometry, plateMaterial);
        handlePlate.position.set(0, 0, 0.125);
        handleGroup.add(handlePlate);

        // Handle lever
        const leverGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.12);
        const leverMaterial = new THREE.MeshPhongMaterial({
            color: 0xdaa520, // Golden color
            shininess: 100,
        });
        const handleLever = new THREE.Mesh(leverGeometry, leverMaterial);
        handleLever.rotation.z = Math.PI / 2;
        handleLever.position.set(0.06, 0, 0.125);
        handleGroup.add(handleLever);

        // Handle grip
        const gripGeometry = new THREE.SphereGeometry(0.025);
        const gripMaterial = new THREE.MeshPhongMaterial({
            color: 0xdaa520,
            shininess: 100,
        });
        const handleGrip = new THREE.Mesh(gripGeometry, gripMaterial);
        handleGrip.position.set(0.12, 0, 0.125);
        handleGroup.add(handleGrip);

        handleGroup.position.set(1.1, 2.1, 0);
        this.doorMesh.add(handleGroup);

        // Door lock mechanism
        const lockGroup = new THREE.Group();
        
        // Lock body
        const lockGeometry = new THREE.BoxGeometry(0.25, 0.4, 0.15);
        const lockMaterial = new THREE.MeshPhongMaterial({
            color: 0x2a2a2a, // Dark metal
            shininess: 60,
        });
        const doorLock = new THREE.Mesh(lockGeometry, lockMaterial);
        doorLock.position.set(0, 0, 0.125);
        lockGroup.add(doorLock);

        // Lock keyhole
        const keyholeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2);
        const keyholeMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a1a1a,
            shininess: 50,
        });
        const keyhole = new THREE.Mesh(keyholeGeometry, keyholeMaterial);
        keyhole.rotation.z = Math.PI / 2;
        keyhole.position.set(0, 0, 0.125);
        lockGroup.add(keyhole);

        lockGroup.position.set(0.7, 2.1, 0);
        this.doorMesh.add(lockGroup);

        // Add EXIT sign above the door
        const exitSign = this.createExitSign();
        exitSign.position.set(0, 4.4, 0.15);
        this.doorGroup.add(exitSign);
        
        return this.doorGroup;
    }

    addDoorPanels() {
        // Top panel
        const topPanelGeometry = new THREE.BoxGeometry(2.4, 1.8, 0.05);
        const panelMaterial = new THREE.MeshPhongMaterial({
            color: 0x5a4a3a, // Slightly darker wood
            shininess: 20,
        });
        const topPanel = new THREE.Mesh(topPanelGeometry, panelMaterial);
        topPanel.position.set(0, 1.2, 0.125);
        this.doorMesh.add(topPanel);

        // Bottom panel
        const bottomPanelGeometry = new THREE.BoxGeometry(2.4, 1.8, 0.05);
        const bottomPanel = new THREE.Mesh(bottomPanelGeometry, panelMaterial);
        bottomPanel.position.set(0, -0.3, 0.125);
        this.doorMesh.add(bottomPanel);

        // Middle divider
        const dividerGeometry = new THREE.BoxGeometry(2.4, 0.1, 0.05);
        const divider = new THREE.Mesh(dividerGeometry, panelMaterial);
        divider.position.set(0, 0.45, 0.125);
        this.doorMesh.add(divider);
    }

    addHinges() {
        const hingeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
        const hingeMaterial = new THREE.MeshPhongMaterial({
            color: 0x8b7355, // Brass color
            shininess: 70,
        });

        // Top hinge
        const topHinge = new THREE.Mesh(hingeGeometry, hingeMaterial);
        topHinge.rotation.z = Math.PI / 2;
        topHinge.position.set(-1.3, 1.2, 0);
        this.doorMesh.add(topHinge);

        // Middle hinge
        const middleHinge = new THREE.Mesh(hingeGeometry, hingeMaterial);
        middleHinge.rotation.z = Math.PI / 2;
        middleHinge.position.set(-1.3, 0, 0);
        this.doorMesh.add(middleHinge);

        // Bottom hinge
        const bottomHinge = new THREE.Mesh(hingeGeometry, hingeMaterial);
        bottomHinge.rotation.z = Math.PI / 2;
        bottomHinge.position.set(-1.3, -1.2, 0);
        this.doorMesh.add(bottomHinge);
    }

    createExitSign() {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        // Create exit sign background with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 128);
        gradient.addColorStop(0, "#ff6666");
        gradient.addColorStop(1, "#cc4444");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 128);

        // Add border
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 6;
        ctx.strokeRect(0, 0, 256, 128);

        // Add inner border
        ctx.strokeStyle = "#ffaaaa";
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 236, 108);

        // Add EXIT text with shadow
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 52px Arial";
        ctx.textAlign = "center";
        ctx.fillText("EXIT", 128, 85);

        const exitTexture = new THREE.CanvasTexture(canvas);
        const exitMaterial = new THREE.MeshLambertMaterial({ map: exitTexture });
        const exitGeometry = new THREE.PlaneGeometry(1.2, 0.6);
        return new THREE.Mesh(exitGeometry, exitMaterial);
    }

    getDoorMesh() {
        return this.doorMesh;
    }

    getDoorGroup() {
        return this.doorGroup;
    }
} 