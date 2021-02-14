import { ISource } from '../source/source';

export class Version {
  public sources: ISource[];
  public id: string;
  public label: string;

  constructor(data: { id: string; label?: string; sources?: ISource[] }) {
    this.id = data.id;
    this.label = data.label || 'Untitled version';
    this.sources = data.sources || [];
  }

  public async download(outDir: string): Promise<void> {
    await Promise.all(this.sources.map((source) => source.download(outDir)));
  }
}
