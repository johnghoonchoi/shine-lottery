
Template.animation3D.onCreated(function() {
  const instance = this;
  
  const data = Template.currentData();

  //data.roomId

  instance.autorun(function() {
    instance.subscribe('connectedList', {'rooms.roomId': data.roomId});
  });

  instance.connectionListCount = function() {
    return Counts.get('connectionListCount');
  };

  instance.connection = function() {
    return Connection.collection.find({'rooms.roomId': data.roomId}, {});
  };

  instance.vy = 0;
  instance.vyMax = 300;
  instance.ay = -1;
  instance.toonVel = 2;
  instance.bounce = true;

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

  console.log('instance.connectionListCount(): ', instance.connectionListCount());
  console.log('instance.connection: ', instance.connection().fetch());

  let connectedList = instance.connection().fetch();
  console.log('connectedList: ', connectedList);

  let currentGamers = connectedList.map(function(obj) {
    let rObj = {};
    rObj.id = obj.user._id;
    rObj.username = obj.user.username;

    return rObj;
  });

  currentGamers.forEach(function(gamer) {
    let selectNum = _.random(0, 500);
    let randomNum = _.random(-450, 450);
    gamer.max = selectNum;
    gamer.pos = {
      x: randomNum,
      y: 0,
      z: 0
    };
  });
  console.log('currentGamers: ', currentGamers);

  let winner = _.max(currentGamers, function(gamer){
    return gamer.max;
  });
  console.log('winner: ', winner);
  

  instance.values = [];
  currentGamers.forEach(function(gamer) {
    instance.values.push(gamer);
  });
  
  console.log('values: ', instance.values);

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
