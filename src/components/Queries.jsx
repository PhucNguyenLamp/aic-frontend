// Queries.jsx
import { Button } from '@mui/material'
import QueryBuilder from './QueryBuilder.jsx'
import { useState, useCallback } from 'react';
import * as Blockly from 'blockly';

export default function Queries({ sendData, workspace, setWorkspace }) {
    const [workspaceData, setWorkspaceData] = useState(null);

    const handleSubmit = () => {
        // format to readible json
        const formattedData = formatFn(workspaceData)
        console.log("Formatted Data:", JSON.stringify(formattedData, null, 2));
        sendData?.(formattedData);

    }

    const handleWorkspaceChange = useCallback((workspace) => {
        const json = Blockly.serialization.workspaces.save(workspace);
        setWorkspaceData(json);
    }, []); // Empty dependency array since we don't depend on any props/state

    return (
        <div className='flex-1 flex flex-col w-full h-full justify-between'>
            <QueryBuilder onWorkspaceChange={handleWorkspaceChange} setWorkspaceInstance={setWorkspace} />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!workspaceData}
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

    // Entry point: the first block
    const root = workspaceJson.blocks?.blocks?.[0];
    return walk(root);
};
