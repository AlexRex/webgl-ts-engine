import { Entity } from '../Entity';

import { mat4 } from 'gl-matrix';

export class Camera extends Entity {
  private active: boolean;

  constructor(canvasId: string, id?: string) {
    super(canvasId, id);
  }

  public beginDraw(): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log('begin drawing', this.id);

      if (this.motor.motorLoop.iteration === 0) {
        this.motor.matrixStack.setActualAsViewMatrix();
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
