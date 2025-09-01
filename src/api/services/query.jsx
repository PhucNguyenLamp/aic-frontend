import api from "../axios";

export const searchKeyframes = async (payload) => {
    const queries = payload.queries;

    // {
    //     req: {
    //         question_filename: str = Field(..., description = "Logical name used to group related searches")
    //         keyframe: Optional[KeyframeQuery] = None
    //         caption: Optional[CaptionQuery] = None
    //         ocr: Optional[OCRQuery] = None
    //     }
    //     topk: TopKReturn = TopKReturn()
    //     ctrl: {
    //        fusion: {
    //            w_visual: float = Field(default=0.5)
    //            w_caption: float = Field(default=0.3)
    //            w_ocr: float = Field(default=0.2)

    //        }    
    // }
    // }

    let response;

    if (queries.length === 1) {
        const query = queries[0];
        const request = {
            req: {
                question_filename: payload.currentQuestionId,
                caption: {
                    tag_boost_alpha: query.captionSearchTagBoostAlpha,
                    text: query.captionSearchText,
                    fusion: query.captionSearchRRF ? "rrf" : "weighted",
                    weighted: query.captionSearchWeight,
                },
                keyframe: {
                    text: query.keyframeSearchText,
                    tag_boost_alpha: query.keyframeSearchTagBoostAlpha
                },
                ocr: {
                    text: query.OCRSearchText
                }
            },
            ctrl: {
                fusion: {
                    w_visual: query.keyframeSlider,
                    w_caption: query.captionSlider,
                    w_ocr: query.OCRSlider
                }
            }
        }
        response = await api.post("/search/single", request);
        return response.data.fused;
    } else {

        const request = queries.map((query, index) => ({
            event_order: index,
            query: {
            req: {
                question_filename: payload.currentQuestionId,
                caption: {
                    tag_boost_alpha: query.captionSearchTagBoostAlpha,
                    text: query.captionSearchText,
                    fusion: query.captionSearchRRF ? "rrf" : "weighted",
                    weighted: query.captionSearchWeight,
                },
                keyframe: {
                    text: query.keyframeSearchText,
                    tag_boost_alpha: query.keyframeSearchTagBoostAlpha
                },
                ocr: {
                    text: query.OCRSearchText
                }
            },
            ctrl: {
                fusion: {
                    w_visual: query.keyframeSlider,
                    w_caption: query.captionSlider,
                    w_ocr: query.OCRSlider
                }
            }
        }}))
        const events = { events: request }
        response = await api.post("/search/trake", events);
        return response.data.trake_paths.paths
}


};

// lấy lịch sử

export const getHistory = async () => {
    // return ví dụ
    let history = await api.get("/search/history")
    history = history.data;
    // const grouped = new Map();

    // for (const item of data) {
    //     if (!grouped.has(item.questionName)) {
    //         grouped.set(item.questionName, []);
    //     }
    //     grouped.get(item.questionName).push(item);
    // }

    const formatted = Object.entries(history).map(([questionName, historyItems]) => ({
        id: questionName,
        label: questionName,
        children: historyItems.map(({ timestamp }) => ({
            id: timestamp,
            label: (new Date(timestamp)).toLocaleString(undefined, options),
        }))
    }));

    return formatted;
};

// lấy history cụ thể ví dụ

export const getHistoryId = async (timestamp, limit = 100) => {
    const params = { timestamp, limit };
    const data = await api.get("/search", { params });
    return data.data;
};


const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
};