import React, {useEffect, useState} from 'react'
import Node from './Node';

const PathfindingVisualizer = () => {
    const [nodes, setNodes] = useState([]);
    const [NUMBER_OF_ROWS, setNUMBER_OF_ROWS] = useState(15)
    const [NUMBER_OF_COLUMNS, setNUMBER_OF_COLUMNS] = useState(Math.round(window.innerWidth/28));
    const [mousePressed, setMousePressed] = useState(false);
    const [whichNodeToMove, setWhichNodeToMove] = useState("")

    const clearGraph = () => {
        for (let col=0;col<NUMBER_OF_COLUMNS;col++) {
            for (let row=0;row<NUMBER_OF_ROWS;row++) {
                if (nodes[col][row].type === "wall") {
                    setNodes((nodes)=> {
                        nodes[col][row].type = "blank";
                        return [...nodes];
                    })
                }
            }
        }
    }

    //Helper function to remove a type of node
    const removeNode = (nameOfNode) => {
        for (let col=0;col<NUMBER_OF_COLUMNS;col++) {
            for (let row=0;row<NUMBER_OF_ROWS;row++) {
                if (nodes[col][row].type === nameOfNode) {
                    setNodes((nodes)=> {
                        nodes[col][row].type = "blank";
                        return [...nodes];
                    })
                    return;
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

    const handleMouseUp = (row, col) => {
        setMousePressed(false);
        setWhichNodeToMove("")
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
                    <button className="btn" onClick={()=>clearGraph()}>Clear Graph</button>
                </div>
            </div>
        </div>
    )
}

export default PathfindingVisualizer
