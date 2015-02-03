var openpgp = require('openpgp'),
    _       = require('lodash');

var parse   = require('./parse'),
    path    = require('./path'),
    walk    = require('./walk'),
    list    = require('./list'),
    search  = require('./search');

function Pass (armoredKey, passphrase, armoredStore) {
    var key = openpgp.key.readArmored(armoredKey).keys[0];
    key.decrypt(passphrase);

    function decrypt () {
        var message          = openpgp.message.readArmored(armoredStore),
            decryptedMessage = openpgp.decryptMessage(key, message);

        return parse(decryptedMessage);
    }

    var store = decrypt();

    this.list = function (subfolderPath, reader) {
        var subfolder = path(store, subfolderPath),
            writer    = walk.bind(null, subfolder);

        list(writer, reader);

        return this;
    };

    this.grep = function (searchString, reader) {
        var writer = walk.bind(null, store),
            re     = new RegExp(searchString);

        search(writer, 'V', re, reader);

        return this;
    };

    this.find = function (passNames, reader) {
        var searchString = passNames.reduce(function reduceIteratee (acc, passName, index, passNames) {
            return acc + (acc ? '|' : '') + '(?:' + passName + ')';
        }, '');

        var writer = walk.bind(null, store),
            re     = new RegExp(searchString);

        search(writer, 'L', re, reader);

        return this;
    };

    this.show = function (passName) {
        var values = path(store, passName);

        if (!_.isArray(values)) {
            throw new Error('ERR_NOT_A_PASS_NAME');
        }

        return values.join('\n');
    };
}

module.exports = function newPass (armoredKey, passphrase, armoredStore) {
    return new Pass(armoredKey, passphrase, armoredStore);
};
