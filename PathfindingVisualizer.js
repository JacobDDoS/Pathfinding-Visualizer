import React, {useEffect, useState} from 'react'
import Node from './Node';

const PathfindingVisualizer = () => {
    const [nodes, setNodes] = useState([]);
    const [NUMBER_OF_ROWS, setNUMBER_OF_ROWS] = useState(15)
    const [NUMBER_OF_COLUMNS, setNUMBER_OF_COLUMNS] = useState(Math.round(window.innerWidth/28));
    const [ANIMATION_SPEED, setANIMATION_SPEED] = useState(10)
    const [startNode, setStartNode] = useState([10, 5])
    const [endNode, setEndNode] = useState([40, 5])
    const [isRunning, setIsRunning] = useState(false);
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

    //Helper function to find & set the position of the start node
    const findStartNode = () => {
        for (let curCol=0;curCol<NUMBER_OF_COLUMNS;curCol++) {
            for (let curRow=0;curRow<NUMBER_OF_ROWS;curRow++) {
                if (nodes[curCol][curRow].type === "start") {
                    setStartNode((node)=> {
                        node = [curCol, curRow]
                        return [...node]
                    })
                    return [curCol, curRow];
                }
            }
        }
    }

    //Helper function to find & set the position of the end node
    const findEndNode = () => {
        for (let curCol=0;curCol<NUMBER_OF_COLUMNS;curCol++) {
            for (let curRow=0;curRow<NUMBER_OF_ROWS;curRow++) {
                if (nodes[curCol][curRow].type === "end") {
                    setEndNode([curCol, curRow]);
                    return [curCol, curRow];
                }
            }
        }
    }

    //Function that will set the start & end nodes
    const setStartAndEndNodes = () => {
        setNodes((nodes)=> {
            nodes[startNode[0]][startNode[1]].type = "start";
            nodes[endNode[0]][endNode[1]].type = "end";
            return [...nodes];
        })
        
    }

    const handleMouseDown = (row, col) => {
        if (!isRunning) {
            removeNode("visited")
            removeNode("solution")
            setStartAndEndNodes();
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

                //Check to see if user is going to drag start or end node
            } else if (nodes[col][row].type === "start") {
                setWhichNodeToMove("start");
            } else if (nodes[col][row].type === "end") {
                setWhichNodeToMove("end");
            }
        }
    }

    const handleMouseOver = (row, col) => {
        if (mousePressed && !isRunning) {

            //Check to see if we are moving either start or end node
            //before we draw wall. If it is unrecognized, throw exception
            //Only move if the node is not end/start 
            if (whichNodeToMove) {
                if (whichNodeToMove === "start") {
                    if (nodes[col][row].type !== "end") {
                        setStartNode([col, row])
                        removeNode("start");
                        setNodes((nodes)=> {
                            nodes[col][row].type = "start";
                            return [...nodes];
                        })
                    }   
                } else if (whichNodeToMove === "end") {
                    if (nodes[col][row].type !== "start") {
                        setEndNode([col, row])
                        removeNode("end");
                        setNodes((nodes)=> {
                            nodes[col][row].type = "end";
                            return [...nodes];
                        })
                    }
                } else {
                    throw new Error("Unrecognized node");
                }
            } else if (!isRunning) {
                setStartAndEndNodes()
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
        findStartNode()
        findEndNode()
    }

    //Code responsible for the visualization of BFS
    const breadthFirstSearchVisualizer = (startCol, startRow) => {
        setIsRunning(true);
        let animationNumber = 1;
        let nodesToVisit = [];
        let visited = [];
        let path=[]
        let startNode = [startCol, startRow];
        nodesToVisit.push(startNode);
        let endNode;

        //Find the end node & also create the visited&path 2D array
        for (let column=0;column<NUMBER_OF_COLUMNS;column++) {
            let columnVisited = [];
            let columnPath = [];
            for (let row=0;row<NUMBER_OF_ROWS;row++) {
                if (nodes[column][row].type === "end") {
                    endNode = [column, row];
                }
                columnVisited.push(false);
                columnPath.push([])
            }
            visited.push(columnVisited);
            path.push(columnPath);
        }

        //Set the start node as visited
        visited[nodesToVisit[0][0]][nodesToVisit[0][1]] = true;

        //Set the path of the start node equal
        path[nodesToVisit[0][0]][nodesToVisit[0][1]] = [[nodesToVisit[0][0], nodesToVisit[0][1]]]

        //Runs while there are still nodes in the queue
        while (nodesToVisit.length !== 0) {

            //If we find the end node
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
                    }, ANIMATION_SPEED*animationNumber)
                animationNumber++;
            }

            //Check the node above
            if (nodesToVisit[0][1]-1 >= 0 && nodes[nodesToVisit[0][0]][nodesToVisit[0][1]-1].type !== "wall" ) {
                if (nodes[nodesToVisit[0][0]][nodesToVisit[0][1]-1].type !== "visited" && !visited[nodesToVisit[0][0]][nodesToVisit[0][1]-1]) {
                    visited[nodesToVisit[0][0]][nodesToVisit[0][1]-1] = true;
                    nodesToVisit.push([nodesToVisit[0][0], nodesToVisit[0][1]-1]);

                    if (path[nodesToVisit[0][0]][nodesToVisit[0][1]-1].length < 1) {
                        path[nodesToVisit[0][0]][nodesToVisit[0][1]-1] = [...path[nodesToVisit[0][0]][nodesToVisit[0][1]], [nodesToVisit[0][0], nodesToVisit[0][1]-1]]
                    }
                }
            }

            //Check the node below
            if (nodesToVisit[0][1]+1 < NUMBER_OF_ROWS && nodes[nodesToVisit[0][0]][nodesToVisit[0][1]+1].type !== "wall") {
                if (nodes[nodesToVisit[0][0]][nodesToVisit[0][1]+1].type !== "visited" && !visited[nodesToVisit[0][0]][nodesToVisit[0][1]+1]) {
                    visited[nodesToVisit[0][0]][nodesToVisit[0][1]+1] = true;
                    nodesToVisit.push([nodesToVisit[0][0], nodesToVisit[0][1]+1]);

                    if (path[nodesToVisit[0][0]][nodesToVisit[0][1]+1].length < 1) {
                        path[nodesToVisit[0][0]][nodesToVisit[0][1]+1] = [...path[nodesToVisit[0][0]][nodesToVisit[0][1]], [nodesToVisit[0][0], nodesToVisit[0][1]+1]]
                    }
                }
            }

            //Check the node to the left
            if (nodesToVisit[0][0]-1 >= 0 && nodes[nodesToVisit[0][0]-1][nodesToVisit[0][1]].type !== "wall") {
                if (nodes[nodesToVisit[0][0]-1][nodesToVisit[0][1]].type !== "visited" && !visited[nodesToVisit[0][0]-1][nodesToVisit[0][1]]) {
                    visited[nodesToVisit[0][0]-1][nodesToVisit[0][1]] = true;
                    nodesToVisit.push([nodesToVisit[0][0]-1, nodesToVisit[0][1]]);

                    if (path[nodesToVisit[0][0]-1][nodesToVisit[0][1]].length < 1) {
                        path[nodesToVisit[0][0]-1][nodesToVisit[0][1]] = [...path[nodesToVisit[0][0]][nodesToVisit[0][1]], [nodesToVisit[0][0]-1, nodesToVisit[0][1]]]
                    }
                }
            }

            //Check the node to the right
            if (nodesToVisit[0][0]+1 < NUMBER_OF_COLUMNS && nodes[nodesToVisit[0][0]+1][nodesToVisit[0][1]].type !== "wall") {
                if (nodes[nodesToVisit[0][0]+1][nodesToVisit[0][1]].type !== "visited" && !visited[nodesToVisit[0][0]+1][nodesToVisit[0][1]]) {
                    visited[nodesToVisit[0][0]+1][nodesToVisit[0][1]] = true;
                    nodesToVisit.push([nodesToVisit[0][0]+1, nodesToVisit[0][1]]);
                    if (path[nodesToVisit[0][0]+1][nodesToVisit[0][1]].length < 1) {
                        path[nodesToVisit[0][0]+1][nodesToVisit[0][1]] = [...path[nodesToVisit[0][0]][nodesToVisit[0][1]], [nodesToVisit[0][0]+1, nodesToVisit[0][1]]]
                    }
                }
            }

            //Remove the first element
            nodesToVisit.shift();
        }

            //Check to see if we have an answer
            if (path[endNode[0]][endNode[1]].length) {
                //Set each element in the path to type: "solution". 
                for (let i=0;i<path[endNode[0]][endNode[1]].length;i++) {
                    let column = path[endNode[0]][endNode[1]][i][0]
                    let row = path[endNode[0]][endNode[1]][i][1]
                    setTimeout(()=> {
                        setNodes((nodes) => {
                            nodes[column][row] = {...nodes[column][row], type: "solution"}
                            return [...nodes]
                        })
                    }, ANIMATION_SPEED * animationNumber + ANIMATION_SPEED)
                    animationNumber++;
                }

                //Set isRunning to false at the end
                setTimeout(()=>{
                    setIsRunning(false)
                }, ANIMATION_SPEED*animationNumber+ANIMATION_SPEED)
            } else {

                //Set isRunning to false if there is no path
                setTimeout(()=>{
                    setIsRunning(false);
                }, ANIMATION_SPEED*animationNumber+ANIMATION_SPEED)
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

        //Hacky Cleanup
        return () => {
            var highestTimeoutId = setTimeout(";");
            for (var i = 0 ; i < highestTimeoutId ; i++) {
                clearTimeout(i); 
            }
        }
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
                        if (!isRunning) {
                        removeNode("visited")
                        removeNode("solution")
                        let startNode = findStartNode();
                        setStartAndEndNodes()
                        breadthFirstSearchVisualizer(startNode[0], startNode[1]);
                    }
                    }}>BFS</button>
                </div>
                <div className="pathfinder-section-item">
                    <button className="btn" onClick={()=>{
                        if (!isRunning) {
                        removeNode("wall")
                        }
                    }}>Clear Walls</button>
                    <button className="btn" onClick={()=>{
                        if (!isRunning) {
                        removeNode("wall")
                        removeNode("visited")
                        removeNode("solution")
                        setStartAndEndNodes()
                        }
                    }}>Clear All</button>
                    <button className="btn" onClick={()=>{
                        if (!isRunning) {
                        removeNode("visited")
                        removeNode("solution")
                        setStartAndEndNodes()
                        }
                    }}>Clear All except Walls</button>
                </div>
            </div>
        </div>
    )
}

export default PathfindingVisualizer
