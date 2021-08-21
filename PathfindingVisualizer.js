import React, {useEffect, useState} from 'react'
import Node from './Node';

const PathfindingVisualizer = () => {
    const [nodes, setNodes] = useState([]);
    const [mousePressed, setMousePressed] = useState(false);

    const handleMouseDown = (row, col) => {
        setMousePressed(true);

        //Ensure that the current node is not the start or finish node
        if (nodes[col][row].type !== "start" && nodes[col][row].type !== "finish") {

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

    const handleMouseOver = (row, col) => {
        if (mousePressed) {

            //Ensure that the current node is not the start or finish node
            if (nodes[col][row].type !== "start" && nodes[col][row].type !== "finish") {

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

    const handleMouseUp = (row, col) => {
        setMousePressed(false);
    }

    useEffect(()=> {
        //Creates blank graph
        for (let col=0;col<52;col++) {
            let colOfNodes = [];
            for (let row=0;row<15;row++) {
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
        </div>
    )
}

export default PathfindingVisualizer
