import { Door } from './Door.js';
import { Key } from './Key.js';
import { Box } from './Box.js';
import { ColorPuzzle } from './ColorPuzzle.js';
import { NumberPuzzle } from './NumberPuzzle.js';
import { TableLamp } from './CubeLamp.js';
import { Table } from './Table.js';

export class Room2 {
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
        
        console.log("Room 2 created");
    }

    createRoomStructure() {
        // Enhanced floor with different color
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshLambertMaterial({
            color: 0x2d1b69, // Purple-ish floor
            transparent: true,
            opacity: 0.9,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.roomGroup.add(floor);

        // Add floor pattern with teal accents
        const patternGeometry = new THREE.RingGeometry(0.1, 0.15, 8);
        const patternMaterial = new THREE.MeshLambertMaterial({ color: 0x4ecdc4 });
        for (let i = 0; i < 20; i++) {
            const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
            pattern.rotation.x = -Math.PI / 2;
            pattern.position.set((Math.random() - 0.5) * 8, 0.01, (Math.random() - 0.5) * 8);
            this.roomGroup.add(pattern);
        }

        // Enhanced walls with teal theme
        const wallMaterial = new THREE.MeshLambertMaterial({
            color: 0x1a535c, // Teal walls
            transparent: true,
            opacity: 0.95,
        });

        // Create walls (same structure as room 1)
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
        backWall.position.set(0, 2.5, -5);
        this.roomGroup.add(backWall);

        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.set(-5, 2.5, 0);
        this.roomGroup.add(leftWall);

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

        // Enhanced ceiling with purple theme
        const ceilingMaterial = new THREE.MeshLambertMaterial({
            color: 0x4a148c, // Purple ceiling
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

        // Key hidden under the box
        const key = new Key();
        const keyMesh = key.create(new THREE.Vector3(3, 0.5, 3.5), 0x4ecdc4); // Same position as box
        this.roomGroup.add(keyMesh);
        this.interactableObjects.push(keyMesh);

        // Box covering the key
        const box = new Box();
        const boxMesh = box.create(new THREE.Vector3(3, 0.5, 3.5), 0x6a4c93); // Purple box
        this.roomGroup.add(boxMesh);
        this.interactableObjects.push(boxMesh);

        // Color puzzle panel in different position
        const colorPuzzle = new ColorPuzzle();
        const colorPuzzleMesh = colorPuzzle.create(new THREE.Vector3(4, 2, -4.9), 0xd4a5c7); // Soft pink instead of bright pink
        this.roomGroup.add(colorPuzzleMesh);
        this.interactableObjects.push(colorPuzzleMesh);

        // Number puzzle panel in different position
        const numberPuzzle = new NumberPuzzle();
        const numberPuzzleMesh = numberPuzzle.create(new THREE.Vector3(-4, 2, -4.9), 0x7fb3d3); // Soft blue instead of bright teal
        this.roomGroup.add(numberPuzzleMesh);
        this.interactableObjects.push(numberPuzzleMesh);

        // Table in different position
        const table = new Table();
        const tableMesh = table.create(new THREE.Vector3(-2, 1, 0), 0x6a4c93); // Purple table
        this.roomGroup.add(tableMesh);

        // Create lamp on the table
        const lamp = new TableLamp();
        const lampMesh = lamp.create(new THREE.Vector3(-2, 0, 0), 1); // On table surface (y=1)
        this.roomGroup.add(lampMesh);
        this.interactableObjects.push(lampMesh);

        // Add room 2 number clues with different positions
        this.addNumberClues();
    }

    addNumberClues() {
        // Different code for room 2: 5931
        const clues = [
            { number: "5", color: 0xd4a5c7, position: { x: 2, y: 1.5, z: -4.8 } }, // Soft pink
            { number: "9", color: 0x7fb3d3, position: { x: -2, y: 1.5, z: -4.8 } }, // Soft blue
            { number: "3", color: 0xb8a5d4, position: { x: 4.8, y: 1.5, z: -2 } }, // Soft purple
            { number: "1", color: 0xd4b895, position: { x: -4.8, y: 1.5, z: 2 } }, // Soft orange
        ];

        clues.forEach((clue) => {
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

            // Create number texture
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext("2d");

            const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(1, "#f0f0f0");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 256, 256);

            ctx.strokeStyle = "#333333";
            ctx.lineWidth = 8;
            ctx.strokeRect(0, 0, 256, 256);

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
        // Floating particles with different colors
        const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b9d,
            emissive: 0x110022,
            transparent: true,
            opacity: 0.6,
        });

        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set((Math.random() - 0.5) * 8, Math.random() * 4 + 1, (Math.random() - 0.5) * 8);
            this.roomGroup.add(particle);

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