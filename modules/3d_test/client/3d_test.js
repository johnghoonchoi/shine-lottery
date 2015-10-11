
Template.animation3D.onCreated(function() {
  const instance = this;

  instance.vy = 0;
  instance.vyMax = 300;
  instance.ay = -1;
  instance.toonVel = 2;
  instance.bounce = true;

  instance.values = [
    { id: '1', max: 200, pos: { x: -450, y: 0, z: 0 }},
    { id: '2', max: 250, pos: { x: -300, y: 0, z: 0 }},
    { id: '3', max: 300, pos: { x: -150, y: 0, z: 0 }},
    { id: '4', max: 450, pos: { x: 0, y: 0, z: 0 }},
    { id: '5', max: 300, pos: { x: 150, y: 0, z: 0 }},
    { id: '6', max: 400, pos: { x: 300, y: 0, z: 0 }},
    { id: '7', max: 350, pos: { x: 450, y: 0, z: 0 }},
    { id: '8', max: 425, pos: { x: 600, y: 0, z: 0 }},
  ];

  instance.newCamera = function(window) {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 700;
    camera.position.z = 500;

    return camera;
  };

  instance.newLight = function() {
    let light = new THREE.SpotLight();
    light.position.set(250, 2000, 2000);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;

    return light;
  };

  instance.newSphere = function(x, y, z) {
    let geometry = new THREE.SphereGeometry(50, 16, 12);
    let material = new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0xffffff, shininess: 50, opacity: 1, wireframe: false });
    let sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.position.set(x, y, z);

    return sphere;
  };

  instance.newPlane = function() {
    let geometry = new THREE.PlaneGeometry(1500, 500);
    let material = new THREE.MeshLambertMaterial({ color: 0xffcc55, wireframe: false });
    let plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(0, -500, 0);
    plane.castShadow = false;
    plane.receiveShadow = true;

    return plane;
  };

});

Template.animation3D.onRendered(function() {

  const instance = this;

  let camera = instance.newCamera(window);
  let scene = new THREE.Scene();

  let light = instance.newLight();
  scene.add(light);

  let plane = instance.newPlane();
  scene.add(plane);

  instance.values.forEach((item) => {
    item.sphere = instance.newSphere(item.pos.x, item.pos.y, item.pos.z);
    scene.add(item.sphere);
  });

  camera.lookAt(plane.position);

  // renderer = new THREE.CanvasRenderer();
  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  $('.ani-frame').append(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    instance.values.forEach((item) => {
      item.sphere.position.y += instance.toonVel;

      if (item.sphere.position.y >= item.max) {
        instance.vy = 0;

        item.sphere.position.y = item.max;
      }
    });

    renderer.render(scene, camera);
  }

  function inspect(obj) {
    for (var k in obj) {
      trace(k + ' = ' + obj[k]);
    }
  }

  function trace(str) {
    console.log(str);
  }

  animate();
});