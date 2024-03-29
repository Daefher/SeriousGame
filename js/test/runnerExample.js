var sceneWidth;
var sceneHeight;
var camera;
var renderer;
var scene;
var dom;
var sun;
var ground;
var sphere;
var heroSphere;
var rollingGroundSphere;
var rollingSpeed  = 0.008;
var worldRadius   = 26;
var heroRadius    = 0.2;
var sphericalHelper;
var pathAngleValues;
var heroBaseY     = 1.8;
var bounceValue   = 0.1;
var grativy       = 0.005;
var leftLane      = -1;
var rightLane     = 1;
var middleLane    = 0;
var currentLane;
var clock;
var jumping;
var treeReleaseInterval = 0.5;
var lastTreeReleaseTime = 0;
var treesInPath;
var treesPool;
var particleGeometry;
var particleCount   = 20;
var explosionPower  = 1.06;
var particles;
//Stats
var scoreText;
var score;
var hasCollided;


init()

function init(){
  createScene();
  update();
}

function createScene(){
  hasCollided = false;
  score = 0;
  treesInPath = [];
  treesPool = [];
  clock = new THREE.Clock();
  clock.start();
  sphericalHelper  = new THREE.Spherical();
  pathAngleValues = [1.52,1.57,1.62];
    sceneWidth  = window.innerWidth;
    sceneHeight = window.innerHeight;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf0fff0, 0.14);
    camera  = new THREE.PerspectiveCamera(60, sceneWidth/sceneHeight, 0.1,1000);
    renderer    = new THREE.WebGLRenderer({ antialias: true, alpha:true});
    renderer.setClearColor(0xfffafa, 1);
    renderer.shadowMap.enable = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setSize(sceneWidth, sceneHeight);
    dom = document.getElementById('container');
    dom.appendChild(renderer.domElement);

    //function
    createTreesPool();
    addWorld();
    addHero();
    addLigth();
    addExplosion();

    camera.position.z = 6.5;
    camera.position.y = 2.5;
    window.addEventListener('resize', onWindowsResize, false);

    document.onkeydown  = handleKeyDown;

    scoreText = document.createElement('div');
    scoreText.style.position  = 'absolute';
    scoreText.style.width = 100;
    scoreText.style.height  = 100;
    scoreText.innerHTML = '0';
    scoreText.style.top = 50  + 'px';
    scoreText.style.left  = 10 + 'px';
    document.body.appendChild(scoreText);
}

