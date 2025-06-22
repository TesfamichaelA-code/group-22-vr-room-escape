export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.hasKey = false;
        this.colorPuzzleSolved = false;
        this.numberPuzzleSolved = false;
        this.timeLeft = 900; // 15 minutes in seconds
        this.gameWon = false;
        this.inventory = [];
        this.currentRoom = 1;
        this.room2Initialized = false;
        this.transitionInProgress = false;
        this.gamePaused = false;
        this.currentColorSequence = null;
        this.playerSequence = [];
        this.gameStarted = false; // Track if game has actually started
    }

    startGame() {
        this.gameStarted = true;
        this.timeLeft = 900; // Reset to 15 minutes when game starts
    }

    update(delta) {
        // This method is now only used for non-timer updates
        // Timer updates are handled separately with precise timing
    }

    updateTimer(seconds) {
        // Only count down timer if game has started and is not paused/won
        if (this.gameStarted && !this.gamePaused && !this.gameWon && this.timeLeft > 0) {
            this.timeLeft -= seconds;
            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.gameOver();
            }
        }
    }

    addToInventory(item) {
        if (!this.inventory.includes(item)) {
            this.inventory.push(item);
            return true;
        }
        return false;
    }

    removeFromInventory(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    }

    hasItem(item) {
        return this.inventory.includes(item);
    }

    solveColorPuzzle() {
        this.colorPuzzleSolved = true;
        return this.checkAllPuzzlesSolved();
    }

    solveNumberPuzzle() {
        this.numberPuzzleSolved = true;
        return this.checkAllPuzzlesSolved();
    }

    collectKey() {
        this.hasKey = true;
        this.addToInventory("Golden Key");
        return this.checkAllPuzzlesSolved();
    }

    checkAllPuzzlesSolved() {
        return this.hasKey && this.colorPuzzleSolved && this.numberPuzzleSolved;
    }

    canOpenDoor() {
        return this.checkAllPuzzlesSolved();
    }

    transitionToRoom(roomNumber) {
        if (this.transitionInProgress) return false;
        
        this.transitionInProgress = true;
        this.currentRoom = roomNumber;
        
        // Reset room-specific state for new room
        this.hasKey = false;
        this.colorPuzzleSolved = false;
        this.numberPuzzleSolved = false;
        this.inventory = [];
        this.currentColorSequence = null;
        this.playerSequence = [];
        
        return true;
    }

    completeTransition() {
        this.transitionInProgress = false;
    }

    winGame() {
        this.gameWon = true;
        this.gamePaused = true;
    }

    gameOver() {
        this.gamePaused = true;
        if (window.gameEngine && window.gameEngine.uiManager) {
            window.gameEngine.uiManager.showGameOverMessage();
        }
    }

    pauseGame() {
        this.gamePaused = true;
    }

    resumeGame() {
        this.gamePaused = false;
    }

    getTimeString() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = Math.floor(this.timeLeft % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    getTimeLeft() {
        return this.timeLeft;
    }

    getCurrentRoom() {
        return this.currentRoom;
    }

    isGameWon() {
        return this.gameWon;
    }

    isGamePaused() {
        return this.gamePaused;
    }

    isTransitioning() {
        return this.transitionInProgress;
    }

    isGameStarted() {
        return this.gameStarted;
    }

    getInventory() {
        return [...this.inventory];
    }

    getObjective() {
        if (this.gameWon) {
            return "🎉 Congratulations! You've escaped!";
        }

        if (this.checkAllPuzzlesSolved()) {
            return `🚪 Room ${this.currentRoom}: All puzzles solved! Use the key to open the door!`;
        }

        const solved = [];
        if (this.colorPuzzleSolved) solved.push("🎨 Color");
        if (this.numberPuzzleSolved) solved.push("🔢 Number");
        
        if (this.hasKey) {
            if (solved.length > 0) {
                return `🗝️ Room ${this.currentRoom}: You have the key! Solve: ${solved.join(", ")}`;
            } else {
                return `🗝️ Room ${this.currentRoom}: You have the key! Solve the remaining puzzles.`;
            }
        } else {
            if (solved.length > 0) {
                return `✅ Room ${this.currentRoom} - Solved: ${solved.join(", ")} | Still need: 🗝️ Key`;
            } else {
                return `🎯 Room ${this.currentRoom}: Find the key and solve puzzles to escape!`;
            }
        }
    }
} 