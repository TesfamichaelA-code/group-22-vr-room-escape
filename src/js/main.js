import { GameEngine } from './core/GameEngine.js';

// Global game instance
window.gameEngine = null;

// Initialize the game when page loads
window.addEventListener('load', async () => {
    try {
        // Check if THREE.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('THREE.js not loaded!');
            document.getElementById('loadingText').textContent = 'Error: THREE.js failed to load. Please refresh.';
            return;
        }

        console.log('Starting game initialization...');

        // Create and initialize game engine
        window.gameEngine = new GameEngine();
        await window.gameEngine.init();

        // Set up UI update loop - update every second for smooth timer
        setInterval(() => {
            if (window.gameEngine && window.gameEngine.uiManager) {
                const gameState = window.gameEngine.getGameState();
                window.gameEngine.uiManager.updateGameUI();
            }
        }, 1000);

        console.log('Game initialization complete!');

    } catch (error) {
        console.error('Error during game initialization:', error);
        document.getElementById('loadingText').textContent = 'Error: ' + error.message;
    }
});

// Global functions for UI interactions
window.closePuzzle = function() {
    if (window.gameEngine && window.gameEngine.uiManager) {
        window.gameEngine.uiManager.closePuzzle();
    }
};

window.closeNote = function() {
    if (window.gameEngine && window.gameEngine.uiManager) {
        window.gameEngine.uiManager.closeNote();
    }
};

window.checkNumberCode = function() {
    if (window.gameEngine && window.gameEngine.uiManager) {
        window.gameEngine.uiManager.checkNumberCode();
    }
}; 