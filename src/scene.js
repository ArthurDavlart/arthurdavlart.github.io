import { dotProduct, subtract, length, multiply, add, multiplyMV } from "./helpers/linearAlgebraHelper.js";
import { LightType } from "./lights/light.js";

export default class Scene { 
    // Scene setup.
    viewport_size = 1;
    projection_plane_z = 1;
    background_color = [255, 255, 255];
    recursion_depth = 2;

    constructor(camera, lights, objests) {
        this.camera = camera;
        this.lights = lights;
        this.objests = objests;
        this.canvasInit();
    }

    canvasInit() {
        this.canvas = document.getElementById("canvas");
        this.canvas_context = this.canvas.getContext("2d");
        this.canvas_buffer = this.canvas_context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.canvas_pitch = this.canvas_buffer.width * 4;
    }

    render() {
        for (var x = -this.canvas.width / 2; x < this.canvas.width / 2; x++) {
            for (var y = -this.canvas.height / 2; y < this.canvas.height / 2; y++) {
                var direction = this.canvasToViewport([x, y])
                direction = multiplyMV(this.camera.getRotation(), direction);
                var color = this.traceRay(this.camera.getPosition(), direction, 1, Infinity, this.recursion_depth);
                this.putPixel(x, y, color);
            }
        }

        this.updateCanvas();
    }

    canvasToViewport(p2d) {
        return [p2d[0] * this.viewport_size / this.canvas.width,
        p2d[1] * this.viewport_size / this.canvas.height,
        this.projection_plane_z];
    }
    
    // Traces a ray against the set of spheres in the scene.
    traceRay(origin, direction, min_t, max_t, recursion_depth) {
        var arr = this.closestIntersection(origin, direction, min_t, max_t)
        var closest_sphere = arr[0];
        var closest_t = arr[1];
    
        if (closest_sphere == null) {
            return this.background_color;
        }

        var p = add(this.camera.getPosition(), multiply(closest_t, direction));
        var n = subtract(p, closest_sphere.getCenter());
    
        n = multiply(1.0 / length(n), n);

        var local_color = multiply(this.computeLighting(p, n, multiply(-1, direction), closest_sphere.getSpecular()), closest_sphere.color);
        
        var r = closest_sphere.getReflective()
        if (recursion_depth <= 0 || r <= 0) {
            return local_color;
        }

        var reflectRay = this.reflectRay(multiply(-1, direction), n);

        var reflectedColor = this.traceRay(p, reflectRay, 0.001, Infinity, recursion_depth - 1)

        return add(multiply((1 - r), local_color), multiply(r, reflectedColor));
    }

    reflectRay(r, n) {
        return subtract(multiply(dotProduct(n, r), multiply(2, n)), r)
    }

    putPixel(x, y, color) {
        x = this.canvas.width / 2 + x;
        y = this.canvas.height / 2 - y - 1;
    
        if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) {
            return;
        }
    
        var offset = 4 * x + this.canvas_pitch * y;
        this.canvas_buffer.data[offset++] = color[0];
        this.canvas_buffer.data[offset++] = color[1];
        this.canvas_buffer.data[offset++] = color[2];
        this.canvas_buffer.data[offset++] = 255; // Alpha = 255 (full opacity)
    }

    // Displays the contents of the offscreen buffer into the canvas.
    updateCanvas() {
        this.canvas_context.putImageData(this.canvas_buffer, 0, 0);
    }

    computeLighting(p, n, v, s) {
        var intensity = 0.0
        for (var i = 0; i < this.lights.length; i++) {
            var light = this.lights[i]
            if (light.getType() == LightType.AMBIENT) {
                intensity += light.getIntensity();
            } else {
                var l = []
                var max_t = null;
                if (light.getType() == LightType.POINT) {
                    l = subtract(light.getPosition(), p)
                    max_t = 1;
                } else {
                    l = light.getDirection();
                    max_t = Infinity;
                }

                var arr = this.closestIntersection(p, l, 0.001, max_t);
                var shadow_sphere = arr[0];
                var shadow_t = arr[1];

                if(shadow_sphere != null) {
                    continue;
                }

                var n_dot_l = dotProduct(n, l)
                if (n_dot_l > 0) {
                    intensity += light.getIntensity() * n_dot_l/(1.0 * length(l))
                }

                if (s != -1) {
                    var r = subtract(multiply(dotProduct(n, l), multiply(2, n)), l)
                    var r_dot_v = dotProduct(r, v)
                    if (r_dot_v > 0) {
                        intensity += light.getIntensity() * Math.pow(r_dot_v/((length(r)*length(v))), s)
                    }
                }

            }
        }
        return intensity;
    }

    closestIntersection(origin, direction, min_t, max_t) {
        var closest_t = Infinity;
        var closest_sphere = null;
    
        for (var i = 0; i < this.objests.length; i++) {
            var ts = this.objests[i].intersectRay(origin, direction);
            if (ts[0] < closest_t && min_t < ts[0] && ts[0] < max_t) {
                closest_t = ts[0];
                closest_sphere = this.objests[i];
            }
            if (ts[1] < closest_t && min_t < ts[1] && ts[1] < max_t) {
                closest_t = ts[1];
                closest_sphere = this.objests[i];
            }
        }

        return [closest_sphere, closest_t]
    }
}