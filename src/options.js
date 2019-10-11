const fetch = require('node-fetch');

const validateLinks = (arrObj) => {
  const arrayPromises = arrObj.map((links) => fetch(links.href)
    .then((response) => {
      const newLinkObj = {
        ...links,
        status: 'URL no válida',
        msg: 'fail',
      };
      if (response.status >= 200 && response.status < 400) {
        newLinkObj.status = response.status;
        newLinkObj.msg = 'ok';
        return newLinkObj;
      }
      newLinkObj.status = response.status;
      return newLinkObj;
    }).catch((err) => {
      const newErrObj = {
        ...links,
        error: err,
        status: 'link sin acceso',
        msg: 'fail',
      };
      return newErrObj;
    }));
  return Promise.all(arrayPromises);
};


export { validateLinks };
