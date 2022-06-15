//import * as VRButton from 'VRButton.js';
//import * as THREE from './js/three.module.js';
//const THREE = require("./three");

var camera, camera1, camera2, stereoCamera, camera4, cameraPause;
var clock, currentCameraNumber, camera_before_pause;
var scene, renderer;
var geometry, mesh;

var origami;

var pause;
var paused = false;

var rotateFirstStepLeft = false, rotateFirstStepRight = false;
var rotateSecondStepLeft = false, rotateSecondStepRight = false;
var rotateThirdStepLeft = false, rotateThirdStepRight = false;

var first_step, second_step, third_step;


var ground;

//spotlight
var spotlight_1, spotlight_2,  spotlight_3 ;



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

    var v1 = new THREE.Vector3(5,-5,0);
    var v2 = new THREE.Vector3(0,0,10);
    var v3 = new THREE.Vector3(5,5,0);
    var v4 = new THREE.Vector3(0,0,-10);

    first_triangle.vertices.push(v1);
    first_triangle.vertices.push(v2);
    first_triangle.vertices.push(v3);

    second_triangle.vertices.push(v1);
    second_triangle.vertices.push(v3);
    second_triangle.vertices.push(v4);

    first_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    second_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    
    var first_triangle_material = new THREE.Mesh( first_triangle, new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false, side: THREE.DoubleSide }));
    var second_triangle_material = new THREE.Mesh( second_triangle, new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false,  side: THREE.DoubleSide }));

    first_step = new THREE.Group();
    first_step.position.set(0,40,30);
    first_step.add(first_triangle_material);
    first_step.add(second_triangle_material);

    first_step.add(new THREE.AxisHelper(10));
    scene.add(first_step);


}


function create_second_step(){

    var first_triangle = new THREE.Geometry(); 
    var second_triangle = new THREE.Geometry(); 
    var third_triangle = new THREE.Geometry(); 
    var fourth_triangle = new THREE.Geometry(); 
    var fifth_triangle = new THREE.Geometry(); 
    var sixth_triangle = new THREE.Geometry(); 
  

    var v1 = new THREE.Vector3(0,5,0);
    var v2 = new THREE.Vector3(0, 2.5, 5);
    var v3 = new THREE.Vector3(0,-2.5, 3);
    var v4 = new THREE.Vector3(0,-10,0);
    var v5 = new THREE.Vector3(0, -2.5, -3);
    var v6 = new THREE.Vector3(0, 2.5,-5);
    var v7 = new THREE.Vector3(0,0,0);

    first_triangle.vertices.push(v7);
    first_triangle.vertices.push(v1);
    first_triangle.vertices.push(v6);

    second_triangle.vertices.push(v6);
    second_triangle.vertices.push(v7);
    second_triangle.vertices.push(v5);

    third_triangle.vertices.push(v5);
    third_triangle.vertices.push(v7);
    third_triangle.vertices.push(v4);
    
    fourth_triangle.vertices.push(v4);
    fourth_triangle.vertices.push(v7);
    fourth_triangle.vertices.push(v3);
    
    fifth_triangle.vertices.push(v3);
    fifth_triangle.vertices.push(v7);
    fifth_triangle.vertices.push(v2);

    sixth_triangle.vertices.push(v2);
    sixth_triangle.vertices.push(v7);
    sixth_triangle.vertices.push(v1);

    first_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    second_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    third_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    fourth_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    fifth_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    sixth_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    
    var first_triangle_material = new THREE.Mesh( first_triangle, new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false, side: THREE.DoubleSide }));
    var second_triangle_material = new THREE.Mesh( second_triangle, new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false,  side: THREE.DoubleSide }));
    var third_triangle_material = new THREE.Mesh( third_triangle, new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false, side: THREE.DoubleSide }));
    var fourth_triangle_material = new THREE.Mesh( fourth_triangle, new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false,  side: THREE.DoubleSide }));
    var fifth_triangle_material = new THREE.Mesh( fifth_triangle, new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false, side: THREE.DoubleSide }));
    var sixth_triangle_material = new THREE.Mesh( sixth_triangle, new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false,  side: THREE.DoubleSide }));



    second_step = new THREE.Group();
    second_step.position.set(0,40, 0);
    second_step.add(first_triangle_material);
    second_step.add(second_triangle_material);
    second_step.add(third_triangle_material);
    second_step.add(fourth_triangle_material);
    second_step.add(fifth_triangle_material);
    second_step.add(sixth_triangle_material);

    second_step.add(new THREE.AxisHelper(10));
    scene.add(second_step);

}

