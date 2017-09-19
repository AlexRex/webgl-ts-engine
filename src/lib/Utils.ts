import { vec3 } from 'gl-matrix';

export class Utils {
  /**
   * Obtiene el contexto del canvas para WebGL
   * @param {HTMLCanvasElement} canvas Elemento canvas
   * @return {WebGLRenderingContext} Contexto WebGL
   */
  public static getGlContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let contextNames = [
      'webgl',
      'experimental-webgl',
      'webkit-3d',
      'moz-webgl'
    ],
      context: WebGLRenderingContext;

    contextNames.forEach((name) => {
      if (!context) {
        context = <WebGLRenderingContext>canvas.getContext(name, { preserveDrawingBuffer: true });
      }
    });

    return context;
  }

  /**
   * Se le pasa la funcion callback a requestAnimationFrame del navegador simulando
   * un bucle cada X frames por segundo.
   * @param {FrameRequestCallback} callback Funcion a llamar en cada iteracion
   */
  public static requestAnimFrame(callback: FrameRequestCallback): any {
    return window.requestAnimationFrame(callback) ||
      window.webkitRequestAnimationFrame(callback) ||
      function(callback: FrameRequestCallback, element: any) {
        window.setTimeout(callback, 1000 / 60);
      };
  }

  /**
   * Carga un fichero haciendo una peticion AJAX.
   * @param {string} path URL del fichero
   * @return {Promise<any>} Promesa
   */
  public static loadFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();

      request.open('GET', path, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          return resolve(request.responseText);
        } else {
          return reject(request);
        }
      };

      request.onerror = () => {
        return reject(request);
      };

      request.send();
    });
  }

  /**
   * Wrapper para loadFile de shaders.
   * @param {string} shader nombre del shader
   * @return {Promise<string>} Promesa
   */
  public static loadShader(shader: string): Promise<string> {
    return Utils.loadFile(`../../shaders/${shader}`);
  }

  /**
   * Convertir de grados a radianes.
   * @param {number} degrees Grados a convertir
   * @return {number}
   */
  public static radians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convertir de radianes a grados.
   * @param {number} radians Radianes a convertir.
   * @return {number}
   */
  public static degrees(radians: number): number {
    return radians * 180 / Math.PI;
  }

  public static roundNumber(value: number, decimals?: number): number {
    return Math.round(value * Math.pow(10, decimals || 5)) / Math.pow(10, decimals || 5);
  }

  public static cos(degrees: number): number {
    return Utils.roundNumber(Math.cos(Utils.radians(degrees)));
  }

  public static sin(degrees: number): number {
    return Utils.roundNumber(Math.sin(Utils.radians(degrees)));
  }
  /**
 * Parse the MTL file, appending relevant data to the data object.
 * @param {string} mtl: contents of an MTL file.
 * @param {Object} data: the data object you are appending information to.
 */
  public static parseMtl(mtl: any) {
    let data: any = {};

    mtl.split('\n').forEach(function(line: any) {
      let split = line.split(' ');

      switch (split[0]) {
        case 'Ns':
          // Specular power.
          data.specularPower = parseFloat(split[1]);
          break;
        case 'Ka':
          // Ambient Light
          data.ambient = split.slice(1).map(function(val: any) {
            return parseFloat(val);
          });
          break;
        case 'Kd':
          // Diffuse Light
          data.diffuse = split.slice(1).map(function(val: any) {
            return parseFloat(val);
          });
          break;
        case 'Ks':
          // Specular light
          data.specular = split.slice(1).map(function(val: any) {
            return parseFloat(val);
          });
          break;
        case 'd':
        case 'Tr':
          // Dissolved/Transparent
          data.opacity = parseFloat(split[1]);
          break;
        case 'Tf':
          data.emissive = parseFloat(split[1]);
          break;
        default:
          break;
      }

    });

    return data;
  }

  public static calculateTangents(vertices: any, textureCoords: any, indices: any): any {
    let i;
    let tangents = [];
    for (i = 0; i < vertices.length / 3; i++) {
      tangents[i] = vec3.create();
    }
    // Calculate tangents
    let a = vec3.create(), b = vec3.create();
    let triTangent = vec3.create();
    for (i = 0; i < indices.length; i += 3) {
      let i0 = indices[i + 0];
      let i1 = indices[i + 1];
      let i2 = indices[i + 2];


      let pos0 = [vertices[i0 * 3], vertices[i0 * 3 + 1], vertices[i0 * 3 + 2]];
      let pos1 = [vertices[i1 * 3], vertices[i1 * 3 + 1], vertices[i1 * 3 + 2]];
      let pos2 = [vertices[i2 * 3], vertices[i2 * 3 + 1], vertices[i2 * 3 + 2]];
      let tex0 = [textureCoords[i0 * 2], textureCoords[i0 * 2 + 1]];
      let tex1 = [textureCoords[i1 * 2], textureCoords[i1 * 2 + 1]];
      let tex2 = [textureCoords[i2 * 2], textureCoords[i2 * 2 + 1]];

      vec3.subtract(a, pos1, pos0);
      vec3.subtract(b, pos2, pos0);

      let c2c1t = tex1[0] - tex0[0];
      let c2c1b = tex1[1] - tex0[1];
      let c3c1t = tex2[0] - tex0[0];
      let c3c1b = tex2[0] - tex0[1];

      triTangent = vec3.fromValues(c3c1b * a[0] - c2c1b * b[0], c3c1b * a[1] - c2c1b * b[1], c3c1b * a[2] - c2c1b * b[2]);

      vec3.add(tangents[i0], tangents[i0], triTangent);
      vec3.add(tangents[i0], tangents[i1], triTangent);
      vec3.add(tangents[i0], tangents[i2], triTangent);
    }

    // Normalize tangents
    let ts = [];
    for (i = 0; i < tangents.length; i++) {
      let tan = tangents[i];
      vec3.normalize(tan, tan);
      ts.push(tan[0]);
      ts.push(tan[1]);
      ts.push(tan[2]);
    }

    return ts;
  }

  public static calculateNormals(vs: any, ind: any) {
    let x = 0;
    let y = 1;
    let z = 2;

    let ns = [];
    for (let i = 0; i < vs.length; i = i + 3) {
      ns[i + x] = 0.0;
      ns[i + y] = 0.0;
      ns[i + z] = 0.0;
    }

    for (let i = 0; i < ind.length; i = i + 3) {
      let v1 = [];
      let v2 = [];
      let normal = [];

      v1[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
      v1[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
      v1[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z];

      v2[x] = vs[3 * ind[i] + x] - vs[3 * ind[i + 1] + x];
      v2[y] = vs[3 * ind[i] + y] - vs[3 * ind[i + 1] + y];
      v2[z] = vs[3 * ind[i] + z] - vs[3 * ind[i + 1] + z];

      normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
      normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
      normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
      for (let j = 0; j < 3; j++) {
        ns[3 * ind[i + j] + x] = ns[3 * ind[i + j] + x] + normal[x];
        ns[3 * ind[i + j] + y] = ns[3 * ind[i + j] + y] + normal[y];
        ns[3 * ind[i + j] + z] = ns[3 * ind[i + j] + z] + normal[z];
      }
    }

    for (let i = 0; i < vs.length; i = i + 3) {

      let nn = [];
      nn[x] = ns[i + x];
      nn[y] = ns[i + y];
      nn[z] = ns[i + z];

      let len: any = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
      if (len === 0) len = 1.0;

      nn[x] = nn[x] / len;
      nn[y] = nn[y] / len;
      nn[z] = nn[z] / len;

      ns[i + x] = nn[x];
      ns[i + y] = nn[y];
      ns[i + z] = nn[z];
    }

    return ns;
  }
}
