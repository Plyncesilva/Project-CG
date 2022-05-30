
const { OrthographicCamera, Spherical, Vector3 } = require("./three");

var camera, camera1, camera2, camera3, scene, renderer;
var geometry, mesh;


var moveUp = false, moveDown = false; //Longitude
var moveRight = false, moveLeft = false; //Latitude

var numberHemisf=0;

var planet, rocket, R, garbage = new Array(4);

var clock, currentCameraNumber;

//coordenadas esfericas
var R, rocket_phi, rocket_theta;


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

function addRectangle(obj, x, y, z, dimx, dimy, dimz) {
    'use strict';

    var rectangle_material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }); 
    geometry = new THREE.BoxGeometry(dimx, dimy, dimz);
    mesh = new THREE.Mesh(geometry, rectangle_material);
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

function createRocket(obj, x, y, z){
    'use strict';

    rocket = new THREE.Group();

    addCylinder(rocket, x, y, z, 1, 1, R/20);
    addCylinder(rocket, x, y + R/20, z, 0, 1, R/20);

    addCapsule(rocket, x + 1, y - R/40, x + 1, 0.2, 1.2);
    addCapsule(rocket, x - 1, y - R/40, x + 1, 0.2, 1.2);
    addCapsule(rocket, x + 1, y - R/40, x - 1, 0.2, 1.2);
    addCapsule(rocket, x - 1, y - R/40, x - 1, 0.2, 1.2);

}

function randomBetween(min, max){
    return Math.random() * (max - min) + min;
}

function addGarbage(obj, i, spherical_position){
    //console.log("lista", obj);

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
    planet.add(rocket);

    let spherical_position = getRandomPositionPlanet();
    let rocket_position = new THREE.Vector3();
    rocket_position.setFromSphericalCoords(spherical_position.radius, spherical_position.phi, spherical_position.theta);
    rocket_phi = spherical_position.phi;
    rocket_theta = spherical_position.theta;
    console.log("phi ", rocket_phi, "theta ", rocket_theta);

    rocket.position.set(rocket_position.x, rocket_position.y, rocket_position.z);

    createGarbage(planet, 25);

    scene.add(rocket);

    scene.add(planet);
    
    planet.position.x = x;
    planet.position.y = y;
    planet.position.z = z;
}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxisHelper(10));
    
    createPlanet(0, 0, 0);
}

function movimentLatRightRocket(delta){
    rocket_phi = rocket_phi < 2*Math.PI ? rocket_phi+delta : 0;
  
    rocket.position.x = 1.2 * R * Math.cos(rocket_phi) * Math.sin(rocket_theta);
    rocket.position.z = 1.2 * R * Math.sin(rocket_phi) * Math.sin(rocket_theta);
    rocket.position.y = 1.2 * R * Math.cos(rocket_theta);
  
    detectColision();
}   

function movimentLatLeftRocket(delta){
    rocket_phi = rocket_phi > 0 ? rocket_phi-delta : 2*Math.PI;
  
    rocket.position.x = 1.2 * R * Math.cos(rocket_phi) * Math.sin(rocket_theta);
    rocket.position.z = 1.2 * R * Math.sin(rocket_phi) * Math.sin(rocket_theta);
    rocket.position.y = 1.2 * R * Math.cos(rocket_theta);
    
    detectColision();
} 

function movimentLonDownRocket(delta){
    rocket_theta = rocket_theta < 2*Math.PI ? rocket_theta+delta : 0;
    
    rocket.position.x = 1.2* R * Math.cos(rocket_phi) * Math.sin(rocket_theta);
    rocket.position.z = 1.2* R * Math.sin(rocket_phi) * Math.sin(rocket_theta);
    rocket.position.y = 1.2 *R * Math.cos(rocket_theta);

    detectColision();
}   

function movimentLonUpRocket(delta){
    rocket_theta = rocket_theta > 0 ? rocket_theta-delta : 2*Math.PI;
    
    rocket.position.x = 1.2 * R * Math.cos(rocket_phi) * Math.sin(rocket_theta);
    rocket.position.z = 1.2 *R * Math.sin(rocket_phi) * Math.sin(rocket_theta);
    rocket.position.y = 1.2 *R * Math.cos(rocket_theta);

    detectColision();
} 

function detectColision(){
    
    for(var i = 0; i < garbage[numberHemisf].children.length; i++){
        //console.log("hemisf trash", garbage[numberHemisf].children.length);
           
        if(checkColision(garbage[numberHemisf].children[i])){
            garbage[numberHemisf].remove(garbage[numberHemisf].children[i]);
        }
    }
}


function checkColision(obj){
    var distance = Math.pow( R/10,2);

    var distance_coord = Math.pow((rocket.position.x - obj.position.x),2) + 
        Math.pow((rocket.position.y - obj.position.y),2) + Math.pow((rocket.position.z - obj.position.z),2);
    //console.log("Distancia" , distance);
    //console.log("Distancia_coord" , distance_coord);
    return distance_coord < distance;

}


function createCameras() {
    'use strict';

    camera1 =  new THREE.OrthographicCamera(window.innerWidth / - 15, window.innerWidth / 15, window.innerHeight / 15, window.innerHeight / - 15 );    
    camera1.position.set(20,20,20);
    camera1.lookAt(scene.position);
    
    camera2 =  new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera2.position.set(0,0,199);
    camera2.lookAt(scene.position);
  
    
    camera3 =  new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);

    rocket.add(camera3);
    
    camera3.position.set(rocket.position.x + R/15, rocket.position.y + R/15, rocket.position.z +R/15);

    camera3.lookAt(rocket.position);
    
        
    scene.add(camera1);
    scene.add(camera2);
    scene.add(camera3);

    camera = camera1;
    currentCameraNumber=1;
}

function checkMovement(delta) {
    'use strict';

    //console.log("numero de lixos", garbage[0].children.length+garbage[1].children.length+garbage[2].children.length+garbage[3].children.length );
    
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

    camera3.position.set(rocket.position.x + R/15, rocket.position.y + R/15, rocket.position.z +R/15);

    camera3.lookAt(rocket.position);
}

function onResize() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if(currentCameraNumber==1){
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
        case 38: // Arrow Up
            moveUp = true;
            break;
        case 40: // Arrow Down
            moveDown = true;
            break;
        case 39: // Arrow Right
            moveRight = true;
            break;
        case 37: // Arrow Left
            moveLeft = true;
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
    }
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
   
    createScene();
    createCameras();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';
    var delta = clock.getDelta();
    //console.log("delta", delta);

    // Update
    checkMovement(delta);

    // Display
    render();
    
    requestAnimationFrame(animate);
}

