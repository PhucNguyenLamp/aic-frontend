import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import './ContextMenu.css'; // Assuming you have some styles for the context menu

export default function ContextMenu({
    id,
    top,
    left,
    right,
    bottom,
    getId,
    ...props
}) {
    const { getNode, setNodes, addNodes, setEdges, screenToFlowPosition } = useReactFlow();
    const duplicateNode = useCallback(() => {
        const node = getNode(id);
        const position = {
            x: node.position.x + 50,
            y: node.position.y + 50,
        };

        addNodes({
            ...node,
            selected: false,
            dragging: false,
            id: getId(),
            position,
        });
    }, [id, getNode, addNodes]);

    const deleteNode = useCallback(() => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
    }, [id, setNodes, setEdges]);

    const createNode = useCallback((e) => {
        addNodes({
            id: getId(),
            type: 'text',
            position: screenToFlowPosition({ x: e.clientX - 50, y: e.clientY - 50 }),
            data: { category: 'keyframe_tag_filtering', text: 'Text', select: 'tree' },
        });
    }, [screenToFlowPosition, getId, addNodes]);

    return (
        <div
            style={{ top, left, right, bottom }}
            className="context-menu"
            {...props}
        >
            {id != "pane" ?
                <>
                    <p style={{ margin: '0.5em' }}>
                        <small>node: {id}</small>
                    </p>
                    <button onClick={duplicateNode}>duplicate</button>
                    <button onClick={deleteNode}>delete</button>
                </>
                : <button onClick={createNode}>createNode</button>}
        </div>
    );
}

