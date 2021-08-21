import React from 'react'

const Node = ({nodeData}) => {
    return (
        <div className={`node ${nodeData.type}`}>
        </div>
    )
}

export default Node
