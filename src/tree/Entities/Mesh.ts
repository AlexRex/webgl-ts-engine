import { Entity } from '../Entity';

import { mat4, vec3 } from 'gl-matrix';
import * as _ from 'lodash';

import { MeshResource } from '../../resource-manager/types';
import { MatrixStack } from '../MatrixStack';

import { Renderer } from '../../lib';

export class Mesh extends Entity {

  public mesh: MeshResource;
  public texturePaths: any;
  private renderer: Renderer = this.motor.renderer;
  private nOfModels: number;

  public active: boolean = true;

  constructor(canvasId: string, texturePaths?: any, nOfModels?: number, id?: string) {
    super(canvasId, id);
    this.texturePaths = texturePaths;
    this.nOfModels = nOfModels || 1;
  }

  /**
   * Pide el recurso, una vez que lo tiene llama al dibujado del metodo.
   * @return {Promise<any>} [description]
   */
  public beginDraw(): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log('begin drawing', this.id);

      if (this.active && this.motor.motorLoop.iteration === 2 && this.mesh) {
        this.mesh.draw();
      } else if (this.renderer.shadersLoaded) {
        this.motor.resourceManager.getResource('mesh', this.texturePaths, this.nOfModels)
        .then((mesh: MeshResource) => {
          this.mesh = mesh;
        });
      }
      resolve();
    });
  }

  public setTexturePatsh(texturePaths: any) {
    if (this.mesh) {
      this.mesh.setTexturePaths(texturePaths);
    }
  }

  public endDraw(): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log('end drawing', this.id);
      resolve();
    });
  }
}
