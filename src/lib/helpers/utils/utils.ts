export class Utils {
  public static promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
    if (promises.length === 0) {
      return Promise.resolve([]);
    }

    return Promise.all(promises);
  }

  public static promiseAllVoid<T>(promises: Promise<T>[]): Promise<void> {
    return Utils.promiseAll(promises)
      .then(() => undefined);
  }
}
