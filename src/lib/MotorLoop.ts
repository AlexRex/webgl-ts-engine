import { Utils, States } from './index';
import { Node } from '../tree/Node';
import { MatrixStack } from '../tree/MatrixStack';

declare var Stats: any;

let stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom );

export class MotorLoop {
  private rootNode: Node;

  public iteration: number = 0; // 0: cameras, 1: lights, 2: models
  public frameCount: number = 0;
  public frameTick: number = 8; // 30fps para las animaciones

  public canvasId: string;

  constructor(canvasId: string) {
    this.canvasId = canvasId;
  }

  /**
   * Punto de entrada del loop.
   *
   * En cada iteracion pintamos un recurso.
   */
  public runLoop(): void {
    stats.begin();

    States.getState(this.canvasId).matrixStack.reset(); // Inicializamos otra vez la matriz para no perder la matriz inversa de la camara
    States.getState(this.canvasId).renderer.drawScene();
    this.rootNode.draw()
    .then(() => {
      this.iteration = 1;
      return this.rootNode.draw();
    })
    .then(() => {
      this.iteration = 2;
      return this.rootNode.draw();
    })
    .then(() => {
      this.iteration = 0;

      this.countFrame();

      stats.end();
      Utils.requestAnimFrame(this.runLoop.bind(this));
    });
  }

  public countFrame(): void {
    this.frameCount++;

    if (this.frameCount > this.frameTick) {
      this.frameCount = 0;
    }
  }

  /**
   * Especifica el nodo root del arbol de la escena.
   * @param {Node} node Nodo padre
   */
  public setRootNode(node: Node): void {
    this.rootNode = node;
  }
}
