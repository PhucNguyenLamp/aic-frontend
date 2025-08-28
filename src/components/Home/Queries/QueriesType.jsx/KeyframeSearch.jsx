import { Slider, Switch, TextField, Typography, FormGroup, FormControlLabel, Box } from "@mui/material";



export default function KeyframeSearch({keyframeSearchText, setKeyframeSearchText, keyframeSearchTagBoostAlpha, setKeyframeSearchTagBoostAlpha}) {

    return (
        <div className="flex flex-col gap-4">
            <Typography variant="h4">Keyframe Search</Typography>
            <TextField id="outlined-basic" label="Search text" variant="outlined" value={keyframeSearchText} onChange={(e) => setKeyframeSearchText(e.target.value)} />

            <Box display="flex" alignItems="center" gap={2} >
                <Typography id="alpha-slider" gutterBottom className="flex-1">
                    Tag Boost α
                </Typography>
                <Slider value={keyframeSearchTagBoostAlpha} onChange={(e, newValue) => setKeyframeSearchTagBoostAlpha(newValue)} min={0} step={0.01} max={1} aria-labelledby="alpha-slider" marks={marks} valueLabelDisplay="auto"
                    className="flex-4"
                />
            </Box>
        </div>
    )
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
