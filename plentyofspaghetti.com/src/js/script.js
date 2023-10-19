import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as Ammo from 'ammo.js';

import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/meatballs/1.jpg';
import mercuryTexture from '../img/meatballs/2.png';
import venusTexture from '../img/meatballs/3.png';
import earthTexture from '../img/meatballs/1.jpg';
import marsTexture from '../img/meatballs/2.png';
import jupiterTexture from '../img/meatballs/3.png';
import saturnTexture from '../img/meatballs/1.jpg';
import saturnRingTexture from '../img/sauce/1.png';
import uranusTexture from '../img/meatballs/2.png';
import uranusRingTexture from '../img/sauce/2.png';
import neptuneTexture from '../img/meatballs/3.png';
import plutoTexture from '../img/olives/1.png';

Ammo().then(function(Ammo) {
    var clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const orbit = new OrbitControls(camera, renderer.domElement);

    camera.position.set(-90, 140, 140);
    orbit.update();

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    scene.background = cubeTextureLoader.load([
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture
    ]);

    const textureLoader = new THREE.TextureLoader();

    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(sunTexture)
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    var physicsWorld;
    var gravityConstant = -8.9; // reduce gravity cause we are in space guys and apply it rotation not downward

    var collisionConfiguration;
    var dispatcher;
    var broadphase;
    var solver;
    var rigidBodies = [];
    var margin = 0.05;
    var spaghetti;
    var transformAux1 = new Ammo.btTransform();
    var time = 0;

    collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    softBodySolver = new Ammo.btDefaultSoftBodySolver();
    physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
    physicsWorld.setGravity( new Ammo.btVector3( gravityConstant, 0, gravityConstant ) ); // outward, downward, z
    physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( gravityConstant, 0, gravityConstant ) );

    function createPlanet(size, texture, position, spaghettiColor, ring) {
        const geo = new THREE.SphereGeometry(size, 30, 30);
        const mat = new THREE.MeshStandardMaterial({
            map: textureLoader.load(texture)
        });
        const mesh = new THREE.Mesh(geo, mat);
        const obj = new THREE.Object3D();
        obj.add(mesh);

        // Used to bind to the end of each spaghetti
        const refObj = new THREE.Object3D();
        refObj.position.x = position;
        scene.add(refObj);

        if (ring) {
            const ringGeo = new THREE.RingGeometry(
                ring.innerRadius,
                ring.outerRadius,
                32);
            const ringMat = new THREE.MeshBasicMaterial({
                map: textureLoader.load(ring.texture),
                side: THREE.DoubleSide
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            obj.add(ringMesh);
            ringMesh.position.x = position;
            ringMesh.rotation.x = -0.5 * Math.PI;
        }
        scene.add(obj);
        mesh.position.x = position;

        // The spaghetti
        // spaghetti graphic object
        var spaghettiNumSegments = 10;
        var spaghettiLength = 4;
        const spaghettiMass = 3;
        var spaghettiPos = obj.position.clone();
        spaghettiPos.x += position;
        spaghettiPos.z += position;

        var segmentLength = spaghettiLength / spaghettiNumSegments;
        const spaghettiGeometry = new THREE.BufferGeometry();
        const spaghettiMaterial = new THREE.LineBasicMaterial( { color: spaghettiColor } );
        var spaghettiPositions = [];
        var spaghettiIndices = [];

        for ( var i = 0; i < spaghettiNumSegments + 1; i++ ) {
            spaghettiPositions.push( spaghettiPos.x + i * segmentLength, spaghettiPos.y, spaghettiPos.z + i * segmentLength );
        }

        for ( var i = 0; i < spaghettiNumSegments; i++ ) {
            spaghettiIndices.push( i, i + 1 );
        }

        spaghettiGeometry.setIndex( new THREE.BufferAttribute( new Uint16Array( spaghettiIndices ), 1 ) );
        spaghettiGeometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( spaghettiPositions ), 3 ) );
        spaghettiGeometry.computeBoundingSphere();
        spaghetti = new THREE.LineSegments( spaghettiGeometry, spaghettiMaterial );
        spaghetti.castShadow = false;
        spaghetti.receiveShadow = false;
        scene.add( spaghetti );

        // spaghetti physic object
        const softBodyHelpers = new Ammo.btSoftBodyHelpers();
        const spaghettiStart = new Ammo.btVector3( spaghettiPos.x, spaghettiPos.y, spaghettiPos.z );
        const spaghettiEnd = new Ammo.btVector3( spaghettiPos.x + spaghettiLength, spaghettiPos.y, spaghettiPos.z + spaghettiLength );
        const spaghettiSoftBody = softBodyHelpers.CreateRope( physicsWorld.getWorldInfo(), spaghettiStart, spaghettiEnd, spaghettiNumSegments - 1, 0 );
        const sbConfig = spaghettiSoftBody.get_m_cfg();
        sbConfig.set_viterations( 10 );
        sbConfig.set_piterations( 10 );
        spaghettiSoftBody.setTotalMass( spaghettiMass, false );
        Ammo.castObject( spaghettiSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin * 3 );
        physicsWorld.addSoftBody( spaghettiSoftBody, 1, - 1 );
        spaghetti.userData.physicsBody = spaghettiSoftBody;
        // Disable deactivation
        spaghettiSoftBody.setActivationState( 4 );

        // set bounds of spaghetti
        var influence = 1;
        spaghettiSoftBody.appendAnchor( 0, mesh.userData.physicsBody, true, influence );
        spaghettiSoftBody.appendAnchor( spaghettiNumSegments, refObj.userData.physicsBody, true, influence );

        return { mesh, obj, spaghetti, refObj }
    }

    const mercury = createPlanet(3.2, mercuryTexture, 28, 0xf0dd99);
    const venus = createPlanet(5.8, venusTexture, 44, 0xedd683);
    const earth = createPlanet(6, earthTexture, 62, 0xf0dd99);
    const mars = createPlanet(4, marsTexture, 78, 0xedd683);
    const jupiter = createPlanet(12, jupiterTexture, 100, 0xf0dd99);
    const saturn = createPlanet(10, saturnTexture, 138, 0xedd683, {
        innerRadius: 10,
        outerRadius: 20,
        texture: saturnRingTexture
    });
    const uranus = createPlanet(7, uranusTexture, 176, 0xf0dd99, {
        innerRadius: 7,
        outerRadius: 12,
        texture: uranusRingTexture
    });
    const neptune = createPlanet(7, neptuneTexture, 200, 0xedd683);
    const pluto = createPlanet(2.8, plutoTexture, 216, 0xf0dd99);

    const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
    scene.add(pointLight);

    function animate() {
        var deltaTime = clock.getDelta();

        //Self-rotation
        sun.rotateY(0.004);
        mercury.mesh.rotateY(0.004);
        venus.mesh.rotateY(0.002);
        earth.mesh.rotateY(0.02);
        mars.mesh.rotateY(0.018);
        jupiter.mesh.rotateY(0.04);
        saturn.mesh.rotateY(0.038);
        uranus.mesh.rotateY(0.03);
        neptune.mesh.rotateY(0.032);
        pluto.mesh.rotateY(0.008);

        //Around-sun-rotation
        mercury.obj.rotateY(0.04);
        mercury.refObj.x = mercury.refObj.x * Math.cos(0.04) - mercury.refObj.z * Math.sin(0.04);
        mercury.refObj.z = mercury.refObj.x * Math.sin(0.04) + mercury.refObj.z * Math.cos(0.04);
        //mercury.refObj.enableAngularMotor( true, 1.5 * 0.04, 50);
        // Update spaghetti
        var softBody = mercury.spaghetti.userData.physicsBody;
        var spaghettiPositions = mercury.spaghetti.geometry.attributes.position.array;
        var numVerts = spaghettiPositions.length / 3;
        var nodes = softBody.get_m_nodes();
        var indexFloat = 0;
        for ( var i = 0; i < numVerts; i ++ ) {
            var node = nodes.at( i );
            var nodePos = node.get_m_x();
            spaghettiPositions[ indexFloat++ ] = nodePos.x();
            spaghettiPositions[ indexFloat++ ] = nodePos.y();
            spaghettiPositions[ indexFloat++ ] = nodePos.z();

        }
        mercury.spaghetti.geometry.attributes.position.needsUpdate = true;

        venus.obj.rotateY(0.015);
        venus.refObj.x = venus.refObj.x * Math.cos(0.04) - venus.refObj.z * Math.sin(0.04);
        venus.refObj.z = venus.refObj.x * Math.sin(0.04) + venus.refObj.z * Math.cos(0.04);
        //venus.refObj.enableAngularMotor( true, 1.5 * 0.04, 50);
        // Update spaghetti
        var softBody = venus.spaghetti.userData.physicsBody;
        var spaghettiPositions = venus.spaghetti.geometry.attributes.position.array;
        var numVerts = spaghettiPositions.length / 3;
        var nodes = softBody.get_m_nodes();
        var indexFloat = 0;
        for ( var i = 0; i < numVerts; i ++ ) {
            var node = nodes.at( i );
            var nodePos = node.get_m_x();
            spaghettiPositions[ indexFloat++ ] = nodePos.x();
            spaghettiPositions[ indexFloat++ ] = nodePos.y();
            spaghettiPositions[ indexFloat++ ] = nodePos.z();

        }
        venus.spaghetti.geometry.attributes.position.needsUpdate = true;

        earth.obj.rotateY(0.01);
        mars.obj.rotateY(0.008);
        jupiter.obj.rotateY(0.002);
        saturn.obj.rotateY(0.0009);
        uranus.obj.rotateY(0.0004);
        neptune.obj.rotateY(0.0001);
        pluto.obj.rotateY(0.00007);

        // Step world
        physicsWorld.stepSimulation( deltaTime, 10 );

        renderer.render(scene, camera);
        time += deltaTime;
    }

    renderer.setAnimationLoop(animate);

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});