export class Table {
    create(position, color = 0x8b4513) {
        const tableGroup = new THREE.Group();
        tableGroup.position.copy(position);
        
        // Table top
        const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const tableMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 30,
        });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.castShadow = true;
        tableGroup.add(table);

        // Table legs
        for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
            const leg = new THREE.Mesh(legGeometry, tableMaterial);
            const x = i < 2 ? -0.8 : 0.8;
            const z = i % 2 === 0 ? -0.4 : 0.4;
            leg.position.set(x, -0.45, z);
            leg.castShadow = true;
            tableGroup.add(leg);
        }
        
        return tableGroup;
    }
} 