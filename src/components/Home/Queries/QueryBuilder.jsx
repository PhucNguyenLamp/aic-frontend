// QueryBuilder.jsx
import React, { useRef, useState, useCallback, useContext, memo } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import './customBlocks';
import { AppContext } from '@/context/AppContext';


const QueryBuilder = memo(function QueryBuilder({ workspaceRef }) {
    const { setSomethingChange } = useContext(AppContext);
    return (
        <div className='flex-1 w-full flex flex-col'>
            <BlocklyWorkspace
                toolboxConfiguration={toolbox}
                // initialXml={workspaceXML}
                className="flex-1 w-full"
                workspaceConfiguration={{
                    toolboxPosition: 'top',
                    horizontalLayout: true,
                    scrollbars: false,
                    trashcan: true
                }}
                onXmlChange={(workspace) => {
                    setSomethingChange((prev) => !prev);
                }}
                onInject={(workspace) => {
                    workspaceRef.current = workspace;
                }}
            />
        </div>
    );
});

export default QueryBuilder;
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

