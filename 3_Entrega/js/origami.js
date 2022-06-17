//import * as VRButton from 'VRButton.js';
//import * as THREE from './js/three.module.js';
//const THREE = require("./three");

var camera, camera1, camera2, stereoCamera;
var clock, currentCameraNumber, camera_before_pause;
var scene, pauseScene, renderer;
var geometry, mesh;

var pause;
var ispause = false;

var rotateFirstStepLeft = false, rotateFirstStepRight = false;
var rotateSecondStepLeft = false, rotateSecondStepRight = false;
var rotateThirdStepLeft = false, rotateThirdStepRight = false;

//origami
var origami;

var first_step, second_step, third_step, ghost;


var ground;


//diretional light
var dlight;

//spotlight
var spotlight_1, spotlight_2,  spotlight_3 ;
var body_spotlight_1, body_spotlight_2, body_spotlight_3;



function addCone(obj, x, y, z) {
    'use strict';
    
    var cone_material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
    geometry =  new THREE.ConeGeometry(2, 4)
    mesh = new THREE.Mesh(geometry, cone_material);
    
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


function addSphere(obj, x, y, z, dimx, dimy, dimz) {
    'use strict';
    
    var sphere_material = new THREE.MeshBasicMaterial({ color: 0x0011aa, wireframe: false });
    geometry = new THREE.SphereGeometry(dimx, dimy, dimz);
    mesh = new THREE.Mesh(geometry, sphere_material);
    
    mesh.position.set(x, y, z);
    
    obj.add(mesh)
}

function addRectangle(obj, x, y, z, dimx, dimy, dimz, color_ground) {
    'use strict';

    var rectangle_material = new THREE.MeshLambertMaterial({ color: color_ground, wireframe: false }); 
    geometry = new THREE.BoxGeometry(dimx, dimy, dimz);
    mesh = new THREE.Mesh(geometry, rectangle_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createGround(){
    'use strict';

    ground = new THREE.Group();
    
    addRectangle(ground, 0,0,0, 1000, 10,1000, 0x230062);
    addRectangle(ground, 0,10,0, 150, 10, 150,0x00FFFF );
    addRectangle(ground, 0,20,0, 120, 10,120, 0xFF0000);
    scene.add(ground);
}

function create_first_step(){
    'use strict'

    let quad_uvs = new Float32Array( [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]);

    let first_step_vertices = new Float32Array( [
        // Each group of 3 numbers is a vertex
        5, -5, 0,     0, 0, 10,     5, 5, 0,
        5, -5, 0,     0, 0, -10,    5, 5, 0     
    ])

    let quad_indices = new Uint32Array( [
        0, 1, 2, 0, 3, 2
    ]);


    
    let first_step_geometry = new THREE.BufferGeometry();
    first_step_geometry.setAttribute("position", new THREE.BufferAttribute(first_step_vertices, 3) );
    first_step_geometry.addAttribute( 'uv', new THREE.BufferAttribute( quad_uvs, 2 ));
    // first_step_geometry.setIndex( new THREE.BufferAttribute( quad_indices, 2) );

    first_step_geometry.computeVertexNormals();

    const texture = new THREE.TextureLoader().load('js/texture_sea.jpg');
    let material = new THREE.MeshLambertMaterial({wireframe: false, side: THREE.DoubleSide, map: texture});
    material.shading = THREE.FlatShading;
    material.shading = THREE.SmoothShading;
    first_step_geometry.normalsNeedUpdate = true;
    first_step = new THREE.Mesh(first_step_geometry, material);

    
    first_step.position.set(0, 40, 40);

    scene.add(first_step);


}


function create_second_step(){

    let quad_uvs = new Float32Array( [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]);

    let second_step_vertices = new Float32Array( [
        // Each group of 3 numbers is a vertex
        0, 0, 0,     0, 5, 0,     0, 2.5, -5,
        0, 2.5, -5,     0, 0, 0,    0, -2.5, -3,     
        0, -2.5, -3,     0, 0, 0,    0, -10, 0,     
        0, -2.5, 3,     0, 0, 0,    0, -10, 0,
        0, 2.5, 5,      0, 0, 0,    0, -2.5, 3,     
        0, 5, 0,      0, 0, 0,    0, 2.5, 5
    ])

    let second_step_geometry = new THREE.BufferGeometry();
    second_step_geometry.setAttribute("position", new THREE.BufferAttribute(second_step_vertices, 3) );
    second_step_geometry.addAttribute( 'uv', new THREE.BufferAttribute( quad_uvs, 2 ));

    second_step_geometry.computeVertexNormals();

    const texture = new THREE.TextureLoader().load('js/texture_fire.jpg');
    second_step = new THREE.Mesh(second_step_geometry, new THREE.MeshLambertMaterial({map: texture, wireframe: false, side: THREE.DoubleSide}));

    second_step.position.set(0,40, 0);

    scene.add(second_step);

}

function create_third_step(){

    let quad_uvs = new Float32Array( [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]);

    let third_step_vertices = new Float32Array( [
        // Each group of 3 numbers is a vertex
        0, 11, 7,     0, 13, 5,     0, 12, 3,
        0, 12, 3,     0, 11, 5,    0, 2, 4,     
        0, 3, 7,     0, 2, 4,    0, 11, 5,     
        0, 2, 4,     0, 0, 4,    0, 3, 7,
        0, 0, 0,      0, 0, 4,    0, 4, 4,     
        0, 0, 0,      0, 5, -2,    0, 4, 4,
        0, 0, -5,      0, 5, -2,    0, 0, 0,
        0, 7, -9,      0, 0, -5,    0, 5, -2
    ])

    let third_step_geometry = new THREE.BufferGeometry();
    third_step_geometry.setAttribute("position", new THREE.BufferAttribute(third_step_vertices, 3) );
    third_step_geometry.setAttribute( 'uv', new THREE.BufferAttribute( quad_uvs, 2 ));

    third_step_geometry.computeVertexNormals();

    const texture = new THREE.TextureLoader().load('js/texture_flowers.jpg');
    third_step = new THREE.Mesh(third_step_geometry, new THREE.MeshLambertMaterial({map: texture, wireframe: false, side: THREE.DoubleSide}));

    third_step.position.set(0, 35, -40);

    scene.add(third_step);

}

function createDirectionalLight(){
    // directional light
    dlight = new THREE.DirectionalLight( 0xFFFFFF, 5 );
    dlight.position.set( 40, 100, 0 );
    dlight.target.position.set( 0, 0, 0 );
    scene.add(dlight);
    scene.add(dlight.target);

}

function createPauseScreen(){
    pauseScene = new THREE.Scene();
    
    pauseScene.add(new THREE.AxisHelper(10));
    geometry = new THREE.PlaneGeometry( 100, 200, 100);

    var texture = new THREE.TextureLoader().load('js/pause.png');

    var material = new THREE.MeshBasicMaterial({map:texture});

    pause = new THREE.Mesh(geometry, material);
    pause.invisible = false;
    pause.position.set(90, 60, 0);
    pauseScene.add(pause);
    
}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxisHelper(10));
    
    createGround();

    create_first_step();
    create_second_step();
    create_third_step();

    createPauseScreen();
    
    createSpotlight();
    createDirectionalLight();

}

function createCameras() {
    'use strict';

    camera1 =  new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera1.position.set(150,60,0);
    camera1.lookAt(scene.position);
    
    camera2 = new THREE.OrthographicCamera(window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / -20 );    

    camera2.position.set(0, 50, 0);
    camera2.lookAt(scene.position);

    stereoCamera = new THREE.StereoCamera();

    /*camera4 = new THREE.OrthographicCamera(window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20 );
    camera4.position.x = 50;
    camera4.position.y = 50;
    camera4.position.z = 50;
    camera4.lookAt(pause.position);*/
        
    scene.add(camera1);
    scene.add(camera2);
    //scene.add(camera4);

    camera = camera1;
    currentCameraNumber = 1;
    //camera_before_pause = 1;
}

/*
function remove_pause_camera(){
    switch(camera_before_pause){
        case 1:
            camera = camera1;
            break;
        case 2:
            camera = camera2;
            break;
        //    case 4:
        //camera = stereoCamera;
        //break;

    }
}*/

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

function createSpotlight() {
    'use strict';
    
    body_spotlight_1 = new THREE.Group();
    addSphere(body_spotlight_1,  first_step.position.x, first_step.position.y + 20, first_step.position.z, 3, 10, 10);
    addCone(body_spotlight_1,  first_step.position.x, first_step.position.y + 17, first_step.position.z  )

    scene.add(body_spotlight_1);

    spotlight_1 = new THREE.SpotLight ( 0xffffff, 5, 100, Math.PI, 10 );
    spotlight_1.position.set(30, 60,20 );
    spotlight_1.lookAt( first_step.position.x, first_step.position.y, first_step.position.z );
    spotlight_1.target = first_step;

    spotlight_1.penumbra = .2;
    spotlight_1.castShadow = true

    var spotlighthelper = new THREE.SpotLightHelper(spotlight_1);
    scene.add(spotlighthelper);

    scene.add(spotlight_1);
    scene.add(spotlight_1.target);

    body_spotlight_2 = new THREE.Group();
    addSphere(body_spotlight_2, 0, 60, 0, 3, 10, 10);
    addCone(body_spotlight_1, 0, 57, 0 );

    scene.add(body_spotlight_2);

    spotlight_2 = new THREE.SpotLight ( 0xffffff, 5, 100, Math.PI, 10 );
    spotlight_2.position.set(30, 60,0 );
    spotlight_2.lookAt( second_step.position.x, second_step.position.y, second_step.position.z );
    spotlight_2.penumbra = .2;
    spotlight_2.castShadow = true

    var spotlighthelper2 = new THREE.SpotLightHelper(spotlight_2);
    scene.add(spotlighthelper2);

    scene.add(spotlight_2);

    
    body_spotlight_3 = new THREE.Group();
    addSphere(body_spotlight_3, third_step.position.x, third_step.position.y + 24, third_step.position.z, 3, 10, 10);
    addCone(body_spotlight_1, third_step.position.x, third_step.position.y + 21, third_step.position.z );

    scene.add(body_spotlight_3);

    spotlight_3 = new THREE.SpotLight ( 0xffffff, 5, 100, Math.PI, 10 );
    spotlight_3.position.set(30, 60, -20 );
    spotlight_3.lookAt( third_step.position.x, third_step.position.y,third_step.position.z );
    spotlight_3.penumbra = .2;
    spotlight_3.castShadow = true

    var spotlighthelper3 = new THREE.SpotLightHelper(spotlight_3);
    scene.add(spotlighthelper3);

    scene.add(spotlight_3);

}

function resetOrigami(){
    ispause = false;
    pause.invisible = true;
    camera = camera1;
    currentCameraNumber = 1;
    //camera_before_pause=1;
    scene.remove(first_step);
    scene.remove(third_step);
    scene.remove(second_step);
    scene.remove(spotlight_1);
    scene.remove(spotlight_2);
    scene.remove(spotlight_3);
    scene.remove(dlight);

    createSpotlight();
    createDirectionalLight();
    create_first_step();
    create_second_step();
    create_third_step();
}

function onResize() {
    'use strict';
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if(currentCameraNumber==2){
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

        case 32:  //space
            ispause = !ispause;
            pause.invisible = !pause.invisible;
            if(ispause==true){

           
                camera2.lookAt(pause.position);
                camera2.lookAt(pause.position);
            }else{

                camera1.lookAt(scene.position);
                camera2.lookAt(scene.position);
            }
            break;

        case 49: //1
            currentCameraNumber=1;
            camera=camera1;
            break;
        case 50: //2
            camera=camera2;
            currentCameraNumber=2;
            break;
        case 51: //3
            if(ispause)
                resetOrigami();
            break;
        
        //light 
        case 68: // D
        case 100: //d
            dlight.visible = !dlight.visible;
            break;
        
        //spotlight
        case 90: // Z
        case 122: //z
            spotlight_1.visible = !spotlight_1.visible;
            break;

        case 88: //X
        case 120: //x
            spotlight_2.visible = !spotlight_2.visible;
            break;
        
        case 67: //C
        case 99: //c
            spotlight_3.visible = !spotlight_3.visible;
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
    //stereoCamera.update();
    
    //const size = new THREE.Vector2();
    //renderer.getSize(size);

    //renderer.setScissorTest(true);
    
    //renderer.setScissor(0, 0, size.width / 2, si//ze.height);
    //renderer.setViewport(0, 0, size.width / 2, s//ize.height);
    //renderer.render(scene, stereoCamera.cameraL)//;
//
    ////renderer.setScissor(size.width / 2, 0, size.width / 2, size.height);
    ////renderer.setViewport(size.width / 2, 0, size.width / 2, size.height);
    //renderer.render(scene, stereoCamera.cameraR);
    //renderer.setScissorTest(false);

        
       
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera);
    if (ispause){
        renderer.clearDepth();
        renderer.render(pauseScene, camera); //???????pauseCamera em vez de camera
    } 
}

function init() {
    'use strict';

    clock =  new THREE.Clock();
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild( VRButton.createButton( renderer ) );
    
    renderer.xr.enabled = true;
    
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
    if(!ispause)
        checkMovement(delta);

    // Display
    render();
    
    requestAnimationFrame(animate);
}

