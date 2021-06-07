import { ETARenderer, WRAPPERS } from './eta';

describe('ETARenderer', () => {
  let generator: ETARenderer;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new ETARenderer()).not.toThrow();
    });
  });

  describe('#render', () => {
    let spyRender: jest.SpyInstance;

    beforeEach(() => {
      spyRender = jest
        .spyOn(WRAPPERS, 'renderFile')
        .mockImplementation(async () => 'rendered file');

      generator = new ETARenderer();
    });

    it("should throw when the file can't be rendered", async () => {
      spyRender.mockReset().mockImplementation(async () => {
        throw new Error('some problem');
      });
      await expect(generator.render('/tmp/test', {})).rejects.toThrow(
        'some problem'
      );
    });

    it('should convert the file content into HTML', async () => {
      await expect(await generator.render('/tmp/test', {})).toEqual(
        'rendered file'
      );
    });
  });
});
