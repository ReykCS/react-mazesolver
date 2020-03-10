import React from 'react';
import './App.css';
import { createNodes, Constants, createMaze, getCoordinates, removeBorders, solveMaze, createPath } from './assets';
import { Node } from './Node';

class App extends React.Component {
    constructor(props)  {
        super(props);
        this.state = {
            nodes: createNodes(Constants.dim.x, Constants.dim.y),
            start: {x: 0, y: 0},
            end: { x: Constants.dim.x - 1, y: Constants.dim.y - 1}
        }
        this.buildMaze = this.buildMaze.bind(this);
        this.handleHead = this.handleHead.bind(this);
        console.log(this.state);
    }
    buildMaze()   {
        const {nodes, start} = this.state;

        const {parent, order} = createMaze(start, nodes);
        for ( let n in order )   {
            setTimeout(() => {
                let newNodes = this.state.nodes.slice();
                let coordinates = getCoordinates(order[n]);
                let nodeN = newNodes[coordinates.y][coordinates.x];
                if ( n > 0 ) {
                    let coordP = getCoordinates(order[n - 1]);
                    let nodeP = newNodes[coordP.y][coordP.x];
                    nodeP = this.handleHead(nodeP, false);
                    let { borderN, borderP } = removeBorders(order[n-1], order[n], nodeP, nodeN);
                    nodeN = {...nodeN, borders: borderN };
                    newNodes[coordP.y][coordP.x] = {...nodeP, borders: borderP };;
                }
                let newNode = {
                    ...nodeN,
                    visited: true
                };
                newNode = this.handleHead(newNode, true);
                newNodes[coordinates.y][coordinates.x] = newNode;
                this.setState({
                    nodes: newNodes,
                    active: (n == order.length - 1)
                });
            }, Constants.timeout * n);
        }
    }
    handleHead(head, bool)    {
        let newHead = {
            ...head,
            head: bool
        }
        return newHead;
    }
    handleSetEnd = (x, y) => {
        console.log(x, y);
        let newNodes = this.state.nodes.slice();
        newNodes = newNodes.map((nodes) => (
            nodes.map((node) => ({
                ...node,
                end: false
            }))
        ));
        newNodes[y][x].end = true;
        this.setState({
            nodes: newNodes,
            end: {x, y}
        });
    }
    handleSolveMaze = () => {
        const { start, nodes } = this.state;
        const { order, parent } = solveMaze(start, nodes);
        let newNodes = nodes;
        for ( let i of order )  {
            newNodes[i.y][i.x].maze = true;
            newNodes[i.y][i.x].path = false;
        }
        this.setState({
            nodes: newNodes
        });
        let { end } = this.state
        let path = createPath(parent, start, end).reverse();
        console.log(path);
        this.drawPath(path);
    }
    drawPath = (path) => {
        for ( let i in path )   {
            setTimeout(() => {
                let p = path[i];
                let newNodes = this.state.nodes.slice();
                newNodes[p.y][p.x].path = true;
                this.setState({
                    nodes: newNodes
                })
            }, i * 100);
        }
    }
    render() {
        const {nodes, start, active } = this.state;
        return (
        <div className="App">
            <div className="grid-holder">
                {nodes.map((nodes, y) => {
                    
                    return (
                        <div key={y} className="row">
                            {nodes.map((elem, x) => {
                                return <Node onClick={this.handleSetEnd} key={x} data={elem} />}
                            )}
                        </div>)
                    })
                }
            </div>
            <div>
                <button onClick={this.buildMaze}>Create Maze</button>
                { active ? <button onClick={this.handleSolveMaze}>Solve Maze</button> : null }
            </div>
        </div>
        );
    }
}

export default App;
