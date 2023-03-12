// ======================================================================
    //  Linear algebra and helpers.
    // ======================================================================

// Dot product of two 3D vectors.
export function dotProduct(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}
// Computes v1 - v2.
export function subtract(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

// Length of a 3D vector.
export function length(vec) {
    return Math.sqrt(dotProduct(vec, vec));
}

// Computes k * vec.
export function multiply(k, vec) {
    return [k*vec[0], k*vec[1], k*vec[2]];
}

// Computes v1 + v2.
export function add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

// Computes k + v2.
export function addK(k, v) {
    return [v[0] + k, v[1] + k, v[2] + k];
}

// Computes k + v2.
export function subtractK(k, v) {
    return [v[0] - k, v[1] - k, v[2] - k];
}

// Clamps a color to the canonical color range.
export function clamp(vec) {
    return [
        Math.min(255, Math.max(0, vec[0])),
        Math.min(255, Math.max(0, vec[1])),
        Math.min(255, Math.max(0, vec[2]))
    ];
}

// Multiplies a scalar and a vector.
export function multiplySV(k, vec) {
    return [k*vec[0], k*vec[1], k*vec[2]];
}
  
  
// Multiplies a matrix and a vector.
export function multiplyMV(mat, vec) {
    var result = [0, 0, 0];

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
        result[i] += vec[j]*mat[i][j];
        }
    }

    return result;
}