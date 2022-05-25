
const { OrthographicCamera, Spherical } = require("./three");

var camera, camera1, camera2, camera3, scene, renderer;
var geometry, mesh;

var rotateBallLeft = false, rotateBallRight = false;
var rotateCubeLeft = false, rotateCubeRight = false;
var rotateRectangleLeft = false, rotateRectangleRight = false;

var moveUp = false, moveDown = false;
var moveRight = false, moveLeft = false;
var moveUpUp = false, moveDownDown = false;

var planet, rocket, R, garbage;

var clock, speed;
var cubeMaxAngleLeft, cubeMaxAngleRight;

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
    return Math.floor(Math.random() * (max - min) + min);
}

function createGarbage(obj, n) {
    'use strict';

    garbage = new THREE.Group();

    for (let i = 0; i < n; i++) {
        let random_x = randomBetween(-1.2*R, 1.2*R);
        let random_y = randomBetween(- Math.sqrt(Math.pow(1.2*R, 2) - Math.pow(random_x, 2)) , 
                                        Math.sqrt(Math.pow(1.2*R, 2) - Math.pow(random_x, 2)));
        let z = Math.pow(-1, i) * Math.sqrt(Math.pow(1.2*R, 2) - Math.pow(random_x, 2) - Math.pow(random_y, 2));

        if (Math.floor(i/5) == 0)
            addDodecahedron(garbage, random_x, random_y, z, R/20);
        else if (Math.floor(i/5) == 1)
            addTetrahedron(garbage, random_x, random_y, z, R/20, 10);
        else if (Math.floor(i/5) == 2)
            addSphere(garbage, random_x, random_y, z, R/24, 5, 5);
        else if (Math.floor(i/5) == 3)
            addTorus(garbage, random_x, random_y, z, R/24, R/24);
        else
            addCube(garbage, random_x, random_y, z, R/24, R/24, R/24);
    }

}

function createPlanet(x, y, z){
    'use strict';

    planet = new THREE.Group();
    R = 40;

    addSphere(planet, 0, 0, 0, R, 20, 20);
    
    createRocket(planet, 0, 0, 0);
    planet.add(rocket);

    rocket.position.set(0, 1.2*R, 0);
    // var test = new THREE.Spherical();
    // rocket.position.set(test);

    createGarbage(planet, 25);
    planet.add(garbage);

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


function createCamera(x, y, z){
    camera = new THREE.OrthographicCamera(window.innerWidth / - 15, window.innerWidth / 15, window.innerHeight / 15, window.innerHeight / - 15 );
    
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);

    return camera
}

function createCameras() {
    'use strict';

    camera1 = createCamera(20, 20, 20);
    camera2 = createCamera(0, 0, 100)
    camera3 = createCamera(0, 100, 0)
    
    scene.add(camera1);
    scene.add(camera2);
    scene.add(camera3);

    camera = camera1;
}

function checkRotate(delta) {
    'use strict';

    if(rotateBallLeft)
        kadinsky.rotateY(-delta);
    
    if(rotateBallRight)
        kadinsky.rotateY(delta);
    
    if(rotateCubeLeft){
        if(kadinskySec.userData.angle > cubeMaxAngleLeft){
            kadinskySec.rotateX(-delta);
            kadinskySec.userData.angle -= delta;
        }
    }

    if(rotateCubeRight){
        if(kadinskySec.userData.angle < cubeMaxAngleRight){
            kadinskySec.rotateX(delta);
            kadinskySec.userData.angle += delta;
        }
    }

    if(rotateRectangleLeft)
        kadinskyTer.rotateX(-delta);

    if(rotateRectangleRight)
        kadinskyTer.rotateX(delta);
     
}

function checkMovement(delta) {
    'use strict';

    if (moveUp)  
        kadinsky.position.z += delta*speed;
    
    if (moveDown)  
        kadinsky.position.z -= delta*speed;
    

    if (moveRight)
        kadinsky.position.x += delta*speed;

    if (moveLeft) 
        kadinsky.position.x -= delta*speed;   
    

    if (moveUpUp)
        kadinsky.position.y += delta*speed;  
       
    if (moveDownDown)  
        kadinsky.position.y -= delta*speed;    
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.left = window.innerWidth / - 20;
        camera.right = window.innerWidth / 20;
        camera.top = window.innerHeight / 20;
        camera.bottom = window.innerHeight / - 20;
        camera.updateProjectionMatrix();
    }

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
        case 68: // D UpUp
        case 100: // d UpUp   
            moveUpUp = true;
            break;
        case 67: // C DownDown
        case 99: // c DownDown
            moveDownDown = true;
            break;
        case 49: //1
            camera=camera1;
            break;
        case 50: //2
            camera=camera2;
            break;
        case 51: //3
            camera=camera3;
            break;
        case 52: //4
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
    
        //controlar  angulo θ1 que roda todo o objecto
        case 81: //Q
        case 113: //q
            rotateBallLeft = true;
            break;
        
        case 87: //W
        case 119: //w
            rotateBallRight = true;
            break;

        
        // controlar o angulo θ2 de um ramo secundario
        case 65: //A
        case 97: //a
            rotateCubeLeft = true;
            break;

        case 83:  //S
        case 115: //s
            rotateCubeRight = true;
            break;

        //controlar o ângulo θ3 de um ramo terciario.
        case 90: // Z
        case 122: //z
            rotateRectangleLeft = true;
            break;

        case 88: //X
        case 120: //x
            rotateRectangleRight = true;
            break;         
        
        case 69:  //E
        case 101: //e
            scene.traverse(function (node) {
                if (node instanceof THREE.AxisHelper) {
                    node.visible = !node.visible;
                }
            });
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
        case 68: // d UpUp
        case 100: // D UpUp   
            moveUpUp = false;
            break;
        case 67: // C DownDown
        case 99: // c DownDown
            moveDownDown = false;
            break;

        // //parar a rotação do  angulo θ1 que roda todo o objecto
        case 81: //Q
        case 113: //q
            rotateBallLeft=false;
            break;
        
        case 87: //W
        case 119: //w
            rotateBallRight=false;
            break;

        // // parar a rotação do angulo θ2 de um ramo secundario
        case 65: //A
        case 97: //a
            rotateCubeLeft = false;
            break;
        case 83:  //S
        case 115: //s
            rotateCubeRight = false;
            break;

        // //controlar o ângulo θ3 de um ramo terciario.
        case 90: // Z
        case 122: //z
            rotateRectangleLeft = false;
            break;
        case 88: //X
        case 120: //x
            rotateRectangleRight = false;
            break;

    }
}

function render() {
    'use strict';

    renderer.render(scene, camera);
}

function init() {
    'use strict';

    // speed = 10;
    // cubeMaxAngleLeft = -1.5;
    // cubeMaxAngleRight = 0.21;
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
    // Update
    // checkRotate(delta);
    // checkMovement(delta);

    // Display
    render();
    
    requestAnimationFrame(animate);
}

