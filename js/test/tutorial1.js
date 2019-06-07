// Se crea la escena antes para en ella incertar el contenido
var scene = new THREE.Scene();
// Existen diferentes tipos de camaras en threejs, PerspectiveCamera, StereoCamera, OrthographicCamera y CubeCamera.
// Se utilizara la se PerspectiveCamera, y pide como argumentos fov, aspect, near, far
// El argumento 'fov' o campo de vision, significa que tanto se puede ver alrededor de la camara.
// El argumento 'aspect' es el radio del fov, o en otras palabras el ancho y alto de la pantalla(4:3,16:9)
// Los ultimos dos 'near' y 'far', son planos de un dolido. Juntos controlan la distancia en la que un objeto sera renderizado
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1,1000);
camera.position.set(-5,12,10);
camera.lookAt(scene.position);
//La siguiente varibale es la responsable para el despliegue de los modelos.
var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

//CONTROLS
var controls = new THREE.TrackballControls(camera);
function initControls(){
  controls.rotateSpeed = 0;
  controls.zoomSpeed = 3.0;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.enableDamping = true;
  controls.noPan = true;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.2
}
initControls();


//Luces
var color = '#FAFAFA',
    AmbientLight = new THREE.AmbientLight('#EEEEEE'),
    hemiLight = new THREE.HemisphereLight(color, color = 0);
  //  light = new THREE.PointLight(color, 1, 100);
    hemiLight.position.set(0, 50, 0);
  //  light.position.set(0,20,10);

    scene.add(AmbientLight);
    scene.add(hemiLight);
  //  scene.add(light);

//Utilities
var axisHelper = new THREE.AxesHelper(1.25);
scene.add(axisHelper);

//Render LOOP
function render(){
  renderer.render(scene, camera);
}

//Rednderiza la escena cuando los controles han cambiado
//Si no hay otra animacion o cambio en la escenea no drenara recursos del sistema cada frame
controls.addEventListener('change', render);

//Evitar renderizar constantemente la escenea, es mejor solo actualizar los controles cada ves que se pide un frame
function animationLoop(){
  requestAnimationFrame(animationLoop);
  controls.update();
}

animationLoop();

//Pantalla
window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
  render();
},false);

//Cargar el objeto

var dae,
    loader = new THREE.ColladaLoader();

function loadCollada(collada){
    dae = collada.scene;
    dae.position.set(0.4,0,0.8);
    scene.add(dae);
    render();
}

//loader.options.convertUpAxis = true;
loader.load('models/lowPolyCar2.dae', loadCollada);
