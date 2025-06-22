export class UIManager {
    constructor() {
        this.isInitialized = false;
        this.loadingProgress = 0;
        this.loadingSteps = [
            "Initializing Three.js...",
            "Creating virtual environment...",
            "Setting up game components...",
            "Setting up lighting system...",
            "Generating interactive objects...",
            "Configuring game systems...",
            "Finalizing experience...",
        ];
    }

    init() {
        this.startLoading();
        this.setupPuzzleEventListeners();
        this.isInitialized = true;
        console.log("UI Manager initialized");
    }

    startLoading() {
        const progressBar = document.getElementById("loadingProgress");
        const loadingText = document.getElementById("loadingText");

        const updateProgress = () => {
            if (this.loadingProgress < 100) {
                this.loadingProgress += Math.random() * 20 + 10;
                if (this.loadingProgress > 100) this.loadingProgress = 100;

                if (progressBar) {
                    progressBar.style.width = this.loadingProgress + "%";
                }

                const stepIndex = Math.floor((this.loadingProgress / 100) * this.loadingSteps.length);
                if (stepIndex < this.loadingSteps.length && loadingText) {
                    loadingText.textContent = this.loadingSteps[stepIndex];
                }

                if (this.loadingProgress >= 100) {
                    setTimeout(() => {
                        const loadingScreen = document.getElementById("loadingScreen");
                        if (loadingScreen) {
                            loadingScreen.style.opacity = "0";
                            setTimeout(() => {
                                loadingScreen.style.display = "none";
                            }, 500);
                        }
                    }, 500);
                } else {
                    setTimeout(updateProgress, 100 + Math.random() * 200);
                }
            }
        };

        updateProgress();
    }

    setupPuzzleEventListeners() {
        // Number input restrictions and auto-advance
        const ids = ["num1", "num2", "num3", "num4"];
        ids.forEach((id, idx) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener("input", (e) => {
                    // Only allow one digit
                    if (e.target.value.length > 1) {
                        e.target.value = e.target.value.slice(-1);
                    }
                    // Auto-advance to next input if a digit is entered
                    if (e.target.value.length === 1 && idx < ids.length - 1) {
                        const nextInput = document.getElementById(ids[idx + 1]);
                        if (nextInput) nextInput.focus();
                    }
                });
                // Optional: allow backspace to go to previous input
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Backspace" && !e.target.value && idx > 0) {
                        const prevInput = document.getElementById(ids[idx - 1]);
                        if (prevInput) prevInput.focus();
                    }
                });
            }
        });
    }

    updateTimer(timeString) {
        const timerElement = document.getElementById("timer");
        if (timerElement) {
            const gameState = window.gameEngine ? window.gameEngine.getGameState() : null;
            
            if (gameState && !gameState.isGameStarted()) {
                // Show initial timer state before game starts
                timerElement.textContent = "Time: 15:00";
                timerElement.style.color = "#ffffff";
                timerElement.style.animation = "none";
            } else {
                // Show actual timer during gameplay
                timerElement.textContent = `Time: ${timeString}`;
                
                if (gameState && gameState.getTimeLeft() < 300) {
                    timerElement.style.color = "#ff6b6b";
                    timerElement.style.animation = "pulse 1s infinite";
                } else {
                    timerElement.style.color = "#ffffff";
                    timerElement.style.animation = "none";
                }
            }
        }
    }

    updateObjective(objective) {
        const objectiveElement = document.getElementById("objective");
        if (objectiveElement) {
            objectiveElement.textContent = objective;
        }
    }

    updateInventory(inventory) {
        const itemsDiv = document.getElementById("items");
        if (itemsDiv) {
            itemsDiv.innerHTML = "";
            inventory.forEach((item) => {
                const itemSpan = document.createElement("span");
                itemSpan.className = "item";
                itemSpan.textContent = item;
                itemsDiv.appendChild(itemSpan);
            });
        }
    }

    showMessage(message) {
        const popup = document.getElementById("messagePopup");
        if (popup) {
            popup.textContent = message;
            popup.style.display = "block";

            setTimeout(() => {
                popup.style.display = "none";
                this.updateGameUI();
            }, 3000);
        }
    }

    showColorPuzzle() {
        const puzzle = document.getElementById("colorPuzzle");
        if (puzzle) {
            puzzle.style.display = "block";
            this.generateRandomColorSequence();
            this.showColorSequence();
        }
    }

    generateRandomColorSequence() {
        const colors = ["red", "blue", "green", "yellow"];
        const sequenceLength = 5;
        const randomSequence = [];
        
        for (let i = 0; i < sequenceLength; i++) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            randomSequence.push(randomColor);
        }
        
        if (window.gameEngine && window.gameEngine.getGameState()) {
            window.gameEngine.getGameState().currentColorSequence = randomSequence;
            window.gameEngine.getGameState().playerSequence = [];
        }
    }

    showNumberPuzzle() {
        const puzzle = document.getElementById("numberPuzzle");
        if (puzzle) {
            puzzle.style.display = "block";
            ["num1", "num2", "num3", "num4"].forEach((id) => {
                const input = document.getElementById(id);
                if (input) input.value = "";
            });
        }
    }

    showColorSequence() {
        const display = document.getElementById("sequenceDisplay");
        if (!display) return;

        display.innerHTML = "";
        
        const gameState = window.gameEngine ? window.gameEngine.getGameState() : null;
        const colorSequence = gameState ? gameState.currentColorSequence : ["red", "blue", "green", "yellow", "red"];

        colorSequence.forEach((color, index) => {
            setTimeout(() => {
                display.innerHTML = "";
                
                const colorDiv = document.createElement("div");
                colorDiv.className = "sequence-item";
                colorDiv.style.backgroundColor = color;
                colorDiv.style.transform = "scale(1.2)";
                display.appendChild(colorDiv);

                setTimeout(() => {
                    if (colorDiv.parentNode) {
                        colorDiv.parentNode.removeChild(colorDiv);
                    }
                }, 1000);
            }, index * 1200);
        });

        setTimeout(() => {
            document.querySelectorAll(".color-btn").forEach((btn) => {
                btn.onclick = () => this.handleColorInput(btn.dataset.color);
            });
        }, colorSequence.length * 1200 + 500);
    }

    handleColorInput(color) {
        const gameState = window.gameEngine ? window.gameEngine.getGameState() : null;
        if (!gameState) return;

        const colorSequence = gameState.currentColorSequence || ["red", "blue", "green", "yellow", "red"];
        const playerSequence = gameState.playerSequence || [];
        playerSequence.push(color);

        // Visual feedback
        const buttons = document.querySelectorAll(".color-btn");
        buttons.forEach((btn) => {
            if (btn.dataset.color === color) {
                btn.style.transform = "scale(0.9)";
                setTimeout(() => {
                    btn.style.transform = "scale(1)";
                }, 150);
            }
        });

        if (playerSequence.length === colorSequence.length) {
            if (JSON.stringify(playerSequence) === JSON.stringify(colorSequence)) {
                gameState.solveColorPuzzle();
                this.showMessage("🎨 Color Sequence Solved! Excellent memory!");
                this.closePuzzle();
                this.updateGameUI();
            } else {
                this.showMessage("❌ Wrong sequence! Watch carefully and try again.");
                gameState.playerSequence = [];
                setTimeout(() => {
                    this.showColorSequence();
                }, 2000);
            }
        }
    }

    checkNumberCode() {
        const gameState = window.gameEngine ? window.gameEngine.getGameState() : null;
        if (!gameState) return;

        const num1 = document.getElementById("num1")?.value || "";
        const num2 = document.getElementById("num2")?.value || "";
        const num3 = document.getElementById("num3")?.value || "";
        const num4 = document.getElementById("num4")?.value || "";

        const enteredCode = num1 + num2 + num3 + num4;

        if (enteredCode.length !== 4) {
            this.showMessage("⚠️ Please enter all 4 digits!");
            return;
        }

        const correctCode = gameState.getCurrentRoom() === 1 ? "2847" : "5931";

        if (enteredCode === correctCode) {
            gameState.solveNumberPuzzle();
            this.showMessage(`🔢 Digital Lock Cracked! Well done, detective!`);
            this.closePuzzle();
            this.updateGameUI();
        } else {
            this.showMessage("❌ Incorrect code! Look for colored number clues around the room.");
            ["num1", "num2", "num3", "num4"].forEach((id) => {
                const input = document.getElementById(id);
                if (input) input.value = "";
            });
        }
    }

    closePuzzle() {
        const colorPuzzle = document.getElementById("colorPuzzle");
        const numberPuzzle = document.getElementById("numberPuzzle");
        
        if (colorPuzzle) colorPuzzle.style.display = "none";
        if (numberPuzzle) numberPuzzle.style.display = "none";
    }

    closeNote() {
        const notePanel = document.getElementById("notePanel");
        if (notePanel) {
            notePanel.style.display = "none";
        }
    }

    showWinMessage() {
        const gameState = window.gameEngine ? window.gameEngine.getGameState() : null;
        if (!gameState) return;

        const finalTime = 900 - gameState.getTimeLeft();
        const minutes = Math.floor(finalTime / 60);
        const seconds = Math.floor(finalTime % 60);

        const finalTimeElement = document.getElementById("finalTime");
        if (finalTimeElement) {
            finalTimeElement.textContent = `🕐 Total Escape Time: ${minutes}:${seconds.toString().padStart(2, "0")}`;
        }

        const winMessage = document.getElementById("winMessage");
        if (winMessage) {
            if (!winMessage.querySelector('.restart-btn')) {
                const restartBtn = document.createElement('button');
                restartBtn.className = 'restart-btn';
                restartBtn.textContent = 'Play Again';
                restartBtn.onclick = () => location.reload();
                winMessage.appendChild(restartBtn);
            }
            winMessage.style.display = "block";
        }

        this.celebrateWin();
    }

    showGameOverMessage() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'gameOverMessage';
        gameOverDiv.innerHTML = `
            <div class="game-over-content">
                <h2>⏰ Time's Up!</h2>
                <p>You ran out of time and couldn't escape the room.</p>
                <p>Better luck next time, detective!</p>
                <button class="restart-btn" onclick="location.reload()">Try Again</button>
            </div>
        `;
        document.body.appendChild(gameOverDiv);
    }

    showTransitionScreen(message, callback) {
        // Create simple fade overlay
        const fadeDiv = document.createElement('div');
        fadeDiv.className = 'transition-overlay';
        fadeDiv.style.opacity = '0';
        document.body.appendChild(fadeDiv);
        
        // Create message div
        const messageDiv = document.createElement('div');
        messageDiv.className = 'transition-loading';
        messageDiv.textContent = message;
        messageDiv.style.opacity = '0';
        document.body.appendChild(messageDiv);
        
        // Fade in
        setTimeout(() => {
            fadeDiv.style.opacity = '1';
            messageDiv.style.opacity = '1';
            
            // Execute callback after short delay
            setTimeout(() => {
                if (callback) callback();
                
                // Fade out
                setTimeout(() => {
                    fadeDiv.style.opacity = '0';
                    messageDiv.style.opacity = '0';
                    
                    // Clean up
                    setTimeout(() => {
                        if (document.body.contains(fadeDiv)) {
                            document.body.removeChild(fadeDiv);
                        }
                        if (document.body.contains(messageDiv)) {
                            document.body.removeChild(messageDiv);
                        }
                    }, 300);
                }, 500);
            }, 1000);
        }, 100);
    }

    showPauseMenu() {
        // Remove existing pause menu if it exists
        const existingPauseMenu = document.getElementById('pauseMenu');
        if (existingPauseMenu) {
            existingPauseMenu.remove();
        }

        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pauseMenu';
        pauseMenu.innerHTML = `
            <div class="pause-content">
                <h2>Game Paused</h2>
                <button onclick="window.gameEngine.resumeGame()">Resume</button>
                <button onclick="location.reload()">Restart</button>
            </div>
        `;
        document.body.appendChild(pauseMenu);
    }

    closePauseMenu() {
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) {
            pauseMenu.remove();
        }
    }

    updateGameUI() {
        const gameState = window.gameEngine ? window.gameEngine.getGameState() : null;
        if (!gameState) return;

        this.updateTimer(gameState.getTimeString());
        this.updateObjective(gameState.getObjective());
        this.updateInventory(gameState.getInventory());
    }

    celebrateWin() {
        if (!window.gameEngine) return;

        const scene = window.gameEngine.getScene();
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const positions = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 10;
            positions[i3 + 1] = Math.random() * 10;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: new THREE.Color(0xffffff),
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        const animateParticles = () => {
            particles.rotation.y += 0.01;
            requestAnimationFrame(animateParticles);
        };

        animateParticles();
    }
}