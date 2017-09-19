import { SpecularMaps } from './SpecularMaps';
import { NormalMaps } from './NormalMaps';
import { Phong } from './Phong';
import { SpecularNormal } from './SpecularNormal';
import { Toon } from './Toon';
import { Blending } from './Blending';
import { Basic } from './Basic';
import { Animation } from './Animation';
import { App } from './App';

declare var window: {
    [key: string]: any; // missing index defintion
    prototype: Window;
    new(): Window;
};

export class Main {

  constructor() {
    new Basic('basic');
    new Phong('phong');
    new SpecularMaps('specularmaps');
    new NormalMaps('normalmaps');
    new SpecularNormal('specularnormal');
    new Blending('blending');
    new Toon('toon');
    new Animation('animation');
  }
}

export class Viewer {
  constructor() {
    new App('viewer');
  }
}

export class Application {
  constructor() {
    new App('app');
  }
}

// new Main();
