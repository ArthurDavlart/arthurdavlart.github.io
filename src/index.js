import Camera from "./camera/camera.js";
import { Light, LightType } from "./lights/light.js";
import Sphere from "./objects/sphere.js";
import Scene from "./scene.js";

var spheres = [
    new Sphere([0, -1, 3], 1, [255, 0, 0], 5000, 0.2),
    new Sphere([2, 0, 4], 1, [0, 0, 255], 500, 0.3),
    new Sphere([-2, 0, 4], 1, [0, 255, 0], 10, 0.4),
    new Sphere([0, -5001, 0], 5000, [255, 255, 0], 1000, 0.5)
];

var camera = new Camera([0, 0, 0]);
var lights = [
    new Light(LightType.AMBIENT, 0.2, null, null),
    new Light(LightType.POINT, 0.6, [2, 1, 0], null),
    new Light(LightType.DIRECTIONAL, 0.2, null, [1, 4, 4])
 ]
var scene = new Scene(camera, lights, spheres);

scene.render();

document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    
    if (keyName == "a") {
        camera.left();
    }

    if (keyName == "w") {
        camera.forward();
    }

    if (keyName == "d") {
        camera.right();
    } 

    if (keyName == "s") {
        camera.back();
    }


    scene.render();
});