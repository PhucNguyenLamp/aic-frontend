import { Slider, Switch, TextField, Typography, FormGroup, FormControlLabel } from "@mui/material";



export default function OCRSearch({OCRSearchText, setOCRSearchText}) {


    return (
        <div className="flex flex-col gap-4">
            <Typography variant="h4">OCR Search</Typography>
            <TextField id="outlined-basic" label="Search text" variant="outlined" value={OCRSearchText} onChange={(e) => setOCRSearchText(e.target.value)} />
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
