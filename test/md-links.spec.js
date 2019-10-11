import { mdLinks } from '../src/md-links.js';

import { validateLinks } from '../src/options.js';

import {
  theDirExist, getFilePaths, readAllMarkdowns, extractLinks, extractLinksFromMdFiles,
} from '../src/extract-links.js';

const mock = require('mock-fs');

const fileStruct = {
  'path/to/fake/dir': {
    'some-file.txt': 'file content here',
    'some-file.md': 'some content here with the link only for firebase [Firestore](https://firebase.google.com/docs/firestore) ',
    fakedir2: {
      'some-file2.txt': 'file content here2',
      'some-file2.md': 'some other content with several links [mobile](https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png)[desktop](https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png)[_mobile first_](https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/)',
      fakedir3: {
        'some-file3.txt': 'file content here3',
        'some-file3.md': 'some other content with several links [mobile](https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png)[desktop](https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png)[_mobile first_](https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/no)',
      },
    },
  },
  'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
  'some/other/path': {/** another empty directory */},
};

beforeEach(() => { mock(fileStruct); });
afterAll(() => { mock.restore(); });

const pathsAllFiles = [
  'path/to/fake/dir/fakedir2',
  'path/to/fake/dir/some-file.md',
  'path/to/fake/dir/some-file.txt',
  'path/to/fake/dir/fakedir2/fakedir3',
  'path/to/fake/dir/fakedir2/some-file2.md',
  'path/to/fake/dir/fakedir2/some-file2.txt',
  'path/to/fake/dir/fakedir2/fakedir3/some-file3.md',
  'path/to/fake/dir/fakedir2/fakedir3/some-file3.txt',
];

const archivosMarkdown = [
  'path/to/fake/dir/some-file.md',
  'path/to/fake/dir/fakedir2/some-file2.md',
  'path/to/fake/dir/fakedir2/fakedir3/some-file3.md',
];

const linkArray = [
  {
    file: 'path/to/fake/dir',
    href: 'https://firebase.google.com/docs/firestore',
    text: 'Firestore',
  },
  {
    file: 'path/to/fake/dir/fakedir2',
    href: 'https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png',
    text: 'mobile',
  },
  {
    file: 'path/to/fake/dir/fakedir2',
    href: 'https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png',
    text: 'desktop',
  },
  {
    file: 'path/to/fake/dir/fakedir2',
    href: 'https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/',
    text: '_mobile first_',
  },
  {
    file: 'path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png',
    text: 'mobile',
  },
  {
    file: 'path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png',
    text: 'desktop',
  },
  {
    file: 'path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/no',
    text: '_mobile first_',
  },
];

const optionsLinkArray = [
  {
    file: 'path/to/fake/dir',
    href: 'https://firebase.google.com/docs/firestore',
    msg: 'ok',
    status: 200,
    text: 'Firestore',
  },
  {
    file: 'path/to/fake/dir/fakedir2',
    href: 'https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png',
    msg: 'ok',
    status: 200,
    text: 'mobile',
  },
  {
    file: 'path/to/fake/dir/fakedir2',
    href: 'https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png',
    msg: 'ok',
    status: 200,
    text: 'desktop',
  },
  {
    file: 'path/to/fake/dir/fakedir2',
    href: 'https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/',
    msg: 'ok',
    status: 200,
    text: '_mobile first_',
  },
  {
    file: 'path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png',
    msg: 'ok',
    status: 200,
    text: 'mobile',
  },
  {
    file: 'path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png',
    msg: 'ok',
    status: 200,
    text: 'desktop',
  },
  {
    file: 'path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/no',
    msg: 'fail',
    status: 404,
    text: '_mobile first_',
  },
];

const optionsLinkArrayfalse = [
  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir',
    href: 'https://firebase.google.com/docs/firestore',
    text: 'Firestore',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2',
    href: 'https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png',
    text: 'mobile',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2',
    href: 'https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png',
    text: 'desktop',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2',
    href: 'https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/',
    text: '_mobile first_',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png',
    text: 'mobile',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png',
    text: 'desktop',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/no',
    text: '_mobile first_',
  },
];

const optionsLinkArraytrue = [
  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir',
    href: 'https://firebase.google.com/docs/firestore',
    msg: 'ok',
    status: 200,
    text: 'Firestore',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2',
    href: 'https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png',
    msg: 'ok',
    status: 200,
    text: 'mobile',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2',
    href: 'https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png',
    msg: 'ok',
    status: 200,
    text: 'desktop',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2',
    href: 'https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/',
    msg: 'ok',
    status: 200,
    text: '_mobile first_',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png',
    msg: 'ok',
    status: 200,
    text: 'mobile',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png',
    msg: 'ok',
    status: 200,
    text: 'desktop',
  },

  {
    file: '/home/sabrina/Documents/LABORATORIA - LIM010/LIM010-fe-md-links/path/to/fake/dir/fakedir2/fakedir3',
    href: 'https://www.mediaclick.es/blog/diseno-web-responsive-design-y-la-importancia-del-mobile-first/no',
    msg: 'fail',
    status: 404,
    text: '_mobile first_',
  },
];

describe('theDirExist', () => {
  it('el directorio existe', () => {
    expect(theDirExist('path/to/fake/dir')).toBe(true);
  });

  it('el directorio no existe', () => {
    expect(theDirExist('path/to/fake/dirno')).toBe(false);
  });
});

describe('getFilePaths', () => {
  it('obtiene recursivamente las rutas de todos los archivos', () => {
    expect(getFilePaths('path/to/fake/dir')).toStrictEqual(pathsAllFiles);
  });
});

describe('readAllMarkdowns', () => {
  it('extrae todos los archivos markdown dentro del directorio', () => {
    expect(readAllMarkdowns(pathsAllFiles)).toStrictEqual(archivosMarkdown);
  });
});

describe('extractLinks', () => {
  it('extrae todos los links del archivo markdown', () => {
    expect(extractLinks(archivosMarkdown)).toStrictEqual(linkArray);
  });
});

describe('extractLinksFromMdFiles', () => {
  it('extrae todos los links de los archivos markdown dentro de un directorio', () => {
    expect(extractLinksFromMdFiles('path/to/fake/dir')).toStrictEqual(linkArray);
  });
  it('genera error cuando el directorio ingresado no existe', () => {
    expect(extractLinksFromMdFiles('path/to/fake/fakeDir')).toBe('No existe el directorio especificado');
  });
});


describe('validateLinks', () => {
  it('validateLinks', (done) => {
    validateLinks(linkArray)
      .then((data) => {
        expect(data).toStrictEqual(optionsLinkArray);
        done();
      });
  });
});

describe('mdLinks', () => {
  it('ciclo de la función que recibe un path y options validate true', (done) => {
    mdLinks('path/to/fake/dir', { validate: true })
      .then((data) => {
        expect(data).toStrictEqual(optionsLinkArraytrue);
        done();
      });
  });
  it('ciclo de la función que recibe un path y options validate false', (done) => {
    mdLinks('path/to/fake/dir', { validate: false })
      .then((data) => {
        expect(data).toStrictEqual(optionsLinkArrayfalse);
        done();
      });
  });
});
