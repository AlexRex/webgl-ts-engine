import { TRCMotor } from './index';

export class States {
  public static states: any = {};

  public static setState(motor: TRCMotor, canvasId: string): void {
    States.states[canvasId] = motor;
  }

  public static getState(canvasId: string): TRCMotor {
    return States.states[canvasId];
  }
}
