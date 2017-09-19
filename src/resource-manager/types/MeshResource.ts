import { Resource } from '../Resource';
import { Utils, States, TRCMotor } from '../../lib';

const OBJ = require('webgl-obj-loader');

const shaderConfig = require('../../shaders/config.json');

const mapSeries = require('promise-map-series');

import * as _ from 'lodash';

interface TexturePaths {
  basePath: string;
  diffuse: string;
  specular: string;
  normal: string;
};

export class MeshResource extends Resource {
  private gl: WebGLRenderingContext;

  private models: Array<any> = [];

  private nOfModels: number;

  private texturePaths: TexturePaths;

  private materialLocations: any = {};

  private meshConfig: any;

  private iteration: number = 0;

  private motor: TRCMotor;

  constructor(canvasId: string, texturePaths?: TexturePaths, nOfModels?: number) {
    super(texturePaths.basePath);

    this.motor = States.getState(canvasId);
    this.gl = this.motor.renderer.gl;
    this.meshConfig = shaderConfig[this.motor.renderer.shader].mesh;

    this.texturePaths = texturePaths;
    this.nOfModels = nOfModels || 1;

    _.forEach(this.meshConfig.locations, (key: string) => {
      this.materialLocations[key] = this.gl.getUniformLocation(this.motor.renderer.shaderProgram, key);
    });
  }

  private loadTexture(model: any): Promise<any> {
    return new Promise((resolve, reject) => {

      model.texture = this.gl.createTexture();

      model.textureImage = new Image();
      model.textureImage.onload = () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, model.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, model.textureImage);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        resolve(model);
      };

      model.textureImage.src = `../../assets/models/${this.texturePaths.basePath}/${this.texturePaths.diffuse}`;
    });
  }

  private loadSpecularTexture(model: any): Promise<any> {
    return new Promise((resolve, reject) => {

      model.specularTexture = this.gl.createTexture();

      model.specularImage = new Image();
      model.specularImage.onload = () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, model.specularTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, model.specularImage);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        resolve(model);
      };

      model.specularImage.src = `../../assets/models/${this.texturePaths.basePath}/${this.texturePaths.specular}`;
    });
  }

  private loadTangentsBuffer(model: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let tangentBufferObj = this.gl.createBuffer();
      let tangents = Utils.calculateTangents(model.vertices, model.textures, model.indices);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tangentBufferObj);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tangents), this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

      model.tangentBuffer = tangentBufferObj;
      model.tangents = tangents;

      resolve(model);
    });
  }

  private loadNormalTexture(model: any): Promise<any> {
    return new Promise((resolve, reject) => {

      model.normalTexture = this.gl.createTexture();

      model.normalImage = new Image();
      model.normalImage.onload = () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, model.normalTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, model.normalImage);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        resolve(model);
      };

      model.normalImage.src = `../../assets/models/${this.texturePaths.basePath}/${this.texturePaths.normal}`;
    });
  }

  public loadModel(index: number): Promise<any> {
    return new Promise((resolve, reject) => {
      return Utils.loadFile(`../../assets/models/${this.texturePaths.basePath}/${this.texturePaths.basePath}_${index}.obj`)
        .then((file) => {
          return Utils.loadFile(`../../assets/models/${this.texturePaths.basePath}/${this.texturePaths.basePath}_${index}.mtl`)
            .then((mtl) => {
              let model = new OBJ.Mesh(file);
              model.material = Utils.parseMtl(mtl);

              OBJ.initMeshBuffers(this.gl, model);

              let normalBufferObject = this.gl.createBuffer();
              let normals = Utils.calculateNormals(model.vertices, model.indices);

              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBufferObject);
              this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

              model.normalBuffer = normalBufferObject;

              if (this.texturePaths.diffuse && this.meshConfig.texture) {
                return this.loadTexture(model)
                .then((model) => {
                  if (this.texturePaths.specular) {
                    return this.loadSpecularTexture(model);
                  } else {
                    return model;
                  }
                })
                .then((model) => {
                  if (this.texturePaths.normal) {
                    return this.loadTangentsBuffer(model)
                    .then((model) => {
                      return this.loadNormalTexture(model);
                    });
                  } else {
                    return model;
                  }
                });
              } else {
                return model;
              }
            })
            .then((model) => {
              this.models.push(model);
              resolve(model);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  /**
   * Llama a la funcion para cargar un archivo, una vez cargado carga los buffers
   * y resuelve la promesa.
   * @return {Promise<any>}
   */
  public loadFile(): Promise<any> {
    let promises: any = [],
      modelIndex: Array<any> = _.range(this.nOfModels);

    return mapSeries(modelIndex, (index: number) => {
        return this.loadModel(index);
    })
    .then((models: any) => {
      this.loaded = true;

      return models;
    });
  }

  public setTexturePaths(texturePaths?: TexturePaths): void {
    this.loaded = false;
    this.models = [];
    this.texturePaths = texturePaths;

    this.loadFile()
    .then(() => {
      this.loaded = true;
    });
  }

  /**
   * Llama al metodo del renderer para dibujar el modelo pasado como parametro.
   */
  public draw(): void {
    if (this.loaded) {
      // console.log('drawing mesh', this.id, this.loaded);
      if (this.motor.motorLoop.frameCount > this.motor.motorLoop.frameTick - 1) {
        this.iteration++;
        if (this.iteration >= this.nOfModels) {
          this.iteration = 0;
        }
      }

      if (this.models[this.iteration].material && this.meshConfig.modelMaterials) {
        this.meshConfig.modelMaterials.forEach((material: any, index: number) => {
          if (material.type === 'uniform4fv')  {
            this.motor.renderer.gl.uniform4fv(this.materialLocations[this.meshConfig.locations[index]], _.concat(this.models[this.iteration].material[material.name], 0));
          } else if (material.type === 'uniform1f') {
            this.motor.renderer.gl.uniform1f(this.materialLocations[this.meshConfig.locations[index]], this.models[this.iteration].material[material.name]);
          } else if (material.type === 'uniform1i' && material.name === 'sampler') {
            this.motor.renderer.gl.uniform1i(this.materialLocations[this.meshConfig.locations[index]], material.num);
          }
        });
      }

      this.motor.renderer.drawModel(this.models[this.iteration]);
    }
  }
}
