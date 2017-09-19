import { Node } from './tree/Node';

import { Camera, Transform, Mesh } from './tree/Entities/index';

import { Utils, TRCMotor, Controls, Application } from './lib';

export class App extends Application {
  private cuerpoTransformNodeX = this.motor.createTransform(this.scene, 'cuerpoTransf');
  private cuerpoTransformNodeY = this.motor.createTransform(this.cuerpoTransformNodeX, 'cuerpoTransf');
  private cuerpoMesh = this.motor.createMesh({
    basePath: 'pollo-cuerpo',
    diffuse: 'diffuse.png'
  }, this.cuerpoTransformNodeY, 1, 'cuerpo');

  private ojosMesh = this.motor.createMesh({
    basePath: 'pollo-ojos',
    diffuse: 'diffuse.png'
  }, this.cuerpoTransformNodeY, 1, 'ojos');

  private cabezaMesh = this.motor.createMesh({
    basePath: 'pollo-cabeza',
    diffuse: 'diffuse.png'
  }, this.cuerpoTransformNodeY, 1, 'cabeza');

  private alasMesh = this.motor.createMesh({
    basePath: 'pollo-alas',
    diffuse: 'diffuse.png'
  }, this.cuerpoTransformNodeY, 1, 'alas');

  private patasMesh = this.motor.createMesh({
    basePath: 'pollo-patas',
    diffuse: 'diffuse.png'
  }, this.cuerpoTransformNodeY, 1, 'patas');

  private picoMesh = this.motor.createMesh({
    basePath: 'pollo-pico',
    diffuse: 'diffuse.png'
  }, this.cuerpoTransformNodeY, 1, 'pico');

  private gafasMesh = this.motor.createMesh({
    basePath: 'pollo-gafas',
    diffuse: 'diffuse.png'
  }, this.cuerpoTransformNodeY, 1, 'gafas');

  private gorraMesh = this.motor.createMesh({
    basePath: 'pollo-gorra',
    diffuse: 'naranja.png'
  }, this.cuerpoTransformNodeY, 1, 'gorra');

  private changeMeshDiffuse(node: Node, diffuse: string): void {
    let mesh = this.motor.getMeshFromNode(node),
      texturePaths = mesh.texturePaths;

    texturePaths.diffuse = diffuse;

    mesh.setTexturePatsh(texturePaths);
  }

  private changeMeshStatus(node: Node, status: boolean): void {
    this.motor.getMeshFromNode(node).active = status;
  }

  private setInitialTransforms(): void {
    let cuerpoTransformX = this.motor.getTransformFromNode(this.cuerpoTransformNodeX);
    let cuerpoTransformY = this.motor.getTransformFromNode(this.cuerpoTransformNodeY);

    this.controls.addMouseControls(cuerpoTransformX, cuerpoTransformY);
    this.controls.mouseWheel(this.camTranslation);
    // this.controls.addCameraControls(this.camTranslation, this.camRotationX, this.camRotationY);

    this.motor.getLightFromNode(this.secondLight).active = false;
    this.motor.getLightFromNode(this.light).setSpecularColor(255, 255, 255);
    this.motor.getLightFromNode(this.light).setDiffuseColor(150, 150, 150);

    this.lightTransformEntity.reset();
    this.lightTransformEntity.translate(-2, 5, -5);

    this.camTranslation.reset();
    this.camTranslation.translate(0, 0, -35);
    this.camRotationX.rotateX(Utils.radians(15));

    this.changeMeshStatus(this.gorraMesh, false); // Gorra desactivada
    this.changeMeshStatus(this.gafasMesh, false); // Gafas desactivada
  }

  public handleColor(id: string, mesh: Node): void {
    let select = <any>document.querySelector(id);

    select.onchange = (event: any) => {
      if (event.target.value === 'disabled') {
        this.changeMeshStatus(mesh, false);
        this.changeMeshDiffuse(mesh, null);
      } else {
        this.changeMeshStatus(mesh, true);
        this.changeMeshDiffuse(mesh, `${event.target.value}`);
      }
    };
  }

  private hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private downloadCanvasHandler() {
    let link = document.querySelector('#download');

    let downloadCanvas = (link: any, canvasId: any, filename: any) => {
      link.href = this.motor.renderer.canvas.toDataURL();
      link.download = filename;
    };

    document.getElementById('download').addEventListener('click', () => {
      downloadCanvas(link, 'canvas', 'avatar.png');
    }, false);
  }

  private bgColorHandler() {
    // Cambiar el color
    let bgColor = <any>document.querySelector('#bg-color');
    bgColor.onchange = (event: any) => {
      let rgb = this.hexToRgb(event.target.value);
      this.motor.renderer.setBgColor(rgb.r, rgb.g, rgb.b);
    };
  }

  constructor(canvasId: string) {
    super(canvasId, 'phong');

    this.handleColor('#gorraColor', this.gorraMesh);
    this.handleColor('#gafasColor', this.gafasMesh);
    this.handleColor('#cabezaColor', this.cabezaMesh);
    this.handleColor('#cuerpoColor', this.cuerpoMesh);
    this.handleColor('#alasColor', this.alasMesh);

    // this.downloadCanvasHandler();
    this.bgColorHandler();

    this.setInitialTransforms();
    this.animation();
  }

  public animation() {
    Utils.requestAnimFrame(this.animation.bind(this));
  }
}
