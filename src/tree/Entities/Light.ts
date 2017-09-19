import { Entity } from '../Entity';
import { Renderer } from '../../lib';
import { MatrixStack } from '../MatrixStack';
import { mat4, vec3, mat3 } from 'gl-matrix';

const shaderConfig = require('../../shaders/config.json');

import * as _ from 'lodash';

export class Light extends Entity {
  private renderer: Renderer = this.motor.renderer;

  private gl: WebGLRenderingContext = this.renderer.gl;

  private matrixStack: MatrixStack = this.motor.matrixStack;

  public active: boolean = true;

  private loaded: boolean = false;

  private uLight: WebGLUniformLocation;

  private lightNum: number;

  private locations: any = {
    uLightPosition: null,
    uLightAmbient: null,
    uLightDiffuse: null,
    uLightSpecular: null
  };

  private locationsValues: any = {
    uLightPosition: [0.0, 0.0, 0.0],
    uLightAmbient: [0.3, 0.3, 0.3, 1.0],
    uLightDiffuse: [0.7, 0.7, 0.7, 1.0],
    uLightSpecular: [0.7, 0.7, 0.7, 1.0]
  };

  constructor(canvasId: string, lightNum: number, id?: string) {
    super(canvasId, id);
    this.lightNum = lightNum;
  }

  private init() {
    this.setLightLocations();
    this.loaded = true;
  }

  public setAmbientColor(r: number, g: number, b: number): void {
    this.locationsValues.uLightAmbient = [r / 255, g / 255, b / 255, 1.0];
  }

  public setDiffuseColor(r: number, g: number, b: number): void {
    this.locationsValues.uLightDiffuse = [r / 255, g / 255, b / 255, 1.0];
  }

  public setSpecularColor(r: number, g: number, b: number): void {
    this.locationsValues.uLightSpecular = [r / 255, g / 255, b / 255, 1.0];
  }

  /**
   * Si la luz es direccional obtenemos los uniforms adecuados.
   */
  private setLightLocations(): void {
    _.forEach(this.locations, (location: any, key: string) => {
      this.locations[key] = this.gl.getUniformLocation(this.renderer.shaderProgram, `uLights[${this.lightNum}].${key}`);
    });
  }

  /**
   * Metodo para dibujar una luz direccional.
   */
  private drawLight(): void {
    let lightPosition = mat4.create();

    mat4.copy(lightPosition, this.matrixStack.getActualMatrix());

    mat4.multiply(lightPosition, this.matrixStack.getProjectionMatrix(), lightPosition);

    mat4.getTranslation(this.locationsValues.uLightPosition, lightPosition);

    _.forEach(this.locations, (location: any, key: string) => {
      if (this.locationsValues[key].length === 3) {
        this.gl.uniform3fv(this.locations[key], this.locationsValues[key]);
      } else {
        this.gl.uniform4fv(this.locations[key], this.locationsValues[key]);
      }
    });
  }

  public beginDraw(): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log('begin drawing');
      if (this.motor.motorLoop.iteration === 1 && this.renderer.shadersLoaded && this.loaded && this.active) {
        // console.log('drawing light');

        this.drawLight();
      } else if (!this.loaded && this.renderer.shadersLoaded) {
        this.init();
      }
      resolve();
    });
  }

  public endDraw(): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log('end drawing');
      resolve();
    });
  }
}
