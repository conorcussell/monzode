const request = require('request');

class Monzo {
  constructor(credentials) {
    this.credentials = credentials;
    this.accessToken;
    this.refreshToken;
  }

  apiRequest(options) {
    return new Promise((resolve, reject) => {
      request(options, (err, res) => {
        if (err) {
          reject(err);
        } else {
          var data = res.body;
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(res.statusCode);
          }
        }
      });
    });
  }

  authenticatedApiRequest(options) {
    if (this.accessToken) {
      options.headers = options.headers || {};
      options.headers.Authorization = 'Bearer ' + this.accessToken;
      return this.apiRequest(options);
    } else {
      return new Promise((resolve, reject) => {
        this.authenticate()
          .then(res => {
            options.headers = options.headers || {};
            options.headers.Authorization = 'Bearer ' + res.access_token;
            this.apiRequest(options)
              .then(res => resolve(res))
              .catch(err => reject(err));
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }

  authenticate() {
    const form = Object.assign({ grant_type: 'password' }, this.credentials);
    const options = {
      method: 'POST',
      uri: 'https://api.monzo.com/oauth2/token',
      form
    };
    return new Promise((resolve, reject) => {
      this.apiRequest(options)
        .then(res => {
          this.accessToken = res.access_token;
          this.refreshToken = res.refresh_token;
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }

  accounts(currentAccount = false) {
    const options = {
      method: 'GET',
      uri: `https://api.monzo.com/accounts${currentAccount
        ? '?account_type=uk_retail'
        : ''}`
    };
    return this.authenticatedApiRequest(options);
  }

  balance(accountId) {
    const options = {
      method: 'GET',
      uri: `https://api.monzo.com/balance?account_id=${accountId}`
    };
    return this.authenticatedApiRequest(options);
  }

  transactions(accountId) {
    const options = {
      method: 'GET',
      uri: `https://api.monzo.com/transactions?account_id=${accountId}`
    };
    return this.authenticatedApiRequest(options);
  }

  transaction(transactionId) {
    const options = {
      method: 'GET',
      uri: `https://api.monzo.com/transactions/${transactionId}`
    };
    return this.authenticatedApiRequest(options);
  }
}

module.exports = Monzo;
