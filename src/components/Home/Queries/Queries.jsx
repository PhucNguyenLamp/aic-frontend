// Queries.jsx
import { Button } from '@mui/material'
import QueryBuilder from './QueryBuilder.jsx'
import { memo } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useStore } from '@/stores/questions.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { searchKeyframes } from '@/api/services/query.jsx';

const Queries = memo(function Queries() {

    const { updateQuestionField, getCurrentQuestion } = useStore();

    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        const currentQuestion = getCurrentQuestion();
        const nodes = [...currentQuestion.nodes].map(node => {
            return {
                id: node.id,
                data: node.data,
            }
        })
        let edges = [...currentQuestion.edges].map(edge => {
            return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
            }
        })
        const payload = {
            nodes,
            edges
        }
        console.log("Submitting payload:", payload);
        const data = await searchKeyframes(payload); // searchImages
        // then invalidate queries
        queryClient.invalidateQueries(['history']);
        updateQuestionField({
            searchImages: data,
        })

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
