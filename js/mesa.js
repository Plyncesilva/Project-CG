/*global THREE, requestAnimationFrame, console*/

const { OrthographicCamera } = require("./three");

var camera, scene, renderer;

var geometry, material, mesh;

var sphere_material, cube_material, rectangle_material;

var ball;
var rotateBallLeft = false, rotateBallRight = false;

var kadinsky;

var clock = new THREE.Clock();

function addTableLeg(obj, x, y, z) {
    'use strict';
                                    //x (vermelho) , z(verde), y(azul) 
    geometry = new THREE.CubeGeometry(0, 5, 5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
}

function addTableTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(60, 2, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createBall(x, y, z) {
    'use strict';
    
    ball = new THREE.Object3D();
    //ball.userData = { jumping: true, step: 0 };
    
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.SphereGeometry(5, 0, 0);
    mesh = new THREE.Mesh(geometry, material);
    
    ball.add(mesh);
    ball.position.set(x, y, z);
    
    scene.add(ball);
}


function addSphere(obj, x, y, z) {
    'use strict';
    
    //material.color = 0xdd00cc;

    // ball = new THREE.Object3D();
    //ball.userData = { jumping: true, step: 0 };
    
    // material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.SphereGeometry(5, 10, 10);
    mesh = new THREE.Mesh(geometry, sphere_material);
    
    // ball.add(mesh);
    mesh.position.set(x, y, z);
    
    obj.add(mesh)
}

function addCube(obj, x, y, z) {
    'use strict';
    //material.color = 0x1100cc;
                                    //x (vermelho) , z(verde), y(azul) 
    geometry = new THREE.CubeGeometry(5, 5, 5);
    mesh = new THREE.Mesh(geometry, cube_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRectangle(obj, x, y, z) {
    'use strict';
    //material.color = 0x1100cc;
                                    //x (vermelho) , z(verde), y(azul) 
    geometry = new THREE.CubeGeometry(3, 6, 3);
    mesh = new THREE.Mesh(geometry, rectangle_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addPyramid(obj, x, y, z) {
    'use strict';
    //material.color = 0xffffff;
                                    //x (vermelho) , z(verde), y(azul) 
    geometry = new THREE.TetrahedronGeometry(3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    mesh.rotation.y = Math.PI / 4;
    mesh.rotation.x = Math.PI;
    // mesh.rotation.x = Math.PI;
    
    obj.add(mesh);
}

function createKadinsky(x, y, z){
    'use strict';

    kadinsky = new THREE.Object3D();
    
    sphere_material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    cube_material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    rectangle_material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
   
    addSphere(kadinsky, 15, 19.625, -2.5);
    addCube(kadinsky, 10, 15, 2.5);
    // addPyramid(kadinsky, 7.5, 11.2, 5);
    addRectangle(kadinsky, 6, 9.5, 6.5);    

    scene.add(kadinsky);
    
    kadinsky.position.x = x;
    kadinsky.position.y = y;
    kadinsky.position.z = z;

}

function createTable(x, y, z) {
    'use strict';
    
    var table = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
   
    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -25, -1, -8);
    addTableLeg(table, -25, -1, 8);
    addTableLeg(table, 25, -1, 8);
    addTableLeg(table, 25, -1, -8);
    
    scene.add(table);
    
    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    

    scene.add(new THREE.AxisHelper(10));
    
    createKadinsky(0, 0, 0);
    //15, 19.625, -2.5
    //createKadinsky(15, 19.625, -2.5);
    //createTable(0, 8, 0);
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);
}

function createCamera_xy() {
    'use strict';
    camera = new THREE.OrthographicCamera( -10, 40, 50, -20, 1, 1000 );
    // camera = new THREE.PerspectiveCamera(70,
    //                                      window.innerWidth / window.innerHeight,
    //                                      1,
    //                                      1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 100;
    camera.lookAt(scene.position);
}

function createCamera_xz() {
    'use strict';
    camera = new THREE.OrthographicCamera( -10, 40, 20, -20, 1, 1000 );
    // camera = new THREE.PerspectiveCamera(70,
    //                                      window.innerWidth / window.innerHeight,
    //                                      1,
    //                                      1000);
    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 0;
    camera.lookAt(scene.position);
}


function checkRotate() {
    'use strict';

    if(rotateBallLeft){
        // 15, 19.625, -2.5);
        kadinsky.position.set(-15,-19.625,+2.5);
        kadinsky.rotateX(1);
        

    }

    if(rotateBallRight)
        kadinsky.rotateX(-1);    
    
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function onKeyDown(e) {
    'use strict';
    
    switch (e.keyCode) {
    case 49: //1
        createCamera();
        render();
        break;
    case 50: //2
        createCamera_xy();
        render();
        break;
    case 51: //3
        createCamera_xz();
        render();
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
        rotateBallLeft=true;
        break;
    
    case 87: //W
    case 119: //w
        rotateBallRight=true;
        break;

    
    // controlar o angulo θ2 de um ramo secundario
    case 65: //A
    case 97: //a
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;
    case 83:  //S
    case 115: //s
        ball.userData.jumping = !ball.userData.jumping;
        break;

    //controlar o ângulo θ3 de um ramo terciario.
    case 90: // Z
    case 122: //z
        break;

    case 88: //X
    case 120: //x
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
    //controlar  angulo θ1 que roda todo o objecto
    case 81: //Q
    case 113: //q
        rotateBallLeft=false;
        break;
    
    case 87: //W
    case 119: //w
        rotateBallRight=false;
        break;
    }


}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
   
    createScene();
    createCamera();
    
    render();
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    checkRotate();
    /*
    if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }*/
    render();
    
    requestAnimationFrame(animate);
}

