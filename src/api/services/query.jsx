import api from "../axios";

// payload = TSearchKeyframePayload[] {
//     model: TModel;
//     value: string | string[] | any;
// };

// queryParams = TSearchParams{
//     vector_search: "faiss" | "usearch";
//     k_query: number;
//     display: number
//     filter_indexes: number[];
// };


export const searchKeyframes = async (payload, queryParams = {
    vector_search: "faiss",
    k_query: 10,
    display: 10,
    filter_indexes: [],
}) => {
    // const params = queryParams ? qs.stringify(queryParams) : "";
    // const url = `${REST_API.SEARCH_KEYFRAMES.uri}${params ? `?${params}` : ""}`;
    // return HttpService.post<TSearchKeyframePayload[], any>(url, payload);
    // mock the response for now
    // return list of class KeyframeWithConfidence(BaseModel):
    //   key: int
    //   value: str
    //   confidence: Optional[float] | list[float]
    //   video_id: int
    //   group_id: int
    return Promise.resolve([
        {
            confidence: 0.95,
            key: 0,
            video_id: 1,
            group_id: 1,
        },
        {
            confidence: 0.9,
            key: 596,
            video_id: 1,
            group_id: 1,
        },
        {
            confidence: 0.9,
            key: 2444,
            video_id: 1,
            group_id: 1,
        },
        {
            confidence: 0.9,
            key: 29810,
            video_id: 1,
            group_id: 1,
        },
        {
            confidence: 0.9,
            key: 30444,
            video_id: 1,
            group_id: 1,
        },
        {
            confidence: 0.8,
            key: 399,
            video_id: 2,
            group_id: 1,
        },
    ]);
};

export const getVideoByGroupVideoId = async (
    videoId,
    groupId
) => {
    // const url = REST_API.GET_VIDEO.uri
    //   .replace("{{group_id}}", groupId.toString())
    //   .replace("{{video_id}}", videoId.toString());
    const url = "/test/video/L0{{group_id}}_V00{{video_id}}.mp4"
        .replace("{{group_id}}", groupId.toString())
        .replace("{{video_id}}", videoId.toString());

    const blob = await api.get(url, {
        responseType: "blob",
    });

    return blob;
};

export const getHistory = async () => {
    return Promise.resolve([
        {
            "images": [], // lưu state luôn, tính sau
            "workspace": {
                "blocks": {
                    "languageVersion": 0,
                    "blocks": [
                        {
                            "type": "sequential_block",
                            "id": "0[H,Mw3|WvbPz-uh@ZX$",
                            "x": 123,
                            "y": 48,
                            "inputs": {
                                "STACK": {
                                    "block": {
                                        "type": "query_block",
                                        "id": "yuX:)era95?cgKM|Ww-S",
                                        "fields": {
                                            "TYPE": "TEXT",
                                            "TEXT": "text"
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        {
            "images": [],
            "workspace": {},
        }
    ]);
};

export const syncHistory = async (history) => {
    // This function would typically send the updated history to the server
    // For now, we just log it to the console
    console.log("Syncing history:", history);
    return Promise.resolve(history);
};