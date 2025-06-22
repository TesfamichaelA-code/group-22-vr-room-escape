# 🚪 VR Room Escape

A fully interactive 3D room escape game built with Three.js and WebXR, featuring multiple rooms, puzzles, and immersive VR gameplay.

## 🎮 About

You find yourself trapped in a mysterious room with only 15 minutes to escape. Solve puzzles, find hidden objects, and unlock the door before time runs out! The game features two unique rooms with different challenges and visual themes. Experience the game in both desktop and VR modes for the ultimate escape room adventure.

## ✨ Features

- **WebXR VR Support**: Full VR immersion with controller interactions
- **Two Unique Rooms**: Different themes, puzzles, and visual styles
- **Interactive Objects**: Click to interact with doors, keys, puzzles, and decorative elements
- **Puzzle System**: Color sequence memory and number code puzzles
- **Timer System**: 15-minute countdown timer with visual feedback
- **Inventory System**: Track collected items and progress
- **Responsive Controls**: WASD movement, mouse look, and click interactions
- **VR Controls**: Controller-based movement and interaction
- **Visual Effects**: Particle effects, smooth animations, and atmospheric lighting
- **Cross-Platform**: Works on desktop browsers and VR headsets

## 🏗️ Project Structure

```
VR Room Escape/
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
├── PROJECT_DOCUMENTATION.md   # Comprehensive documentation
├── src/
│   ├── css/
│   │   └── styles.css         # All game styling including VR
│   └── js/
│       ├── main.js            # Main game entry point
│       ├── core/
│       │   ├── GameEngine.js  # Main game engine
│       │   ├── GameState.js   # Game state management
│       │   ├── SceneManager.js # Scene and room management
│       │   ├── LightingManager.js # Lighting system
│       │   └── WebXRManager.js # WebXR VR support
│       ├── controls/
│       │   └── InputManager.js # Input handling and movement
│       ├── objects/
│       │   ├── Room1.js       # First room implementation
│       │   ├── Room2.js       # Second room implementation
│       │   ├── Door.js        # Door object class
│       │   ├── Key.js         # Key object class
│       │   ├── Box.js         # Movable box class
│       │   ├── ColorPuzzle.js # Color puzzle panel
│       │   ├── NumberPuzzle.js # Number puzzle panel
│       │   ├── CubeLamp.js    # Decorative lamp
│       │   └── Table.js       # Decorative table
│       └── utils/
│           └── UIManager.js   # User interface management
```

## 🎯 Requirements Fulfillment

### Technical Requirements ✅

1. **Minimum 5 Unique 3D Objects** ✅
   - Door with frame and handle
   - Golden key with glow effect
   - Movable box
   - Cube lamp with lighting
   - Table with legs
   - Color puzzle panel
   - Number puzzle panel
   - Floor patterns and decorative elements

2. **Camera Controls** ✅
   - Custom mouse look controls
   - WASD movement with proper forward/backward mapping
   - Smooth camera rotation and movement
   - Boundary constraints
   - VR controller-based movement

3. **Lighting System** ✅
   - Ambient lighting for base illumination
   - Point lights for main room lighting
   - Accent lights for atmosphere
   - Directional lights for depth
   - Different lighting schemes per room

4. **User Interaction** ✅
   - Click interactions with raycasting
   - Hover effects on interactive objects
   - Keyboard controls (WASD, Escape)
   - Puzzle interface interactions
   - VR controller interactions

5. **Texture Mapping** ✅
   - Canvas-generated textures for number clues
   - Procedural materials with emissive properties
   - Gradient materials and transparency effects

6. **Animation** ✅
   - Door opening/closing animations
   - Box movement animations
   - Floating particle animations
   - UI transitions and effects
   - Celebration particle systems

### Tools and Features ✅

1. **OrbitControls and PointerLockControls** ✅
   - Custom implementation with mouse look
   - Pointer lock support for immersive experience
   - WebXR VR controls integration

2. **Raycasting** ✅
   - Object selection and interaction
   - Click detection for puzzles and items
   - VR controller raycasting

3. **Lighting Models** ✅
   - Ambient, directional, and point lights
   - Room-specific lighting configurations

4. **Textures and Materials** ✅
   - Procedural texture generation
   - Normal maps and emissive materials
   - Transparency and blending effects

5. **Post-processing Effects** ✅
   - Tone mapping (ACES Filmic)
   - Shadow mapping with PCF soft shadows
   - Anti-aliasing and high-performance rendering

6. **WebXR Support** ✅
   - VR session management
   - Controller input handling
   - VR-specific UI and interactions

## 🚀 How to Run

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "VR Room Escape"
   ```

2. **Open in a web server**:
   - Due to ES6 modules, you need to serve the files from a web server
   - Use any local server like:
     - Python: `python -m http.server 8000`
     - Node.js: `npx serve .`
     - VS Code: Live Server extension
     - Or deploy to GitHub Pages

3. **Open in browser**:
   - Navigate to `http://localhost:8000` (or your server URL)
   - The game will load automatically
   - Click "Enter VR" to experience in virtual reality

## 🎮 Controls

### Desktop Controls
- **W**: Move forward
- **S**: Move backward  
- **A**: Move left
- **D**: Move right
- **Mouse**: Look around (click and drag)
- **Click**: Interact with objects
- **Escape**: Pause game

### VR Controls
- **VR Controllers**: Move and look around
- **Controller Trigger**: Interact with objects
- **VR Menu Button**: Exit VR mode

## 🧩 Game Mechanics

### Room 1
- **Color Puzzle**: Remember and repeat the sequence: Red → Blue → Green → Yellow → Red
- **Number Puzzle**: Enter code "2847" (found in colored number clues around the room)
- **Key Location**: Behind the movable box on the left side

### Room 2
- **Color Puzzle**: Same sequence but different visual theme
- **Number Puzzle**: Enter code "5931" (different colored clues)
- **Key Location**: Behind the movable box on the right side

## 🛠️ Development

### Adding New Features
1. **New Objects**: Create classes in `src/js/objects/`
2. **New UI Elements**: Modify `src/js/utils/UIManager.js`
3. **New Game Logic**: Update `src/js/core/GameState.js`
4. **VR Features**: Extend `src/js/core/WebXRManager.js`

### Code Style
- ES6+ JavaScript with modules
- Three.js for 3D graphics
- WebXR for VR support
- Responsive CSS with modern design

## 📝 Future Enhancements

- [x] VR support with WebXR ✅
- [ ] Additional rooms and puzzles
- [ ] Save/load game state
- [ ] Multiplayer support
- [ ] Advanced shaders and effects
- [ ] Mobile touch controls
- [ ] Accessibility features
- [ ] VR haptic feedback
- [ ] Room-scale VR support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy escaping in VR! 🚪✨** 

## 🛠️ Dependencies

- **Three.js**: 3D graphics and rendering
- **PointerLockControls**: Mouse look controls 