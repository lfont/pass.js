var lines     = [],
    maxLength = 0;

function tuple (atoms) {
    return [
        atoms.slice(0, -1).join('/'),
        atoms[ atoms.length - 1 ]
    ];
}

function push (atoms) {
    var lineTuple = tuple(atoms),
        length    = lineTuple[0].length;

    maxLength = (length > maxLength) ? length : maxLength;
    lines.push(lineTuple);
}

function pad (num) {
    return new Array(num + 1).join(' ');
}

function format (lineTuple, maxLength) {
    var padding = maxLength - lineTuple[0].length;

    return lineTuple[0] + ':    ' + pad(padding) + lineTuple[1];
}

function join (lines, maxLength) {
    return lines.reduce(function (sum, lineTuple, i) {
        return sum + ((sum ? '\n' : '') + format(lineTuple, maxLength));
    }, '');
}

module.exports = function flat (writer) {
    var atoms     = [],
        lastDepth = null;

    writer(function flatIteratee (node) {
        if (!lastDepth || node.depth > lastDepth) {
            atoms.push(node.value);
        } else {
            push(atoms);

            var delta = lastDepth - node.depth;
            atoms.splice(atoms.length - (delta + 1), delta + 1);
            atoms.push(node.value);
        }

        lastDepth = node.depth;
    });

    if (atoms.length) {
        push(atoms);
    }

    return join(lines, maxLength);
};
