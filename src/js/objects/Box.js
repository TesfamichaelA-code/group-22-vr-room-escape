export class Box {
    create(position, color = 0x8b4513) {
        const boxGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 20,
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.copy(position);
        box.castShadow = true;
        box.userData = { type: "box", moveable: true };
        return box;
    }
} 