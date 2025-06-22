export class NumberPuzzle {
    create(position, color = 0x3742fa) {
        const numberPanelGeometry = new THREE.BoxGeometry(1, 1.5, 0.1);
        const numberPanelMaterial = new THREE.MeshPhongMaterial({
            color: color,
            emissive: 0x000033,
            shininess: 50,
        });
        const numberPanel = new THREE.Mesh(numberPanelGeometry, numberPanelMaterial);
        numberPanel.position.copy(position);
        numberPanel.userData = { type: "numberPuzzle" };
        return numberPanel;
    }
} 