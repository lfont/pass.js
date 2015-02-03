function pad (num) {
    return Array(num + 1).join('  ');
}

function columns (siblings) {
    var output = {
        value: '',
        pad: 0
    };

    for (var i = 0, len = siblings.length; i < len; i++) {
        if (siblings[i]) {
            output.value += '|  ';
            output.pad++;
        } else if (siblings.slice(i).indexOf(true) > -1) {
            output.value += '  ';
            output.pad++;
        }
    }

    return output;
}

var NODE = '|__ ';

module.exports = function tree (writer) {
    var lines    = [],
        siblings = [];

    writer(function treeIteratee (node) {
        if (node.depth === 0) {
            lines.push(NODE + node.value);
        } else {
            var delta = siblings.length - node.depth;
            if (delta > 0) {
                siblings.splice(node.depth, delta);
            }

            var columnsOutput = columns(siblings);
            lines.push(columnsOutput.value +
                       pad(node.depth - columnsOutput.pad) +
                       NODE + node.value);
        }

        siblings[node.depth] = node.hasSibling;
    });

    return lines.join('\n');
};
