import React, {useEffect, useState} from 'react'
import {RangeStepInput} from 'react-range-step-input';
import Node from './Node';

const PathfindingVisualizer = () => {
    const [nodes, setNodes] = useState([]);
    const [NUMBER_OF_ROWS, setNUMBER_OF_ROWS] = useState(15)
    const [NUMBER_OF_COLUMNS, setNUMBER_OF_COLUMNS] = useState(Math.round(window.innerWidth/28));
    const [ANIMATION_SPEED, setANIMATION_SPEED] = useState(10)
    const [startNode, setStartNode] = useState([10, 5])
    const [endNode, setEndNode] = useState([10, 10])
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
                    setStartNode((startNode)=> {
                        startNode = [curCol, curRow]
                        return [...startNode]
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

    //Function that will set all nodes that are "blank", "solution", or "visited" to "wall"
    const setAllBlankNodesToWall = () => {
        for (let col=0;col<NUMBER_OF_COLUMNS;col++) {
            for (let row=0;row<NUMBER_OF_ROWS;row++) {
                if (nodes[col][row].type === "blank" || nodes[col][row].type === "solution" || nodes[col][row].type === "visited") {
                    nodes[col][row].type = "wall";
                }
            }
        }
        setNodes((nodes) => {
            return [...nodes]
        })
    }

    const handleMouseDown = (row, col) => {
        if (!isRunning) {
            removeNode("visited")
            removeNode("solution")
            setMousePressed(true);
            setStartAndEndNodes();

            //Ensure that the current node is not the start or finish node
            if (!(nodes[col][row].col === startNode[0] && nodes[col][row].row === startNode[1]) && !(nodes[col][row].col === endNode[0] && nodes[col][row].row === endNode[1])) {

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
            } else if (nodes[col][row].col === startNode[0] && nodes[col][row].row === startNode[1]) {
                setWhichNodeToMove("start");
            } else if (nodes[col][row].col === endNode[0] && nodes[col][row].row === endNode[1]) {
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

                        //Set the start node equal to the new position
                        setStartNode([col, row])
                        removeNode("start");
                        setNodes((nodes)=> {
                            nodes[col][row].type = "start";
                            return [...nodes];
                        })
                    }   
                } else if (whichNodeToMove === "end") {
                    if (nodes[col][row].type !== "start") {

                        //Set the end node equal to the new position
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
                //If we are not moving end or start nodes
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

            path[nodesToVisit[0][0]][nodesToVisit[0][1]] = [];

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
                    }, ANIMATION_SPEED * animationNumber)
                    animationNumber++;
                }

                //Set isRunning to false at the end
                setTimeout(()=>{
                    setIsRunning(false)
                }, ANIMATION_SPEED*animationNumber)
            } else {

                //Set isRunning to false if there is no path
                setTimeout(()=>{
                    setIsRunning(false);
                }, ANIMATION_SPEED*animationNumber)
            }
        return true;
    }


    useEffect(()=> {
        //To ensure that it isn't the first iteration meaning that numOfRows or numOfColumns have changed
        if (nodes.length > 0) {
        
        //Until nodes has enough columns, add more.
        while (nodes.length < NUMBER_OF_COLUMNS) {
            let colOfNodes = [];
            for (let col=nodes.length;col<NUMBER_OF_COLUMNS;col++) {
                for (let row=0;row<NUMBER_OF_ROWS;row++) {
                    colOfNodes.push({row: row, col: col, type: "blank"})
                }
            }

            setNodes((nodes) => {
                nodes.push(colOfNodes)
                return [...nodes];
            })
            //Throughout this useEffect, you'll see that I manually update even though I set the state
            //This is because that useState is a little too slow that that led to some major bugs
            //So I also manually update the state alongside updating it asynchronous
            nodes.push(colOfNodes)
        }

        //Until each column has enough rows, add another node to the column
        while (nodes[0].length < NUMBER_OF_ROWS) {
            for (let i=0;i<NUMBER_OF_COLUMNS;i++) {
                nodes[i].push({row: nodes[i].length, col: i, type: "blank"})
            }
            setNodes((nodes) => {
                return [...nodes]
            })
        }

        //Use tempNodes to map out the nodes and while doing that, set them to blank if they are 
        //"solution" or "visited" nodes
        let tempNodes = [];
        for (let col=0;col<NUMBER_OF_COLUMNS;col++) {
            let colOfNodes = [];
            for (let row=0;row<NUMBER_OF_ROWS;row++) {
                if (nodes[col][row].type === "solution" || nodes[col][row].type === "visited") {
                    nodes[col][row].type = "blank";
                }
                colOfNodes.push(nodes[col][row]);
            }
            tempNodes.push(colOfNodes);
        }

        

        //Ensure that the start node's column exists
        if (startNode[0] >= NUMBER_OF_COLUMNS) {
            setStartNode((startNode) => {
                startNode[0] = NUMBER_OF_COLUMNS-1;
                return [...startNode];
            })
            startNode[0] = NUMBER_OF_COLUMNS-1;
        }

        //Ensure that the start node's row exists
        if (startNode[1] >= NUMBER_OF_ROWS) {
            setStartNode((startNode) => {
                startNode[1] = NUMBER_OF_ROWS-1;
                return [...startNode];
            })
            startNode[1] = NUMBER_OF_ROWS-1;
        }

        //Ensure that the end node's column exists
        if (endNode[0] >= NUMBER_OF_COLUMNS) {
            setEndNode((endNode) => {
                endNode[0] = NUMBER_OF_COLUMNS-1;
                return [...endNode];
            })
            endNode[0] = NUMBER_OF_COLUMNS-1;
        }

        //Ensure that the end node's row exists
        if (endNode[1] >= NUMBER_OF_ROWS) {
            setEndNode((endNode) => {
                endNode[1] = NUMBER_OF_ROWS-1;
                return [...endNode];
            })
            endNode[1] = NUMBER_OF_ROWS-1;
        }

        //If end and start node take up the same space, move the start node away
        if (startNode[0] === endNode[0] && startNode[1] === endNode[1]) {
            if (startNode[0] > 0) {
                startNode[0]--;
            }
            else {
                startNode[1]--;
            }
            setStartNode(startNode)
            
        }

        //Define the start & end nodes
        tempNodes[startNode[0]][startNode[1]] = {...tempNodes[startNode[0]][startNode[1]], type: "start"}
        tempNodes[endNode[0]][endNode[1]] = {...tempNodes[endNode[0]][endNode[1]], type: "end"}

        setNodes([...tempNodes]);

    }

    }, [NUMBER_OF_ROWS, NUMBER_OF_COLUMNS])


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
        //Define the start & end nodes
        nodes[startNode[0]][startNode[1]] = {...nodes[startNode[0]][startNode[1]], type: "start"}
        nodes[endNode[0]][endNode[1]] = {...nodes[endNode[0]][endNode[1]], type: "end"}
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
            <div className="pathfinder-section">
                <div className="pathfinder-section-item">
                    <button className="btn pathfinder-button" style={{marginTop: "40px"}}onClick={()=>{
                        if (!isRunning && !whichNodeToMove && !mousePressed) {
                        removeNode("visited")
                        removeNode("solution")
                        setStartAndEndNodes()
                        // let returnedStartNode = findStartNode();
                        setTimeout(()=>{
                            breadthFirstSearchVisualizer(startNode[0], startNode[1]);
                        }, 500)
                    }
                    }}>Breadth First Search</button>
                </div>
                <div className="pathfinder-section-item">
                    <button className="btn pathfinder-button" onClick={()=>{
                        if (!isRunning && !whichNodeToMove&& !mousePressed) {
                        removeNode("wall")
                        }
                    }}>Clear Walls</button>
                    <button className="btn pathfinder-button" onClick={()=>{
                        if (!isRunning && !whichNodeToMove&& !mousePressed) {
                        removeNode("wall")
                        removeNode("visited")
                        removeNode("solution")
                        setStartAndEndNodes()
                        }
                    }}>Clear All</button>
                    <button className="btn pathfinder-button" onClick={()=>{
                        if (!isRunning && !whichNodeToMove&& !mousePressed) {
                        removeNode("visited")
                        removeNode("solution")
                        setStartAndEndNodes()
                        }
                    }}>Clear All except Walls</button>
                    <button className="btn pathfinder-button" onClick={()=>{
                        if (!isRunning && !whichNodeToMove&& !mousePressed) {
                        setAllBlankNodesToWall()
                        setStartAndEndNodes();
                        }
                    }}>Fill All</button>
                </div>
                <div className="pathfinder-section-item">
                    <div style={{width: "150px", height: "125px", display: "inline-block",  float: "left"}}>
                        <p className="slider-input-text">Number of Columns</p>
                        <p className="slider-input-text" style={{marginBottom:"5px"}}>Current: {NUMBER_OF_COLUMNS} Columns</p>
                        <RangeStepInput
                            min={5} max={Math.round(window.innerWidth/28)}
                            value={NUMBER_OF_COLUMNS} step={1}
                            onChange={(e) => {
                                if (!isRunning && !whichNodeToMove&& !mousePressed) {
                                setNUMBER_OF_COLUMNS(e.target.value)
                                }
                            }}
                        />

                        <p className="slider-input-text">Number of Rows</p>
                        <p className="slider-input-text" style={{marginBottom:"5px"}}>Current: {NUMBER_OF_ROWS} Rows</p>
                        <RangeStepInput
                            min={5} max={25}
                            value={NUMBER_OF_ROWS} step={1}
                            onChange={(e) => {
                                if (!isRunning && !whichNodeToMove&& !mousePressed) {
                                setNUMBER_OF_ROWS(e.target.value)
                                }
                            }}
                        />
                    </div>
                    <div style={{display: "inline-block"}}>
                        <p className="slider-input-text">Animation Speed</p>
                        <p className="slider-input-text" style={{marginBottom:"5px"}}>Current: {ANIMATION_SPEED} ms</p>
                        <RangeStepInput
                            min={10} max={500}
                            value={ANIMATION_SPEED} step={1}
                            onChange={(e) => {
                                if (!isRunning && !whichNodeToMove&& !mousePressed) {
                                setANIMATION_SPEED(e.target.value)
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
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
