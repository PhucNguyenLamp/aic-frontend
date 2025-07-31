// Queries.jsx
import { Button } from '@mui/material'
import QueryBuilder from './QueryBuilder.jsx'
import { useRef } from 'react';

export default function Queries({ sendData }) {
    const workspaceRef = useRef(null);

    const handleSubmit = () => {
        const formattedData = formatFn(workspaceRef.current)
        // console.log("Formatted Data:", JSON.stringify(formattedData, null, 2));
        console.log(workspaceRef.current);
        sendData?.(formattedData);0.
        
    }

    return (
        <div className='flex-1 flex flex-col w-full h-full justify-between'>
            <QueryBuilder workspaceRef={workspaceRef}/>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </div>
    )
}

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
