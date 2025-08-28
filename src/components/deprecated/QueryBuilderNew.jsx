import * as React from 'react';
import { useState } from 'react';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import { Box, Button, Divider, Paper, Slider, Tab, Typography } from '@mui/material';
import CaptionSearch from '../Home/Queries/QueriesType.jsx/CaptionSearch';
import KeyframeSearch from '../Home/Queries/QueriesType.jsx/KeyframeSearch';
import OCRSearch from '../Home/Queries/QueriesType.jsx/OCRSearch';

export default function QueryBuilder() {
    // caption search
    const [captionSearchText, setCaptionSearchText] = useState('');
    const [captionSearchRRF, setCaptionSearchRRF] = useState(true);
    const [captionSearchWeight, setCaptionSearchWeight] = useState(0.1);
    const [captionSearchTagBoostAlpha, setCaptionSearchTagBoostAlpha] = useState(0.1);


    // keyframe search
    const [keyframeSearchText, setKeyframeSearchText] = useState('');
    const [keyframeSearchTagBoostAlpha, setKeyframeSearchTagBoostAlpha] = useState(0.1);

    // ocr search
    const [OCRSearchText, setOCRSearchText] = useState('');

    // three slider
    const [captionSlider, setCaptionSlider] = useState(0.1);
    const [keyframeSlider, setKeyframeSlider] = useState(0.1);
    const [OCRSlider, setOCRSlider] = useState(0.1);

    const sendQuery = () => {
        console.log({
            captionSearchText,
            captionSearchRRF,
            captionSearchWeight,
            captionSearchTagBoostAlpha,
            keyframeSearchText,
            keyframeSearchTagBoostAlpha,
            OCRSearchText,
            captionSlider,
            keyframeSlider,
            OCRSlider
        });
    }
    return (
        <Paper>
            <Box className="relative flex flex-col gap-4 p-4 h-[70%] overflow-x-hidden overflow-y-auto">
                <CaptionSearch captionSearchText={captionSearchText} setCaptionSearchText={setCaptionSearchText} captionSearchRRF={captionSearchRRF} setCaptionSearchRRF={setCaptionSearchRRF} captionSearchWeight={captionSearchWeight} setCaptionSearchWeight={setCaptionSearchWeight} captionSearchTagBoostAlpha={captionSearchTagBoostAlpha} setCaptionSearchTagBoostAlpha={setCaptionSearchTagBoostAlpha} />
                <Divider />
                <KeyframeSearch keyframeSearchText={keyframeSearchText} setKeyframeSearchText={setKeyframeSearchText} keyframeSearchTagBoostAlpha={keyframeSearchTagBoostAlpha} setKeyframeSearchTagBoostAlpha={setKeyframeSearchTagBoostAlpha} />
                <Divider />
                <OCRSearch OCRSearchText={OCRSearchText} setOCRSearchText={setOCRSearchText} />
            </Box>
            <Box className="h-[25%] p-4 border-t-2 border-dashed border-gray-600">
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography id="weight-slider" gutterBottom className="flex-1">
                        Caption
                    </Typography>
                    <Slider
                        value={captionSlider}
                        onChange={(e, newValue) => setCaptionSlider(newValue)}
                        min={0}
                        step={0.01}
                        max={1}
                        aria-labelledby="weight-slider"
                        marks={marks}
                        valueLabelDisplay="auto"
                        className="flex-4"
                    />
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography id="alpha-slider" gutterBottom className="flex-1">
                        Keyframe
                    </Typography>
                    <Slider value={keyframeSlider} onChange={(e, newValue) => setKeyframeSlider(newValue)} min={0} step={0.01} max={1} aria-labelledby="alpha-slider" marks={marks} valueLabelDisplay="auto"
                        className="flex-4"
                    />
                </Box>
                <Box display="flex" alignItemas="center" gap={2}>
                    <Typography id="alpha-slider" gutterBottom className="flex-1">
                        OCR
                    </Typography>
                    <Slider value={OCRSlider} onChange={(e, newValue) => setOCRSlider(newValue)} min={0} step={0.01} max={1} aria-labelledby="alpha-slider" marks={marks} valueLabelDisplay="auto"
                        className="flex-4"
                    />
                </Box>
            </Box>
            <Button variant="contained" onClick={sendQuery} className='h-[5%]'>Submit</Button>
        </Paper>
    );
}

const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 0.5,
        label: '0.5',
    },
    {
        value: 1,
        label: '1',
    },
];
