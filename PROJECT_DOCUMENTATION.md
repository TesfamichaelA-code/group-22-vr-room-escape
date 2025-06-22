# VR Room Escape - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Core Components](#core-components)
5. [Game Objects](#game-objects)
6. [Controls & Input](#controls--input)
7. [UI System](#ui-system)
8. [Lighting System](#lighting-system)
9. [Game States](#game-states)
10. [Setup & Installation](#setup--installation)
11. [Development Guide](#development-guide)
12. [Troubleshooting](#troubleshooting)

## 🎮 Project Overview

**VR Room Escape** is a 3D puzzle game built with Three.js where players navigate through escape rooms, solve puzzles, and find keys to progress. The game features:

- **Two interconnected rooms** with unique themes and puzzles
- **Interactive 3D objects** (doors, keys, boxes, lamps, puzzles)
- **Point-and-click navigation** with mouse controls
- **Puzzle-solving mechanics** (color sequences, number codes)
- **Progressive difficulty** from Room 1 to Room 2
- **Modern 3D graphics** with lighting and shadows

### Game Mechanics
- **Movement**: WASD keys for navigation
- **Interaction**: Click on objects to interact
- **Puzzles**: Solve color and number puzzles to unlock doors
- **Progression**: Collect keys and solve puzzles to advance

## 🏗️ Architecture

The project uses a **modular architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Main Entry    │    │  Game Engine    │    │  Scene Manager  │
│   (main.js)     │───▶│  (GameEngine)   │───▶│ (SceneManager)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Input Manager  │    │  Room Objects   │
                       │ (InputManager)  │    │ (Room1/Room2)   │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   UI Manager    │    │ Lighting Manager│
                       │  (UIManager)    │    │(LightingManager)│
                       └─────────────────┘    └─────────────────┘
```

### Key Design Principles
- **Modularity**: Each component has a single responsibility
- **Event-driven**: Components communicate through events
- **Extensible**: Easy to add new rooms, objects, and features
- **Performance**: Optimized rendering and memory management

## 📁 File Structure

```
VR Room Escape/
├── index.html                 # Main HTML file
├── README.md                  # Basic project info
├── PROJECT_DOCUMENTATION.md   # This documentation
├── src/
│   ├── js/
│   │   ├── main.js           # Application entry point
│   │   ├── core/
│   │   │   ├── GameEngine.js      # Main game controller
│   │   │   ├── GameState.js       # Game state management
│   │   │   ├── SceneManager.js    # Scene and room management
│   │   │   └── LightingManager.js # Dynamic lighting system
│   │   ├── controls/
│   │   │   └── InputManager.js    # Input handling and interactions
│   │   ├── objects/
│   │   │   ├── Room1.js           # First room implementation
│   │   │   ├── Room2.js           # Second room implementation
│   │   │   ├── Door.js            # Interactive door object
│   │   │   ├── Key.js             # Collectible key object
│   │   │   ├── Box.js             # Movable box object
│   │   │   ├── CubeLamp.js        # Decorative lamp object
│   │   │   ├── Table.js           # Furniture object
│   │   │   ├── ColorPuzzle.js     # Color sequence puzzle
│   │   │   └── NumberPuzzle.js    # Number code puzzle
│   │   └── utils/
│   │       └── UIManager.js       # User interface management
│   └── css/
│       └── styles.css             # Game styling
```

## 🔧 Core Components

### GameEngine (`src/js/core/GameEngine.js`)
**Purpose**: Central controller that orchestrates all game systems

**Key Features**:
- Initializes Three.js scene, camera, and renderer
- Manages game loop and animation
- Coordinates between all managers
- Handles window resize events

**Main Methods**:
```javascript
async init()           // Initialize the game engine
animate()              // Main render loop
pauseGame()           // Pause the game
resumeGame()          // Resume the game
```

### SceneManager (`src/js/core/SceneManager.js`)
**Purpose**: Manages 3D scenes and room transitions

**Key Features**:
- Creates and destroys rooms
- Manages scene objects and cleanup
- Handles room transitions
- Updates animated objects

**Main Methods**:
```javascript
async createRoom(roomNumber)  // Create a new room
clearScene()                  // Remove all objects
update(delta)                 // Update scene animations
```

### GameState (`src/js/core/GameState.js`)
**Purpose**: Manages game progression and player state

**Key Features**:
- Tracks puzzle completion status
- Manages inventory (keys, items)
- Handles room transitions
- Controls win conditions

**State Properties**:
```javascript
{
  hasKey: boolean,           // Player has collected the key
  colorPuzzleSolved: boolean, // Color puzzle completed
  numberPuzzleSolved: boolean, // Number puzzle completed
  currentRoom: number,       // Current room (1 or 2)
  timeLeft: number,          // Remaining time
  gameWon: boolean           // Game completion status
}
```

## 🎯 Game Objects

### Room Objects
Each room is a self-contained environment with its own:
- **Geometry**: Walls, floor, ceiling
- **Interactive Objects**: Doors, keys, puzzles, furniture
- **Decorative Elements**: Particles, lighting effects
- **Puzzle Clues**: Number hints scattered around

#### Room1 (`src/js/objects/Room1.js`)
- **Theme**: Blue/gray industrial
- **Puzzle Code**: "2847"
- **Key Location**: Visible on floor
- **Box**: Separate from key

#### Room2 (`src/js/objects/Room2.js`)
- **Theme**: Purple/teal mystical
- **Puzzle Code**: "5931"
- **Key Location**: Hidden under box
- **Box**: Covers the key

### Interactive Objects

#### Door (`src/js/objects/Door.js`)
- **Function**: Room transitions and game completion
- **Requirements**: Key + both puzzles solved
- **Animation**: Smooth opening/closing with particles

#### Key (`src/js/objects/Key.js`)
- **Function**: Required to unlock doors
- **Visual**: Golden with glow effect
- **Collection**: Removes from scene when collected

#### Box (`src/js/objects/Box.js`)
- **Function**: Hides keys or reveals secrets
- **Interaction**: Click to move
- **Animation**: Smooth sliding motion

#### CubeLamp (`src/js/objects/CubeLamp.js`)
- **Function**: Decorative lighting
- **Design**: Clean, modern table lamp
- **Components**: Base, stand, arm, shade, light source

#### Puzzles
- **ColorPuzzle**: Sequence-based color matching
- **NumberPuzzle**: 4-digit code input system

## 🎮 Controls & Input

### InputManager (`src/js/controls/InputManager.js`)
**Purpose**: Handles all user input and object interactions

**Movement Controls**:
- **W/A/S/D**: Forward/Left/Backward/Right movement
- **Mouse**: Look around (click and drag)
- **Click**: Interact with objects

**Interaction System**:
- **Raycasting**: Click detection for 3D objects
- **Object Types**: Doors, keys, boxes, puzzles, lamps
- **Feedback**: Visual and audio feedback for interactions

**Key Methods**:
```javascript
handleClick(event)           // Process mouse clicks
handleObjectInteraction(obj) // Route to specific handlers
updateMovement(delta)        // Update player movement
```

## 🖥️ UI System

### UIManager (`src/js/utils/UIManager.js`)
**Purpose**: Manages all user interface elements

**UI Components**:
- **Loading Screen**: Progress bar and status messages
- **Game Messages**: In-game notifications and hints
- **Puzzle Interfaces**: Color and number puzzle UIs
- **Transition Screens**: Room change animations
- **Win/Lose Screens**: Game completion states

**Key Features**:
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Fade in/out transitions
- **Accessibility**: Clear text and visual feedback

## 💡 Lighting System

### LightingManager (`src/js/core/LightingManager.js`)
**Purpose**: Dynamic lighting for different rooms and moods

**Light Types**:
- **Ambient Light**: Base room illumination
- **Point Lights**: Specific area lighting
- **Directional Light**: Sun-like illumination
- **Accent Lights**: Colored mood lighting

**Room-Specific Lighting**:
- **Room 1**: Cool blue/teal tones
- **Room 2**: Warm purple/pink tones
- **Dynamic Changes**: Updates when switching rooms

## 🎯 Game States

### Game Flow
1. **Loading**: Initialize Three.js and game systems
2. **Room 1**: Solve puzzles and find key
3. **Transition**: Door opens, move to Room 2
4. **Room 2**: Solve new puzzles and find key
5. **Completion**: Final door opens, game won

### Win Conditions
- **Room 1**: Collect key + solve both puzzles
- **Room 2**: Collect key + solve both puzzles
- **Final**: Open the exit door

### Puzzle Solutions
- **Room 1 Color Puzzle**: Red → Blue → Green → Yellow → Red
- **Room 1 Number Puzzle**: 2847
- **Room 2 Color Puzzle**: Different sequence
- **Room 2 Number Puzzle**: 5931

## 🚀 Setup & Installation

### Prerequisites
- Modern web browser with WebGL support
- Local web server (for development)

### Quick Start
1. **Clone/Download** the project
2. **Start a local server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Open browser** and navigate to `http://localhost:8000`
4. **Enjoy the game!**

### Development Setup
1. **Install dependencies** (if any)
2. **Use a code editor** with JavaScript support
3. **Enable browser developer tools** for debugging
4. **Use live reload** for development efficiency

## 👨‍💻 Development Guide

### Adding New Objects
1. **Create object class** in `src/js/objects/`
2. **Implement create() method**:
   ```javascript
   export class NewObject {
       create(position, options = {}) {
           const group = new THREE.Group();
           // Add geometry, materials, lights
           return group;
       }
   }
   ```
3. **Add to room** in Room1.js or Room2.js
4. **Add interaction handler** in InputManager.js

### Adding New Rooms
1. **Create room class** extending Room1/Room2 pattern
2. **Implement required methods**:
   - `createRoomStructure()`
   - `createInteractiveObjects()`
   - `addNumberClues()`
   - `createDecorativeElements()`
3. **Add to SceneManager** room creation logic
4. **Update lighting** in LightingManager

### Adding New Puzzles
1. **Create puzzle class** in `src/js/objects/`
2. **Add UI elements** in UIManager
3. **Add interaction logic** in InputManager
4. **Update GameState** for puzzle tracking

### Performance Optimization
- **Use object pooling** for frequently created objects
- **Implement LOD (Level of Detail)** for complex scenes
- **Optimize textures** and materials
- **Use efficient geometries** (BufferGeometry)
- **Minimize draw calls** by batching objects

## 🔧 Troubleshooting

### Common Issues

#### Game Won't Load
- **Check browser console** for JavaScript errors
- **Verify Three.js** is loaded correctly
- **Check file paths** and imports
- **Ensure web server** is running

#### Performance Issues
- **Reduce object count** in scenes
- **Optimize lighting** (fewer lights, lower quality shadows)
- **Check for memory leaks** in object creation/destruction
- **Use simpler geometries** for distant objects

#### Interaction Problems
- **Verify raycasting** is working correctly
- **Check object userData** for proper type assignment
- **Ensure objects** are added to interactableObjects array
- **Test click detection** with console logging

#### Visual Glitches
- **Check material settings** and transparency
- **Verify lighting** setup and shadow mapping
- **Test different browsers** for compatibility
- **Check WebGL support** and driver updates

### Debug Tools
- **Browser Developer Tools**: Console, Network, Performance
- **Three.js Inspector**: Scene graph visualization
- **Performance Monitor**: FPS and memory usage
- **Console Logging**: Custom debug messages

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (macOS)
- **Mobile**: Limited support (touch controls needed)

## 📝 Future Enhancements

### Potential Features
- **VR Support**: Oculus Quest, HTC Vive compatibility
- **Mobile Version**: Touch controls and responsive design
- **More Rooms**: Additional puzzle rooms and themes
- **Sound Effects**: Audio feedback and ambient sounds
- **Save System**: Progress persistence
- **Multiplayer**: Cooperative puzzle solving
- **Custom Puzzles**: User-generated content
- **Achievements**: Unlockable rewards and stats

### Technical Improvements
- **WebGL 2.0**: Advanced rendering features
- **Web Workers**: Background processing
- **Service Workers**: Offline support
- **Progressive Web App**: Installable game
- **WebAssembly**: Performance optimization

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Author**: VR Room Escape Development Team 