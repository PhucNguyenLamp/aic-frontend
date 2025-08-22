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
    // console.log("GET HISTORY")
    const mockCall = Promise.resolve([
        {
            questionName: "1",
            timestamp: "8:33pm 20/08/2025",
            searchImages: [

            ],
            edges: [],
            nodes: [],
        },
        {
            questionName: "2",
            timestamp: "7:29pm 20/08/2025",
            searchImages: [

            ],
            edges: [],
            nodes: [],
        },
        {
            questionName: "1",
            timestamp: "7:00pm 20/08/2025",
            searchImages: [

            ],
            edges: [],
            nodes: [],
        },
        {
            questionName: "2",
            timestamp: "6:29pm 20/08/2025",
            searchImages: [

            ],
            edges: [],
            nodes: [],
        },
    ]);
    const data = await mockCall;

    const grouped = new Map();

    for (const item of data) {
        if (!grouped.has(item.questionName)) {
            grouped.set(item.questionName, []);
        }
        grouped.get(item.questionName).push(item);
    }

    const formatted = Array.from(grouped.entries()).map(([questionName, items]) => ({
        id: questionName,
        label: questionName,
        children: items.map(({ timestamp, edges, nodes, searchImages }) => ({
            id: timestamp,
            label: timestamp,
            edges,
            nodes,
            searchImages,
        }))
    }))

    return formatted;
};

export const getHistoryId = async (id) => {
    // id is timestamp
    // console.log("GET SPECIFIC HISTORY")
    const mockCall = Promise.resolve({
        questionName: "1",
        timestamp: "8:33pm 20/08/2025",
        searchImages: [],
        edges: [],
        nodes: [],
    });
    const data = await mockCall;
    return data;
};
// export const syncHistory = async (history) => {
//     // This function would typically send the updated history to the server
//     // For now, we just log it to the console
//     return Promise.resolve(history);
// };