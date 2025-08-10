// Queries.jsx
import { Button } from '@mui/material'
import QueryBuilder from './QueryBuilder.jsx'
import { memo } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useStore } from '@/stores/questions.jsx';

const Queries = memo(function Queries({ sendData }) {

    const { getCurrentQuestion } = useStore();
    const { nodes, edges } = getCurrentQuestion();
    const handleSubmit = () => {
        sendData({
            nodes: nodes,
            edges: edges,
        });
    };

    return (
        <div className='flex-1 flex flex-col w-full h-full justify-between'>
            <ReactFlowProvider>
                <QueryBuilder />
            </ReactFlowProvider>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </div>
    );
});

export default Queries;

const formatFn = (workspaceJson) => {
    const walk = (block) => {
        if (!block) return null;

        switch (block.type) {
            case "query_block":
                return {
                    q: {
                        text: block.fields?.TEXT,
                        type: block.fields?.TYPE
                    }
                };

            case "sequential_block":
                return {
                    seq: walkStack(block.inputs?.STACK?.block)
                };

            case "parallel_block":
                return {
                    par: walkStack(block.inputs?.STACK?.block)
                };

            default:
                return null;
        }
    };

    const walkStack = (block) => {
        const list = [];
        let current = block;
        while (current) {
            const walked = walk(current);
            if (walked) list.push(walked);
            current = current?.next?.block;
        }
        return list;
    };

    const root = workspaceJson.blocks?.blocks?.[0];
    return walk(root);
};
