var sceneWidth,
    sceneHeight,
    camera,
    scene,
    renderer,
    dom,
    sun,
    ground,
    orbitControl;
    //loader;
  var shadowMapViewer;
  var car;
if (!Detector.webgl) Detector.addGetWebGLMessage();
init();

function init() {
  //Crea la escena
  createScene();
  //llama al loop
  update();
}

function createScene(){
  sceneWidth  = window.innerWidth;
  sceneHeight = window.innerHeight;
  scene       = new THREE.Scene();
  camera      = new THREE.PerspectiveCamera(60, sceneWidth / sceneHeight,0.1,10000);
  renderer    = new THREE.WebGLRenderer({ antialias: true, alpha:true});
  scene.background = new THREE.Color( 0xcce0ff );
  scene.fog = new THREE.Fog( 0xcce0ff, 1, 5000 );
//  renderer.setClearColor(0xfffafa, 1);
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.gammaOutput = true
  renderer.setSize(sceneWidth, sceneHeight);
  dom         = document.getElementById("container");
  dom.appendChild(renderer.domElement);
  //Loading the Car dae
  var loader = new THREE.ColladaLoader();
  loader.load('models/lowPolyCar2.dae', carLoader);
  //scene.add(this.car);

  //var car2 = new THREE.Object3D();
  //GLTFLoader
  var loader2 = new THREE.GLTFLoader();
  loader2.load('models/lowPolyCar2.gltf', function(gltf){
    gltf.scene.traverse( function( node ) {

        if ( node instanceof THREE.Mesh ) { node.castShadow = true; node.receiveShadow = true; }

    } );
    gltf.scene.position.z = 1;
    gltf.scene.scale.set(0.1,0.1,0.1);
    scene.add( gltf.scene );

  });

  //import world
  loader2.load('models/map1.gltf', function(gltf){
    gltf.scene.traverse( function( node ) {

        if ( node instanceof THREE.Mesh ) { node.castShadow = true;
          node.receiveShadow = true; }

    } );
    gltf.scene.position.y = -0.25;


    scene.add(gltf.scene);
  });

  //World
  var planeGeometry     = new THREE.PlaneGeometry(5,5,4,4);
  var planeMaterial     = new THREE.MeshPhongMaterial({color: 0x6C6C6C});
  ground                = new THREE.Mesh(planeGeometry, planeMaterial);
  ground.receiveShadow  = true;
  ground.castShadow     = false;
  ground.rotation.x     = -Math.PI/2;
  //scene.add(ground);
  camera.position.y     = 5;
  camera.position.x     = 5;
  var ambient = new THREE.AmbientLight( 0xffffff, 0.2 );
				scene.add( ambient );
  //sun
  sun                   = new THREE.DirectionalLight(0xffffff,0.5);
  sun.position.set(0,4,1);
  sun.castShadow        = true;
  scene.add(sun);

  //Sun properties
  sun.shadow.mapSize.width   = 2048;
  sun.shadow.mapSize.height  = 2048;
  sun.shadow.camera.near      = 0.75;
  sun.shadow.camera.far       = 100;

  // shadowMapViewer = new THREE.ShadowMapViewer( sun );
  // shadowMapViewer.position.x = 10;
  // shadowMapViewer.position.y = 10;
  // shadowMapViewer.size.width = 2048 / 4;
  // shadowMapViewer.size.height = 1024 / 4;

  let helper = new THREE.CameraHelper(camera);
  scene.add(helper);



  orbitControl              = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControl.addEventListener('change', render);
  orbitControl.enableZoom   = true;
  orbitControl.update();

  window.addEventListener('resize', onWindowsResize, false);
}
function carLoader(collada){
  //
  collada.scene.traverse(function(node){
    if(node instanceof THREE.Mesh){
      node.castShadow = true;
      node.receiveShadow = true;
   }
  });

  car = collada.scene;
  car.position.y    = 0;
  car.position.x    = 0;
  car.scale.set(0.1,0.1,0.1);
  scene.add(car);


}
function update(){
  if (car !== undefined)
    car.rotation.z += 0.01;
  //shadowMapViewer.update();
  render();
    requestAnimationFrame(update);
}
function render(){
  renderer.render(scene,camera);
}
function onWindowsResize(){
  sceneHeight = window.innerHeight;
  sceneWidth  = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth/sceneHeight;
  camera.updateProjectionMatrix();
}

// function carFBXLoader() {
//     object.
// }
// function carLoader(){
//   loader.load('models/lowPolyCar2.dae', loadCollada);
// }
