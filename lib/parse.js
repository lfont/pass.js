function getNode (line) {
    var result = /^(\*+) +(.+)/.exec(line);

    if (result === null) {
        return null;
    }

    return {
        depth: result[1].length,
        name: result[2]
    };
}

function getEntry (line) {
    if (line === '' || line.indexOf('-*-') === 0) {
        return null;
    }

    return line;
}

function times (num, iteratee, context) {
    num = Math.abs(num);
    while (num) {
        iteratee.call(context);
        num--;
    }
}

function walk (lines, parents, dir) {
    var line = lines.shift();

    var d = getNode(line);
    if (d) {
        var delta = d.depth - dir.depth;
        if (delta < 0) {
            times(delta, parents.pop, parents);
            parents[ parents.length - 1 ][d.name] = {};
            parents.push(parents[ parents.length - 1][d.name]);
        } else if (delta <= 1) {
            parents[ parents.length - 1 ][d.name] = {};
            parents.push(parents[ parents.length - 1][d.name]);
        } else {
            throw new Error('Malformed store!');
        }
        dir = d;
    } else {
        var entry = getEntry(line);
        if (entry) {
            var f = parents[ parents.length - 1 ][dir.name];

            if (!f) {
                parents.pop();
                f = parents[ parents.length - 1 ][dir.name] = [];
            }

            f.push(entry);
        }
    }

    if (lines.length) {
        walk(lines, parents, dir);
    }
}

module.exports = function parse (storeString) {
    var lines   = storeString.split('\n'),
        parents = [ {} ];

    walk(lines, parents, { depth: 0 });

    return parents[0];
};
