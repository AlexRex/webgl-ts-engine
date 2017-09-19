precision highp float;

#define MAX_LIGHTS 5
struct light {
  vec3 uLightPosition;
};

uniform light uLights[MAX_LIGHTS];

uniform vec4 uMaterialDiffuse;

varying vec3 vNormal;

void main(void) {

  // Normal al vertice
  vec3 normal = normalize(vNormal);

  vec4 Id = vec4(0.0,0.0,0.0,1.0);

  float intensity;

  intensity = dot(vec3(uLights[0].uLightPosition), normal);

  if (intensity > 20.0) {
    Id.xyz = uMaterialDiffuse.xyz;
  } else if (intensity > 15.0) {
    Id.xyz = uMaterialDiffuse.xyz * vec3(0.6, 0.6, 0.6);
  } else if (intensity > 5.0) {
    Id.xyz = uMaterialDiffuse.xyz * vec3(0.4, 0.4, 0.4);
  } else {
    Id.xyz = uMaterialDiffuse.xyz * vec3(0.2, 0.2, 0.2);
  }

  vec4 finalColor = Id;

  gl_FragColor = finalColor;
}
