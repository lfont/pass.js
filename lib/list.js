module.exports = function list (writer, reader) {
    writer(function listIteratee (node) {
        if (node.type !== 'V') {
            reader(node);
        }
    });
};
