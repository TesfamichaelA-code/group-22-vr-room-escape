export class TableLamp {
    create(position, surfaceHeight = 0) {
        const lampGroup = new THREE.Group();
        lampGroup.position.copy(position);
        
        // Simple, elegant base
        const baseGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.02);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x2c3e50,
            shininess: 60,
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, surfaceHeight + 0.01, 0);
        base.castShadow = true;
        lampGroup.add(base);

        // Clean, straight stand
        const standGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5);
        const standMaterial = new THREE.MeshPhongMaterial({
            color: 0x34495e,
            shininess: 40,
        });
        const stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.set(0, surfaceHeight + 0.27, 0);
        stand.castShadow = true;
        lampGroup.add(stand);

        // Simple curved arm pointing downward - properly connected to stand
        const armGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.25);
        const armMaterial = new THREE.MeshPhongMaterial({
            color: 0x34495e,
            shininess: 40,
        });
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        // Position at the top of the stand (surfaceHeight + 0.27 + 0.25 = 0.52)
        arm.position.set(0.125, surfaceHeight + 0.52, 0);
        arm.rotation.z = -Math.PI / 4; // 45 degrees downward
        arm.castShadow = true;
        lampGroup.add(arm);

        // Clean, modern shade - positioned at the end of the arm
        const shadeGeometry = new THREE.ConeGeometry(0.1, 0.2, 8);
        const shadeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x221100,
            transparent: true,
            opacity: 0.9,
        });
        const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
        // Position at the end of the arm (0.125 + 0.25*cos(45°) ≈ 0.3)
        shade.position.set(0.3, surfaceHeight + 0.42, 0);
        shade.rotation.z = Math.PI / 4; // Tilt to match arm
        shade.castShadow = true;
        shade.userData = { type: "lamp" };
        lampGroup.add(shade);

        // Warm, cozy light - positioned inside the shade
        const light = new THREE.PointLight(0xfff0d0, 0.7, 3);
        light.position.set(0.3, surfaceHeight + 0.42, 0);
        lampGroup.add(light);
        
        lampGroup.userData = { 
            type: "lamp",
            interactablePart: shade 
        };
        
        return lampGroup;
    }
} 