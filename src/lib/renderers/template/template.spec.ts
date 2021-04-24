import * as file from '../../helpers/file/file';
import { ETARenderer } from '../engines/eta/eta';
import { TemplateRenderer } from './template';

describe('TemplateRenderer', () => {
  let renderer: TemplateRenderer;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new TemplateRenderer()).not.toThrow();
    });
  });

  describe('#render', () => {
    beforeEach(() => {
      jest
        .spyOn(ETARenderer.prototype, 'render')
        .mockImplementation(async () => 'rendered file');
      jest.spyOn(file, 'writeFile').mockImplementation(async () => undefined);

      renderer = new TemplateRenderer();
    });

    it('should convert the file content into rendered HTML', async () => {
      await renderer.render('/tmp/test', '/tmp/dest', {
        data: { documentation: { versions: [] } },
      });
      expect(file.writeFile).toHaveBeenCalledWith(
        '/tmp/dest/test',
        'rendered file'
      );
    });
  });
});
