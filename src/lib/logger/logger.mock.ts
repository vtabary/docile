import { Logger } from './logger';

export class MockedLogger implements Logger {
  public message(): void {}

  public info(): void {}

  public warn(): void {}

  public error(): void {}

  public success(): void {}
}
