// QueryBuilder.jsx
import React, { useRef, useState, useCallback } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import './customBlocks';

const toolbox = {
    kind: 'flyoutToolbox',
    contents: [
        {
            kind: 'block',
            type: 'query_block'
        },
        {
            kind: 'block',
            type: 'sequential_block'
        },
        {
            kind: 'block',
            type: 'parallel_block'
        }
    ]
};

export default function QueryBuilder({ onWorkspaceChange, setWorkspaceInstance }) {
    const [workspaceXML, setWorkspaceXML] = useState('');
    const workspaceRef = useRef(null);

    const handleWorkspaceReady = useCallback((workspace) => {
        onWorkspaceChange?.(workspace);
        setWorkspaceInstance?.(workspace); // 👈 expose workspace to parent
    }, [onWorkspaceChange, setWorkspaceInstance]);

    return (
        <div className='flex-1 w-full flex flex-col'>
            <BlocklyWorkspace
                ref={workspaceRef}
                toolboxConfiguration={toolbox}
                initialXml={workspaceXML}
                className="flex-1 w-full"
                workspaceConfiguration={{
                    toolboxPosition: 'top',
                    horizontalLayout: true,
                    scrollbars: false,
                    trashcan: true
                }}
                onXmlChange={(xml) => {
                    setWorkspaceXML(xml);
                    const workspace = workspaceRef.current?.workspace;
                    if (workspace) {
                        onWorkspaceChange?.(workspace);
                        setWorkspaceInstance?.(workspace);
                    }
                }}
                onWorkspaceChange={handleWorkspaceReady}
            />
        </div>
    );
}
