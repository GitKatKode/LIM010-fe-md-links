import { extractLinksFromMdFiles } from '../MyLib/lib/extract-links.js';
import { validateLinks } from '../MyLib/lib/options.js';

const path = require('path');

export const mdLinks = (thePath, options) => {
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
