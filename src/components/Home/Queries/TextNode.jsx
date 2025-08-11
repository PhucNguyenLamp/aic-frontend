import { memo, useEffect, useState } from 'react';
import { Position, Handle, useReactFlow } from '@xyflow/react';
function TextNode({ id, data }) {
    const { updateNodeData } = useReactFlow();
    const validTags = tag_filtering[data.category] || [];
    const currentSelect = validTags.includes(data.select)
        ? data.select
        : validTags[0] ?? '';

    useEffect(() => {
        if (currentSelect !== data.select) {
            updateNodeData(id, { select: currentSelect });
        }
    }, [data.category]);

    return (
        <div>
            <div className='p-4'>node {id}</div>
            <div>
                <select name="cars" id="cars" className='block mb-2 xy-theme__select nodrag' 
                    value={data.category}
                    onChange={(e) => updateNodeData(id, { category: e.target.value })}
                    >
                    <option value="keyframe_tag_filtering">Keyframe Tag</option>
                    <option value="event_tag_filtering">Event Tag</option>
                    <option value="video_embedding">Video Embedding</option>
                    <option value="event_caption_embedding">Event Caption Embedding</option>
                    <option value="ocr_fuzzy_text_search">OCR Fuzzy Text Search</option>
                    <option value="event_caption_text_search">Event Caption Text Search</option>
                    <option value="event_graph_embedding">Event Graph Embedding</option>
                    <option value="frame_embedding">Frame Embedding</option>
                    <option value="visual_caption_embedding">Visual Caption Embedding</option>
                    <option value="event_caption_fuzzy_search">Event Caption Fuzzy Search</option>
                    <option value="visual_scene_graph">Visual Scene Graph</option>
                </select>

                {validTags.length > 0 ? (
                    <select
                        value={currentSelect}
                        onChange={(e) => updateNodeData(id, { select: e.target.value })}
                        className="mb-2 xy-theme__select nodrag"
                    >
                        {validTags.map((tag) => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                )
                    :
                    <textarea
                        value={data.text}
                        onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
                        className="xy-theme__input field-sizing-content max-h-36 max-w-56 nodrag"
                        onWheelCapture={(e => e.stopPropagation())}
                    />}
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

const tag_filtering = {
    keyframe_tag_filtering: ["tree", "house"],
    event_tag_filtering: ["birthday", "wedding"]
}