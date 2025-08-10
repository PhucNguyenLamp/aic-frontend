import { memo } from 'react';
import { Position, Handle, useReactFlow } from '@xyflow/react';
function TextNode({ id, data }) {
    const { updateNodeData } = useReactFlow();

    return (
        <div>
            <div className='p-4'>node {id}</div>
            <div>
                <textarea
                    onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
                    value={data.text}
                    className="xy-theme__input field-sizing-content max-h-36 max-w-56 nodrag"
                    onWheelCapture={(e => e.stopPropagation())}
                />
            </div>
            <Handle type="target" position={Position.Top} style={{
                width: 20,
                height: 20,
            }} />
            <Handle type="source" position={Position.Bottom} style={{
                width: 20,
                height: 20,
            }} />
        </div>
    );
}

export default memo(TextNode);