const credentials = require('./secrets');
const Monzo = require('./lib/monzo');

/**
 * Initialize the monzo library
 */

const monzo = new Monzo(credentials);

/**
 * get transactions for a specific account
 */

monzo
  .transactions('ACCOUNT_ID')
  .then(res => {
    console.log(res);
  })
  .catch(err => console.log(err, 'accounts'));
