import React from "react";
import { Controller, useWatch } from "react-hook-form";
import {
    Autocomplete,
    Box, Button, Chip, FormControlLabel, FormGroup, Paper, Select, Slider,
    Switch, TextField, Typography
} from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { fetchTags } from "@/api/services/query";
import VirtualizedListbox from './VirtualizedListbox';
import { createFilterOptions } from "@mui/material";
import { VariableSizeList } from "react-window";
import { useTheme, styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { useDebounce } from "use-debounce";

const marks = [
    { value: 0, label: "0" },
    { value: 0.5, label: "0.5" },
    { value: 1, label: "1" },
];

const LISTBOX_PADDING = 8;
function renderRow(props) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = { ...style, top: style.top + LISTBOX_PADDING };

    if (Object.prototype.hasOwnProperty.call(dataSet, "group")) {
        return (
            <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
                {dataSet.group}
            </ListSubheader>
        );
    }

    const { key, ...optionProps } = dataSet[0];
    const optionLabel = dataSet[1]; // <- this is the option text

    return (
        <Typography
            component="li"
            noWrap
            key={key}
            {...optionProps}
            style={{ ...inlineStyle, color: "inherit" }} // keep theme text color
        >
            {String(optionLabel)}
        </Typography>
    );
}

const OuterElementContext = React.createContext({});
const OuterElementType = React.forwardRef(function OuterElementType(props, ref) {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;

    // IMPORTANT: do NOT use React.Children.forEach here.
    const itemData = [];
    const items = Array.isArray(children) ? children : (children ? [children] : []);
    items.forEach((item) => {
        itemData.push(item);
        if (item && item.children) itemData.push(...item.children);
    });

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child) =>
        Object.prototype.hasOwnProperty.call(child, "group") ? 48 : itemSize;

    const getHeight = () => {
        if (itemCount > 8) return 8 * itemSize;
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

ListboxComponent.propTypes = { children: PropTypes.node };
const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: "border-box",
        "& ul": { padding: 0, margin: 0 },
    },
});

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

    const { data: tagsData } = useQuery({ queryKey: ['tags'], queryFn: fetchTags });
    const [inputValue, setInputValue] = React.useState("");
    const [debouncedInput] = useDebounce(inputValue, 150);

    return (
        <Paper style={{ padding: 12 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Query #{idx + 1}</Typography>
                <Button color="error" size="small" onClick={onRemove}>Remove</Button>
            </Box>

            {/* Caption section */}
            <Box display="flex" alignItems="center" gap={2} mt={2} flexWrap="wrap">
                <Typography variant="h6" style={{ marginRight: 8 }}>Caption Search</Typography>

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

            {/* tag boost alpha */}
            <Box mt={2} display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={2} style={{ flex: 1, minWidth: 320 }}>
                    <Typography className="flex-1">Tag Boost α</Typography>
                    <Controller
                        control={control}
                        name={`queries.${idx}.tagBoostAlpha`}
                        render={({ field: { value, onChange } }) => sliderRender(value, onChange)}
                    />
                </Box>
            </Box>
            
            {/* users tag */}
            <Box mt={2} display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Typography variant="h6" style={{ marginRight: 8 }}>
                    User Tags
                </Typography>

                <Controller
                    control={control}
                    name={`queries.${idx}.userTags`}
                    render={({ field: { value, onChange } }) => (
                        <Autocomplete
                            multiple
                            sx={{ minWidth: 360 }}
                            options={tagsData}
                            value={value || []}
                            onChange={(_, newValue) => onChange(newValue)}
                            inputValue={inputValue}
                            onInputChange={(_, v) => setInputValue(v)}
                            filterSelectedOptions
                            // debounce-aware local filter
                            filterOptions={(options) => {
                                const q = debouncedInput.trim().toLowerCase();
                                if (!q) return options;
                                return options
                                    .filter((opt) => String(opt).toLowerCase().includes(q));
                            }}
                            // virtualization hooks (official API)
                            renderOption={(props, option, state) => [props, option, state.index]}
                            renderGroup={(params) => params}
                            slots={{ popper: StyledPopper }}
                            slotProps={{ listbox: { component: ListboxComponent } }}
                            renderTags={(val, getTagProps) =>
                                val.map((option, i) => (
                                    <Chip key={String(option)} label={option} {...getTagProps({ index: i })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Select tags" placeholder="Type to search..." />
                            )}
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