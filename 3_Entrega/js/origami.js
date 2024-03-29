//import * as VRButton from 'VRButton.js';
//import * as THREE from './js/three.module.js';
//const THREE = require("./three");

var camera, camera1, camera2, stereoCamera;
var clock, currentCameraNumber;
var scene, pauseScene, renderer;
var geometry, mesh;

var first_step_materials, second_step_materials, third_step_materials;
var activeMaterial = 1;
var previousMaterial = -1;

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
        4, -8, 0,     0, 0, 8,     4, 8, 0,
        4, -8, 0,     0, 0, -8,    4, 8, 0     
    ])
    
    let first_step_geometry = new THREE.BufferGeometry();
    first_step_geometry.setAttribute("position", new THREE.BufferAttribute(first_step_vertices, 3) );
    first_step_geometry.addAttribute( 'uv', new THREE.BufferAttribute( quad_uvs, 2 ));

    first_step_geometry.computeVertexNormals();

    first_step = new THREE.Mesh(first_step_geometry, first_step_materials[activeMaterial]);
    
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

    second_step = new THREE.Mesh(second_step_geometry, second_step_materials[activeMaterial]);

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

    third_step = new THREE.Mesh(third_step_geometry, third_step_materials[activeMaterial]);

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
    geometry = new THREE.PlaneGeometry( 50, 50, 50);

    var texture = new THREE.TextureLoader().load('js/pause.png');

    var material = new THREE.MeshBasicMaterial({map:texture});

    pause = new THREE.Mesh(geometry, material);
    pause.invisible = false;
    pause.position.set(0, 0, 0);
    pause.rotateY(Math.PI/2);
    pauseScene.add(pause);
    
}

function createMaterials(){
    first_step_materials = new Array(3);
    second_step_materials = new Array(3);
    third_step_materials = new Array(3);

    const first_step_texture = new THREE.TextureLoader().load('js/texture_sea.jpg');
    first_step_materials[0] = new THREE.MeshBasicMaterial({map: first_step_texture, wireframe: false, side: THREE.DoubleSide});
    first_step_materials[1] = new THREE.MeshLambertMaterial({map: first_step_texture, wireframe: false, side: THREE.DoubleSide});
    first_step_materials[2] = new THREE.MeshPhongMaterial({map: first_step_texture, wireframe: false, side: THREE.DoubleSide});

    const second_step_texture = new THREE.TextureLoader().load('js/texture_fire.jpg');
    second_step_materials[0] = new THREE.MeshBasicMaterial({map: second_step_texture, wireframe: false, side: THREE.DoubleSide});
    second_step_materials[1] = new THREE.MeshLambertMaterial({map: second_step_texture, wireframe: false, side: THREE.DoubleSide});
    second_step_materials[2] = new THREE.MeshPhongMaterial({map: second_step_texture, wireframe: false, side: THREE.DoubleSide});

    const third_step_texture = new THREE.TextureLoader().load('js/texture_flowers.jpg');
    third_step_materials[0] = new THREE.MeshBasicMaterial({map: third_step_texture, wireframe: false, side: THREE.DoubleSide});
    third_step_materials[1] = new THREE.MeshLambertMaterial({map: third_step_texture, wireframe: false, side: THREE.DoubleSide});
    third_step_materials[2] = new THREE.MeshPhongMaterial({map: third_step_texture, wireframe: false, side: THREE.DoubleSide});
    
}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxisHelper(10));
    
    createGround();

    createMaterials();

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
    
    camera2 = new THREE.OrthographicCamera(window.innerWidth / - 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10 );    

    camera2.position.set(200, 20, 0);
    camera2.lookAt(scene.position);

    stereoCamera = new THREE.StereoCamera();
        
    scene.add(camera1);
    scene.add(camera2);

    camera = camera1;
    currentCameraNumber = 1;
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

