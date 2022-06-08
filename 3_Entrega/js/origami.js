//import { VRButton } from 'js/VRButton.js';



var camera, camera1, camera2, camera3, scene, renderer;
var geometry, mesh;


var moveUp = false, moveDown = false; //Longitude
var moveRight = false, moveLeft = false; //Latitude

var numberHemisf=0;

var planet, rocket, R, garbage = new Array(4);
var rocket_center;
var pointing_UP = true, pointing_DOWN = false;
var pointing_RIGHT = false, pointing_LEFT = false;

var clock, currentCameraNumber;

//coordenadas esfericas
var R, rocket_phi, rocket_theta;


var ground;


function addCylinder(obj, x, y, z, radiusTop, radiusBot, height) {
    'use strict';
    
    var cylinder_material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
    geometry = new THREE.CylinderGeometry(radiusTop, radiusBot, height,10);
    mesh = new THREE.Mesh(geometry, cylinder_material);
    
    mesh.position.set(x, y, z);
    
    obj.add(mesh)
}

function addTetrahedron(obj, x, y, z, radius, detail) {
    'use strict';
    
    var tetrahedron_material = new THREE.MeshBasicMaterial({ color: 0x0044ff, wireframe: true });
    geometry = new THREE.TetrahedronGeometry(radius, detail);
    mesh = new THREE.Mesh(geometry, tetrahedron_material);
    
    mesh.position.set(x, y, z);
    
    obj.add(mesh)
}


function addSphere(obj, x, y, z, dimx, dimy, dimz) {
    'use strict';
    
    var sphere_material = new THREE.MeshBasicMaterial({ color: 0x0000aa, wireframe: true });
    geometry = new THREE.SphereGeometry(dimx, dimy, dimz);
    mesh = new THREE.Mesh(geometry, sphere_material);
    
    mesh.position.set(x, y, z);
    
    obj.add(mesh)
}

