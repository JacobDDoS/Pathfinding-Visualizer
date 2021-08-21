import React from 'react'

const Node = ({nodeData,handleMouseDown, handleMouseUp, handleMouseOver}) => {
    return (
        <div className={`node ${nodeData.type}`}
         id={`node-${nodeData.row}-${nodeData.col}`}
         onMouseDown={()=>handleMouseDown(nodeData.row, nodeData.col)}
         onMouseUp={()=>handleMouseUp(nodeData.row, nodeData.col)}
         onMouseOver={()=>handleMouseOver(nodeData.row, nodeData.col)}
         >
        </div>
    )
}

export default Node
