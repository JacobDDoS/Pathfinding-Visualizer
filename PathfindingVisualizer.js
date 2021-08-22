import React, {useEffect, useState} from 'react'
import Node from './Node';

const PathfindingVisualizer = () => {
    const [nodes, setNodes] = useState([]);
    const [NUMBER_OF_ROWS, setNUMBER_OF_ROWS] = useState(15)
    const [NUMBER_OF_COLUMNS, setNUMBER_OF_COLUMNS] = useState(Math.round(window.innerWidth/28));
    const [ANIMATION_SPEED, setANIMATION_SPEED] = useState(10)
    const [mousePressed, setMousePressed] = useState(false);
    const [whichNodeToMove, setWhichNodeToMove] = useState("")

    //Helper function to remove a type of node
    const removeNode = (nameOfNode) => {
        for (let col=0;col<NUMBER_OF_COLUMNS;col++) {
            for (let row=0;row<NUMBER_OF_ROWS;row++) {
                if (nodes[col][row].type === nameOfNode) {
                    setNodes((nodes)=> {
                        nodes[col][row].type = "blank";
                        return [...nodes];
                    })
                }
            }
        }
    }

    const findStartNode = () => {
        for (let curCol=0;curCol<NUMBER_OF_COLUMNS;curCol++) {
            for (let curRow=0;curRow<NUMBER_OF_ROWS;curRow++) {
                if (nodes[curCol][curRow].type === "start") {
                    return [curCol, curRow];
                }
            }
        }
    }

    const handleMouseDown = (row, col) => {
        setMousePressed(true);

        //Ensure that the current node is not the start or finish node
        if (nodes[col][row].type !== "start" && nodes[col][row].type !== "end") {

            //Check to see if the current node is blank or a wall
            if (nodes[col][row].type === "blank") {
                setNodes((nodes) => {
                    nodes[col][row] = {...nodes[col][row], type: "wall"}
                    return [...nodes]
                })
            } else {
                setNodes((nodes)=>{
                    nodes[col][row] = {...nodes[col][row], type: "blank"}
                    return [...nodes]
                })
            }
        } else if (nodes[col][row].type === "start") {
            setWhichNodeToMove("start");
        } else if (nodes[col][row].type === "end") {
            setWhichNodeToMove("end");
        }
    }

    const handleMouseOver = (row, col) => {
        if (mousePressed) {

            //Check to see if we are moving either start or end node
            //Before we draw wall, if unrecognized, throw exception
            //Only move if the node is not end/start 
            if (whichNodeToMove) {
                if (whichNodeToMove === "start") {
                    if (nodes[col][row].type !== "end") {
                        removeNode("start");
                        setNodes((nodes)=> {
                            nodes[col][row].type = "start";
                            return [...nodes];
                        })
                    }   
                } else if (whichNodeToMove === "end") {
                    if (nodes[col][row].type !== "start") {
                        removeNode("end");
                        setNodes((nodes)=> {
                            nodes[col][row].type = "end";
                            return [...nodes];
                        })
                    }
                } else {
                    throw new Error("Unrecognized node");
                }
            } else {
                //Ensure that the current node is not the start or finish node
                if (nodes[col][row].type !== "start" && nodes[col][row].type !== "end") {

                    //Check to see if the current node is blank or a wall
                    if (nodes[col][row].type === "blank") {
                        setNodes((nodes) => {
                            nodes[col][row] = {...nodes[col][row], type: "wall"}
                            return [...nodes]
                        })
                    } else {
                        setNodes((nodes)=>{
                            nodes[col][row] = {...nodes[col][row], type: "blank"}
                            return [...nodes]
                        })
                    }
                }
            }
        }
    }

    //When mouse up, set mousePressed = false to stop building walls
    //Also make sure that we are no longer moving the start or end node
    const handleMouseUp = (row, col) => {
        setMousePressed(false);
        setWhichNodeToMove("")
    }

    //Code responsible for the visualization of BFS
    const breadthFirstSearchVisualizer = (startCol, startRow, curPath=[]) => {
        let animationNumber = 1;
        let nodesToVisit = [];
        let visited = [];
        let startNode = [startCol, startRow];
        nodesToVisit.push(startNode);
        let endNode;

        //Find the end node & also create the visited 2D array
        for (let column=0;column<NUMBER_OF_COLUMNS;column++) {
            let columnVisited = [];
            for (let row=0;row<NUMBER_OF_ROWS;row++) {
                if (nodes[column][row].type === "end") {
                    endNode = [column, row];
                }
                columnVisited.push(false);
            }
            visited.push(columnVisited);
        }

        //Set the start node as visited
        visited[nodesToVisit[0][0]][nodesToVisit[0][1]] = true;

        //Runs while there are still nodes in the queue
        while (nodesToVisit.length !== 0) {
            if (nodesToVisit[0][0] === endNode[0] && nodesToVisit[0][1] === endNode[1]) {
                nodesToVisit = [];
                break;
            }

            //If the current node is not the start node, set its type to "visited"
            if (nodesToVisit[0] !== startNode) {
                    const column = JSON.parse(JSON.stringify(nodesToVisit[0][0]))
                    const row = JSON.parse(JSON.stringify(nodesToVisit[0][1]))
                    setTimeout(() => {
                        setNodes((nodes) => {
                            nodes[column][row] = {...nodes[column][row], type: "visited"}
                            return [...nodes]
                        })
                    }, 10*animationNumber)
                animationNumber++;
            }

            //Check the node above
            if (nodesToVisit[0][1]-1 >= 0 && nodes[nodesToVisit[0][0]][nodesToVisit[0][1]-1].type !== "wall" ) {
                if (nodes[nodesToVisit[0][0]][nodesToVisit[0][1]-1].type !== "visited" && !visited[nodesToVisit[0][0]][nodesToVisit[0][1]-1]) {
                    visited[nodesToVisit[0][0]][nodesToVisit[0][1]-1] = true;
                    nodesToVisit.push([nodesToVisit[0][0], nodesToVisit[0][1]-1]);
                }
            }

            //Check the node below
            if (nodesToVisit[0][1]+1 < NUMBER_OF_ROWS && nodes[nodesToVisit[0][0]][nodesToVisit[0][1]+1].type !== "wall") {
                if (nodes[nodesToVisit[0][0]][nodesToVisit[0][1]+1].type !== "visited" && !visited[nodesToVisit[0][0]][nodesToVisit[0][1]+1]) {
                    visited[nodesToVisit[0][0]][nodesToVisit[0][1]+1] = true;
                    nodesToVisit.push([nodesToVisit[0][0], nodesToVisit[0][1]+1]);
                }
            }

            //Check the node to the left
            if (nodesToVisit[0][0]-1 >= 0 && nodes[nodesToVisit[0][0]-1][nodesToVisit[0][1]].type !== "wall") {
                if (nodes[nodesToVisit[0][0]-1][nodesToVisit[0][1]].type !== "visited" && !visited[nodesToVisit[0][0]-1][nodesToVisit[0][1]]) {
                    visited[nodesToVisit[0][0]-1][nodesToVisit[0][1]] = true;
                    nodesToVisit.push([nodesToVisit[0][0]-1, nodesToVisit[0][1]]);
                }
            }

            //Check the node to the right
            if (nodesToVisit[0][0]+1 < NUMBER_OF_COLUMNS && nodes[nodesToVisit[0][0]+1][nodesToVisit[0][1]].type !== "wall") {
                if (nodes[nodesToVisit[0][0]+1][nodesToVisit[0][1]].type !== "visited" && !visited[nodesToVisit[0][0]+1][nodesToVisit[0][1]]) {
                    visited[nodesToVisit[0][0]+1][nodesToVisit[0][1]] = true;
                    nodesToVisit.push([nodesToVisit[0][0]+1, nodesToVisit[0][1]]);
                }
            }

            //Remove the first element
            nodesToVisit.shift();
        }
        return true;
    }

    useEffect(()=> {
        //Creates blank graph
        for (let col=0;col<NUMBER_OF_COLUMNS;col++) {
            let colOfNodes = [];
            for (let row=0;row<NUMBER_OF_ROWS;row++) {
                colOfNodes.push({row: row, col: col, type: "blank"});
            }
            nodes.push(colOfNodes);
            setNodes(nodes);
        }
        console.log(nodes);
        //Define the start & end nodes
        nodes[10][5] = {...nodes[10][5], type: "start"}
        nodes[40][5] = {...nodes[40][5], type: "end"}
        setNodes([...nodes]);
    }, [])

    return (
        <div id="pathfinder-body">
            <div id="pathfinder-graph">
                {
                    nodes.map((nodeRow, nodeRowIdx)=> {
                        return <div style={{display: 'inline-block'}} key={nodeRowIdx}>
                            {
                                nodeRow.map((node, nodeIdx)=>{
                                    return <Node nodeData={node} handleMouseDown={handleMouseDown} handleMouseUp={handleMouseUp} handleMouseOver={handleMouseOver} key={`node-${node.row}-${node.col}`}></Node>
                                })
                            }
                        </div>
                    })
                }
            </div>

            <div className="pathfinder-section">
                <div className="pathfinder-section-item">
                    <button className="btn" onClick={()=>{
                        let startNode = findStartNode();
                        breadthFirstSearchVisualizer(startNode[0], startNode[1]);
                    }}>BFS</button>
                </div>
                <div className="pathfinder-section-item">
                    <button className="btn" onClick={()=>removeNode("wall")}>Clear Graph</button>
                </div>
            </div>
        </div>
    )
}

export default PathfindingVisualizer
