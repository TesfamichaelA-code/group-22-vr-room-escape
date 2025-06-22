import { Door } from './Door.js';
import { Key } from './Key.js';
import { Box } from './Box.js';
import { ColorPuzzle } from './ColorPuzzle.js';
import { NumberPuzzle } from './NumberPuzzle.js';
import { TableLamp } from './CubeLamp.js';
import { Table } from './Table.js';

export class Room1 {
    constructor() {
        this.scene = null;
        this.interactableObjects = [];
        this.roomGroup = null;
    }

    async create(scene) {
        this.scene = scene;
        this.roomGroup = new THREE.Group();
        
        // Create room structure
        this.createRoomStructure();
        
        // Create interactive objects
        this.createInteractiveObjects();
        
        // Create decorative elements
        this.createDecorativeElements();
        
        // Add room group to scene
        this.scene.add(this.roomGroup);
        
        console.log("Room 1 created");
    }

    createRoomStructure() {
        // Enhanced floor with texture-like appearance
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshLambertMaterial({
            color: 0x4a4a4a,
            transparent: true,
            opacity: 0.9,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.roomGroup.add(floor);

        // Add floor pattern
        const patternGeometry = new THREE.RingGeometry(0.1, 0.15, 8);
        const patternMaterial = new THREE.MeshLambertMaterial({ color: 0x6a6a6a });
        for (let i = 0; i < 20; i++) {
            const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
            pattern.rotation.x = -Math.PI / 2;
            pattern.position.set((Math.random() - 0.5) * 8, 0.01, (Math.random() - 0.5) * 8);
            this.roomGroup.add(pattern);
        }

        // Enhanced walls with gradient-like effect
        const wallMaterial = new THREE.MeshLambertMaterial({
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.95,
        });

        // Back wall
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
        backWall.position.set(0, 2.5, -5);
        this.roomGroup.add(backWall);

        // Left wall
        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.set(-5, 2.5, 0);
        this.roomGroup.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.set(5, 2.5, 0);
        this.roomGroup.add(rightWall);

        // Front wall with door opening
        const frontWallLeft = new THREE.Mesh(new THREE.PlaneGeometry(3, 5), wallMaterial);
        frontWallLeft.position.set(-3.5, 2.5, 5);
        frontWallLeft.rotation.y = Math.PI;
        this.roomGroup.add(frontWallLeft);

        const frontWallRight = new THREE.Mesh(new THREE.PlaneGeometry(3, 5), wallMaterial);
        frontWallRight.position.set(3.5, 2.5, 5);
        frontWallRight.rotation.y = Math.PI;
        this.roomGroup.add(frontWallRight);

        const frontWallTop = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), wallMaterial);
        frontWallTop.position.set(0, 4.5, 5);
        frontWallTop.rotation.y = Math.PI;
        this.roomGroup.add(frontWallTop);

        // Enhanced ceiling
        const ceilingMaterial = new THREE.MeshLambertMaterial({
            color: 0x34495e,
            transparent: true,
            opacity: 0.9,
        });
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 5;
        this.roomGroup.add(ceiling);
    }

