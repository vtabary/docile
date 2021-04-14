import { Logger } from './logger';

export class MockedLogger implements Logger {
  public message() {}
  public info() {}
  public warn() {}
  public error() {}
  public success() {}
}
