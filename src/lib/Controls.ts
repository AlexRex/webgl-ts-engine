import { Utils } from './';

import { Transform } from '../tree/entities';

import { mat4, vec3 } from 'gl-matrix';

export class Controls {
  private gradTheta: number = 270; // Rotacion plana
  private gradPhi: number = 0; // Rotacion vertical

  public initialTranslation: number = 20;

  private canvasId: string;

  constructor(canvasId: string) {
    this.canvasId = canvasId;

    // this.preventWindowScroll();
  }

  public preventWindowScroll() {
    let onMouseOver = (event: Event) => {
      document.body.style.overflow = 'hidden';
    };

    let onMouseOut = (event: Event) => {
      document.body.style.overflow = 'auto';
    };

    document.getElementById(this.canvasId).addEventListener('mouseover', onMouseOver);
    document.getElementById(this.canvasId).addEventListener('mouseout', onMouseOut);
  }

  public addCameraControls(cameraTranslation: Transform, cameraRotationX: Transform, cameraRotationY: Transform) {
    let mouseDown: boolean = false,
      lastMouseX: number = 0,
      lastMouseY: number = 0;

    let handleMouseDown = (event: any) => {
      mouseDown = true;

      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    };

    let handleMouseUp = (event: any) => {
      mouseDown = false;
    };

    let handleMouseMove = (event: any) => {
      let newX = event.clientX;
      let newY = event.clientY;
      let position;

      if (!mouseDown) {
        return;
      }

      let deltaX = (newX - lastMouseX),
        deltaY = (newY - lastMouseY);

      cameraRotationX.reset();
      cameraRotationY.reset();
      cameraTranslation.reset();

      position = this.calcPositionCamera(deltaX, deltaY);

      cameraTranslation.translate(position.x, position.y, position.z);
      cameraRotationY.rotateX(Utils.radians(this.gradPhi));
      cameraRotationX.rotateY(Utils.radians(this.gradTheta + 90));

      lastMouseX = newX;
      lastMouseY = newY;
    };

    document.getElementById(this.canvasId).addEventListener('mousemove', handleMouseMove);
    document.getElementById(this.canvasId).addEventListener('mousedown', handleMouseDown);
    document.getElementById(this.canvasId).addEventListener('mouseup', handleMouseUp);
  }

  public addMouseControls(transformX: Transform, transformY: Transform, inverse?: boolean): void {
    let mouseDown: boolean = false,
      lastMouseX: number = 0,
      lastMouseY: number = 0;

    let handleMouseDown = (event: any) => {
      mouseDown = true;

      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    };

    let handleMouseUp = (event: any) => {
      mouseDown = false;
    };

    let handleMouseMove = (event: any) => {
      let newX = event.clientX;
      let newY = event.clientY;
      let position;

      if (!mouseDown) {
        return;
      }

      let deltaX = (newX - lastMouseX),
        deltaY = (newY - lastMouseY);

      if (inverse) {
        deltaX *= -1;
        deltaY *= -1;
      }

      transformX.rotateX(deltaY / 200);
      transformY.rotateY(deltaX / 200);

      lastMouseX = newX;
      lastMouseY = newY;
    };

    document.getElementById(this.canvasId).addEventListener('mousemove', handleMouseMove);
    document.getElementById(this.canvasId).addEventListener('mousedown', handleMouseDown);
    document.getElementById(this.canvasId).addEventListener('mouseup', handleMouseUp);
  }

  public mouseWheel(cameraTranslation: Transform) {
    let handleMouseWheel = (event: any) => {
      let sign = Math.sign(event.wheelDelta);
      if (sign > 0) {
        cameraTranslation.translate(0, 0, .5);
      } else {
        cameraTranslation.translate(0, 0, -.5);
      }
    };

    document.getElementById(this.canvasId).addEventListener('mousewheel', handleMouseWheel);
  }

  public mouseWheelScale(transform: Transform) {
    let handleMouseWheel = (event: any) => {
      let sign = Math.sign(event.wheelDelta);
      if (sign > 0) {
        transform.scale(1.05, 1.05, 1.05);
      } else {
        transform.scale(.95, .95, .95);
      }
    };

    document.getElementById(this.canvasId).addEventListener('mousewheel', handleMouseWheel);
  }

  public calcGradTheta(increment: number) {
    if ((this.gradTheta + increment) > 360) {
      this.gradTheta = (this.gradTheta + increment) - 360;
    } else if ((this.gradTheta + increment) < 0) {
      this.gradTheta = (this.gradTheta + increment) + 360;
    } else {
      this.gradTheta += increment;
    }

    return this.gradTheta;
  }

  public calcGradPhi(increment: number) {
    if ((this.gradPhi + increment) > 360) {
      this.gradPhi = (this.gradPhi + increment) - 360;
    } else if ((this.gradPhi + increment) < 0) {
      this.gradPhi = (this.gradPhi + increment) + 360;
    } else {
      this.gradPhi += increment;
    }

    return this.gradPhi;
  }

  public calcPositionCamera(incrementX: number, incrementY: number) {
    this.calcGradTheta(incrementX);
    this.calcGradPhi(incrementY);

    let z = this.initialTranslation * Utils.sin(this.gradTheta) * Utils.cos(this.gradPhi),
      y = this.initialTranslation * Utils.sin(this.gradTheta) * Utils.sin(this.gradPhi),
      x = this.initialTranslation * Utils.cos(this.gradTheta);

    return {
      x: x,
      y: y,
      z: z
    };
  }

  public addKeyboardWASDControls(transform: Transform, increment: number = 0.05): void {
    let handler = (event: any) => {
      if (event.keyCode === 65) { // Left A
        transform.translate(-increment, 0, 0);
      } else if (event.keyCode === 68) { // Right D
        transform.translate(increment, 0, 0);
      } else if (event.keyCode === 87) { // Up W
        transform.translate(0, increment, 0);
      } else if (event.keyCode === 83) { // Down S
        transform.translate(0, -increment, 0);
      } else if (event.keyCode === 81) { // Front Q
        transform.translate(0, 0, -increment);
      } else if (event.keyCode === 69) { // Back E
        transform.translate(0, 0, increment);
      } else if (event.keyCode === 90) { // Rotate Up Z
        transform.rotateX(-increment);
      } else if (event.keyCode === 88) { // Rotate Down X
        transform.rotateX(increment);
      } else if (event.keyCode === 67) { // Rotate Left C
        transform.rotateY(-increment);
      } else if (event.keyCode === 86) { // Rotate Right V
        transform.rotateY(increment);
      }
    };

    window.addEventListener('keydown', handler);
  }

  public addKeyboardArrowKeys(transform: Transform, increment: number = 0.05): void {
    let handler = (event: any) => {
      if (event.keyCode === 37) { // Left
        transform.translate(-increment, 0, 0);
      } else if (event.keyCode === 39) { // Right
        transform.translate(increment, 0, 0);
      } else if (event.keyCode === 38) { // Up
        transform.translate(0, increment, 0);
      } else if (event.keyCode === 40) { // Down
        transform.translate(0, -increment, 0);
      }
    };

    window.addEventListener('keydown', handler);

  }
}