    createInteractiveObjects() {
        // Create door
        const door = new Door();
        const doorMesh = door.create(new THREE.Vector3(0, 0, 4.85));
        this.roomGroup.add(doorMesh);
        this.interactableObjects.push(door.getDoorMesh());

        // Create key (visible on the floor)
        const key = new Key();
        const keyMesh = key.create(new THREE.Vector3(-3, 0.5, -3), 0xffd700); // Original working position
        this.roomGroup.add(keyMesh);
        this.interactableObjects.push(keyMesh);

        // Create box (separate from key)
        const box = new Box();
        const boxMesh = box.create(new THREE.Vector3(-3, 0.5, -3.5), 0x8b4513); // Original working position
        this.roomGroup.add(boxMesh);
        this.interactableObjects.push(boxMesh);

        // Create color puzzle panel
        const colorPuzzle = new ColorPuzzle();
        const colorPuzzleMesh = colorPuzzle.create(new THREE.Vector3(-4, 2, -4.9), 0xd4a5a5);
        this.roomGroup.add(colorPuzzleMesh);
        this.interactableObjects.push(colorPuzzleMesh);

        // Create number puzzle panel
        const numberPuzzle = new NumberPuzzle();
        const numberPuzzleMesh = numberPuzzle.create(new THREE.Vector3(4, 2, -4.9), 0x7fb3d3);
        this.roomGroup.add(numberPuzzleMesh);
        this.interactableObjects.push(numberPuzzleMesh);

        // Create table
        const table = new Table();
        const tableMesh = table.create(new THREE.Vector3(2, 1, 0), 0x8b4513);
        this.roomGroup.add(tableMesh);

        // Create lamp on the table
        const lamp = new TableLamp();
        const lampMesh = lamp.create(new THREE.Vector3(2, 0, 0), 1); // On table surface (y=1)
        this.roomGroup.add(lampMesh);
        this.interactableObjects.push(lampMesh);

        // Add number clues
        this.addNumberClues();
    }

    addNumberClues() {
        const clues = [
            { number: "2", color: 0xd4a5a5, position: { x: -2, y: 1.5, z: -4.8 } }, // Soft pink
            { number: "8", color: 0x9bc4a0, position: { x: 2, y: 1.5, z: -4.8 } }, // Soft green
            { number: "4", color: 0x7fb3d3, position: { x: -4.8, y: 1.5, z: -2 } }, // Soft blue
            { number: "7", color: 0xd4b895, position: { x: 4.8, y: 1.5, z: 2 } }, // Soft orange
        ];

        clues.forEach((clue) => {
            // Enhanced clue panels with glow
            const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.15);
            const material = new THREE.MeshPhongMaterial({
                color: clue.color,
                emissive: new THREE.Color(clue.color).multiplyScalar(0.2),
                shininess: 50,
            });
            const cluePanel = new THREE.Mesh(geometry, material);

            cluePanel.position.copy(clue.position);
            if (clue.position.x > 4) cluePanel.rotation.y = -Math.PI / 2;
            if (clue.position.x < -4) cluePanel.rotation.y = Math.PI / 2;

            cluePanel.castShadow = true;
            this.roomGroup.add(cluePanel);

            // Enhanced text
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext("2d");

            // Create gradient background
            const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(1, "#f0f0f0");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 256, 256);

            // Add border
            ctx.strokeStyle = "#333333";
            ctx.lineWidth = 8;
            ctx.strokeRect(0, 0, 256, 256);

            // Add number
            ctx.fillStyle = "#000000";
            ctx.font = "bold 120px Arial";
            ctx.textAlign = "center";
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(clue.number, 128, 160);

            const texture = new THREE.CanvasTexture(canvas);
            const textMaterial = new THREE.MeshLambertMaterial({ map: texture });
            const textGeometry = new THREE.PlaneGeometry(0.4, 0.4);
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            textMesh.position.copy(clue.position);
            if (clue.position.x > 4) {
                textMesh.rotation.y = -Math.PI / 2;
                textMesh.position.x -= 0.12;
            } else if (clue.position.x < -4) {
                textMesh.rotation.y = Math.PI / 2;
                textMesh.position.x += 0.12;
            } else {
                textMesh.position.z += 0.12;
            }

            this.roomGroup.add(textMesh);
        });
    }

    createDecorativeElements() {
        // Add some floating particles for atmosphere
        const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: 0x4ecdc4,
            emissive: 0x001122,
            transparent: true,
            opacity: 0.6,
        });

        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set((Math.random() - 0.5) * 8, Math.random() * 4 + 1, (Math.random() - 0.5) * 8);
            this.roomGroup.add(particle);

            // Add floating animation
            particle.userData = {
                originalY: particle.position.y,
                floatSpeed: Math.random() * 0.02 + 0.01,
            };
        }
    }

    update(delta) {
        // Update any animated objects in the room
    }

    getInteractableObjects() {
        return this.interactableObjects;
    }
} 