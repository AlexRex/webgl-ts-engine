import { Node, Entity, Camera, Light, Mesh, Transform, MatrixStack } from '../tree';

import { Renderer, MotorLoop, Utils, States } from './index';
import { ResourceManager } from '../resource-manager/ResourceManager';


export class TRCMotor {
  public scene: Node;

  public canvasId: string;

  public renderer: Renderer;
  public motorLoop: MotorLoop;
  public matrixStack: MatrixStack;
  public resourceManager: ResourceManager;

  constructor(canvasId: string) {
    this.canvasId = canvasId;
    this.matrixStack = new MatrixStack();

    States.setState(this, this.canvasId);

    this.renderer = new Renderer(canvasId);
    this.motorLoop = new MotorLoop(canvasId);
    this.resourceManager = new ResourceManager(this.canvasId);
  }

  public start() {

    // this.ResourceManager = new ResourceManager();
    if (!this.renderer.shader) {
      this.setShader('phong');
    }
    this.renderer.setUpRenderer();
    this.motorLoop.runLoop();
  }

  public getShader(): string {
    return this.renderer.shader;
  }

  public setShader(shader: string) {
    this.renderer.shader = shader;
  }

  private createNode(entity?: Entity, father?: Node, id?: string): Node {
    let node = new Node(entity, father, id);

    if (father) {
      father.addChild(node);
    }

    return node;
  }

  /**
   * Crea el nodo root de la escena.
   * @param {string} id Id de la escena.
   * @return {Node}
   */
  public createScene(id?: string): Node {
    this.scene = this.createNode(null, null, id);

    this.motorLoop.setRootNode(this.scene);

    return this.scene;
  }

  /**
   * Crea una entidad transformacion.
   * @param {Node} father Padre asociado
   * @param {string} id
   * @return {Node}
   */
  public createTransform(father?: Node, id?: string): Node {
    let transform = new Transform(this.canvasId, id);

    return this.createNode(transform, father || this.scene, id);
  }

  /**
   * Crea una malla en la escena
   * @param {string} path URL del fichero a cargar.
   * @param {string} texturePath ruta de la textura
   * @param {string} specularPath ruta de la textura especular
   * @param {number} nOfAnimations numero de animaciones
   * @param {Node} father Padre asociado
   * @param {string} id
   * @return {Node}
   */
  public createMesh(texturePaths?: any, father?: Node, nOfAnimations?: number, id?: string): Node {
    let mesh = new Mesh(this.canvasId, texturePaths, nOfAnimations, id);

    return this.createNode(mesh, father || this.scene, id);
  }

  /**
   * Crea una camara.
   * @param {Node} father Padre asociado
   * @param {string} id
   * @return {Node}
   */
  public createCamera(father?: Node, id?: string): Node {
    let camera = new Camera(this.canvasId, id);

    return this.createNode(camera, father || this.scene, id);
  }

  /**
   * Crea una luz.
   * @param {boolean} directional luz direccional o no
   * @param {Node} father Padre asociado
   * @param {string} id
   * @return {Node}
   */
  public createLight(lightNum: number, father?: Node, id?: string): Node {
    let light = new Light(this.canvasId, lightNum, id);

    return this.createNode(light, father || this.scene, id);
  }

  /**
   * Devuelve la entidad Light del nodo.
   * @param {Node} node [description]
   * @return {Light} [description]
   */
  public getLightFromNode(node: Node): Light {
    return <Light>node.entity;
  }

  /**
   * Devuelve la entidad Transform del nodo.
   * @param {Node} node
   * @return {Transform}
   */
  public getTransformFromNode(node: Node): Transform {
    return <Transform>node.entity;
  }

  /**
   * Devuelve la entidad Mesh del nodo.
   * @param {Node} node
   * @return {Transform}
   */
  public getMeshFromNode(node: Node): Mesh {
    return <Mesh>node.entity;
  }
}
