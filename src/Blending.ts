import { Node } from './tree/Node';

import { Camera, Transform, Mesh } from './tree/Entities/index';

import { Utils, TRCMotor, Controls, Application } from './lib';

export class Blending extends Application {
  private objectTransformNodeX = this.motor.createTransform(this.scene, 'objectTransf');
  private objectTransformNodeY = this.motor.createTransform(this.objectTransformNodeX, 'objectTransf');

  private object2Transform = this.motor.createTransform(this.scene, 'objectTransf');

  private object2Mesh = this.motor.createMesh({
    basePath: 'tree-blending',
    diffuse: 'diffuse.png'
  }, this.object2Transform, 1, 'tree');

  private objectMesh = this.motor.createMesh({
    basePath: 'window-blending',
    diffuse: 'diffuse.png'
  }, this.objectTransformNodeY, 1, 'window');

  constructor(canvasId: string) {
    super(canvasId, 'blending');

    let objectTransformX = this.motor.getTransformFromNode(this.objectTransformNodeX);
    let objectTransformY = this.motor.getTransformFromNode(this.objectTransformNodeY);

    let object2Tr = this.motor.getTransformFromNode(this.object2Transform);

    object2Tr.translate(0, 0, -10);

    this.controls.addMouseControls(objectTransformX, objectTransformY);
    // this.controls.mouseWheel(this.camTranslation);

    this.motor.getLightFromNode(this.secondLight).active = false;
    this.motor.getLightFromNode(this.light).setSpecularColor(255, 255, 255);
    this.motor.getLightFromNode(this.light).setDiffuseColor(150, 150, 150);

    this.lightTransformEntity.reset();
    this.lightTransformEntity.translate(0, 4, -5);

    this.animation();
  }

  public animation() {
    Utils.requestAnimFrame(this.animation.bind(this));
  }
}
