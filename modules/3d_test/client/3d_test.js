
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

  instance.frame = { width: 900, height: 900 };

  instance.vy = 0;
  instance.vyMax = 300;
  instance.ay = -1;
  instance.toonVel = 2;
  instance.bounce = true;

  instance.values = [
    { id: '이상원', max: 200 },
    { id: '이용선', max: 475 },
    { id: '성열우', max: 300 },
    { id: '최종훈', max: 450 },
    { id: 'Michael Jackson', max: 300 },
    { id: 'Ablert Einstein', max: 400 },
    { id: 'Mahatma Gandy', max: 350 },
    { id: 'Riz Taylor', max: 425 },
  ];

  let pos = -500;
  instance.values.forEach((item) => {
    item.pos = {
      x: pos, y: 0, z: 100
    };
    pos += 150;
  });

  instance.newCamera = function(window) {
    let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = 0;
    camera.position.y = 200; //600;
    camera.position.z = 700;

    return camera;
  };

  instance.newLight = function(scene, type) {
    let light;
    if (type === 'spotlight') {
      light = new THREE.SpotLight();
      light.position.set(0, 2000, 500);
      light.target.position.set(0, 0, 0);
      light.castShadow = true;
    } else {
      light = new THREE.AmbientLight(0xdddddd);
    }

    scene.add(light);

    return light;
  };

  instance.newAvatar = function(item, scene) {
    // sphere
    /*
    let geometry = new THREE.SphereGeometry(50, 16, 12);
    let material = new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0xffffff, shininess: 50, opacity: 1, wireframe: false });
    */

    // text
    /*
    let geometry = new THREE.TextGeometry(item.id, {
      size: 70,
      height: 20,
      curveSegments: 4,
      font: 'droid sans',
      weight: 'bold',
      style: 'normal',
      bevelThickness: 2,
      bevelSize: 1.5,
      bevelEnabled: true,
      material: 0,
      extrudeMaterial: 1
    });
    let material = new THREE.MeshPhongMaterial({ color: 0x3399ff, specular: 0xffffff, shininess: 50, opacity: 1, wireframe: false });
    */

    // plane
    let geometry = new THREE.PlaneGeometry(50, 50);
    //let material = new THREE.MeshPhongMaterial({ color: 0x3399ff, specular: 0xffffff, shininess: 50, opacity: 1, wireframe: false });


    let imageMap = THREE.ImageUtils.loadTexture('/images/test.gif');
    imageMap.minFilter = THREE.NearestFilter;
    let material = new THREE.MeshLambertMaterial({ map: imageMap, wireframe: false });
    material.transparent = true;
    material.blending = THREE['NoBlending'];

    let avatar = new THREE.Mesh(geometry, material);
    avatar.castShadow = true;
    avatar.position.set(item.pos.x, item.pos.y, item.pos.z);

    scene.add(avatar);

    return avatar;
  };

  instance.newPlane = function(scene) {
    let geometry = new THREE.PlaneBufferGeometry(2000, 1000);
    let material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false });
    let plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(0, 0, 0); //-100, 100);
    plane.castShadow = false;
    plane.receiveShadow = true;

    scene.add(plane);

    return plane;
  };

});

Template.animation3D.onRendered(function() {

  const instance = this;
  const $frame = $('.ani-frame');

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
  let light = instance.newLight(scene, 'spotlight');
  let plane = instance.newPlane(scene);


  // avatar items
  instance.values.forEach((item) => {
    item.avatar = instance.newAvatar(item, scene);
  });

  camera.lookAt(plane.position);

  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  $frame.append(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    instance.values.forEach((item) => {
      item.avatar.position.y += instance.toonVel;

      if (item.avatar.position.y >= item.max) {
        instance.vy = 0;

        item.avatar.position.y = item.max;
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
