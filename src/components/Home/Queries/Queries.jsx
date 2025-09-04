import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Box, Button, Paper, Stack } from "@mui/material";
import QueryRow from "./QueryRow";
import { useStore } from "@/stores/questions";
import { searchKeyframes } from "@/api/services/query";
import { useQueryClient } from "@tanstack/react-query";

const defaultItem = {
    captionSearchText: "",
    captionSearchRRF: false,
    captionSearchWeight: 0,
    captionSearchTagBoostAlpha: 0,

    keyframeSearchText: "",
    keyframeSearchTagBoostAlpha: 0,

    OCRSearchText: "",

    captionSlider: 0, // chưa có 
    keyframeSlider: 0, // chưa có 
    OCRSlider: 0, // chưa có 

    userTags: [],
}

export default function Queries() {
    const { queries } = useStore();
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset } = useForm({
        defaultValues: { queries: queries },
    });

    const { setSearchQuestions, currentQuestionId, formField, setFormField } = useStore();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "queries",
    });

    useEffect(() => {
        reset({ queries: queries })
    }, [queries])

    const onSubmit = async (data) => {
        const payload = {
            currentQuestionId,
            queries: data.queries
        };
        const responseData = await searchKeyframes(payload);
        setSearchQuestions(responseData);

        // invalidate queryKey: ['history'],
        queryClient.invalidateQueries({ queryKey: ['history'] });
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
