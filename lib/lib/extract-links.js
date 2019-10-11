"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var fs = require('fs');

var path = require('path');

var extractLinks = function extractLinks(filesPaths) {
  var linksArrayFormat = [];
  filesPaths.forEach(function (uniquePath) {
    var onlyOneFileContent = fs.readFileSync(uniquePath).toString(); // const linkRegExpInMd = /\[(.+)\]\(([^ ]+)(?: "(.+)")?\)/g;
    // eslint-disable-next-line no-empty-character-class

    var linkRegExpInMd = /([])|\[(.*?)\]\(.*?\)/gm;
    var everyLink = onlyOneFileContent.toString().match(linkRegExpInMd);
    var linkRegExp = /\(([^ ]+)(?: "(.+)")?\)/gm;
    var textRegExp = /\[.+\]/gm;
    everyLink.forEach(function (link) {
      var linkObj = {
        href: link.match(linkRegExp).toString().replace('(', '').replace(')', ''),
        text: link.match(textRegExp).toString().replace('[', '').replace(']', ''),
        file: path.dirname(uniquePath).toString()
      };
      linksArrayFormat.push(linkObj);
    });
  });
  return linksArrayFormat;
};

var readAllMarkdowns = function readAllMarkdowns(filePathList) {
  var result = [];
  filePathList.forEach(function (file) {
    if (path.extname(file).toLowerCase() === '.md' || path.extname(file).toLowerCase() === '.markdown') {
      result.push(file);
    }
  });
  return result;
};

var getFilePaths = function getFilePaths(dir) {
  var fileList = [];
  var dirfilelist = [];
  var fileslist = [];
  fs.readdirSync(dir).forEach(function (file) {
    fileslist = fs.statSync(dir).isFile() ? getFilePaths(path.join(dir, file)) : fileslist.concat(path.join(dir, file));
    dirfilelist = fs.statSync(path.join(dir, file)).isDirectory() ? getFilePaths(path.join(dir, file)) : dirfilelist.concat(path.join(dir, file));
    fileList = fileslist.concat(dirfilelist);
  });
  return _toConsumableArray(new Set(fileList));
};

var theDirExist = function theDirExist(dir) {
  try {
    fs.accessSync(dir, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

var extractLinksFromMdFiles = function extractLinksFromMdFiles(paths) {
  var links = [];

  if (theDirExist(paths)) {
    var allFilesPaths = getFilePaths(paths);
    var markdownFiles = readAllMarkdowns(allFilesPaths);
    links = extractLinks(markdownFiles);
  } else {
    links = 'No existe el directorio especificado';
  }

  return links;
};

module.exports = {
  theDirExist: theDirExist,
  getFilePaths: getFilePaths,
  readAllMarkdowns: readAllMarkdowns,
  extractLinks: extractLinks,
  extractLinksFromMdFiles: extractLinksFromMdFiles
};