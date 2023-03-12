import { dotProduct } from "../helpers/linearAlgebraHelper.js";
import { subtract } from "../helpers/linearAlgebraHelper.js";

export default class Sphere {
    constructor(center, radius, color, specular, reflective) {
        this.center = center;
        this.radius = radius;
        this.color = color;
        this.specular = specular;
        this.reflective = reflective;
    }

    intersectRay(origin, direction) {
        var oc = subtract(origin, this.center);

        var k1 = dotProduct(direction, direction);
        var k2 = 2 * dotProduct(oc, direction);
        var k3 = dotProduct(oc, oc) - this.radius * this.radius;

        var discriminant = k2 * k2 - 4 * k1 * k3;
        if (discriminant < 0) {
            return [Infinity, Infinity];
        }

        var t1 = (-k2 + Math.sqrt(discriminant)) / (2 * k1);
        var t2 = (-k2 - Math.sqrt(discriminant)) / (2 * k1);
        return [t1, t2];
    }

    getCenter() {
        return this.center;
    }

    
    getSpecular() {
        return this.specular;
    }

    getReflective() {
        return this.reflective;
    }
}