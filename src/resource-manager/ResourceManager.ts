import { Resource } from './Resource';
import { MeshResource } from './types';

import * as _ from 'lodash';

export class ResourceManager {
  private resources: Array<Resource> = [];

  private canvasId: string;

  constructor(canvasId: string) {
    this.canvasId = canvasId;
  }

  /**
   * Obtiene un recurso. Si esta disponible lo devuelve, si no, crea uno nuevo.
   * @param {string} resourceType Tipo de recurso (mesh, light, etc).
   * @param {Object} texturePaths ruta de las texturas
   * @param {number} nOfModels numero de modelos (animaciones)
   * @return {Promise<Resource>} Promesa
   */
  public getResource(resourceType: string, texturePaths: any, nOfModels?: number): Promise<Resource> {
    return new Promise((resolve, reject) => {
      let resourceToFind = _.find(this.resources, (resource) => {
        return resource.id === texturePaths.basePath;
      });

      if (!resourceToFind) {
        resourceToFind = this.createNewResourceType(resourceType, texturePaths, nOfModels);
        this.resources.push(resourceToFind);

        resourceToFind.loadFile()
        .then((data) => {
          resolve(resourceToFind);
        });
      } else if (resourceToFind.loaded) {
        resolve(resourceToFind);
      }
    });
  }

  /**
   * Crea un nuevo recurso del tipo especificado.
   * @param {string} path Url del recurso.
   * @param {string} resourceType Tipo de recurso (mesh, light, etc).
   * @param {string} texturePath ruta de la textura
   * @return {Promise<Resource>} Promesa
   */
  private createNewResourceType(resourceType: string, texturePaths: any, nOfModels?: number): Resource {
    switch (resourceType) {
      case 'mesh': return new MeshResource(this.canvasId, texturePaths, nOfModels);
      default: return null;
    }
  }
}
