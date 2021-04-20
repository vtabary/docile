import { ISource } from './source';

export interface IVersion {
  sources: ISource[];
  id: string;
  label?: string;
}
