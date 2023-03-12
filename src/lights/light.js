export const LightType = {
    AMBIENT: 'AMBIENT',
    POINT: 'POINT',
    DIRECTIONAL: 'DIRECTIONAL'
}

export class Light {
    constructor(type, intensity, position, direction) {
        this.type = type;
        this.intensity = intensity;
        this.position = position;
        this.direction = direction;
    }

    getType() {
        return this.type;
    }

    getIntensity() {
        return this.intensity;
    }

    getPosition() {
        return this.position;
    }

    getDirection() {
        return this.direction;
    }
}