function create_third_step(){

    var first_triangle = new THREE.Geometry(); 
    var second_triangle = new THREE.Geometry(); 
    var third_triangle = new THREE.Geometry(); 
    var fourth_triangle = new THREE.Geometry(); 
    var fifth_triangle = new THREE.Geometry(); 
    var sixth_triangle = new THREE.Geometry(); 
    var seventh_triangle = new THREE.Geometry(); 
    var eighth_triangle = new THREE.Geometry(); 
  

    var v1 = new THREE.Vector3(0,11,7);
    var v2 = new THREE.Vector3(0, 13, 5);
    var v3 = new THREE.Vector3(0, 12, 3);
    var v4 = new THREE.Vector3(0, 11, 5);
    var v5 = new THREE.Vector3(0, 3, 7);
    var v6 = new THREE.Vector3(0, 2, 4);
    var v7 = new THREE.Vector3(0,0,4);
    var v8 = new THREE.Vector3(0,0,0);
    var v9 = new THREE.Vector3(0,5,-2);
    var v10 = new THREE.Vector3(0,0,-5);
    var v11 = new THREE.Vector3(0,7,-9);
    var v12 = new THREE.Vector3(0,4,4);

    first_triangle.vertices.push(v1);
    first_triangle.vertices.push(v2);
    first_triangle.vertices.push(v3);

    second_triangle.vertices.push(v3);
    second_triangle.vertices.push(v4);
    second_triangle.vertices.push(v6);

    third_triangle.vertices.push(v5);
    third_triangle.vertices.push(v6);
    third_triangle.vertices.push(v4);
    
    fourth_triangle.vertices.push(v6);
    fourth_triangle.vertices.push(v7);
    fourth_triangle.vertices.push(v5);
    
    fifth_triangle.vertices.push(v8);
    fifth_triangle.vertices.push(v7);
    fifth_triangle.vertices.push(v12);

    sixth_triangle.vertices.push(v8);
    sixth_triangle.vertices.push(v9);
    sixth_triangle.vertices.push(v12);

    seventh_triangle.vertices.push(v10);
    seventh_triangle.vertices.push(v9);
    seventh_triangle.vertices.push(v8);

    eighth_triangle.vertices.push(v11);
    eighth_triangle.vertices.push(v10);
    eighth_triangle.vertices.push(v9);

    first_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    second_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    third_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    fourth_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    fifth_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    sixth_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    seventh_triangle.faces.push( new THREE.Face3( 0, 1, 2) );
    eighth_triangle.faces.push( new THREE.Face3( 0, 1, 2) );

    var first_triangle_material = new THREE.Mesh( first_triangle, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false, side: THREE.DoubleSide }));
    var second_triangle_material = new THREE.Mesh( second_triangle, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false,  side: THREE.DoubleSide }));
    var third_triangle_material = new THREE.Mesh( third_triangle, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false, side: THREE.DoubleSide }));
    var fourth_triangle_material = new THREE.Mesh( fourth_triangle, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false,  side: THREE.DoubleSide }));
    var fifth_triangle_material = new THREE.Mesh( fifth_triangle, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false, side: THREE.DoubleSide }));
    var sixth_triangle_material = new THREE.Mesh( sixth_triangle, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false,  side: THREE.DoubleSide }));
    var seventh_triangle_material = new THREE.Mesh( seventh_triangle, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false,  side: THREE.DoubleSide }));
    var eighth_triangle_material = new THREE.Mesh( eighth_triangle, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false,  side: THREE.DoubleSide }));



    third_step = new THREE.Group();
    third_step.position.set(0,35, -30);
    third_step.add(first_triangle_material);
    third_step.add(second_triangle_material);
    third_step.add(third_triangle_material);
    third_step.add(fourth_triangle_material);
    third_step.add(fifth_triangle_material);
    third_step.add(sixth_triangle_material);
    third_step.add(seventh_triangle_material);
    third_step.add(eighth_triangle_material);

    third_step.add(new THREE.AxisHelper(10));
    scene.add(third_step);

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
    create_second_step();
    create_third_step();
    //createOrigami();
    createPauseScreen();
    createSpotlight();

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

    stereoCamera = new THREE.StereoCamera();



    camera4 = new THREE.OrthographicCamera(window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20 );
    camera4.position.x = 50;
    camera4.position.y = 50;
    camera4.position.z = 50;
    camera4.lookAt(pause.position);
        
    scene.add(camera1);
    scene.add(camera2);
    scene.add(camera4);

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
        //camera = stereoCamera;
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

function createSpotlight() {
    'use strict';
    
    spotlight_1 = new THREE.SpotLight ( 0xffffff, 50, 20, Math.PI*0.05, 0.25, 0.5 );
    spotlight_1.position.set( 30, 30, 25 );
    spotlight_1.target.position.set( first_step.position.x, first_step.position.y, first_step.position.z );

    scene.add(spotlight_1);
    scene.add(spotlight_1.target);

    //spotlight_2 = new THREE.SpotLight ( color, int, dist, angle, penunumbra, decay );
    //spotlight_2.position.set( slposx, slposy, slposz );
    //spotlight_2.target.position.set( tposx, tposy, tposz );

    //spotlight_3 = new THREE.SpotLight ( color, int, dist, angle, penunumbra, decay );
    //spotlight_3.position.set( slposx, slposy, slposz );
    //spotlight_3.target.position.set( tposx, tposy, tposz );

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
                camera=stereoCamera;
                currentCameraNumber=3;
            }
            break;
        
        //spotligth
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

