import { ISource } from '../../models/source';

export type ISourceConfiguration<
  T extends Record<string, unknown> = { [key: string]: unknown },
  K extends string = string
> = Omit<ISource<T, K>, 'id'>;

export class SourceBuilder {
  /**
   * Convert a configuration to a valid object
   * @param data
   * @returns the new object
   */
  public build<
    T extends Record<string, unknown> = { [key: string]: unknown },
    K extends string = string
  >(key: string, source: ISourceConfiguration<T, K>): ISource<T, K> {
    return {
      id: key,
      type: source.type,
      options: source.options || {},
    };
  }

  /**
   * Validate the configuration of a source
   * @param data the source to validate
   * @returns true when the source has all the data
   */
  public validate<
    T extends Record<string, unknown> = { [key: string]: unknown },
    K extends string = string
  >(source?: ISourceConfiguration<T, K>): boolean {
    return !!source?.type && !!source.options;
  }
}
