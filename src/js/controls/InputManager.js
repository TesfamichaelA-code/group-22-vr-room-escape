export class InputManager {
    constructor() {
        this.camera = null;
        this.sceneManager = null;
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;
        this.yaw = 0;
        this.pitch = 0;
        this.moveSpeed = 0.08;
        this.mouseSensitivity = 0.002;
        this.isPointerLocked = false;
        this.isVRMode = false;
    }

    init(camera, sceneManager) {
        this.camera = camera;
        this.sceneManager = sceneManager;
        this.setupEventListeners();
        console.log("Input Manager initialized");
    }

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });

        // Mouse events
        document.addEventListener('mousemove', (event) => {
            if (this.isMouseDown) {
                const deltaX = event.clientX - this.mouseX;
                const deltaY = event.clientY - this.mouseY;

                this.yaw -= deltaX * this.mouseSensitivity;
                this.pitch -= deltaY * this.mouseSensitivity;

                // Clamp pitch
                this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));

                this.camera.rotation.order = "YXZ";
                this.camera.rotation.y = this.yaw;
                this.camera.rotation.x = this.pitch;
            }
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        document.addEventListener('mousedown', (event) => {
            this.isMouseDown = true;
        });

        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        // Object interaction
        document.addEventListener('click', (event) => {
            this.handleClick(event);
        });

        // Pointer lock
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement !== null;
        });
    }

    update(delta) {
        this.updateMovement(delta);
    }

    updateMovement(delta) {
        const moveVector = new THREE.Vector3();
        
        // WASD input
        if (this.keys['KeyW']) moveVector.z -= 1;
        if (this.keys['KeyS']) moveVector.z += 1;
        if (this.keys['KeyA']) moveVector.x -= 1;
        if (this.keys['KeyD']) moveVector.x += 1;
        
        if (moveVector.length() > 0) {
            moveVector.normalize();
            
            // Camera-relative movement (fixed)
            const forward = new THREE.Vector3(
                Math.sin(this.yaw),
                0,
                Math.cos(this.yaw)
            );
            const right = new THREE.Vector3(
                Math.cos(this.yaw),
                0,
                -Math.sin(this.yaw)
            );
            
            const moveDirection = new THREE.Vector3();
            moveDirection.add(forward.multiplyScalar(moveVector.z)); // FIX: remove negative sign
            moveDirection.add(right.multiplyScalar(moveVector.x));   // right vector is correct
            moveDirection.normalize();
            
            const actualMoveSpeed = this.moveSpeed * delta * 60;
            this.camera.position.add(moveDirection.multiplyScalar(actualMoveSpeed));
        }

        // Room boundaries
        this.camera.position.x = Math.max(-4.5, Math.min(4.5, this.camera.position.x));
        this.camera.position.z = Math.max(-4.5, Math.min(4.5, this.camera.position.z));
        this.camera.position.y = Math.max(0.5, Math.min(4, this.camera.position.y));
    }

    handleClick(event) {
        if (!this.sceneManager) return;

        // Start the game timer on first interaction
        const gameState = window.gameEngine ? window.gameEngine.getGameState() : null;
        if (gameState && !gameState.isGameStarted()) {
            gameState.startGame();
        }

        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const interactableObjects = this.sceneManager.getInteractableObjects();
        const intersects = raycaster.intersectObjects(interactableObjects);

        if (intersects.length > 0) {
            this.handleObjectInteraction(intersects[0].object);
        }
    }

    handleObjectInteraction(object) {
        const userData = object.userData;

        switch (userData.type) {
            case "door":
                this.handleDoorInteraction(object);
                break;

            case "key":
                this.handleKeyInteraction(object);
                break;

            case "box":
                this.handleBoxInteraction(object);
                break;

            case "colorPuzzle":
                this.handleColorPuzzleInteraction(object);
                break;

            case "numberPuzzle":
                this.handleNumberPuzzleInteraction(object);
                break;

            case "lamp":
                this.handleLampInteraction(object);
                break;
        }
    }

    handleDoorInteraction(door) {
        if (door.userData.opening || window.gameEngine.getGameState().isTransitioning()) return;
        
        if (door.userData.open) {
            this.closeDoor(door);
        } else {
            if (window.gameEngine.getGameState().canOpenDoor()) {
                this.openDoor(door);
            } else {
                this.showLockedDoorMessage(door);
            }
        }
    }

    handleKeyInteraction(key) {
        const gameState = window.gameEngine.getGameState();
        if (!gameState.hasKey) {
            gameState.collectKey();
            
            // Remove key from scene
            if (key.parent) key.parent.remove(key);
            
            const interactableObjects = window.gameEngine.sceneManager.getInteractableObjects();
            const keyIndex = interactableObjects.indexOf(key);
            if (keyIndex > -1) {
                interactableObjects.splice(keyIndex, 1);
            }
            
            window.gameEngine.uiManager.showMessage("✨ You found the Golden Key! ✨");
        }
    }

    handleBoxInteraction(box) {
        if (box.userData.moveable) {
            const targetX = box.position.x + 1.5;
            this.animateObject(box, { x: targetX }, 1000);
            box.userData.moveable = false;
            window.gameEngine.uiManager.showMessage("📦 Box moved! The key is now visible!");
            
            // Reveal hidden key
            const scene = window.gameEngine.sceneManager.getScene();
            scene.traverse((object) => {
                if (object.userData && object.userData.type === "key" && !object.userData.revealed) {
                    object.userData.revealed = true;
                    window.gameEngine.uiManager.showMessage("✨ The key is now accessible!");
                }
            });
        }
    }

    handleColorPuzzleInteraction(puzzle) {
        const gameState = window.gameEngine.getGameState();
        if (!gameState.colorPuzzleSolved) {
            window.gameEngine.uiManager.showColorPuzzle();
        } else {
            window.gameEngine.uiManager.showMessage("🎨 Color puzzle already solved!");
        }
    }

    handleNumberPuzzleInteraction(puzzle) {
        const gameState = window.gameEngine.getGameState();
        if (!gameState.numberPuzzleSolved) {
            window.gameEngine.uiManager.showNumberPuzzle();
        } else {
            window.gameEngine.uiManager.showMessage("🔢 Number puzzle already solved!");
        }
    }

    handleLampInteraction(lamp) {
        window.gameEngine.uiManager.showMessage("💡 A clean, modern table lamp with a simple curved arm and downward-pointing shade. It provides warm, ambient lighting to the room.");
    }

    openDoor(door) {
        if (door.userData.open || door.userData.opening) return;
        
        door.userData.opening = true;
        
        this.createDoorParticles(door);
        
        // Door animation
        const targetRotation = Math.PI / 2;
        const startRotation = 0;
        const duration = 1500; // Faster animation
        const startTime = Date.now();
        
        const animateDoor = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeOutCubic(progress);
            
            door.rotation.y = startRotation + (targetRotation - startRotation) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animateDoor);
            } else {
                door.userData.open = true;
                door.userData.opening = false;
                
                // Room transition
                const gameState = window.gameEngine.getGameState();
                if (gameState.getCurrentRoom() === 1) {
                    this.transitionToRoom2();
                } else {
                    window.gameEngine.getGameState().winGame();
                    window.gameEngine.uiManager.showWinMessage();
                }
            }
        };
        
        animateDoor();
    }

    closeDoor(door) {
        if (!door.userData.open || door.userData.opening) return;
        
        door.userData.opening = true;
        
        const targetRotation = 0;
        const startRotation = Math.PI / 2;
        const duration = 2000;
        const startTime = Date.now();
        
        const animateDoor = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeOutCubic(progress);
            
            door.rotation.y = startRotation + (targetRotation - startRotation) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animateDoor);
            } else {
                door.userData.open = false;
                door.userData.opening = false;
            }
        };
        
        animateDoor();
    }

    showLockedDoorMessage(door) {
        const gameState = window.gameEngine.getGameState();
        let message = "The door is locked! You need: ";
        const requirements = [];
        if (!gameState.hasKey) requirements.push("🗝️ Golden Key");
        if (!gameState.colorPuzzleSolved) requirements.push("🎨 Color Puzzle");
        if (!gameState.numberPuzzleSolved) requirements.push("🔢 Number Lock");
        message += requirements.join(", ");
        window.gameEngine.uiManager.showMessage(message);
        
        // Door shake
        door.position.x += 0.05;
        setTimeout(() => {
            door.position.x -= 0.1;
            setTimeout(() => {
                door.position.x += 0.05;
            }, 100);
        }, 100);
    }

    createDoorParticles(door) {
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2;
            positions[i3 + 1] = Math.random() * 4;
            positions[i3 + 2] = 0;
            sizes[i] = Math.random() * 0.1 + 0.05;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleSystem.position.copy(door.position);
        window.gameEngine.sceneManager.getScene().add(particleSystem);
        
        // Fade out particles
        let opacity = 0.8;
        const animateParticles = () => {
            opacity -= 0.02;
            particleMaterial.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticles);
            } else {
                window.gameEngine.sceneManager.getScene().remove(particleSystem);
            }
        };
        
        animateParticles();
    }

    transitionToRoom2() {
        const gameState = window.gameEngine.getGameState();
        if (gameState.isTransitioning()) return;
        
        // Start transition
        gameState.transitionToRoom(2);
        
        // Reset camera position and orientation for new room
        if (this.camera) {
            this.camera.position.set(0, 1.6, 3);
            this.camera.rotation.set(0, 0, 0);
            this.yaw = 0; // FIX: Reset yaw
            this.pitch = 0; // FIX: Reset pitch
        }
        
        // Show simple transition screen
        window.gameEngine.uiManager.showTransitionScreen("Entering Room 2...", () => {
            // Create the new room
            window.gameEngine.sceneManager.createRoom(2);
            
            // Complete transition
            gameState.completeTransition();
            
            // Show welcome message
            window.gameEngine.uiManager.showMessage("🌟 Welcome to Room 2! New challenges await...");
        });
    }

    animateObject(object, targetPosition, duration) {
        const startPosition = { ...object.position };
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeOutCubic(progress);

            Object.keys(targetPosition).forEach((axis) => {
                object.position[axis] = startPosition[axis] + 
                    (targetPosition[axis] - startPosition[axis]) * easeProgress;
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    setMoveSpeed(speed) {
        this.moveSpeed = speed;
    }

    setMouseSensitivity(sensitivity) {
        this.mouseSensitivity = sensitivity;
    }

    setVRMode(enabled) {
        this.isVRMode = enabled;
        console.log(`VR mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    handleVRInteraction(event) {
        if (!this.sceneManager || !this.isVRMode) return;

        // Start the game timer on first interaction
        const gameState = window.gameEngine ? window.gameEngine.getGameState() : null;
        if (gameState && !gameState.isGameStarted()) {
            gameState.startGame();
        }

        // Get controller position and orientation
        const controller = event.frame.getPose(event.inputSource.gripSpace, this.camera.parent.matrixWorldInverse);
        if (!controller) return;

        // Create raycaster from controller
        const raycaster = new THREE.Raycaster();
        const controllerMatrix = new THREE.Matrix4().fromArray(controller.transform.matrix);
        const controllerPosition = new THREE.Vector3();
        const controllerDirection = new THREE.Vector3(0, 0, -1);
        
        controllerPosition.setFromMatrixPosition(controllerMatrix);
        controllerDirection.applyMatrix4(controllerMatrix);
        
        raycaster.set(controllerPosition, controllerDirection);

        const interactableObjects = this.sceneManager.getInteractableObjects();
        const intersects = raycaster.intersectObjects(interactableObjects);

        if (intersects.length > 0) {
            this.handleObjectInteraction(intersects[0].object);
        }
    }
}