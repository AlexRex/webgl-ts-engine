precision highp float;

#define MAX_LIGHTS 5
struct light {
  vec3 uLightPosition;
  vec4 uLightDiffuse;
};

uniform light uLights[MAX_LIGHTS];

uniform vec4 uMaterialDiffuse;
uniform sampler2D uSampler;

uniform samplerCube skybox;

varying vec3 vNormal;
varying vec4 vVertex;
varying vec2 vTextureCoord;

void main(void) {

  vec4 finalColor = uLights[0].uLightDiffuse * uMaterialDiffuse;
  finalColor.a = 1.0;

  vec4 texColor = texture2D(uSampler, vTextureCoord);

  if (texColor.a < .9) {
    discard;
  }

  gl_FragColor = texColor;
}