function createSpotlight() {
    'use strict';
    
    body_spotlight_1 = new THREE.Group();
    addSphere(body_spotlight_1,  first_step.position.x, first_step.position.y + 20, first_step.position.z, 3, 10, 10);
    addCone(body_spotlight_1,  first_step.position.x, first_step.position.y + 17, first_step.position.z  )

    scene.add(body_spotlight_1);

    spotlight_1 = new THREE.SpotLight (0xffffff);
    spotlight_1.intensity = 5;
    spotlight_1.distance = 300;
    spotlight_1.angle = Math.PI/6;
    spotlight_1.position.set(20, 50,40 );
    spotlight_1.target.position.set(0, 40, 40);
    spotlight_1.target.updateMatrixWorld();
    scene.add(spotlight_1.target);

    spotlight_1.castShadow = true

    scene.add(spotlight_1);

    //spotlight_2
    body_spotlight_2 = new THREE.Group();
    addSphere(body_spotlight_2, 0, 60, 0, 3, 10, 10);
    addCone(body_spotlight_2, 0, 57, 0 );

    scene.add(body_spotlight_2);

    spotlight_2 = new THREE.SpotLight ( 0xffffff);
    spotlight_2.intensity = 5;
    spotlight_2.distance = 200;
    spotlight_2.angle = Math.PI/5;
    spotlight_2.position.set(30, 60,0 );
    spotlight_2.target.position.set(0, 40, 0);
    spotlight_2.target.updateMatrixWorld();
    scene.add(spotlight_2.target);

    spotlight_2.castShadow = true

    scene.add(spotlight_2);

    //spotlight_3
    body_spotlight_3 = new THREE.Group();
    addSphere(body_spotlight_3, third_step.position.x, third_step.position.y + 24, third_step.position.z, 3, 10, 10);
    addCone(body_spotlight_3, third_step.position.x, third_step.position.y + 21, third_step.position.z );

    scene.add(body_spotlight_3);

    spotlight_3 = new THREE.SpotLight ( 0xffffff);
    spotlight_3.intensity = 5;
    spotlight_3.distance = 300;
    spotlight_3.angle = Math.PI/6;
    spotlight_3.position.set(30, 60, -20 );
    spotlight_3.target.position.set(0, 40, -40);
    spotlight_3.target.updateMatrixWorld();
    scene.add(spotlight_3.target);
    spotlight_3.penumbra = .2;
    spotlight_3.castShadow = true

    scene.add(spotlight_3);

}

function resetOrigami(){
    ispause = false;
    pause.invisible = true;
    camera = camera1;
    currentCameraNumber = 1;

    scene.remove(first_step);
    scene.remove(third_step);
    scene.remove(second_step);
    scene.remove(spotlight_1);
    scene.remove(spotlight_2);
    scene.remove(spotlight_3);
    scene.remove(dlight);

    activeMaterial = 1;

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
            camera.left = window.innerWidth / - 10;
            camera.right = window.innerWidth / 10;
            camera.top = window.innerHeight / 10;
            camera.bottom = window.innerHeight / - 10;
            
        }
    } else{
        camera.aspect = window.innerWidth / window.innerHeight;
    }

    camera.updateProjectionMatrix();
}

function switchMaterial_A() {
    
    if (activeMaterial == 1) {
        activeMaterial = 2;
    }
    else{
        activeMaterial = 1;
    }    
}   

function switchMaterial_S() {
    if (activeMaterial == 0){
        activeMaterial = previousMaterial;
        previousMaterial = activeMaterial;
    }
    else{
        previousMaterial = activeMaterial;
        activeMaterial = 0;
    }
}

function updateMaterials() {
    first_step.material = first_step_materials[activeMaterial];
    second_step.material = second_step_materials[activeMaterial];
    third_step.material = third_step_materials[activeMaterial];
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
            switchMaterial_A();
            updateMaterials();
            break;

        case 83: //S
        case 115: //s
            switchMaterial_S();
            updateMaterials();
            break;

        case 32:  //space
            ispause = !ispause;
            pause.invisible = !pause.invisible;
            if(ispause==true){
                camera1.lookAt(pause.position);
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
    // stereoCamera.update(stereoCamera.cameraL);
    // stereoCamera.update(stereoCamera.cameraR);
    
    // const size = new THREE.Vector2();
    // renderer.getSize(size);

    // renderer.setScissorTest(true);
    
    // renderer.setScissor(0, 0, size.width / 2, size.height);
    // renderer.setViewport(0, 0, size.width / 2, size.height);
    // renderer.render(scene, stereoCamera.cameraL);

    // renderer.setScissor(size.width / 2, 0, size.width / 2, size.height);
    // renderer.setViewport(size.width / 2, 0, size.width / 2, size.height);
    // renderer.render(scene, stereoCamera.cameraR);
    // renderer.setScissorTest(false);

        
       
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera);
    if (ispause){
        renderer.clearDepth();
        renderer.render(pauseScene, camera); 
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

