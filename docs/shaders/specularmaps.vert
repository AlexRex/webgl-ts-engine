attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

// Matrices
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNormalMatrix;

varying vec3 vNormal;
varying vec4 vVertex;
varying vec2 vTextureCoord;

void main(void) {

 vVertex = uMVMatrix * vec4(aVertexPosition, 1.0);

 //Transformed normal position
 vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

 //Final vertex position
 gl_Position = uPMatrix * vVertex;
 vTextureCoord = aTextureCoord;
}
