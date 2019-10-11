"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mdLinks = void 0;

var _extractLinks = require("../MyLib/lib/extract-links.js");

var _options = require("../MyLib/lib/options.js");

var path = require('path');

var mdLinks = function mdLinks(thePath, options) {
  var newPath = thePath;
  return new Promise(function (resolve) {
    if (!path.isAbsolute(thePath)) {
      newPath = path.resolve(thePath);
    }

    var linksExtracted = (0, _extractLinks.extractLinksFromMdFiles)(newPath);

    if (options.validate) {
      (0, _options.validateLinks)(linksExtracted).then(function (response) {
        return resolve(response);
      });
    } else {
      resolve(linksExtracted);
    }
  });
};

exports.mdLinks = mdLinks;