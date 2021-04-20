export interface ISource<
  T extends Record<string, unknown> = { [key: string]: unknown },
  K extends string = string
> {
  id: string;
  type: K;
  options: T;
}
