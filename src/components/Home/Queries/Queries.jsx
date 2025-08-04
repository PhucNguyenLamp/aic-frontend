// Queries.jsx
import { Button } from '@mui/material'
import QueryBuilder from './QueryBuilder.jsx'
import { useContext, useRef } from 'react';
import * as Blockly from 'blockly';
import { AppContext } from '@/context/AppContext.jsx';

export default function Queries({ sendData }) {
    const { workspaceRef } = useContext(AppContext);
    

    const handleSubmit = () => {
        const wsJson = Blockly.serialization.workspaces.save(workspaceRef.current);
        const formattedData = formatFn(wsJson);
        console.log("Formatted Data:", formattedData);
        sendData?.(formattedData);
    };

    return (
        <div className='flex-1 flex flex-col w-full h-full justify-between'>
            <QueryBuilder workspaceRef={workspaceRef} />
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </div>
    );
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
