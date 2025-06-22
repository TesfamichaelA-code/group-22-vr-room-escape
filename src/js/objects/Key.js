export class Key {
    create(position, color = 0xffd700) {
        // Create a beautiful key as a single mesh for proper raycasting
        const keyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
        const keyMaterial = new THREE.MeshPhongMaterial({
            color: color,
            emissive: new THREE.Color(color).multiplyScalar(0.3),
            shininess: 100,
        });
        const key = new THREE.Mesh(keyGeometry, keyMaterial);
        key.position.copy(position);
        key.rotation.z = Math.PI / 2;
        key.castShadow = true;
        
        // Add a beautiful glow effect
        const glowGeometry = new THREE.SphereGeometry(0.25, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(position);
        key.add(glow);
        
        // Set user data for interaction
        key.userData = { 
            type: "key",
            revealed: false // Key starts hidden
        };

        return key;
    }
} 