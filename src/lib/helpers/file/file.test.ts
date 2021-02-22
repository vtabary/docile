import { promises } from 'fs';

import {
  copyFile,
  copyFiles,
  // copyFiles,
  listFiles,
  readFile,
  recursiveMkdir,
  WRAPPERS,
  writeFile,
} from './file';

describe('#copyFile', () => {
  beforeEach(() => {
    jest.spyOn(promises, 'mkdir').mockImplementation(async () => undefined);
    jest.spyOn(promises, 'copyFile').mockImplementation(async () => undefined);
  });

  it('should insure that the parent directory of the destination has been created', async () => {
    await copyFile('/tmp/test', '/tmp/test2');
    expect(promises.mkdir).toHaveBeenCalledWith('/tmp', {
      recursive: true,
    });
  });

  it('should call the copyFile system function', async () => {
    await copyFile('/tmp/test', '/tmp/test2');
    expect(promises.copyFile).toHaveBeenCalledWith('/tmp/test', '/tmp/test2');
  });
});

describe('#copyFiles', () => {
  beforeEach(() => {
    jest
      .spyOn(WRAPPERS, 'globby')
      .mockImplementation(async () => ['tmp/file1', 'tmp/file2']);
    jest.spyOn(promises, 'copyFile').mockImplementation(async () => undefined);
  });

  it('should get the relative file list of the source directory', async () => {
    await copyFiles('/src', ['**/*'], '/dest');
    expect(WRAPPERS.globby).toHaveBeenCalledWith(['**/*'], {
      cwd: '/src',
      absolute: false,
    });
  });

  it('should call the copy for each path', async () => {
    await copyFiles('/src', ['**/*'], '/dest');
    expect(promises.copyFile).toHaveBeenCalledWith(
      '/src/tmp/file1',
      '/dest/tmp/file1'
    );
    expect(promises.copyFile).toHaveBeenCalledWith(
      '/src/tmp/file2',
      '/dest/tmp/file2'
    );
  });
});

describe('#listFiles', () => {
  let spyGlob: jest.SpyInstance;

  beforeEach(() => {
    spyGlob = jest.spyOn(WRAPPERS, 'globby');
    spyGlob.mockImplementation(async () => []);
  });

  it('should return an empty list', async () => {
    expect(listFiles('/tmp', ['**/*'])).resolves.toEqual([]);
    expect(spyGlob).toHaveBeenCalledWith(['**/*'], {
      cwd: '/tmp',
      absolute: true,
    });
  });

  it('should return the relative file list', async () => {
    spyGlob.mockImplementation(async () => ['/tmp/file']);
    expect(listFiles('/tmp', ['**/*'], { absolute: false })).resolves.toEqual([
      '/tmp/file',
    ]);
    expect(spyGlob).toHaveBeenCalledWith(['**/*'], {
      cwd: '/tmp',
      absolute: false,
    });
  });

  it('should get the file list of the source directory', async () => {
    expect(listFiles('/tmp', ['**/*'])).resolves.toEqual([]);
  });

  it('should throw an error', () => {
    spyGlob.mockImplementation(async () => {
      throw 'some error';
    });
    expect(listFiles('/tmp', ['**/*'])).rejects.toEqual('some error');
  });
});

describe('#readFile', () => {
  beforeEach(() => {
    jest
      .spyOn(promises, 'readFile')
      .mockImplementation(async () => 'data test');
  });

  it('should read the file as an utf-8 file', async () => {
    await readFile('/tmp/test');
    expect(promises.readFile).toHaveBeenCalledWith('/tmp/test', {
      encoding: 'utf-8',
    });
  });

  it('should return the read data', async () => {
    expect(await readFile('/tmp/test')).toEqual('data test');
  });
});

describe('#recursiveMkdir', () => {
  beforeEach(() => {
    jest.spyOn(promises, 'mkdir').mockImplementation(async () => undefined);
  });

  it('should call the mkdir system function', async () => {
    await recursiveMkdir('/tmp/test');
    expect(promises.mkdir).toHaveBeenCalledWith('/tmp/test', {
      recursive: true,
    });
  });
});

describe('#writeFile', () => {
  beforeEach(() => {
    jest.spyOn(promises, 'mkdir').mockImplementation(async () => undefined);
    jest.spyOn(promises, 'writeFile').mockImplementation(async () => undefined);
  });

  it('should insure that the parent directory has been created', async () => {
    await writeFile('/tmp/test', 'some data');
    expect(promises.mkdir).toHaveBeenCalledWith('/tmp', {
      recursive: true,
    });
  });

  it('should call the writeFile system function', async () => {
    await writeFile('/tmp/test', 'some data');
    expect(promises.writeFile).toHaveBeenCalledWith('/tmp/test', 'some data', {
      encoding: 'utf-8',
    });
  });
});
