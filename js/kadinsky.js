/*global THREE, requestAnimationFrame, console*/

const { OrthographicCamera } = require("./three");

var camera, camera1, camera2, camera3, scene, renderer;
var geometry, mesh;

var sphere_material, cube_material, rectangle_material;

var rotateBallLeft = false, rotateBallRight = false;
var rotateCubeLeft = false, rotateCubeRight = false;
var rotateRectangleLeft = false, rotateRectangleRight = false;

var moveUp = false, moveDown = false;
var moveRight = false, moveLeft = false;
var moveUpUp = false, moveDownDown = false;

var kadinsky, kadinskySec, kadinskyTer, kadinskyNotMove;


var clock, max=30;


function addSphere(obj, x, y, z, dimx, dimy, dimz) {
    'use strict';
    
    sphere_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    geometry = new THREE.SphereGeometry(dimx, dimy, dimz);
    mesh = new THREE.Mesh(geometry, sphere_material);
    
    mesh.position.set(x, y, z);
    
    obj.add(mesh)
}

function addCube(obj, x, y, z, dimx, dimy,dimz) {
    'use strict';
    //material.color = 0x1100cc;
                                    //x (vermelho) , z(verde), y(azul)
    cube_material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });    
    geometry = new THREE.CubeGeometry(dimx, dimy, dimz);
    mesh = new THREE.Mesh(geometry, cube_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRectangle(obj, x, y, z, dimx, dimy, dimz) {
    'use strict';
    //material.color = 0x1100cc;
                                    //x (vermelho) , z(verde), y(azul)
    rectangle_material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }); 
    geometry = new THREE.CubeGeometry(dimx, dimy, dimz);
    mesh = new THREE.Mesh(geometry, rectangle_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createKadinskyNotMove(x, y, z){
    'use strict';

    kadinskyNotMove= new THREE.Object3D();

    //sphere_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    //cube_material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    //rectangle_material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
   
    addRectangle(kadinskyNotMove, 0, -10, -15, 1, 2, 1);
    addRectangle(kadinskyNotMove, -10, -10, 15, 3, 2, 1);
    addRectangle(kadinskyNotMove, 30, -30, 15, 1, 3, 3);
    addCube(kadinskyNotMove, 3.5, 3.5, -10, 3, 3, 3);
    addSphere(kadinskyNotMove, 15, 19.625, -2.5, 2, 5, 5);
    addCube(kadinskyNotMove, -20, 20, 20, 2, 2, 2);
    //addPyramid(kadinskyNotMove, -10, -10, -10);
    addRectangle(kadinskyNotMove, 20, 20, 20, 2, 2, 1);    
    addSphere(kadinskyNotMove, -10, 0, -10, 1, 4, 4);
    addRectangle(kadinskyNotMove, -10, -10, 0, 3, 1, 2);
    addRectangle(kadinskyNotMove, -10, -10, -10, 1, 2, 2); 
    addSphere(kadinskyNotMove, 0, 0, -10, 2, 6, 6);  
    addRectangle(kadinskyNotMove, -20, 0, 20, 3, 1, 1); 

    scene.add(kadinskyNotMove);
    
    kadinskyNotMove.position.x = x;
    kadinskyNotMove.position.y = y;
    kadinskyNotMove.position.z = z;

}



function createKadinskyTer(){
    'use strict';

    kadinskyTer= new THREE.Object3D();
    addRectangle(kadinskyTer, -1.5, -3, 1.5, 3, 6, 3);
}


function createKadinskySec(){
    'use strict';

    kadinskySec= new THREE.Object3D();
    addCube(kadinskySec, -2.5, -2.5, 2.5, 5, 5, 5);
    kadinskyTer.position.set(-5,-5,5);
    kadinskySec.add(kadinskyTer); 
}

function createKadinsky(x, y, z){
    'use strict';

    kadinsky = new THREE.Object3D();
    
    //sphere_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addSphere(kadinsky, 0, 0, 0, 2.5, 10, 10);

    kadinskySec.position.set(0,0,2.5);
    kadinsky.add(kadinskySec);

    scene.add(kadinsky);
    
    kadinsky.position.x = x;
    kadinsky.position.y = y;
    kadinsky.position.z = z;

}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxisHelper(10));
    
    createKadinskyTer();
    createKadinskySec();
    createKadinsky(0, 0, 0);
    createKadinskyNotMove(0,0,0);
}


function createCamera(x, y, z){
    camera = new THREE.OrthographicCamera(window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20 );
    
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

function checkRotate() {
    'use strict';
    var delta = clock.getDelta();

    if(rotateBallLeft)
        kadinsky.rotateY(-delta);

    if(rotateBallRight)
        kadinsky.rotateY(delta); 
    
    if(rotateCubeLeft)
        kadinskySec.rotateX(-delta);

    if(rotateCubeRight)
        kadinskySec.rotateX(delta);

    if(rotateRectangleLeft)
        kadinskyTer.rotateX(-delta);

    if(rotateRectangleRight)
        kadinskyTer.rotateX(delta);
    
}

function checkMovement() {
    'use strict';
    // var delta = clock.getDelta();

    if (moveUp)
        kadinsky.position.z += -0.5;
    if (moveDown)
        kadinsky.position.z += 0.5;
    if (moveRight)
        kadinsky.position.x += 0.5;
    if (moveLeft)
        kadinsky.position.x += -0.5;
    if (moveUpUp)
        kadinsky.position.y += 0.5;
    if (moveDownDown)
        kadinsky.position.y += -0.5;

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
            render();
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
    clock =  new THREE.Clock();
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
   
    createScene();
    createCameras();
    
    render();
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    // Update
    checkRotate();
    checkMovement();

    // Display
    render();
    
    requestAnimationFrame(animate);
}

