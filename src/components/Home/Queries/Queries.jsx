import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Box, Button, Paper, Stack } from "@mui/material";
import QueryRow from "./QueryRow";
import { useStore } from "@/stores/questions";
import { searchKeyframes } from "@/api/services/query";

const defaultItem = {
    captionSearchText: "",
    captionSearchRRF: true,          // true = RRF, false = weighted
    captionSearchWeight: 0.1,
    captionSearchTagBoostAlpha: 0.1,

    captionSlider: 0.1,
    keyframeSlider: 0.1,
    OCRSlider: 0.1,

    keyframeSearchText: "",
    keyframeSearchTagBoostAlpha: 0.1,
    OCRSearchText: "",
};

export default function Queries() {
    const { control, handleSubmit } = useForm({
        defaultValues: { queries: [defaultItem] },
    });

    const { setSearchQuestions } = useStore();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "queries",
    });

    const onSubmit = async (data) => {
        const payload = data.queries;
        const responseData = await searchKeyframes(payload);
        setSearchQuestions(responseData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                {fields.map((field, idx) => (
                    <QueryRow
                        key={field.id}
                        idx={idx}
                        control={control}
                        onRemove={() => remove(idx)}
                    />
                ))}

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={() => append(defaultItem)}>
                        + Add query
                    </Button>
                    <Button type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
                        Submit All
                    </Button>
                </Box>
            </Stack>
        </form>
    );
}
