const fs = require('fs');
const path = require('path');

const extractLinks = (filesPaths) => {
  const linksArrayFormat = [];

  filesPaths.forEach((uniquePath) => {
    const onlyOneFileContent = fs.readFileSync(uniquePath).toString();
    // const linkRegExpInMd = /\[(.+)\]\(([^ ]+)(?: "(.+)")?\)/g;
    // eslint-disable-next-line no-empty-character-class
    const linkRegExpInMd = /([])|\[(.*?)\]\(.*?\)/gm;
    const everyLink = onlyOneFileContent.toString().match(linkRegExpInMd);

    const linkRegExp = /\(([^ ]+)(?: "(.+)")?\)/gm;
    const textRegExp = /\[.+\]/gm;

    everyLink.forEach((link) => {
      const linkObj = {
        href: link.match(linkRegExp).toString().replace('(', '').replace(')', ''),
        text: link.match(textRegExp).toString().replace('[', '').replace(']', ''),
        file: path.dirname(uniquePath).toString(),
      };
      linksArrayFormat.push(linkObj);
    });
  });
  return linksArrayFormat;
};

const readAllMarkdowns = (filePathList) => {
  const result = [];
  filePathList.forEach((file) => {
    if (path.extname(file).toLowerCase() === '.md' || path.extname(file).toLowerCase() === '.markdown') {
      result.push(file);
    }
  });
  return result;
};

const getFilePaths = (dir) => {
  let fileList = [];
  let dirfilelist = [];
  let fileslist = [];
  fs.readdirSync(dir).forEach((file) => {
    fileslist = fs.statSync(dir).isFile()
      ? getFilePaths(path.join(dir, file))
      : fileslist.concat(path.join(dir, file));
    dirfilelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? getFilePaths(path.join(dir, file))
      : dirfilelist.concat(path.join(dir, file));
    fileList = fileslist.concat(dirfilelist);
  });
  return [...new Set(fileList)];
};

const theDirExist = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

const extractLinksFromMdFiles = (paths) => {
  let links = [];
  if (theDirExist(paths)) {
    const allFilesPaths = getFilePaths(paths);
    const markdownFiles = readAllMarkdowns(allFilesPaths);
    links = extractLinks(markdownFiles);
  } else {
    links = 'No existe el directorio especificado';
  }
  return links;
};

export {
  theDirExist, getFilePaths, readAllMarkdowns, extractLinks, extractLinksFromMdFiles,
};
