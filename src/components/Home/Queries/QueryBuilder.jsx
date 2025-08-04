// QueryBuilder.jsx
import React, { useRef, useState, useCallback } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import './customBlocks';
import * as Blockly from 'blockly';

export default function QueryBuilder({ workspaceRef }) {

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
                onWorkspaceChange={(workspace) => {
                    workspaceRef.current = workspace;
                }}
            />
        </div>
    );
}

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

