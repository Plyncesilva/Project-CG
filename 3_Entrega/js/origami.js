//import * as VRButton from 'VRButton.js';
//import * as THREE from './vendor/three/build/three.module.js';
//const THREE = require("./three");

var camera, camera1, camera2, camera3, camera4, cameraPause;
var clock, currentCameraNumber, camera_before_pause;
var scene, renderer;
var geometry, mesh;

var origami;

var pause, restart;
var paused = false;

var rotateFirstStepLeft = false, rotateFirstStepRight = false;
var rotateSecondStepLeft = false, rotateSecondStepRight = false;
var rotateThirdStepLeft = false, rotateThirdStepRight = false;

var numberHemisf=0;

var planet, rocket, R, garbage = new Array(4);
var rocket_center;
var pointing_UP = true, pointing_DOWN = false;
var pointing_RIGHT = false, pointing_LEFT = false;

var first_step, second_step, third_step;



//coordenadas esfericas
var R, rocket_phi, rocket_theta;


var ground;

function addTriangle(obj, x, y, z, v1, v2, v3) {
    'use strict';
    
    var triangle_material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
    geometry = new THREE.Triangle(v1, v2, v3);
    mesh = new THREE.Mesh(geometry, triangle_material);
    
    mesh.position.set(x, y, z);
    
    obj.add(mesh)
}


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

function create_first_step(){
    'use strict'

    var first_triangle = new THREE.Geometry(); 
    var second_triangle = new THREE.Geometry(); 

    var v1 = new THREE.Vector3(0,-5,0);
    var v2 = new THREE.Vector3(0,0,20);
    var v3 = new THREE.Vector3(0,5,0);
    var v4 = new THREE.Vector3(0,0,-20);

    first_triangle.vertices.push(v1);
    first_triangle.vertices.push(v2);
    first_triangle.vertices.push(v3);

    second_triangle.vertices.push(v1);
    second_triangle.vertices.push(v3);
    second_triangle.vertices.push(v4);

    first_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    second_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    
    var first_triangle_material = new THREE.Mesh( first_triangle, new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }));
    var second_triangle_material = new THREE.Mesh( second_triangle, new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }));

    first_step = new THREE.Group();
    first_step.position.set(0,40,30);
    first_step.add(first_triangle_material);
    first_step.add(second_triangle_material);

    first_step.add(new THREE.AxisHelper(10));
    scene.add(first_step);


}


function create_second_step(){

}

function create_third_step(){
    'use strict';
    /*first_step = new THREE.Group();

    geometry = new THREE.CylinderGeometry( 0.8 / Math.sqrt( 2 ), 1 / Math.sqrt( 2 ), 1, 4, 1 ); // new THREE.CylinderGeometry( 13.5, 9.7, 3.4, 4, 2 ); 
    //geometry.rotateZ( Math.PI / 4 );
    geometry.computeVertexNormals(); // normals will be 'flat' normals
    var trapezoid_material = new THREE.MeshBasicMaterial({ color:  0x00ff00 , wireframe: false }); 
    mesh = new THREE.Mesh(geometry, trapezoid_material);
    mesh.scale.set( 4, 2, 10 );
    mesh.position.set(0, 40, 0);
    first_step.add(mesh);

    scene.add(first_step);

    
    second_step = new THREE.Group();

    scene.add(second_step);
    
    //third_step = new THREE.Group();
    //var v1 = new THREE.Vector3(0, 0, 10);
    //var v2 = new THREE.Vector3(10, 0, 0);
    //var v3 = new THREE.Vector3(10, 10, 0);
    //third_step.vertices.push(v1);
    //third_step.vertices.push(v2);
    //third_step.vertices.push(v3);
    //third_step.faces.push( new THREE.Face3( 0, 1, 2 ) );
    //third_step.computeFaceNormals();
    //addTriangle(third_step, 30, 30, 30, v1, v2, v3);


    var triangle = new THREE.Geometry(); 
    var v1 = new THREE.Vector3(0,40,0);
    var v2 = new THREE.Vector3(10,50,-10);
    var v3 = new THREE.Vector3(0,40,-20);

    triangle.vertices.push(v1);
    triangle.vertices.push(v2);
    triangle.vertices.push(v3);

    triangle.faces.push( new THREE.Face3( 0, 1, 2 ) );

    var third_step = new THREE.Mesh( triangle, new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }));
    third_step.rotateY(Math.PI/2);
    scene.add(third_step);
  
    //scene.add(third_step);
    */
}


