#!/usr/bin/env node
"use strict";

var _mdLinks = require("../lib/md-links.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _process$argv = _toArray(process.argv),
    args = _process$argv.slice(2); // eslint-disable-next-line consistent-return


var cliMdLinks = function cliMdLinks(path, op1, op2) {
  if (!op1 && !op2) {
    return (0, _mdLinks.mdLinks)(path, {
      validate: false
    }).then(function (resp) {
      resp.forEach(function (link) {
        console.log(link.file, link.href, link.text);
      });
    });
  }

  if (op1 === '--validate' && op2 === undefined) {
    return (0, _mdLinks.mdLinks)(path, {
      validate: true
    }).then(function (resp) {
      resp.forEach(function (link) {
        console.log(link.file, link.href, link.status, link.msg, link.text);
      });
    });
  }

  if (op1 === '--stats' && op2 === undefined) {
    return (0, _mdLinks.mdLinks)(path, {
      validate: true
    }).then(function (resp) {
      var total = resp.length;

      var unique = _toConsumableArray(new Set(resp.map(function (link) {
        return link.href;
      }))).length;

      console.log("Total: ".concat(total, "\nUnique: ").concat(unique));
    });
  }

  if (op1 === '--validate' && op2 === '--stats' || op2 === '--validate' && op1 === '--stats') {
    return (0, _mdLinks.mdLinks)(path, {
      validate: true
    }).then(function (resp) {
      var total = resp.length;

      var unique = _toConsumableArray(new Set(resp.map(function (link) {
        return link.href;
      }))).length;

      var broken = _toConsumableArray(new Set(resp.map(function (link) {
        return link.msg === 'fail';
      }))).length;

      console.log("Total: ".concat(total, "\nUnique: ").concat(unique, "\nBroken: ").concat(broken));
    });
  }
};

cliMdLinks(args[0], args[1], args[2]).then(function (resp) {
  return resp;
});