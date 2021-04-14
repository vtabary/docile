import * as file from '../../../helpers/file/file';
import { MarkdownRenderer } from './markdown';

describe('MarkdownRenderer', () => {
  let generator: MarkdownRenderer;

  describe('#new', () => {
    it('should create an instance', () => {
      expect(() => new MarkdownRenderer()).not.toThrow();
    });
  });

  describe('#generate', () => {
    beforeEach(() => {
      jest.spyOn(file, 'readFile').mockImplementation(
        async () => `# Chapter 1

## Test

Content`
      );
      generator = new MarkdownRenderer();
    });

    it('should convert the file content into HTML', async () => {
      expect(await generator.render('/tmp/test', {})).toEqual(
        `<h1 id="chapter-1">Chapter 1</h1>
<h2 id="test">Test</h2>
<p>Content</p>
`
      );
    });
  });
});
