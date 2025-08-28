import React from "react";
import { Controller, useWatch } from "react-hook-form";
import {
    Box, Button, FormControlLabel, FormGroup, Paper, Slider,
    Switch, TextField, Typography
} from "@mui/material";

const marks = [
    { value: 0, label: "0" },
    { value: 0.5, label: "0.5" },
    { value: 1, label: "1" },
];

function sliderRender(value, onChange) {
    return (
        <Slider
            value={typeof value === "number" ? value : 0}
            onChange={(_e, v) => { if (typeof v === "number") onChange(v); }}
            min={0}
            max={1}
            step={0.01}
            marks={marks}
            valueLabelDisplay="auto"
            className="flex-4"
        />
    );
}

export default function QueryRow({ idx, control, onRemove }) {
    // Keep hooks inside this child, not in a map loop in parent
    const rrf = useWatch({ control, name: `queries.${idx}.captionSearchRRF` });

    return (
        <Paper style={{ padding: 12 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Query #{idx + 1}</Typography>
                <Button color="error" size="small" onClick={onRemove}>Remove</Button>
            </Box>

            {/* Caption section */}
            <Box display="flex" alignItems="center" gap={2} mt={2} flexWrap="wrap">
                <Typography variant="h5" style={{ marginRight: 8 }}>Caption Search</Typography>

                <Controller
                    control={control}
                    name={`queries.${idx}.captionSearchText`}
                    render={({ field: { value, onChange } }) => (
                        <TextField
                            label="Search text"
                            variant="outlined"
                            value={value ?? ""}
                            onChange={(e) => onChange(e.target.value)}
                            sx={{ minWidth: 260 }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name={`queries.${idx}.captionSearchRRF`}
                    render={({ field: { value, onChange } }) => (
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={!!value}
                                        onChange={(e) => onChange(e.target.checked)}
                                    />
                                }
                                label="Weighted (off) / rrf (on)"
                            />
                        </FormGroup>
                    )}
                />

                <Box display="flex" alignItems="center" gap={2} style={{ flex: 1, minWidth: 320 }}>
                    <Typography id="weight-slider" className="flex-1" style={{ minWidth: 80 }}>
                        Weight
                    </Typography>
                    <Controller
                        control={control}
                        name={`queries.${idx}.captionSearchWeight`}
                        render={({ field: { value, onChange } }) => (
                            <Slider
                                disabled={rrf === true}
                                value={typeof value === "number" ? value : 0}
                                onChange={(_e, v) => { if (typeof v === "number") onChange(v); }}
                                min={0}
                                max={1}
                                step={0.01}
                                marks={marks}
                                valueLabelDisplay="auto"
                                className="flex-4"
                                aria-labelledby="weight-slider"
                            />
                        )}
                    />
                </Box>

                <Box display="flex" alignItems="center" gap={2} style={{ flex: 1, minWidth: 320 }}>
                    <Typography id="alpha-slider" className="flex-1" style={{ minWidth: 80 }}>
                        Tag Boost α
                    </Typography>
                    <Controller
                        control={control}
                        name={`queries.${idx}.captionSearchTagBoostAlpha`}
                        render={({ field: { value, onChange } }) => sliderRender(value, onChange)}
                    />
                </Box>
            </Box>

            {/* Keyframe */}
            <Box mt={2} display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Typography variant="h6" style={{ marginRight: 8 }}>Keyframe</Typography>
                <Controller
                    control={control}
                    name={`queries.${idx}.keyframeSearchText`}
                    render={({ field: { value, onChange } }) => (
                        <TextField
                            label="Keyframe text"
                            variant="outlined"
                            value={value ?? ""}
                            onChange={(e) => onChange(e.target.value)}
                            sx={{ minWidth: 260 }}
                        />
                    )}
                />
                <Box display="flex" alignItems="center" gap={2} style={{ flex: 1, minWidth: 320 }}>
                    <Typography className="flex-1">KF Tag Boost α</Typography>
                    <Controller
                        control={control}
                        name={`queries.${idx}.keyframeSearchTagBoostAlpha`}
                        render={({ field: { value, onChange } }) => sliderRender(value, onChange)}
                    />
                </Box>
            </Box>

            {/* OCR */}
            <Box mt={2} display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Typography variant="h6" style={{ marginRight: 8 }}>OCR</Typography>
                <Controller
                    control={control}
                    name={`queries.${idx}.OCRSearchText`}
                    render={({ field: { value, onChange } }) => (
                        <TextField
                            label="OCR text"
                            variant="outlined"
                            value={value ?? ""}
                            onChange={(e) => onChange(e.target.value)}
                            sx={{ minWidth: 260 }}
                        />
                    )}
                />
            </Box>

            {/* Fusion sliders */}
            <Box className="p-2 border-t-2 border-dashed border-gray-600" mt={2}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography className="flex-1">Caption</Typography>
                    <Controller
                        control={control}
                        name={`queries.${idx}.captionSlider`}
                        render={({ field: { value, onChange } }) => sliderRender(value, onChange)}
                    />
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <Typography className="flex-1">Keyframe</Typography>
                    <Controller
                        control={control}
                        name={`queries.${idx}.keyframeSlider`}
                        render={({ field: { value, onChange } }) => sliderRender(value, onChange)}
                    />
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <Typography className="flex-1">OCR</Typography>
                    <Controller
                        control={control}
                        name={`queries.${idx}.OCRSlider`}
                        render={({ field: { value, onChange } }) => sliderRender(value, onChange)}
                    />
                </Box>
            </Box>
        </Paper>
    );
}
