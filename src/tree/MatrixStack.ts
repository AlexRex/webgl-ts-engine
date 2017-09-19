import { mat4 } from 'gl-matrix';
import * as _ from 'lodash';

/**
 * Esta clase es un singleton.
 */

export class MatrixStack {
  private stack: Array<mat4> = [];
  private actual: mat4 = mat4.create();

  private viewMatrix: mat4 = mat4.create();
  private projectionMatrix: mat4 = mat4.create();

  constructor() {
    this.reset();
  }

  /**
   * Reinicia el stack, lo vacia y crea la matriz identidad.
   * @return {Array<mat4>}
   */
  public reset(): Array<mat4> {
    this.stack = [];
    this.stack.push(mat4.create());
    this.actual = _.last(this.stack);
    this.viewMatrix = mat4.create();
    return this.stack;
  }

  /**
   * Elimina el ultimo elemento
   * @return {Array<mat4>}
   */
  public pop(): Array<mat4> {
    this.stack.pop();
    this.actual = _.last(this.stack);
    return this.stack;
  }

  /**
   * Pone la matriz pasada como la actual y la anyade al stack.
   * @param {mat4} matrix Matriz a poner como actual.
   * @return {Array<mat4>}
   */
  public setActualMatrix(matrix: mat4): Array<mat4> {
    this.stack.push(matrix);
    this.actual = mat4.clone(matrix);
    return this.stack;
  }

  /**
   * Crea la matrix de la camara a partir de la inversa de la matriz actual.
   * Tambien crea la viewProjectionMatrix.
   *
   * @return {mat4}
   */
  public setActualAsViewMatrix(): mat4 {
    mat4.invert(this.viewMatrix, this.actual);

    // Creamos la matriz viewProjectionMatrix (proyeccion * camara)
    mat4.multiply(this.projectionMatrix, this.projectionMatrix, this.actual);

    return this.viewMatrix;
  }

  public getActualMatrix(): mat4 {
    return this.actual;
  }

  public getViewMatrix(): mat4 {
    return this.viewMatrix;
  }

  public getProjectionMatrix(): mat4 {
    return this.projectionMatrix;
  }

  public printActualMatrix(): void {
    this.printMatrix(this.actual);
  }

  /**
   * DEBUG
   * Metodo para imprimir la matriz pasada como parametro.
   * @param {mat4} matrix
   */
  public printMatrix(matrix: mat4): void {
    console.log(matrix.slice(0, 4));
    console.log(matrix.slice(4, 8));
    console.log(matrix.slice(8, 12));
    console.log(matrix.slice(12, 16));
  }
}
