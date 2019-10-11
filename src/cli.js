#!/usr/bin/env node

import { mdLinks } from '../lib/md-links.js';

const [,, ...args] = process.argv;


// eslint-disable-next-line consistent-return
const cliMdLinks = (path, op1, op2) => {
  if (!op1 && !op2) {
    return mdLinks(path, { validate: false })
      .then((resp) => {
        resp.forEach((link) => {
          console.log(link.file, link.href, link.text);
        });
      });
  }
  if (op1 === '--validate' && op2 === undefined) {
    return mdLinks(path, { validate: true })
      .then((resp) => {
        resp.forEach((link) => {
          console.log(link.file, link.href, link.status, link.msg, link.text);
        });
      });
  }
  if (op1 === '--stats' && op2 === undefined) {
    return mdLinks(path, { validate: true })
      .then((resp) => {
        const total = resp.length;
        const unique = [...new Set(resp.map((link) => link.href))].length;
        console.log(`Total: ${total}\nUnique: ${unique}`);
      });
  }
  if (((op1 === '--validate') && (op2 === '--stats')) || ((op2 === '--validate') && (op1 === '--stats'))) {
    return mdLinks(path, { validate: true })
      .then((resp) => {
        const total = resp.length;
        const unique = [...new Set(resp.map((link) => link.href))].length;
        const broken = [...new Set(resp.map((link) => link.msg === 'fail'))].length;
        console.log(`Total: ${total}\nUnique: ${unique}\nBroken: ${broken}`);
      });
  }
};
cliMdLinks(args[0], args[1], args[2]).then((resp) => resp);
