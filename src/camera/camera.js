import { add, multiply, subtract } from "../helpers/linearAlgebraHelper.js";

export default class Camera {
    deltaStep = 1;
    alpha = 0;
    alphaDelta = 0.1;
    camera_rotation = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]

    constructor(position) {
        this.position = position
    }

    getRotation() {
        return this.camera_rotation
    }

    getPosition() {
        return this.position;
    }

    right() {
        this.changeAplha("minus");
        this.calcCameraRotation();
    }

    left() {
        this.changeAplha("plus");
        this.calcCameraRotation();
    }

    changeAplha(type) {
        if(type == "plus") {
            this.alpha += this.alphaDelta;
        } else {
            this.alpha -= this.alphaDelta;
        }
        console.log(this.alpha)
    }

    calcCameraRotation() {
        this.camera_rotation = [
            [Math.cos(this.alpha), 0, -Math.sin(this.alpha)],
            [0, 1, 0],
            [Math.sin(this.alpha), 0, Math.cos(this.alpha)]
        ]
        console.log(this.camera_rotation)
    }
    
    forward() {
        this.changePosition("forward")
    }

    back() {
        this.changePosition("back")
    }

    changePosition(type) {
        if(type == "forward") {
            this.position = add(this.position, multiply(this.deltaStep, [-Math.sin(this.alpha), 0, Math.cos(this.alpha)]));
        } else {
            this.position = subtract(this.position, multiply(this.deltaStep, [-Math.sin(this.alpha), 0, Math.cos(this.alpha)]));
        }

        console.log(this.position);
    }
}