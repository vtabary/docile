import { Logger } from './logger';

describe('Logger', () => {
  let logger: Logger;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new Logger()).not.toThrow();
    });
  });

  describe('#message', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockReturnValue(undefined);
      logger = new Logger();
    });

    it('should display a message', () => {
      logger.message('some message');
      expect(console.log).toHaveBeenCalledWith('some message');
    });

    it('should display multiple messages', () => {
      logger.message('some message', { test: 42 });
      expect(console.log).toHaveBeenCalledWith('some message', { test: 42 });
    });
  });

  describe('#info', () => {
    beforeEach(() => {
      jest.spyOn(console, 'info').mockReturnValue(undefined);
      logger = new Logger();
    });

    it('should display a message', () => {
      logger.info('some message');
      expect(console.info).toHaveBeenCalledWith('some message');
    });

    it('should display multiple messages', () => {
      logger.info('some message', { test: 42 });
      expect(console.info).toHaveBeenCalledWith('some message', { test: 42 });
    });
  });

  describe('#warn', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockReturnValue(undefined);
      logger = new Logger();
    });

    it('should display a message', () => {
      logger.warn('some message');
      expect(console.warn).toHaveBeenCalledWith('some message');
    });

    it('should display multiple messages', () => {
      logger.warn('some message', { test: 42 });
      expect(console.warn).toHaveBeenCalledWith('some message', { test: 42 });
    });
  });

  describe('#success', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockReturnValue(undefined);
      logger = new Logger();
    });

    it('should display a message', () => {
      logger.success('some message');
      expect(console.log).toHaveBeenCalledWith('some message');
    });

    it('should display multiple messages', () => {
      logger.success('some message', { test: 42 });
      expect(console.log).toHaveBeenCalledWith('some message', { test: 42 });
    });
  });

  describe('#error', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockReturnValue(undefined);
      logger = new Logger();
    });

    it('should display a message', () => {
      logger.error('some message');
      expect(console.error).toHaveBeenCalledWith('some message');
    });

    it('should display multiple messages', () => {
      logger.error('some message', { test: 42 });
      expect(console.error).toHaveBeenCalledWith('some message', { test: 42 });
    });
  });
});
