/*global THREE, requestAnimationFrame, console*/

const { OrthographicCamera } = require("./three");

var camera, camera1, camera2, camera3, camera0, scene, renderer;
var geometry, material, mesh;

var sphere_material, cube_material, rectangle_material;

var ball;
var rotateBallLeft = false, rotateBallRight = false;
var rotateCubeLeft = false, rotateCubeRight = false;
var rotateRectangleLeft = false, rotateRectangleRight = false;

var moveUp = false, moveDown = false;
var moveRight = false, moveLeft = false;
var moveUpUp = false, moveDownDown = false;

var kadinsky, kadinskySec, kadinskyTer, kadinskyNotMove;


var clock;


function addSphere(obj, x, y, z) {
    'use strict';
    
    geometry = new THREE.SphereGeometry(2.5, 10, 10);
    mesh = new THREE.Mesh(geometry, sphere_material);
    
    mesh.position.set(x, y, z);
    
    obj.add(mesh)
}

function addCube(obj, x, y, z) {
    'use strict';
    //material.color = 0x1100cc;
                                    //x (vermelho) , z(verde), y(azul)
    cube_material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });    
    geometry = new THREE.CubeGeometry(5, 5, 5);
    mesh = new THREE.Mesh(geometry, cube_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRectangle(obj, x, y, z) {
    'use strict';
    //material.color = 0x1100cc;
                                    //x (vermelho) , z(verde), y(azul)
    rectangle_material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }); 
    geometry = new THREE.CubeGeometry(3, 6, 3);
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
   
    //addSphere(kadinskyNotMove, 15, 19.625, -2.5);
    //addCube(kadinskyNotMove, 10, 15, 2.5);
    // addPyramid(kadinskyNotMove, 7.5, 11.2, 5);
    //addRectangle(kadinskyNotMove, 6, 9.5, 6.5);    
    //addSphere(kadinskyNotMove, 0, 0, 0);

    //addRectangle(kadinskyNotMove, -1.5, -3, 1.5);
    //scene.add(kadinskyTer);    

    scene.add(kadinskyNotMove);
    
    kadinskyNotMove.position.x = x;
    kadinskyNotMove.position.y = y;
    kadinskyNotMove.position.z = z;

}



function createKadinskyTer(){
    'use strict';

    kadinskyTer= new THREE.Object3D();
    addRectangle(kadinskyTer, -1.5, -3, 1.5);
}


function createKadinskySec(){
    'use strict';

    kadinskySec= new THREE.Object3D();
    addCube(kadinskySec, -2.5, -2.5, 2.5);
    kadinskyTer.position.set(-5,-5,5);
    kadinskySec.add(kadinskyTer); 
}

function createKadinsky(x, y, z){
    'use strict';

    kadinsky = new THREE.Object3D();
    
    sphere_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addSphere(kadinsky, 0, 0, 0);

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
            if (rotateBallRight)
                rotateBallRight = false;
            rotateBallLeft = !rotateBallLeft;
            break;
        
        case 87: //W
        case 119: //w
            if (rotateBallLeft)
                rotateBallLeft = false;
            rotateBallRight = !rotateBallRight;
            break;

        
        // controlar o angulo θ2 de um ramo secundario
        case 65: //A
        case 97: //a
            if (rotateCubeRight)
                rotateCubeRight = false;
            rotateCubeLeft = !rotateCubeLeft;
            break;
        case 83:  //S
        case 115: //s
            if (rotateCubeLeft)
                rotateCubeLeft = false;
            rotateCubeRight = !rotateCubeRight;
            break;

        //controlar o ângulo θ3 de um ramo terciario.
        case 90: // Z
        case 122: //z
            if(rotateRectangleRight)
                rotateRectangleRight = false;
            rotateRectangleLeft = !rotateRectangleLeft;
            break;

        case 88: //X
        case 120: //x
            if (rotateRectangleLeft)
                rotateRectangleLeft = false;
            rotateRectangleRight = !rotateRectangleRight;
            break;

            


        case 68: //D
        case 100: //d
            /*scene.remove(kadinsky);
            createKadinskyTer(0,0,0);
            createKadinskySec(0,0,0);
            createKadinsky(0, 0, 0);*/
            break;

        case 67: //C
        case 99: //c
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
        // case 81: //Q
        // case 113: //q
        //     rotateBallLeft=false;
        //     break;
        
        // case 87: //W
        // case 119: //w
        //     rotateBallRight=false;
        //     break;

        // // parar a rotação do angulo θ2 de um ramo secundario
        // case 65: //A
        // case 97: //a
        //     rotateCubeLeft = false;
        //     break;
        // case 83:  //S
        // case 115: //s
        //     rotateCubeRight = false;
        //     break;

        // //controlar o ângulo θ3 de um ramo terciario.
        // case 90: // Z
        // case 122: //z
        //     rotateRectangleLeft = false;
        //     break;
    
        // case 88: //X
        // case 120: //x
        //     rotateRectangleRight = false;
        //     break;

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
    /*
    if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }*/
    // Display
    render();
    
    requestAnimationFrame(animate);
}

