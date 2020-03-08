export function createNodes(x, y)   {
    console.log(x, y);
    let nodes = [];
    for ( let i = 0; i < y; i++)    {
        nodes.push([]);
        for ( let j = 0; j < x; j++)    {
            nodes[i].push(createNode(i, j));
        }
    }
    return nodes;
}

export function createMaze(start , nodes) {
    const {x, y} = start;
    const { x : maxX, y : maxY } = Constants.dim;
    let Q = [];
    let parent = new Array(maxX * maxY).fill(0);
    let visited = new Array(maxX * maxY).fill(false);
    let startIndex = getIndex(x, y);
    visited[getIndex(x, y)] = true;

    const dft = function(v, i)    {
        

        let neighbors = getNeighbors(v.x, v.y);
        for ( let w of neighbors )  {
            Q.push(i);
            let index = getIndex(w.x, w.y);
            if ( visited[index] ) continue;
            visited[index] = true;
            parent[index] = i;
            dft(w, index);
        }
    }

    dft({x, y}, startIndex);
    console.log(visited, parent);

    console.log(getNeighbors(x, y, nodes));

    return {parent, order: Q};
}

function getIndex(x, y) {
    return x + y * Constants.dim.x;
}

export function getCoordinates(index)   {
    const { x, y } = Constants.dim;
    return {
        x: index % x,
        y: Math.floor(index / x)
    }
}
function shuffleArray(arr)  {
    for ( let i = 0; i < arr.length; i++)   {
        let rand = Math.floor((Math.random() * 100) % arr.length);
        [arr[i], arr[rand]] = [arr[rand], arr[i]]
    }
    return arr;
}

export function getNeighbors(x, y) {
    const { y: maxY, x: maxX } = Constants.dim;
    let neighbors = [];
    if ( x > 0) neighbors.push({x: x - 1, y});
    if ( x < (maxX - 1)) neighbors.push({x: x + 1, y});
    if ( y > 0) neighbors.push({x, y: y - 1});
    if ( y < (maxY - 1)) neighbors.push({x, y: y + 1});
    return shuffleArray(neighbors);
}

function createNode(x, y)    {
    return {
        x, y,
        border: [1, 1, 1, 1],
        visited: false
    };
}

export const Constants = {
    dim: {
        x: 20,
        y: 20
    }
}

export function getBorders(arr)  {
    const borders = ["top", "right", "bottom", "left"];
    let extraClass = "";
    for ( let i in arr) {
        if ( arr[i] ) extraClass += ` ${borders[i]}`
    }
    return extraClass;
}

export function removeBorders(prev, now, nodeP, nodeN) {
    // REFACTORING
    let { x: xP, y: yP} = getCoordinates(prev);
    let { x: xN, y: yN} = getCoordinates(now);

    let diff = {x: xN - xP, y: yN - yP};
    // console.log({xP, yP}, {xN, yN});
    // console.log(diff);
    if ( Math.sqrt(diff.x**2 + diff.y**2) != 1 ) return {borderP: null, borderN: null};
    let borderP = nodeP.border;
    let borderN = nodeN.border;
    let {x, y} = diff;
    if ( x == 1 )   {
        borderP[1] = 0;
        borderN[3] = 0;
    } else if ( x == -1 )   {
        borderP[3] = 0;
        borderN[1] = 0;
    } else if ( y == 1 )    {
        borderP[2] = 0;
        borderN[0] = 0;
    } else if ( y == -1 )   {
        borderP[0] = 0;
        borderN[2] = 0;
    }
    return {borderP, borderN};
}