export abstract class Resource {
  public id: string;
  public loaded: boolean = false;

  constructor(id?: string) {
    this.id = id;
  }

  public loadFile(): Promise<any> {
    return Promise.resolve();
  }

  public draw(): void {}
}
