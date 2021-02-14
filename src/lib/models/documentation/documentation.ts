import { Version } from '../version/version';

export class Documentation {
  public label: string;
  public versions: Version[] = [];

  constructor(data: { label?: string; versions?: Version[] }) {
    this.label = data.label || 'Untitled documentation';
    this.versions = data.versions || [];
  }

  public async download(outDir: string): Promise<void> {
    await Promise.all(this.versions.map((version) => version.download(outDir)));
  }
}
