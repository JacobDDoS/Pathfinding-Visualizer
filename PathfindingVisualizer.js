import React, {useEffect, useState} from 'react'
import Node from './Node';

const PathfindingVisualizer = () => {
    const [nodes, setNodes] = useState([]);

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
                                    return <Node nodeData={node}key={nodeIdx}></Node>
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
