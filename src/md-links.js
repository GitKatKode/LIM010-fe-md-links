import { extractLinksFromMdFiles } from './extract-links.js';
import { validateLinks } from './options.js';

const path = require('path');

const mdLinks = (thePath, options) => {
  let newPath = thePath;
  return new Promise((resolve) => {
    if (!path.isAbsolute(thePath)) {
      newPath = path.resolve(thePath);
    }
    const linksExtracted = extractLinksFromMdFiles(newPath);
    if (options.validate) {
      validateLinks(linksExtracted)
        .then((response) => resolve(response));
    } else {
      resolve(linksExtracted);
    }
  });
};

export { mdLinks };
// module.exports.mdLinks = mdLinks;
