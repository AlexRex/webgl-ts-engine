precision highp float;

#define MAX_LIGHTS 5
struct light {
  vec3 uLightPosition;
  vec4 uLightAmbient;
  vec4 uLightDiffuse;
  vec4 uLightSpecular;
};

uniform light uLights[MAX_LIGHTS];

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;

uniform sampler2D uSampler;
uniform sampler2D uSpecularMapSampler;

varying vec3 vNormal;
varying vec4 vVertex;
varying vec2 vTextureCoord;

void main(void) {

  // Normal al vertice
  vec3 normal = normalize(vNormal);

  // Vector del vertice a la camara
  vec3 E = normalize(-vec3(vVertex.xyz));

  float lambert = 0.0;

  vec4 Ia = vec4(0.3,0.3,0.3,1.0);
  vec4 Id = vec4(0.0,0.0,0.0,1.0);
  vec4 Is = vec4(0.0,0.0,0.0,1.0);

  float specular = 1.0;

  float shininess = texture2D(uSpecularMapSampler, vec2(vTextureCoord.s, vTextureCoord.t)).r * 255.0;

  Ia = uMaterialAmbient;

  for (int i = 0; i < MAX_LIGHTS; i++) {
    vec3 lightDir = normalize(vVertex.xyz - uLights[i].uLightPosition);

    // Quitado porque la luz ambiental debe ser global de la escena y no la suma de varias luces.
    // Ia = (Ia + uLights[i].uLightAmbient * uMaterialAmbient);

    lambert = dot(-lightDir, normal);
    Id += uLights[i].uLightDiffuse * uMaterialDiffuse * lambert;

    vec3 reflection = reflect(normal, -lightDir);
    specular = pow(max(dot(reflection, E), 0.0), shininess);
    Is += uLights[i].uLightSpecular * uMaterialSpecular * specular;
  }

  vec4 finalColor = Ia + Id + Is;
  finalColor.a = 1.0;

  gl_FragColor = finalColor * texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
}
