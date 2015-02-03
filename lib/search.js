function shouldBeIgnored (node, searchedType) {
    if (searchedType === 'N' && node.type !== 'N') {
        return true;
    }

    if (searchedType === 'L' && node.type === 'V') {
        return true;
    }

    return false;
}

function getLastNode (nodes) {
    if (!nodes.length) {
        return null;
    }

    return nodes[ nodes.length - 1 ];
}

function excludeOrphans (nodes, node, searchedType) {
    var lastNode = getLastNode(nodes);

    if (!lastNode) {
        return;
    }

    var delta = node.depth - lastNode.depth;

    if (lastNode.type !== searchedType) {
        if (delta < 0) {
            var howMany = Math.abs(delta);
            nodes.splice(nodes.length - howMany, howMany);
        } else if (delta === 0) {
            nodes.pop();
        }
    }
}

module.exports = function search (writer, type, re, reader) {
    var nodes = [];

    writer(function findIteratee (node) {
        if (shouldBeIgnored(node, type)) {
            return;
        }

        excludeOrphans(nodes, node, type);
        var lastNode = getLastNode(nodes);

        if (node.type === type) {
            // FIXME: if the depth is 0 we should call iteratee
            if (re.test(node.value)) {
                nodes.push(node);
            } else if (!node.hasSibling && lastNode && lastNode.type !== type) {
                nodes.pop();
            }
        } else {
            if (lastNode && node.depth === 0) {
                if (lastNode.type === type) {
                    nodes.forEach(reader);
                }
                nodes.length = 0;
            }

            // FIXME: we should not push the last node
            // because an empty node can shadow a previous match
            nodes.push(node);
        }
    });

    var lastNode = getLastNode(nodes);
    if (lastNode && lastNode.type === type) {
        nodes.forEach(reader);
    }
};
