import { Button, Card, MenuItem, Paper, Select, TextField } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";

export default function Query({select, text, onDelete}) {
    const [selectValue, setSelectValue] = useState(select);
    const color = COLOR_MAP[selectValue];
    return (
        <div className={clsx("relative flex")}>
            <Select className={color} value={selectValue} label="Type" onChange={(e) => setSelectValue(e.target.value)}>
                <MenuItem value="text">📝</MenuItem>
                <MenuItem value="object">📷</MenuItem>
                <MenuItem value="audio">🎤</MenuItem>
            </Select>
            <TextField className="flex-1" id="outlined-basic" label="search text" variant="outlined" required defaultValue={text} />
            <Button onClick={onDelete} className="">❌</Button>
        </div>
    )
}

const COLOR_MAP = {
    text: "bg-blue-200",
    object: "bg-green-200",
    audio: "bg-red-200"
}