export class Logger {
  public message(...messages: any[]) {
    console.log(...messages);
  }

  public info(...messages: any[]) {
    console.info(...messages);
  }

  public warn(...messages: any[]) {
    console.warn(...messages);
  }

  public error(...messages: any[]) {
    console.error(...messages);
  }

  public success(...messages: any[]) {
    console.log(...messages);
  }
}
