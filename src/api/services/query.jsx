import api from "../axios";

export const searchKeyframes = async (payload) => {
    // gửi payload {
    //      nodes: []{
    //      id: node.id,
    //      data: node.data,
    //  }
    //     edges: []{
    //      id: edge.id,
    //      source: edge.source,
    //      target: edge.target,
    //  }
    // }

    // return ví dụ
    const mockCall = Promise.resolve([
        {
            confidence: 0.95,
            key: 0,
            video_id: 1,
            group_id: 21,
        },
        {
            confidence: 0.9,
            key: 596,
            video_id: 1,
            group_id: 22,
        },
        {
            confidence: 0.9,
            key: 2444,
            video_id: 1,
            group_id: 23,
        },
        {
            confidence: 0.9,
            key: 29810,
            video_id: 2,
            group_id: 23,
        },
        {
            confidence: 0.9,
            key: 30444,
            video_id: 3,
            group_id: 23,
        },
        {
            confidence: 0.8,
            key: 399,
            video_id: 1,
            group_id: 30,
        },
    ]);
    const data = await mockCall;

    return data;
};

// lấy lịch sử
export const getHistory = async () => {
    // return ví dụ
    const mockCall = Promise.resolve([
        {
            questionName: "1",
            timestamp: "8:33pm 20/08/2025",
        },
        {
            questionName: "2",
            timestamp: "7:29pm 20/08/2025",
        },
        {
            questionName: "1",
            timestamp: "7:00pm 20/08/2025",
        },
        {
            questionName: "2",
            timestamp: "6:29pm 20/08/2025",
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

// lấy history cụ thể ví dụ
export const getHistoryId = async (id) => {
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
