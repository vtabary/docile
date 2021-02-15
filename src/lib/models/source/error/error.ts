import { ISource } from '../source';

export class ErrorSource implements ISource {
  public readonly id: string;
  public readonly path = '';

  public constructor(data: { id: string }) {
    this.id = data.id;
    return this;
  }

  public async download(): Promise<void> {
    console.error(`Can't copy the source "${this.id}"`);
    throw new Error(`Can't copy the source "${this.id}"`);
  }
}
