export function createNodes(x, y)   {
    console.log(x, y);
    let nodes = [];
    for ( let i = 0; i < y; i++)    {
        nodes.push([]);
        for ( let j = 0; j < x; j++)    {
            nodes[i].push(createNode(j, i));
        }
    }
    return nodes;
}

export function solveMaze(start, nodes) {
    console.log(start, nodes);
    let Q = [];
    const { x, y } = start; 
    const { x: maxX, y: maxY } = Constants.dim;
    let visited = new Array(maxX * maxY).fill(false);
    let parent = new Array(maxX * maxY).fill(0);
    let distance = new Array(maxX * maxY).fill(Infinity);
    Q.push(start);
    let startIndex = getIndex(x, y);
    distance[startIndex] = 0;
    visited[startIndex] = true;
    let order = [];
    
    while ( Q.length > 0 )  {
        Q.sort((a, b) => {
            let aI = getIndex(a.x, a.y);
            let bI = getIndex(b.x, b.y);
            return distance[aI] - distance[bI];
        });
        let node = Q.shift();
        order.push(node);
        let i = getIndex(node.x, node.y);
        console.log(node);
        console.log(nodes);
        let neighbors = getNeighborsWithBorder(node.x, node.y, nodes);
        console.log(neighbors);
        for ( let w of neighbors )  {
            let index = getIndex(w.x, w.y);
            if ( visited[index] ) continue;
            visited[index] = true;
            if ( distance[index] > distance[i] + 1 ) {
                parent[index] = i;
                distance[index] = distance[i] + 1;
                Q.push(w);
            }
        }
    }
    console.log(order);
    console.log(parent);

    return { order, parent };
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

export function getIndex(x, y) {
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

function getNeighborsWithBorder(x, y, nodes)   {
    const { y: maxY, x: maxX } = Constants.dim;
    let neighbors = [];
    console.log(nodes[y][x].border);
    if ( x > 0 && nodes[y][x - 1].border[1] === 0 && nodes[y][x].border[3] === 0 ) neighbors.push({y, x: x - 1});
    if ( y > 0 && nodes[y - 1][x].border[2] === 0 && nodes[y][x].border[0] === 0 ) neighbors.push({x, y: y - 1});
    if ( x < (maxX - 1) && nodes[y][x + 1].border[3] === 0 && nodes[y][x].border[1] === 0 ) neighbors.push({y, x: x + 1});
    if ( y < (maxY - 1) && nodes[y + 1][x].border[0] === 0 && nodes[y][x].border[2] === 0 ) neighbors.push({x, y: y + 1});
    return neighbors;
}

function createNode(x, y)    {
    return {
        x, y,
        border: [1, 1, 1, 1],
        visited: false,
        path: false
    };
}

export function createPath(parent, start, end)  {
    let path = [];
    let endIndex = getIndex(end.x, end.y);
    let startIndex = getIndex(start.x, start.y);
    for ( let i = endIndex; i != startIndex ; i = parent[i] ) {
        path.push(getCoordinates(i));
    }
    return path;
}

export const Constants = {
    dim: {
        x: 40,
        y: 40
    },
    timeout: 50
}

export function getBorders(arr)  {
    const borders = ["top", "right", "bottom", "left"];
    let extraClass = "";
    for ( let i in arr) {
        if ( arr[i] ) extraClass += ` ${borders[i]}`
        else extraClass += ` N${borders[i]}`
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
    let borderP = nodeP.border;
    let borderN = nodeN.border;
    if ( Math.sqrt(diff.x**2 + diff.y**2) != 1 ) return {borderP, borderN};
    let {x, y} = diff;
    if ( x === 1 )   {
        borderP[1] = 0;
        borderN[3] = 0;
    } else if ( x === -1 )   {
        borderP[3] = 0;
        borderN[1] = 0;
    } else if ( y === 1 )    {
        borderP[2] = 0;
        borderN[0] = 0;
    } else if ( y === -1 )   {
        borderP[0] = 0;
        borderN[2] = 0;
    }
    return {borderP, borderN};
}