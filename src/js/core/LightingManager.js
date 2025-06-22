export class LightingManager {
    constructor() {
        this.lights = [];
    }

    init(scene) {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);
        this.lights.push(ambientLight);
    }

    updateForRoom(roomNumber, scene) {
        this.clearLights(scene);
        
        if (roomNumber === 1) {
            this.setupRoom1Lighting(scene);
        } else if (roomNumber === 2) {
            this.setupRoom2Lighting(scene);
        }
    }

    setupRoom1Lighting(scene) {
        const ambientLight = new THREE.AmbientLight(0x6a7b8a, 1.2);
        scene.add(ambientLight);
        this.lights.push(ambientLight);

        const mainLight = new THREE.PointLight(0xfff8f0, 2.0, 100);
        mainLight.position.set(0, 4.5, 0);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 512;
        mainLight.shadow.mapSize.height = 512;
        scene.add(mainLight);
        this.lights.push(mainLight);

        const doorLight = new THREE.PointLight(0xfff8f0, 1.5, 15);
        doorLight.position.set(0, 3, 4);
        doorLight.castShadow = false;
        scene.add(doorLight);
        this.lights.push(doorLight);

        const accentLight = new THREE.PointLight(0x7fb3d3, 0.8, 40);
        accentLight.position.set(0, 3, -3);
        accentLight.castShadow = false;
        scene.add(accentLight);
        this.lights.push(accentLight);
    }

    setupRoom2Lighting(scene) {
        const ambientLight = new THREE.AmbientLight(0x8b7bb8, 1.2);
        scene.add(ambientLight);
        this.lights.push(ambientLight);

        const mainLight = new THREE.PointLight(0xf0f0ff, 2.0, 100);
        mainLight.position.set(0, 4.5, 0);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 512;
        mainLight.shadow.mapSize.height = 512;
        scene.add(mainLight);
        this.lights.push(mainLight);

        const doorLight = new THREE.PointLight(0xf0f0ff, 1.5, 15);
        doorLight.position.set(0, 3, 4);
        doorLight.castShadow = false;
        scene.add(doorLight);
        this.lights.push(doorLight);

        const accentLight = new THREE.PointLight(0xd4a5c7, 0.8, 40);
        accentLight.position.set(0, 3, -3);
        accentLight.castShadow = false;
        scene.add(accentLight);
        this.lights.push(accentLight);
    }

    clearLights(scene) {
        this.lights.forEach(light => {
            scene.remove(light);
        });
        this.lights = [];
    }

    addLight(light, scene) {
        scene.add(light);
        this.lights.push(light);
    }

    removeLight(light, scene) {
        scene.remove(light);
        const index = this.lights.indexOf(light);
        if (index > -1) {
            this.lights.splice(index, 1);
        }
    }
} 