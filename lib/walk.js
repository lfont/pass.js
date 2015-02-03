var _ = require('lodash');

module.exports = function walk (folder, reader, depth) {
    depth = depth || 0;

    if (_.isArray(folder)) {
        throw new Error('ERR_WRONG_NODE_TYPE');
    }

    _(folder)
    .keys()
    .sort()
    .each(function walkIteratee (key, index, keys) {
        var subfolder  = folder[key],
            isLeaf     = _.isArray(subfolder),
            hasSibling = index < keys.length - 1;

        if (isLeaf) {
            reader({
                value: key,
                depth: depth,
                type: 'L',
                hasSibling: hasSibling
            });

            for (var i = 0, len = subfolder.length; i < len; i++) {
                reader({
                    value: subfolder[i],
                    depth: depth + 1,
                    type: 'V',
                    hasSibling: i < len - 1
                });
            }
        } else {
            reader({
                value: key,
                depth: depth,
                type: 'N',
                hasSibling: hasSibling
            });

            walk(subfolder, reader, depth + 1);
        }
    });
};