function createPauseScreen(){
    geometry = new THREE.PlaneGeometry( 100, 200, 100);

    var texture = new THREE.TextureLoader().load('js/pause.png');

    var material = new THREE.MeshBasicMaterial({map:texture});

    pause = new THREE.Mesh(geometry, material);
    pause.invisible = false;
    pause.position.set(50,60,30);
    scene.add(pause);
    
}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxisHelper(10));
    
    createGround();
    create_first_step();
    //createOrigami();
    createPauseScreen();

}

function createCameras() {
    'use strict';

    camera1 =  new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera1.position.set(100,50,0);
    camera1.lookAt(scene.position);
    
    camera2 =  new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);

    camera2.position.set(0, 200, 0);
    camera2.lookAt(scene.position);

    camera3 = new THREE.StereoCamera();

    //camera3.position.set(10,10,10);
    camera4 = new THREE.OrthographicCamera(window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20 );
    
    camera4.position.x = 50;
    camera4.position.y = 50;
    camera4.position.z = 50;
    camera4.lookAt(pause.position);
        
    scene.add(camera1);
    scene.add(camera2);
    scene.add(camera4);
    //scene.add(camera3);

    camera = camera1;
    currentCameraNumber = 1;
    camera_before_pause = 1;
}

function remove_pause_camera(){
    switch(camera_before_pause){
        case 1:
            camera = camera1;
            break;
        case 2:
            camera = camera2;
            break;
        //    case 3:
        //camera = camera3;
        //break;

    }
}

function checkMovement(delta) {
    'use strict';
 
    if(rotateFirstStepLeft){
        first_step.rotateY(delta);
    }

    if(rotateFirstStepRight){
        first_step.rotateY(-delta);
    }

    if(rotateSecondStepLeft){
        second_step.rotateY(delta);
    }

    if(rotateSecondStepRight){
        second_step.rotateY(-delta);
    }

    if(rotateThirdStepLeft){
        third_step.rotateY(delta);
    }

    if(rotateThirdStepRight){
        third_step.rotateY(-delta);
    }


}
function resetOrigami(){
    paused = false;
    pause.invisible = true;
    camera = camera1;
    currentCameraNumber = 1;
    camera_before_pause=1;
    scene.remove(first_step);
    scene.remove(third_step);
    scene.remove(second_step);

    createOrigami();
}

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
    } else if(currentCameraNumber==4){
        if (window.innerHeight > 0 && window.innerWidth > 0) {
            camera.left = window.innerWidth / - 20;
            camera.right = window.innerWidth / 20;
            camera.top = window.innerHeight / 20;
            camera.bottom = window.innerHeight / - 20;
            
        }
    
    }else{
        camera.aspect = window.innerWidth / window.innerHeight;
    }

    camera.updateProjectionMatrix();
}

function onKeyDown(e) {
    'use strict';
    
    switch (e.keyCode) {
        case 81: // Q
        case 113: // q
            rotateFirstStepLeft = true;
            break;

        case 87: // W
        case 119: // w
            rotateFirstStepRight = true;
            break;

        case 69: // E
        case 101: // e
            rotateSecondStepLeft = true;
            break;
        
        case 82: // R
        case 114: // r
            if(paused)
                resetOrigami();
            else
                rotateSecondStepRight = true;
            break;

        case 84: // T
        case 116: // t
            rotateThirdStepLeft = true;
            break;

        case 89: // Y
        case 121: // y
            rotateThirdStepRight = true;
            break;


        case 65: //A
        case 97: //a
            break;

        case 83:  //S
        case 115: //s
            if(paused ==false){
                camera_before_pause = currentCameraNumber;
                camera = camera4;
            }else{
                remove_pause_camera();
            }
            paused = !paused;
       
            pause.invisible = !pause.invisible;
            console.log("invisivel", pause.invisible);
            break;

        case 49: //1
            if(!paused){
                currentCameraNumber=1;
                camera=camera1;
            }
            break;
        case 50: //2
            if(!paused){
                camera=camera2;
                currentCameraNumber=2;
            }
            break;
        case 51: //3
            if(!paused){
                camera=camera3;
                currentCameraNumber=3;
            }
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    switch (e.keyCode) {
        case 81: // Q
        case 113: // q
            rotateFirstStepLeft = false;
            break;

        case 87: // W
        case 119: // w
            rotateFirstStepRight = false;
            break;

        case 69: // E
        case 101: // e
            rotateSecondStepLeft = false;
            break;
        
        case 82: // R
        case 114: // r
            rotateSecondStepRight = false;
            break;

        case 84: // T
        case 116: // t
            rotateThirdStepLeft = false;
            break;

        case 89: // Y
        case 121: // y
            rotateThirdStepRight = false;
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
    if(!paused)
        checkMovement(delta);

    // Display
    render();
    
    requestAnimationFrame(animate);
}

