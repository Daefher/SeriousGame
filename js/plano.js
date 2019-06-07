
var escena = new THREE.Scene();
var camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1,50);
camara.position.z = 30;

var renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

var orbit = new THREE.OrbitControls(camara, renderer.domElement);
orbit.enableZoom = false;

var lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

escena.add( lights[ 0 ] );
escena.add( lights[ 1 ] );
escena.add( lights[ 2 ] );

var geometry = new THREE.BufferGeometry();
geometry.addAttribute('position', new THREE.Float32BufferAttribute( [], 3 ));

var material = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
var plane = new THREE.Mesh(geometry,material);
escena.add(plane);


var render = function(){
  requestAnimationFrame(render);
  console.log("Actualizando: "+  plane.rotation.y);
  plane.rotation.y  += 0.005;
  renderer.render(escena,camara);
};
window.addEventListener( 'resize', function () {

				camara.aspect = window.innerWidth / window.innerHeight;
				camara.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}, false );


render();
