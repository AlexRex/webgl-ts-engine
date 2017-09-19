import { Node } from './tree/Node';

import { Camera, Transform, Mesh } from './tree/Entities/index';

import { Utils, TRCMotor, Controls, Application } from './lib';

export class Toon extends Application {
  private objectTransformNodeX = this.motor.createTransform(this.scene, 'objectTransf');
  private objectTransformNodeY = this.motor.createTransform(this.objectTransformNodeX, 'objectTransf');
  private objectMesh = this.motor.createMesh({
    basePath: 'torus-knot'
  }, this.objectTransformNodeY, 1, 'object');

  constructor(canvasId: string) {
    super(canvasId, 'toon');

    let objectTransformX = this.motor.getTransformFromNode(this.objectTransformNodeX);
    let objectTransformY = this.motor.getTransformFromNode(this.objectTransformNodeY);

    this.controls.addMouseControls(objectTransformX, objectTransformY);
    // this.controls.mouseWheel(this.camTranslation);

    this.motor.getLightFromNode(this.secondLight).active = false;
    this.motor.getLightFromNode(this.light).setSpecularColor(255, 255, 255);
    this.motor.getLightFromNode(this.light).setDiffuseColor(150, 150, 150);

    this.lightTransformEntity.reset();
    this.lightTransformEntity.translate(0, 4, -5);

    this.camTranslation.reset();
    this.camTranslation.translate(0, 0, -13);

    this.animation();
  }

  public animation() {
    Utils.requestAnimFrame(this.animation.bind(this));
  }
}
