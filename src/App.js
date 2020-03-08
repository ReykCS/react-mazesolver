import React from 'react';
import './App.css';
import { createNodes, Constants, createMaze, getCoordinates, removeBorders } from './assets';
import {Node} from './Node';

class App extends React.Component {
    constructor(props)  {
        super(props);
        this.state = {
        nodes: createNodes(Constants.dim.x, Constants.dim.y),
        start: {x: 0, y: 0}
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
                console.log(coordinates);
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
                    nodes: newNodes
                });
            }, 25 * n);
        }
    }
    handleHead(head, bool)    {
        let newHead = {
            ...head,
            head: bool
        }
        return newHead;
    }
    render() {
        const {nodes, start} = this.state;
        return (
        <div className="App">
            <div className="grid-holder">
                {nodes.map((nodes, y) => {
                    
                    return (
                        <div key={y} className="row">
                            {nodes.map((elem, x) => {
                                return <Node key={x} data={elem} />}
                            )}
                        </div>)
                    })
                }
            </div>
            <button onClick={this.buildMaze}>Create Maze</button>
        </div>
        );
    }
}

export default App;
