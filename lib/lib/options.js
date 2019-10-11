"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateLinks = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fetch = require('node-fetch');

var validateLinks = function validateLinks(arrObj) {
  var arrayPromises = arrObj.map(function (links) {
    return fetch(links.href).then(function (response) {
      var newLinkObj = _objectSpread({}, links, {
        status: 'URL no válida',
        msg: 'fail'
      });

      if (response.status >= 200 && response.status < 400) {
        newLinkObj.status = response.status;
        newLinkObj.msg = 'ok';
        return newLinkObj;
      }

      newLinkObj.status = response.status;
      return newLinkObj;
    })["catch"](function (err) {
      var newErrObj = _objectSpread({}, links, {
        status: err,
        msg: 'fail'
      });

      return newErrObj;
    });
  });
  return Promise.all(arrayPromises);
};

exports.validateLinks = validateLinks;