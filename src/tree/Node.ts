import * as _ from 'lodash';
const mapSeries = require('promise-map-series');

import { Entity } from './Entity';

export class Node {
  private _father: Node;
  private _entity: Entity;
  private children: Array<Node> = [];
  public id: string;

  /**
   * Constructor del nodo.
   * @param {Entity} entity Entidad asociada.
   * @param {Node} father Padre del nodo.
   * @param {string} id Id del nodo.
   */
  constructor(entity?: Entity, father?: Node, id?: string) {
    this._entity = entity;
    this._father = father;
    this.id = id;
  }

  get entity(): Entity {
    return this._entity;
  }

  set entity(entity: Entity) {
    this._entity = entity;
  }

  get father(): Node {
    return this._father;
  }

  set father(father: Node) {
    this._father = father;
  }

  /**
   * Anyade un hijo nuevo.
   * @param {Node} child Nodo a anyadir
   * @return {Node} Nodo anyadido
   */
  public addChild(child: Node): Node {
    child.father = this;
    this.children.push(child);
    return child;
  }

  /**
   * Elimina el hijo.
   * @param {Node} child Nodo a eliminar
   * @return {Node} Nodo eliminado
   */
  public removeChild(child: Node): Node {
    _.pull(this.children, child);
    return child;
  }

  /**
   * Dibuja la entidad si tiene, y llama a draw de los hijos.
   * @return {Promise}
   */
  public draw(): Promise<any> {
    // console.log('draw', this.id, iteration);

    if (this.entity) {
      return this.entity.beginDraw()
        .then(() => {
          return this.drawChildren();
        })
        .then(() => {
          return this.entity.endDraw();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return this.drawChildren()
        .catch((err) => {
          console.log(err);
        });
    }
  }

  /**
   * Llamar al metodo draw de todos los hijos.
   * @return {Promise}
   */
  private drawChildren(): Promise<any> {
    let drawPromises: Array<Promise<any>> = [];

    return mapSeries(this.children, (child: any) => {
      return child.draw();
    }).then(() => {
      return Promise.resolve();
    });
  }
}
