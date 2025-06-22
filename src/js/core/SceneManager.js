import { Room1 } from '../objects/Room1.js';
import { Room2 } from '../objects/Room2.js';
import { LightingManager } from './LightingManager.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.currentRoom = null;
        this.lightingManager = null;
        this.interactableObjects = [];
        this.floatingParticles = []; // Cache for particle updates
        this.lastUpdateTime = 0;
    }

    async init(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.lightingManager = new LightingManager();
        
        // Initialize lighting
        this.lightingManager.init(this.scene);
        
        // Create initial room
        await this.createRoom(1);
        
        console.log("Scene Manager initialized");
    }

    async createRoom(roomNumber) {
        // Clear current room
        this.clearScene();
        
        // Reset camera position for new room
        if (this.camera) {
            this.camera.position.set(0, 1.6, 3);
            this.camera.rotation.set(0, 0, 0);
        }
        
        // Create new room based on number
        if (roomNumber === 1) {
            this.currentRoom = new Room1();
        } else if (roomNumber === 2) {
            this.currentRoom = new Room2();
        }
        
        await this.currentRoom.create(this.scene);
        this.interactableObjects = this.currentRoom.getInteractableObjects();
        
        // Collect floating particles for efficient updates
        this.collectFloatingParticles();
        
        // Update lighting for the room
        this.lightingManager.updateForRoom(roomNumber, this.scene);
        
        console.log(`Room ${roomNumber} created`);
    }

    clearScene() {
        if (!this.scene) return;
        
        // Remove all objects except camera
        const objectsToRemove = [];
        this.scene.traverse((object) => {
            if (object !== this.camera && (object.type === "Mesh" || object.type === "Group")) {
                objectsToRemove.push(object);
            }
        });

        objectsToRemove.forEach((object) => {
            this.scene.remove(object);
        });

        this.interactableObjects = [];
        this.floatingParticles = []; // Clear particle cache
    }

    collectFloatingParticles() {
        this.floatingParticles = [];
        this.scene.traverse((object) => {
            if (object.userData && object.userData.floatSpeed) {
                this.floatingParticles.push(object);
            }
        });
    }

    update(delta) {
        if (this.currentRoom) {
            this.currentRoom.update(delta);
        }
        
        // Update floating particles efficiently (only tracked particles)
        const currentTime = Date.now();
        if (currentTime - this.lastUpdateTime > 16) { // Limit to ~60fps
            this.floatingParticles.forEach((particle) => {
                if (particle.userData && particle.userData.floatSpeed) {
                    particle.position.y = particle.userData.originalY + 
                        Math.sin(currentTime * particle.userData.floatSpeed * 0.001) * 0.3;
                }
            });
            this.lastUpdateTime = currentTime;
        }
    }

    getInteractableObjects() {
        return this.interactableObjects;
    }

    addInteractableObject(object) {
        this.interactableObjects.push(object);
    }

    removeInteractableObject(object) {
        const index = this.interactableObjects.indexOf(object);
        if (index > -1) {
            this.interactableObjects.splice(index, 1);
        }
    }

    getScene() {
        return this.scene;
    }

    getCurrentRoom() {
        return this.currentRoom;
    }
} 