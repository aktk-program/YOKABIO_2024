document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("canvas-container");
  const slider = document.getElementById("slider");
  let progress = 0.2;

  // Cresling rotation calculation function
  const calculateRotationAngle = (height, sideLength) => {
    const ratio1 = (height * height) / (2 * sideLength * sideLength) + 0.5;
    const ratio2 = 0.5 - (height * height) / (2 * sideLength * sideLength);
    const clampedRatio1 = Math.min(Math.max(ratio1, -1), 1);
    const clampedRatio2 = Math.min(Math.max(ratio2, -1), 1);
    return (-Math.acos(clampedRatio1) + Math.acos(clampedRatio2)) / 2;
  };

  // THREE.js Scene Setup
  const scene = new THREE.Scene();

  // OrthographicCamera setup
  const frustumSize = 3;
  const aspect = container.clientWidth / 400;
  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000
  );
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, 400);
  renderer.setClearColor(0xffffff);
  container.appendChild(renderer.domElement);

  // Handle window resize
  window.addEventListener("resize", () => {
    const aspect = container.clientWidth / 400;
    camera.left = (frustumSize * aspect) / -2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, 400);
  });

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(0, 1, 1);
  scene.add(directionalLight);

  // Orbit Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.maxZoom = 10.0;
  controls.minZoom = 1.0;

  // Hexagon Group
  const hexagonGroup = new THREE.Group();
  scene.add(hexagonGroup);

  function createHexagonVertices(radius = 1, rotationAngle = 0) {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + rotationAngle;
      vertices.push(
        new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle))
      );
    }
    return vertices;
  }

  function updateHexagon() {
    hexagonGroup.clear();

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const hexMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const faceMaterial = new THREE.MeshBasicMaterial({
      color: 0x4287f5,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    const t = progress;
    const maxHeight = 0.75;
    const currentHeight = maxHeight * (1 - t);
    const sideLength = 1; // 六角形の半径が1なので、辺の長さはおよそ1

    const heights = [0, currentHeight];
    // 新しい回転角度の計算方法を使用
    const rotations = [0, calculateRotationAngle(currentHeight, sideLength)];

    const allVertices = heights.map((height, i) => {
      const vertices = createHexagonVertices(1, rotations[i]);
      return vertices.map((v) => {
        const vertex = v.clone();
        vertex.y = height;
        return vertex;
      });
    });

    allVertices.forEach((vertices, i) => {
      const geometry = new THREE.BufferGeometry();
      const points = [...vertices, vertices[0]];
      geometry.setFromPoints(points);
      const hexagon = new THREE.Line(geometry, hexMaterial);
      hexagonGroup.add(hexagon);
    });

    const connectionPairs = [
      [
        [1, 0],
        [2, 0],
      ],
      [
        [2, 0],
        [2, 1],
      ],
      [
        [2, 1],
        [3, 1],
      ],
      [
        [3, 1],
        [3, 2],
      ],
      [
        [3, 2],
        [4, 2],
      ],
      [
        [4, 2],
        [4, 3],
      ],
      [
        [4, 3],
        [5, 3],
      ],
      [
        [5, 3],
        [5, 4],
      ],
      [
        [5, 4],
        [0, 4],
      ],
      [
        [0, 4],
        [0, 5],
      ],
      [
        [0, 5],
        [1, 5],
      ],
      [
        [1, 5],
        [1, 0],
      ],
    ];

    const lowerVertices = allVertices[0];
    const upperVertices = allVertices[1];

    connectionPairs.forEach(([conn1, conn2]) => {
      const line1Geometry = new THREE.BufferGeometry();
      line1Geometry.setFromPoints([
        lowerVertices[conn1[0]],
        upperVertices[conn1[1]],
      ]);
      const line1 = new THREE.Line(line1Geometry, lineMaterial);
      hexagonGroup.add(line1);

      const line2Geometry = new THREE.BufferGeometry();
      line2Geometry.setFromPoints([
        lowerVertices[conn2[0]],
        upperVertices[conn2[1]],
      ]);
      const line2 = new THREE.Line(line2Geometry, lineMaterial);
      hexagonGroup.add(line2);

      if (conn1[0] !== conn2[0]) {
        const lowerTriangleVertices = new Float32Array([
          lowerVertices[conn1[0]].x,
          lowerVertices[conn1[0]].y,
          lowerVertices[conn1[0]].z,
          lowerVertices[conn2[0]].x,
          lowerVertices[conn2[0]].y,
          lowerVertices[conn2[0]].z,
          upperVertices[conn1[1]].x,
          upperVertices[conn1[1]].y,
          upperVertices[conn1[1]].z,
        ]);
        const lowerTriangleGeometry = new THREE.BufferGeometry();
        lowerTriangleGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(lowerTriangleVertices, 3)
        );
        const lowerTriangle = new THREE.Mesh(
          lowerTriangleGeometry,
          faceMaterial
        );
        hexagonGroup.add(lowerTriangle);
      }

      if (conn1[1] !== conn2[1]) {
        const upperTriangleVertices = new Float32Array([
          upperVertices[conn1[1]].x,
          upperVertices[conn1[1]].y,
          upperVertices[conn1[1]].z,
          upperVertices[conn2[1]].x,
          upperVertices[conn2[1]].y,
          upperVertices[conn2[1]].z,
          lowerVertices[conn2[0]].x,
          lowerVertices[conn2[0]].y,
          lowerVertices[conn2[0]].z,
        ]);
        const upperTriangleGeometry = new THREE.BufferGeometry();
        upperTriangleGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(upperTriangleVertices, 3)
        );
        const upperTriangle = new THREE.Mesh(
          upperTriangleGeometry,
          faceMaterial
        );
        hexagonGroup.add(upperTriangle);
      }
    });
  }

  slider.addEventListener("input", (e) => {
    progress = e.target.value;
    updateHexagon();
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  updateHexagon();
  animate();
});
