import { ErrorSource } from './error';

describe('ErrorSource', () => {
  let source: ErrorSource;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new ErrorSource({ id: 'test' })).not.toThrow();
    });
  });

  describe('#download', () => {
    beforeEach(() => {
      spyOn(console, 'error').and.stub();
      source = new ErrorSource({ id: 'test' });
    });

    it('should throw', async () => {
      await expect(source.download('/tmp')).rejects.toThrow(
        `Can't copy the source "test"`
      );
    });
  });
});
