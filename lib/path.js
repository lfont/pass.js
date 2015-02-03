var _ = require('lodash');

module.exports = function path (store, subfolderPath) {
    var paths     = subfolderPath.split('/'),
        subfolder = store;

    _(paths)
    .reject(function (path) {
        return path === '';
    })
    .each(function (path) {
        subfolder = subfolder[path];

        if (!subfolder) {
            throw new Error('ERR_PATH_NOT_FOUND');
        }
    });

    return subfolder;
};
