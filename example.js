const credentials = require('./secrets');
const Monzo = require('./lib/monzo');

/**
 * Initialize the monzo library
 */

const monzo = new Monzo(credentials);

/**
 * get your accounts
 */

monzo
  .accounts()
  .then(res => {
    console.log(res);
  })
  .catch(err => console.log(err));
