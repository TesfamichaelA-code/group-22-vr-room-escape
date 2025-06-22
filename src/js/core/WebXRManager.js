export class WebXRManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.session = null;
        this.isVRAvailable = false;
        this.isInVR = false;
        this.controllers = [];
        this.reticle = null;
        this.vrButton = null;
        this.exitVRButton = null;
        
        // VR-specific settings
        this.vrSettings = {
            referenceSpace: 'local',
            sessionInit: {
                optionalFeatures: ['local-floor', 'bounded-floor'],
                requiredFeatures: ['local']
            }
        };
    }

    async init() {
        console.log('Initializing WebXR Manager...');
        
        // Check WebXR support
        if (!navigator.xr) {
            console.warn('WebXR not supported in this browser');
            this.setupVRControlsWithFallback('WebXR not supported in this browser');
            return;
        }

        // Check VR support
        try {
            this.isVRAvailable = await navigator.xr.isSessionSupported('immersive-vr');
            console.log('VR support check result:', this.isVRAvailable);
        } catch (error) {
            console.error('Error checking VR support:', error);
            this.isVRAvailable = false;
        }
        
        if (!this.isVRAvailable) {
            console.warn('VR not supported on this device');
            this.setupVRControlsWithFallback('VR not supported on this device');
            return;
        }

        console.log('WebXR VR is available!');
        this.setupVRControls();
        this.setupVREventListeners();
    }

    setupVRControlsWithFallback(message) {
        this.vrButton = document.getElementById('enterVR');
        this.exitVRButton = document.getElementById('exitVR');
        
        if (this.vrButton) {
            this.vrButton.addEventListener('click', () => {
                this.showVRError(message);
            });
            this.vrButton.textContent = 'Enter VR (Not Available)';
            this.vrButton.classList.add('disabled');
            console.log('VR button set up with fallback message');
        } else {
            console.error('VR button not found!');
        }
        
        if (this.exitVRButton) {
            this.exitVRButton.addEventListener('click', () => this.exitVR());
        }

        // Create VR reticle
        this.createVRReticle();
    }

    hideVRControls() {
        const vrControls = document.getElementById('vrControls');
        if (vrControls) {
            vrControls.style.display = 'none';
        }
    }

    setupVRControls() {
        this.vrButton = document.getElementById('enterVR');
        this.exitVRButton = document.getElementById('exitVR');
        
        if (this.vrButton) {
            this.vrButton.addEventListener('click', () => this.enterVR());
            console.log('VR button event listener added');
        } else {
            console.error('VR button not found!');
        }
        
        if (this.exitVRButton) {
            this.exitVRButton.addEventListener('click', () => this.exitVR());
        }

        // Create VR reticle
        this.createVRReticle();
    }

    createVRReticle() {
        this.reticle = document.createElement('div');
        this.reticle.className = 'vr-reticle';
        document.body.appendChild(this.reticle);
    }

    setupVREventListeners() {
        // Listen for VR session end
        if (navigator.xr) {
            navigator.xr.addEventListener('sessionend', () => {
                this.onSessionEnd();
            });
        }
    }

    async enterVR() {
        console.log('Enter VR clicked, checking availability...');
        if (!this.isVRAvailable) {
            this.showVRError('VR not available on this device');
            return;
        }
        
        if (this.isInVR) {
            console.log('Already in VR mode');
            return;
        }

        try {
            console.log('Starting VR session...');
            
            // Create VR session with simpler options
            this.session = await navigator.xr.requestSession('immersive-vr', {
                optionalFeatures: ['local-floor'],
                requiredFeatures: ['local']
            });
            
            console.log('VR session created successfully');
            
            // Set up renderer for VR
            this.gameEngine.renderer.xr.enabled = true;
            this.gameEngine.renderer.xr.setReferenceSpaceType('local');
            this.gameEngine.renderer.xr.setSession(this.session);
            
            // Set up VR session
            await this.setupVRSession();
            
            // Update UI
            this.isInVR = true;
            document.body.classList.add('vr-mode');
            this.vrButton.style.display = 'none';
            this.exitVRButton.style.display = 'block';
            
            console.log('VR session started successfully!');
            
        } catch (error) {
            console.error('Failed to start VR session:', error);
            this.showVRError('Failed to enter VR: ' + error.message);
        }
    }

    async setupVRSession() {
        if (!this.session) return;

        try {
            // Set up reference space
            const referenceSpace = await this.session.requestReferenceSpace('local');
            
            // Set up VR camera
            this.gameEngine.camera.position.set(0, 1.6, 0);
            
            // Set up controllers
            this.setupVRControllers();
            
            // Set up VR session event listeners
            this.session.addEventListener('end', () => this.onSessionEnd());
            this.session.addEventListener('select', (event) => this.onVRSelect(event));
            this.session.addEventListener('selectstart', (event) => this.onVRSelectStart(event));
            this.session.addEventListener('selectend', (event) => this.onVRSelectEnd(event));
            
            // Start VR render loop
            this.session.requestAnimationFrame((time, frame) => this.onVRFrame(time, frame));
            
        } catch (error) {
            console.error('Error setting up VR session:', error);
            this.showVRError('Failed to setup VR session: ' + error.message);
            await this.exitVR();
        }
    }

    setupVRControllers() {
        this.controllers = [];
        
        // Create controller models
        for (let i = 0; i < 2; i++) {
            const controller = this.gameEngine.renderer.xr.getController(i);
            this.gameEngine.scene.add(controller);
            
            // Add controller model (simple geometry for now)
            const controllerGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, -0.1)
            ]);
            const controllerMaterial = new THREE.LineBasicMaterial({ color: 0x4ecdc4 });
            const controllerModel = new THREE.Line(controllerGeometry, controllerMaterial);
            controller.add(controllerModel);
            
            this.controllers.push(controller);
        }
    }

    onVRFrame(time, frame) {
        if (!this.session || !this.isInVR) return;

        // Update VR camera
        const pose = frame.getViewerPose(this.gameEngine.renderer.xr.getReferenceSpace());
        if (pose) {
            const view = pose.views[0];
            this.gameEngine.camera.matrix.fromArray(view.transform.matrix);
            this.gameEngine.camera.matrix.decompose(
                this.gameEngine.camera.position,
                this.gameEngine.camera.quaternion,
                this.gameEngine.camera.scale
            );
        }

        // Update game systems
        this.gameEngine.sceneManager.update(0.016); // Fixed timestep for VR
        this.gameEngine.inputManager.update(0.016);
        
        // Update timer with precise timing
        const currentTime = performance.now();
        if (this.gameEngine.gameState.isGameStarted() && !this.gameEngine.gameState.isGamePaused() && !this.gameEngine.gameState.isGameWon()) {
            if (currentTime - this.gameEngine.lastTimerUpdate >= 1000) {
                this.gameEngine.gameState.updateTimer(1);
                this.gameEngine.lastTimerUpdate = currentTime;
            }
        }
        
        // Render the scene
        this.gameEngine.renderer.render(this.gameEngine.scene, this.gameEngine.camera);
        
        // Continue VR render loop
        this.session.requestAnimationFrame((time, frame) => this.onVRFrame(time, frame));
    }

    onVRSelect(event) {
        // Handle VR controller selection (clicking)
        if (this.gameEngine.inputManager) {
            // Set VR mode and handle interaction
            this.gameEngine.inputManager.setVRMode(true);
            this.gameEngine.inputManager.handleVRInteraction(event);
        }
    }

    onVRSelectStart(event) {
        // Handle VR controller selection start
        console.log('VR select start');
    }

    onVRSelectEnd(event) {
        // Handle VR controller selection end
        console.log('VR select end');
    }

    async exitVR() {
        if (!this.session || !this.isInVR) return;

        try {
            await this.session.end();
        } catch (error) {
            console.error('Error ending VR session:', error);
        }
    }

    onSessionEnd() {
        console.log('VR session ended');
        
        // Clean up VR state
        this.isInVR = false;
        this.session = null;
        
        // Reset renderer
        this.gameEngine.renderer.xr.enabled = false;
        
        // Update input manager
        if (this.gameEngine.inputManager) {
            this.gameEngine.inputManager.setVRMode(false);
        }
        
        // Update UI
        document.body.classList.remove('vr-mode');
        this.vrButton.style.display = 'block';
        this.exitVRButton.style.display = 'none';
        
        // Reset camera position
        this.gameEngine.camera.position.set(0, 1.6, 3);
        this.gameEngine.camera.lookAt(0, 1.6, 0);
        
        // Remove controller models
        this.controllers.forEach(controller => {
            this.gameEngine.scene.remove(controller);
        });
        this.controllers = [];
    }

    showVRError(message) {
        console.error('VR Error:', message);
        
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 3000;
            font-family: 'Orbitron', monospace;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        errorDiv.innerHTML = `
            <h3>VR Error</h3>
            <p>${message}</p>
            <p style="font-size: 0.8rem; margin-top: 10px;">You can still play the game in desktop mode!</p>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }

    isVRMode() {
        return this.isInVR;
    }

    getControllers() {
        return this.controllers;
    }
} 