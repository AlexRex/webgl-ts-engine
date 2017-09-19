import { States, TRCMotor } from '../lib';

export class Entity {

  public id: string;
  public motor: TRCMotor;

  constructor(canvasId: string, id?: string) {
    this.id = id;
    this.motor = States.getState(canvasId);
  }

  public beginDraw(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('begin drawing');
      resolve();
    });
  }

  public endDraw(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('end drawing');
      resolve();
    });
  }
}
