import { Node } from './tree/Node';

import { Camera, Transform, Mesh } from './tree/Entities/index';

import { Utils, TRCMotor, Controls, Application } from './lib';

export class Animation extends Application {
  private objectTransformNodeX = this.motor.createTransform(this.scene, 'objectTransf');
  private objectTransformNodeY = this.motor.createTransform(this.objectTransformNodeX, 'objectTransf');
  private objectMesh = this.motor.createMesh({
    basePath: 'fox',
    diffuse: 'fox.png'
  }, this.objectTransformNodeY, 6, 'object');

  constructor(canvasId: string) {
    super(canvasId, 'phong');

    let objectTransformX = this.motor.getTransformFromNode(this.objectTransformNodeX);
    let objectTransformY = this.motor.getTransformFromNode(this.objectTransformNodeY);

    this.controls.addMouseControls(objectTransformX, objectTransformY);
    // this.controls.mouseWheel(this.camTranslation);

    this.motor.getLightFromNode(this.secondLight).active = false;
    this.motor.getLightFromNode(this.light).setSpecularColor(255, 255, 255);
    this.motor.getLightFromNode(this.light).setDiffuseColor(150, 150, 150);

    this.lightTransformEntity.reset();
    this.lightTransformEntity.translate(-2, -3, -5);

    this.camTranslation.reset();
    this.camTranslation.translate(0, -.5, -12);
    this.camRotationX.rotateX(Utils.radians(12));
    this.camRotationX.rotateY(Utils.radians(15));

    this.animation();
  }

  public animation() {
    Utils.requestAnimFrame(this.animation.bind(this));
  }
}
