import { memo, useEffect, useState } from 'react';
import { Position, Handle, useReactFlow } from '@xyflow/react';
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function TextNode({ id, data }) {
    const theme = useTheme();

    const { updateNodeData } = useReactFlow();
    const validTags = tag_filtering[data.category] || [];
    const currentSelect = isSubarray(validTags, data.select) ? data.select : [];
    const weight = data.weight || 1;

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        updateNodeData(id, { select: typeof value === 'string' ? value.split(',') : value });
    };
    return (
        <div>
            <div className='p-4'>node {id}</div>
            <div className='relative'>
                <select name="cars" id="cars" className='block mb-2 xy-theme__select nodrag'
                    value={data.category}
                    onChange={(e) => updateNodeData(id, { category: e.target.value })}
                >
                    {/* <option value="keyframe_tag_filtering">Keyframe Tag</option> */}
                    {/* <option value="event_tag_filtering">Event Tag</option> */}
                    <option value="ocr_fuzzy_search">OCR Fuzzy Search</option>
                    <option value="ocr_text_search">OCR Text Search</option>
                    <option value="event_caption_fuzzy_search">Event Caption Fuzzy Search</option>
                    <option value="event_caption_text_search">Event Caption Text Search</option>
                    {/* <option value="video_embedding">Video Embedding</option> */}
                    <option value="event_caption_embedding">Event Caption Embedding</option>
                    {/* <option value="event_graph_embedding">Event Graph Embedding</option> */}
                    <option value="frame_embedding">Frame Embedding</option>
                    <option value="visual_caption_embedding">Visual Caption Embedding</option>
                    {/* <option value="visual_scene_graph">Visual Scene Graph</option> */}
                </select>

                {validTags.length > 0 ? (
                    <FormControl sx={{ m: 1 }} className='nodrag w-[220px]'>
                        <InputLabel id="demo-multiple-tag-label">Tag</InputLabel>
                        <Select
                            labelId="demo-multiple-tag-label"
                            id="demo-multiple-tag"
                            multiple
                            fullWidth
                            value={currentSelect}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-tag" label="Tag" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {validTags.map((tag) => (
                                <MenuItem
                                    key={tag}
                                    value={tag}
                                    style={getStyles(tag, currentSelect, theme)}
                                >
                                    {tag}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )
                    :
                    <textarea
                        value={data.text}
                        onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
                        className="xy-theme__input field-sizing-content max-h-36 max-w-56 min-w-56 nodrag"
                        onWheelCapture={(e => e.stopPropagation())}
                    />}
            </div>
            <input className='absolute text-center right-0 translate-x-1/2 bottom-0 translate-y-1/2 xy-theme__input !rounded-full field-sizing-content size-11 nodrag' value={weight}
                onChange={(e) => updateNodeData(id, { weight: e.target.value })}
                onClick={(e) => e.target.select()}
            ></input>
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
    keyframe_tag_filtering: ["tree", "house", "person", "car"],
    event_tag_filtering: ["birthday", "wedding", "anniversary", "graduation"]
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight: personName.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

function isSubarray(arr, subarr) {
    return subarr.every(item => arr.includes(item));
}