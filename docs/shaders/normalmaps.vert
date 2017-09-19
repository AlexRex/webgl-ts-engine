attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexTangent;
attribute vec2 aTextureCoord;

// Matrices
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNormalMatrix;

varying vec3 vNormal;
varying vec4 vVertex;
varying vec2 vTextureCoord;

// Matriz para las normales
varying mat3 tbnMatrix;

void main(void) {

 vVertex = uMVMatrix * vec4(aVertexPosition, 1.0);

 //Transformed normal position
 vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

 vec3 tangent = vec3(uNormalMatrix * vec4(aVertexTangent, 1.0));
 vec3 bitangent = cross(vNormal, tangent);

 tbnMatrix = mat3(
     tangent.x, bitangent.x, vNormal.x,
     tangent.y, bitangent.y, vNormal.y,
     tangent.z, bitangent.z, vNormal.z
 );

 //Final vertex position
 gl_Position = uPMatrix * vVertex;
 vTextureCoord = aTextureCoord;
}
