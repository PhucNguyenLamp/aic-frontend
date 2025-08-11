// QueryBuilder.jsx
import React, { useRef, useState, useCallback, useContext, memo, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MarkerType, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import ContextMenu from './ContextMenu';
import { useDebounce } from 'use-debounce';
import TextNode from './TextNode';
import { useStore } from '@/stores/questions';
import ButtonEdge from './ButtonEdge';
const nodeTypes = {
    text: TextNode,
}
const edgeTypes = {
    buttonedge: ButtonEdge,
};

const nodeOrigin = [0.5, 0];


const QueryBuilder = memo(function QueryBuilder() {
    const ref = useRef(null);

    const currentQuestionId = useStore((s) => s.currentQuestionId);
    const [nodes, setNodes, onNodesChange] = useNodesState(useStore.getState().getCurrentQuestion().nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(useStore.getState().getCurrentQuestion().edges);
    console.log("change nodes and edges", nodes, edges);
    const getId = useStore((s) => s.getId);
    const updateQuestionField = useStore((s) => s.updateQuestionField);

    const [debouncedNodes] = useDebounce(nodes, 1000);
    const [debouncedEdges] = useDebounce(edges, 1000);

    useEffect(() => {
        updateQuestionField('nodes', debouncedNodes);
        updateQuestionField('edges', debouncedEdges);
    }, [debouncedNodes, debouncedEdges, updateQuestionField]);

    useEffect(() => {
        setNodes(useStore.getState().getCurrentQuestion().nodes);
        setEdges(useStore.getState().getCurrentQuestion().edges);
    }, [currentQuestionId]);

    const [menu, setMenu] = useState(null);

    const { screenToFlowPosition } = useReactFlow();

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, type: 'buttonedge' }, eds)),
        [],
    );

    const onConnectEnd = useCallback(
        (event, connectionState) => {
            // when a connection is dropped on the pane it's not valid
            if (!connectionState.isValid) {
                // we need to remove the wrapper bounds, in order to get the correct position
                const id = getId();
                const { clientX, clientY } =
                    'changedTouches' in event ? event.changedTouches[0] : event;
                const newNode = {
                    id,
                    position: screenToFlowPosition({
                        x: clientX,
                        y: clientY,
                    }),
                    type: 'text',
                    data: { category: 'keyframe_tag_filtering', text: 'Text', select: 'tree' },
                    origin: [0.5, 0.0],
                };

                setNodes((nds) => nds.concat(newNode));
                setEdges((eds) =>
                    eds.concat({
                        id, source: connectionState.fromNode.id, target: id, type: 'buttonedge'
                    }),
                );
            }
        },
        [screenToFlowPosition],
    );

    const onNodeContextMenu = useCallback(
        (event, node) => {
            // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = ref.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom:
                    event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setMenu],
    );

    const onPaneContextMenu = useCallback(
        (event) => {
            // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = ref.current.getBoundingClientRect();
            setMenu({
                id: "pane",
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom:
                    event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setMenu],
    );

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    return (
        <div className='flex-1 w-full flex flex-col wrapper' >
            <ReactFlow
                ref={ref}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectEnd={onConnectEnd}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onPaneClick={onPaneClick}
                onPaneContextMenu={onPaneContextMenu}
                onNodeContextMenu={onNodeContextMenu}
                fitView
            >
                <Background variant='lines' />
                {menu && <ContextMenu getId={getId} onClick={onPaneClick} {...menu} />}
            </ReactFlow>
        </div>
    );
});

export default QueryBuilder;
