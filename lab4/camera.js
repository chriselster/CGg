var scene 		= null;
var scene2;
var renderer	= null;
var camera 		= null;
var angleX		= 0.007;
var angleY		= 0.0;
var angleZ		= 0.0;
var mesh;
var box,dot,plano;
var track;
var minimapa;
var clock,color;

function init() {


	scene = new THREE.Scene();
	scene2 = new THREE.Scene();
	color = new THREE.Color('skyblue' );
	scene.fog = new THREE.Fog(color, 0.1,300);
	//scene.background = color;
	//lights

	//camera
	aspectRatio = window.innerWidth/window.innerHeight;
	minimapa = new THREE.OrthographicCamera(window.innerHeight / - 2, window.innerHeight / 2, window.innerWidth / 2, window.innerWidth / - 2, 1, 1000);
	minimapa.up = new THREE.Vector3(0,0,-1); 
	minimapa.lookAt( new THREE.Vector3(0,-1,0) );
	minimapa.position.y = 300;
	scene2.add(minimapa);
	camera = new THREE.PerspectiveCamera( 60.0, aspectRatio, 0.1, 300 );
	camera.position.y = 2;
	camera.position.z = 20;	
	camera2 = new THREE.PerspectiveCamera( 60.0, aspectRatio, 0.1, 300 );

	scene.add( camera );
	scene.add(camera2);
	
	//luzes
	light = new THREE.DirectionalLight(0xefc07f, 1.4);
    light.position.set(300, 400, 50);
    light.position.multiplyScalar(1.3);
    light.shadow.mapSize.width = 2000;  // default
	light.shadow.mapSize.height = 2000;
    light.castShadow = true;
    var d = 300;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far =1000;

    scene.add(light);

    light2 = new THREE.DirectionalLight(0xdfebff, 1.2);
    light2.position.set(300, 400, 50);
    light2.position.multiplyScalar(1.3);
    light2.shadow.mapSize.width = 100;  // default
	light2.shadow.mapSize.height = 100;
    light2.castShadow = true;
    var d = 300;
    light2.shadow.camera.left = -d;
    light2.shadow.camera.right = d;
    light2.shadow.camera.top = d;
    light2.shadow.camera.bottom = -d;
    light2.shadow.camera.far =1000;
    scene2.add(light2);

	var ambient = new THREE.AmbientLight(0xdfebff,0.2);
	scene.add( ambient );


	//obj
	var loader = new THREE.OBJLoader();
	loader.load('../Assets/Models/city.obj', loadMesh);
	loader.load('../Assets/Models/city.obj', loadMesh2);

	var geometry = new THREE.CircleGeometry( 10, 32 );
	var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	dot = new THREE.Mesh( geometry, material );
	dot.rotation.x = 4.7;
	scene2.add( dot );

	geometry = new THREE.SphereGeometry( 20, 60,60 );
	material = new THREE.MeshBasicMaterial( { color: color } );
	plano = new THREE.Mesh( geometry, material );
	plano.side = THREE.DoubleSide;
	scene.add( plano );



	//renderer
	var w = window.innerWidth, h = window.innerHeight;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(w, h);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	renderer.shadowCameraNear = 3;
	renderer.shadowCameraFar = camera.far;
	renderer.shadowCameraFov = 60;


	document.getElementById("WebGL-output").appendChild(renderer.domElement);



	track
	controls = new THREE.FirstPersonControls(camera);
	controls.lookSpeed = 0.2;
	controls.movementSpeed = 10;
 	// controls.noFly = true;
    controls.lookVertical = false;
    // controls.constrainVertical = true;
    controls.heightMax = 10;
    controls.heightMin = 10;
    // controls.verticalMin = 1.4;
    // controls.verticalMax = 1.0;
	clock = new THREE.Clock(true);
	renderer.clear();
	renderer.setClearColor(color, 1);
	//renderer.setClearColor(0xff0000, 1);
	renderer.autoClear = false;
	render();
};


function render() {
	controls.update(clock.getDelta());

	var w = window.innerWidth, h = window.innerHeight;
	// setViewport parameters:
	//  lower_left_x, lower_left_y, viewport_width, viewport_height
	
	// full display
	renderer.clear( true, false, false );
	renderer.setViewport( 0, 0, w, h );
	renderer.render( scene, camera );
	renderer.setViewport( w/2-w/4, h/30, w/2, h/5);
	dot.position.x = camera.position.x;
	dot.position.y = camera.position.y;
	dot.position.z = camera.position.z;

	plano.position.x = camera.position.x;
	plano.position.y = camera.position.y;
	plano.position.z = camera.position.z;



	camera2.position.x = camera.position.x;
	camera2.position.y = camera.position.y;
	camera2.position.z = camera.position.z;
	camera2.rotation.y = -camera.rotation.y;
	renderer.clear( false, true, false );
	renderer.render( scene, camera2 );

	renderer.clear( false, true, false ); // clear the depth buffer -- thanks @WestLangley!
	// minimap (overhead orthogonal camera)
	renderer.setViewport( 0, -h/8, w/6, w/4);
	renderer.render( scene2, minimapa );
	requestAnimationFrame( render );
}




function loadMesh(loadedMesh) {
	var material = new THREE.MeshLambertMaterial({ 
		//wireframe: true
	});

	loadedMesh.children.forEach(function (child) {
		child.material = material;
		child.castShadow = true;
		child.receiveShadow = true;
		child.shadowMap = true;
	});


	mesh = loadedMesh;
	console.log(loadedMesh);
	scene.add(loadedMesh);

	box = new THREE.Box3();
	box.setFromObject(loadedMesh);
	
	
};
function loadMesh2(loadedMesh) {
	var material = new THREE.MeshLambertMaterial({ 
		//wireframe: true
	});

	loadedMesh.children.forEach(function (child) {
		child.material = material;
		child.castShadow = true;
		child.receiveShadow = true;
		child.shadowMap = true;
	});

	scene2.add(loadedMesh);
};