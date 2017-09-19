import { Node } from '../tree/Node';

import { Camera, Transform, Mesh } from '../tree/Entities';

import { Utils, TRCMotor, Controls } from './';

declare var dat: any;

export class Application {
  public motor: TRCMotor;
  public controls: Controls;

  public scene: Node;

  public camRotationTransfX: Node;
  public camRotationTransfY: Node;
  public camTranslationTransf: Node;
  public camera: Node;

  public camRotationX: Transform;
  public camRotationY: Transform;
  public camTranslation: Transform;

  public lightTr: Node;
  public light: Node;

  public secondLightTr: Node;
  public secondLight: Node;

  public lightTransformEntity: Transform;
  public secondLightTransformEntity: Transform;

  constructor(canvasId: string, shader?: string) {
    this.motor = new TRCMotor(canvasId);
    this.controls = new Controls(canvasId);

    this.scene = this.motor.createScene('escena');

    this.camRotationTransfX = this.motor.createTransform(this.scene, 'cameraRotTransfX');
    this.camRotationTransfY = this.motor.createTransform(this.camRotationTransfX, 'cameraRotTransfY');
    this.camTranslationTransf = this.motor.createTransform(this.camRotationTransfY, 'cameraTransTransf');
    this.camera = this.motor.createCamera(this.camTranslationTransf, 'camera');

    this.camRotationX = this.motor.getTransformFromNode(this.camRotationTransfX);
    this.camRotationY = this.motor.getTransformFromNode(this.camRotationTransfY);
    this.camTranslation = this.motor.getTransformFromNode(this.camTranslationTransf);

    this.motor.setShader(shader);
    this.motor.start();

    this.lightTr = this.motor.createTransform(this.scene, 'lightTr');
    this.light = this.motor.createLight(0, this.lightTr, 'light');

    this.lightTransformEntity = this.motor.getTransformFromNode(this.lightTr);

    this.secondLightTr = this.motor.createTransform(this.scene, 'secondLightTr');
    this.secondLight = this.motor.createLight(1, this.secondLightTr, 'secondLight');

    this.motor.getLightFromNode(this.secondLight).active = false;

    this.secondLightTransformEntity = this.motor.getTransformFromNode(this.secondLightTr);

    this.lightTransformEntity.translate(2, 2, 2);

    this.secondLightTransformEntity.translate(-2, 2, 2);

    this.camTranslation.translate(0, 0, -this.controls.initialTranslation);
  }

  public addInputHandlers() {
    this.controls.addCameraControls(this.camTranslation, this.camRotationX, this.camRotationY);
  }

  /**
   * Animaciones de movimiento
   */
  public animation() {
    Utils.requestAnimFrame(this.animation.bind(this));
  }
}