function addExplosion() {
    particleGeometry  = new THREE.Geometry();
    for( var i = 0; i < particleCount; i++){
      var vertex  = new THREE.Vertex3();
      particleGeometry.vertices.push(vertex);
    }
    var particleMaterial  = new ParticleBasicMaterial({
      color: 0xfffafa,
      size: 0.2
    });
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particles.visible = false;
}
function createTreesPool() {
  var maxTreesInPool  =  10;
  var newTree;
  for (var i = 0; i < maxTreesInPool; i++) {
    newTree = createTree();
    treesPool.push(newTree);
  }
}
function handleKeyDown() {
  if(jumping)return;
  var validMove = true;
  if( keyEvent.keyCode  === 37){//left
    if(currentLane  == moddleLane)
      currentLane = leftLane;
    else if (currentLane == rightLane)
      currentLane=middleLane;
    else
    validMove = false;
  } else if (keyEvent.keyCode === 39) {//right
    if(currentLane == middleLane)
      currentLane = rightLane;
    else if (currentLane == leftLane)
      currentLane = middleLane;
    else
      validMove = false;
  }else {
    if (keyEvent.ketCode === 38) {
      bounceValue = 0.1;
      jumping = true;
    }
    validMove = false;
  }
  if(validMove){
    jumping =  true;
    bounceValue = 0.06;
  }
}
function addHero() {
  var sphereGeometry  = new THREE.DodecahedronGeometry(heroRadius, 1);
  var sphereMaterial  = new THREE.MeshStandardMaterial({
    color: 0xe5f2f2,
    shading: THREE.FlatShading
  });
  jumping = false;
  heroSphere  = new THREE.Mesh(sphereGeometry, sphereMaterial);
  heroSphere.receiveShadow  = true;
  heroSphere.castShadow = true;
  scene.add(heroSphere);
  heroSphere.position.y = heroBaseY;
  heroSphere.position.z = 4.8;
  currentLane = middleLane;
  heroSphere.position.x = currentLane;

}
function addWorld() {
  var sides = 40;
  var tiers = 40;
  var sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
  var sphericalMaterial = new THREE.MeshStandardMaterial({color: 0xfffafa, shading: THREE.FlatShading});
  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var nextVertexVector  = new THREE.Vector3();
  var offset  = new THREE.Vector3();
  var currentTier = 1;
  var lerpValue = 0.5;
  var heightValue;
  var maxHeight = 0.07;
  for (var j = 0; j < tiers-2; j++) {
    currentTier = 1;
    for (var i = 0; i < sides; i++) {
        vertexIndex = (currentTier * sides)+1;
        vertexVector  = sphereGeometry.vertices[i+vertexIndex].clone();
        if(j%2 !== 0){
          if(i == 0)
            firstVertexVector = vertexVector.clone();
          nextVertexVector  = sphereGeometry.vertices[i+vertexIndex+1].clone();
          if(i == sides-1)
            nextVertexVector  =  firstVertexVector;

          lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
          vertexVector.lerp(nextVertexVector, lerpValue);
        }
        heightValue = (Math.random() * maxHeight) = (maxHeight / 2);
        offset  = vertexVector.clone().normalize().multiplyScalar(heightValue);
        sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
    }
  }
  rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  rollingGroundSphere.receiveShadow = true;
  rollingGroundSphere.castShadow  = false;
  rollingGroundSphere.rotation.z  = =Math.PI/2;
  scene.add(rollingGroundSphere);
  rollingGroundSphere.position.y  = =24;
  rollingGroundSphere.position.z  = 2;
  addWorldTrees();
}
function addLigth() {
  var hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
  scene.add(hemisphereLight);
  sun = new THREE.DirectionalLight( 0xcdc1c5, 0.9);
  sun.position.set(12, 6, -7);
  sun.castShadow  = true;
  scene.add(sun);
  sun.shadow.mapSize.width = 256;
  sun.shadow.mapSize.height = 256;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 50;
}
function addPathTree(){
  var options =  [0, 1, 2];
  var lane = Math.floor.(Math.random() * 3 );
  addTree(true,lane);
  options.splice(lane, 1);
  if(Math.random() > 0.5){
    lane = Math.floor(Math.random() * 2);
    addTree(true, options[lane]);
  }
}
function addWorldTrees() {
  var numTrees  =  36;
  var gap = 6.28 / 36;
  for (var i = 0; i < numTrees; i++) {
    addTree(false, i * gap, true);
    addTree(false, i * gap, false);
  }
}
function addTree(inPath, row, isLeft) {
  var newTree;
  if(inPath){
    if(treesPool.length == 0) return;
    newTree = treesPool.pop();
    newTree.visible = true;
    treesInPath.push(newTree);
    sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row], -rollingGroundSphere.rotation.x + 4 );
  }else{
    newTree = createTree();
    var forestAreaAngle = 0;
    if(isLeft)
      forestAreaAngle = 1.68 + Math.random() * 0.1;
    else
      forestAreaAngle = 1.46 - Math.random() * 0.1;
    sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTree.position.setFromSpherical(sphericalHelper);
  var rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  var treeVector = newTree.position.clone().normalize();
  newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
  newTree.rotation.x += (Math.random() * (2 * Math.PI / 10)) +- Math.PI / 10;
  rollingGroundSphere.add(newTree);

}


function onWindowsResize(){
  sceneHeight = window.innerHeight;
  sceneWidth  = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth/sceneHeight;
  camera.updateProjectionMatrix();
}
