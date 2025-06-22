import { SceneManager } from './SceneManager.js';
import { InputManager } from '../controls/InputManager.js';
import { UIManager } from '../utils/UIManager.js';
import { GameState } from './GameState.js';
import { WebXRManager } from './WebXRManager.js';

export class GameEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        this.sceneManager = null;
        this.inputManager = null;
        this.uiManager = null;
        this.gameState = null;
        this.webXRManager = null;
        
        this.isInitialized = false;
        this.isRunning = false;
        
        // FPS tracking
        this.frameCount = 0;
        this.lastFPSUpdate = 0;
        this.currentFPS = 0;
        this.lastFrameTime = 0;
        
        // Timer precision
        this.lastTimerUpdate = 0;
    }

    async init() {
        console.log("Initializing Game Engine...");
        
        try {
            // Initialize core game systems
            this.gameState = new GameState();
            this.sceneManager = new SceneManager();
            this.inputManager = new InputManager();
            this.uiManager = new UIManager();
            this.webXRManager = new WebXRManager(this);
            
            // Three.js initialization
            await this.initThreeJS();
            
            // Initialize managers
            await this.sceneManager.init(this.scene, this.camera);
            this.inputManager.init(this.camera, this.sceneManager);
            this.uiManager.init();
            await this.webXRManager.init();
            
            this.addEventListeners();
            
            // Start game loop
            this.isInitialized = true;
            this.isRunning = true;
            this.animate();
            
            console.log("Game Engine initialized successfully!");
            
        } catch (error) {
            console.error("Error initializing Game Engine:", error);
            throw error;
        }
    }

    async initThreeJS() {
        // Scene initialization
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        
        // Camera initialization
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.6, 3);
        
        // Renderer configuration
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false, // Disabled for speed
            alpha: false, // Disabled for speed
            powerPreference: "high-performance",
            stencil: false, // Disabled for speed
            depth: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap; // Basic shadows for speed
        this.renderer.shadowMap.autoUpdate = false; // Manual shadow updates
        this.renderer.toneMapping = THREE.NoToneMapping; // Disabled for speed
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Add to DOM
        const container = document.getElementById("gameContainer");
        if (container) {
            container.appendChild(this.renderer.domElement);
        } else {
            throw new Error("Game container not found!");
        }
    }

    addEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Global game events
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                this.pauseGame();
            }
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        if (!this.isRunning) return;
        
        // Don't run desktop animation loop if in VR
        if (this.webXRManager && this.webXRManager.isVRMode()) {
            return;
        }
        
        requestAnimationFrame(this.animate.bind(this));
        
        const currentTime = performance.now();
        const delta = this.clock.getDelta();
        
        // Frame rate limiting
        if (currentTime - this.lastFrameTime < 16.67) { // ~60 FPS limit
            return;
        }
        this.lastFrameTime = currentTime;
        
        // Update all systems
        this.sceneManager.update(delta);
        this.inputManager.update(delta);
        
        // Update timer with precise timing (every 1000ms exactly)
        if (this.gameState.isGameStarted() && !this.gameState.isGamePaused() && !this.gameState.isGameWon()) {
            if (currentTime - this.lastTimerUpdate >= 1000) {
                this.gameState.updateTimer(1); // Update by exactly 1 second
                this.lastTimerUpdate = currentTime;
            }
        }
        
        // Update shadows only when needed
        if (this.renderer.shadowMap.enabled && this.frameCount % 3 === 0) {
            this.renderer.shadowMap.needsUpdate = true;
        }
        
        this.renderer.render(this.scene, this.camera);
        
        // FPS tracking
        this.frameCount++;
        if (currentTime - this.lastFPSUpdate > 1000) {
            this.currentFPS = Math.round(this.frameCount * 1000 / (currentTime - this.lastFPSUpdate));
            this.frameCount = 0;
            this.lastFPSUpdate = currentTime;
            
            if (this.currentFPS < 30) {
                console.warn(`Low FPS detected: ${this.currentFPS}`);
            }
        }
    }

    pauseGame() {
        this.isRunning = false;
        this.uiManager.showPauseMenu();
    }

    resumeGame() {
        this.isRunning = true;
        
        // Close pause menu
        if (this.uiManager) {
            this.uiManager.closePauseMenu();
        }
        
        // Restart animation loop
        this.animate();
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }

    getGameState() {
        return this.gameState;
    }
} 