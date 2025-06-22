export class ColorPuzzle {
    create(position, color = 0xff4757) {
        const colorPanelGeometry = new THREE.BoxGeometry(1.5, 1, 0.1);
        const colorPanelMaterial = new THREE.MeshPhongMaterial({
            color: color,
            emissive: 0x330000,
            shininess: 50,
        });
        const colorPanel = new THREE.Mesh(colorPanelGeometry, colorPanelMaterial);
        colorPanel.position.copy(position);
        colorPanel.userData = { type: "colorPuzzle" };
        return colorPanel;
    }
} 