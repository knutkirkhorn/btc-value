'use strict;'
const https = require('https');

const apiURL = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';

function sendHttpRequest(url) {
    return new Promise( (resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load url: ' + res.statusCode));
            }

            response.setEncoding('UTF-8');
            let data = '';

            response.on('data', function(body) {
                data += body;
            });

            response.on('end', function() {
                resolve(JSON.parse(data)[0]);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

function getCurrentValue(double) {
    return new Promise( (resolve, reject) => {
        sendHttpRequest(apiURL)
        .then((response) => {
            let usdValue = response.price_usd;
            if (double === true) {
                usdValue = parseInt(usdValue);
            }
            
            if (!usdValue) {
                reject(new Error('Failed to retrieve Bitcoin value'));
            }
            resolve(usdValue);
        });
    });
}

module.exports = (double) => {
    return getCurrentValue(double);
}