function addCube(obj, x, y, z, dimx, dimy,dimz) {
    'use strict';

    var cube_material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });    
    geometry = new THREE.BoxGeometry(dimx, dimy, dimz);
    mesh = new THREE.Mesh(geometry, cube_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addDodecahedron(obj, x, y, z, radius) {
    'use strict';

    var dod_material = new THREE.MeshBasicMaterial({ color: 0x44cc88, wireframe: true });    
    geometry = new THREE.DodecahedronGeometry(radius);
    mesh = new THREE.Mesh(geometry, dod_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTorus(obj, x, y, z, radius, tubeRadius) {
    'use strict';

    var torus_material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }); 
    geometry = new THREE.TorusGeometry(radius, tubeRadius);
    mesh = new THREE.Mesh(geometry, torus_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCylinder(obj, x, y, z, dim_bot, dim_top, dim_height) {
    'use strict';

    var cylinder_material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }); 
    geometry = new THREE.CylinderGeometry(dim_bot, dim_top, dim_height);
    mesh = new THREE.Mesh(geometry, cylinder_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCapsule(obj, x, y, z, radius, lenght){
    'use strict';

    var capsule_material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }); 
    geometry = new THREE.CapsuleGeometry(radius, lenght);
    mesh = new THREE.Mesh(geometry, capsule_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRectangle(obj, x, y, z, dimx, dimy, dimz, color_ground) {
    'use strict';

    var rectangle_material = new THREE.MeshBasicMaterial({ color: color_ground, wireframe: false }); 
    geometry = new THREE.CubeGeometry(dimx, dimy, dimz);
    mesh = new THREE.Mesh(geometry, rectangle_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createGround(){
    'use strict';

    ground = new THREE.Group();
    
    addRectangle(ground, 0,0,0, 1000, 10,1000, 0xD2B48C);
    addRectangle(ground, 0,10,0, 100, 10,100,0xFFFFFF );
    addRectangle(ground, 0,20,0, 80, 10,80, 0xFF0000);
    scene.add(ground);
}


/*
function createRocket(obj, x, y, z){
    'use strict';

    rocket = new THREE.Group();
    rocket_center = new THREE.Group();


    addCylinder(rocket_center, x, y, z, 1, 1, R/20);
    addCylinder(rocket_center, x, y + R/20, z, 0, 1, R/20);

    addCapsule(rocket_center, x + 1, y - R/40, x + 1, 0.2, 1.2);
    addCapsule(rocket_center, x - 1, y - R/40, x + 1, 0.2, 1.2);
    addCapsule(rocket_center, x + 1, y - R/40, x - 1, 0.2, 1.2);
    addCapsule(rocket_center, x - 1, y - R/40, x - 1, 0.2, 1.2);

    rocket.add(rocket_center);

}

function randomBetween(min, max){
    return Math.random() * (max - min) + min;
}

function addGarbage(obj, i, spherical_position){
    if (Math.floor(i/5) == 0)
       addDodecahedron(obj, spherical_position.x, spherical_position.y, spherical_position.z, R/20);
    else if (Math.floor(i/5) == 1)
        addTetrahedron(obj, spherical_position.x, spherical_position.y, spherical_position.z, R/20, 10);
    else if (Math.floor(i/5) == 2)
        addSphere(obj, spherical_position.x, spherical_position.y, spherical_position.z, R/20, 5, 5);
    else if (Math.floor(i/5) == 3)
        addTorus(obj, spherical_position.x, spherical_position.y, spherical_position.z, R/20, R/20);
    else
        addCube(obj, spherical_position.x, spherical_position.y, spherical_position.z, R/20, R/20, R/20);

}

function getRandomPositionPlanet(){
    let random_phi = randomBetween(-Math.PI, Math.PI);
    let random_theta = randomBetween(-Math.PI/2, Math.PI/2);
    
    let spherical_position = new THREE.Spherical(1.2 * R, random_phi, random_theta);

    return spherical_position;
}

function createGarbage(obj, n) {
    'use strict';

    garbage = new Array(4);
    garbage[0]= new THREE.Group();
    garbage[1]= new THREE.Group();
    garbage[2]= new THREE.Group();
    garbage[3]= new THREE.Group();

    for (let i = 0; i < n; i++) {

        let spherical_position = getRandomPositionPlanet();
        let cartesian_position = new THREE.Vector3();
        cartesian_position.setFromSphericalCoords(spherical_position.radius, spherical_position.phi, spherical_position.theta);

        if(cartesian_position.x <= 0 && cartesian_position.y >= 0){
            addGarbage(garbage[0], i, cartesian_position)
        }
        else if(cartesian_position.x >= 0 && cartesian_position.y >= 0){
            addGarbage(garbage[1], i, cartesian_position)
        }
        else if(cartesian_position.x <= 0 && cartesian_position.y <= 0){
            addGarbage(garbage[2], i, cartesian_position)
        }
        else if(cartesian_position.x >= 0 && cartesian_position.y <= 0){
            addGarbage(garbage[3], i, cartesian_position)
        }

    }

    planet.add(garbage[0]);
    planet.add(garbage[1]);
    planet.add(garbage[2]);
    planet.add(garbage[3]);

}

function createPlanet(x, y, z){
    'use strict';

    planet = new THREE.Group();
    R = 40;

    addSphere(planet, 0, 0, 0, R, 20, 20);
    
    createRocket(planet, 0, 0, 0);

    let spherical_position = getRandomPositionPlanet();
    let rocket_position = new THREE.Vector3();
    rocket_position.setFromSphericalCoords(spherical_position.radius, spherical_position.phi, spherical_position.theta);
    rocket_phi = spherical_position.phi;
    rocket_theta = spherical_position.theta;

    rocket.position.set(rocket_position.x, rocket_position.y, rocket_position.z);

    createGarbage(planet, 25);

    scene.add(rocket);

    scene.add(planet);
    
    planet.position.x = x;
    planet.position.y = y;
    planet.position.z = z;
}

function setOrientation(orientation) {
    switch (orientation) {
        case 1:
            //cima
            pointing_UP = true;
            pointing_DOWN = false;
            pointing_LEFT = false;
            pointing_RIGHT = false;
            break;
        case 2:
            //baixo
            pointing_UP = false;
            pointing_DOWN = true;
            pointing_LEFT = false;
            pointing_RIGHT = false;
            break;
        case 3:
            //esquerda
            pointing_UP = false;
            pointing_DOWN = false;
            pointing_LEFT = true;
            pointing_RIGHT = false;
            break;
        case 4:
            //direita
            pointing_UP = false;
            pointing_DOWN = false;
            pointing_LEFT = false;
            pointing_RIGHT = true;
            break;
    }
} */

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxisHelper(10));
    
    createGround();
}

/*
function movimentLatRightRocket(delta){
    rocket_theta = rocket_theta < Math.PI ? rocket_theta+delta : -Math.PI;
    
    let rocket_position = new THREE.Vector3();
    rocket_position.setFromSphericalCoords(1.2*R, rocket_phi, rocket_theta);    
    rocket.position.set(rocket_position.x, rocket_position.y, rocket_position.z);
  
    if (!pointing_RIGHT){
        setOrientation(4);
        rocket_center.lookAt(0, 0, 0);
        rocket_center.rotateZ(Math.PI/2);
    }

    detectColision();
}   

function movimentLatLeftRocket(delta){
    rocket_theta = rocket_theta > -Math.PI ? rocket_theta-delta : Math.PI;

    let rocket_position = new THREE.Vector3();
    rocket_position.setFromSphericalCoords(1.2*R, rocket_phi, rocket_theta);    
    rocket.position.set(rocket_position.x, rocket_position.y, rocket_position.z);
    
    if (!pointing_LEFT){
        setOrientation(3);
        rocket_center.lookAt(0, 0, 0);
        rocket_center.rotateZ(-Math.PI/2);
    }

    detectColision();
} 

function movimentLonDownRocket(delta){
    rocket_phi = rocket_phi < Math.PI ? rocket_phi+delta : -Math.PI;
    
    let rocket_position = new THREE.Vector3();
    rocket_position.setFromSphericalCoords(1.2*R, rocket_phi, rocket_theta);    
    rocket.position.set(rocket_position.x, rocket_position.y, rocket_position.z);

    if (!pointing_DOWN){
        setOrientation(2);
        rocket_center.lookAt(0, 0, 0);
        rocket_center.rotateZ(Math.PI);
    }

    detectColision();
}   

function movimentLonUpRocket(delta){
    rocket_phi = rocket_phi > -Math.PI ? rocket_phi-delta : Math.PI;

    let rocket_position = new THREE.Vector3();
    rocket_position.setFromSphericalCoords(1.2*R, rocket_phi, rocket_theta);    
    rocket.position.set(rocket_position.x, rocket_position.y, rocket_position.z);

    if (!pointing_UP){
        setOrientation(1);
        rocket_center.lookAt(0, 0, 0);
    }

    detectColision();
} 

function detectColision(){
    
    for(var i = 0; i < garbage[numberHemisf].children.length; i++){

        if(checkColision(garbage[numberHemisf].children[i])){
            garbage[numberHemisf].remove(garbage[numberHemisf].children[i]);
        }
    }
}


function checkColision(obj){
    var distance = Math.pow( R/10,2);

    var distance_coord = Math.pow((rocket.position.x - obj.position.x),2) + 
        Math.pow((rocket.position.y - obj.position.y),2) + Math.pow((rocket.position.z - obj.position.z),2);

    return distance_coord < distance;

} */


function createCameras() {
    'use strict';

    camera1 =  new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera1.position.set(150,20,150);
    camera1.lookAt(scene.position);
    
    camera2 =  new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);

    camera2.position.set(0, 150, 0);
    camera2.lookAt(scene.position);

    //camera3 = new THREE.StereoCamera();

    //camera3.position.set(10,10,10);

        
    scene.add(camera1);
    scene.add(camera2);
    //scene.add(camera3);

    camera = camera1;
    currentCameraNumber=1;
}

/*
function checkMovement(delta) {
    'use strict';
 
    if(rocket.position.x <=0 && rocket.position.y >=0)
        numberHemisf=0;
    else if(rocket.position.x >=0 && rocket.position.y >=0)
        numberHemisf=1;
    else if(rocket.position.x <=0 && rocket.position.y <=0)
        numberHemisf=2;
    else if(rocket.position.x >=0 && rocket.position.y <=0)
        numberHemisf=3;

    //latitude
    if(moveLeft){
        movimentLatLeftRocket(delta);
    }

    if(moveRight)
        movimentLatRightRocket(delta);  

    //longitude   
    if(moveDown)
        movimentLonDownRocket(delta);

    if(moveUp)
        movimentLonUpRocket(delta);

    rocket.lookAt(0, 0, 0);
}*/

function onResize() {
    'use strict';
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if(currentCameraNumber==3){
        if (window.innerHeight > 0 && window.innerWidth > 0) {
            camera.left = window.innerWidth / - 20;
            camera.right = window.innerWidth / 20;
            camera.top = window.innerHeight / 20;
            camera.bottom = window.innerHeight / - 20;
            
        }
    } else{
        camera.aspect = window.innerWidth / window.innerHeight;
    }

    camera.updateProjectionMatrix();
}

function onKeyDown(e) {
    'use strict';
    
    switch (e.keyCode) {
        case 81: // Q
        case 113: // q
            break;

        case 87: // W
        case 119: // w
            break;

        case 69: // E
        case 101: // e
            break;
        
        case 82: // R
        case 114: // r
            break;

        case 84: // T
        case 116: // t
            break;

        case 89: // Y
        case 121: // y
            break;


        
        case 49: //1
            camera=camera1;
            currentCameraNumber=1;
            break;
        case 50: //2
            camera=camera2;
            currentCameraNumber=2;
            break;
        case 51: //3
            camera=camera3;
            currentCameraNumber=3;
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    /*    
    switch (e.keyCode) {
        case 38: // Arrow Up
            moveUp = false;
            break;
        case 40: // Arrow Down
            moveDown = false;
            break;

        case 39: // Arrow Right
            moveRight = false;
            break;
        case 37: // Arrow Left
            moveLeft = false;
            break;
    }*/
}

function render() {
    'use strict';

    renderer.render(scene, camera);
}

function init() {
    'use strict';

    clock =  new THREE.Clock();
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    //document.body.appendChild( VRButton.createButton( renderer ) );
    //renderer.xr.enabled = true;
    
    createScene();
    createCameras();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';
    
    var delta = clock.getDelta();
    
    // Update
    //checkMovement(delta);

    // Display
    render();
    
    requestAnimationFrame(animate);
}

