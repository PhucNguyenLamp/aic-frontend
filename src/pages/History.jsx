import { useEffect } from "react";
import api from "../api/axios";
import { getHistory, syncHistory } from "../api/services/query";
import { Card, Typography } from "@mui/material";

export default function History({ history, setHistory }) {
    const fetchHistory = async () => {
        const historyData = await getHistory();
        setHistory(historyData);
    };
    const updateHistory = async (newHistory) => {
        await syncHistory(newHistory);
    };

    useEffect(() => {
        fetchHistory();
    }, []);
    return (
        <div className=" relative flex justify-center w-full h-full">
            <div className="absolute top-2 left-2 text-4xl" >📜</div>
            <div className="flex flex-col gap-4 scroll-auto mt-16">
                {/*  show all queries history */}
                {history.map((item, index) => (
                    <Card key={index} className="w-[80vw] py-6 p-2 flex flex-row gap-5 justify-between items-center">
                        <h3>Query {index + 1}</h3>
                        <p>Workspace: {item.workspace ? JSON.stringify(item.workspace) : "No workspace"}</p>
                        <p>Images: {item.images.length > 0 ? item.images.map(img => img.key).join(", ") : "No images"}</p>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export function loadFormattedData(data, workspace) {
    const createBlock = (type, fields = {}) => {
        const block = workspace.newBlock(type);
        for (const [key, value] of Object.entries(fields)) {
            block.setFieldValue(value, key);
        }
        block.initSvg(); // needed before rendering
        block.render();
        return block;
    };

    const buildFromObject = (obj) => {
        if ('q' in obj) {
            return createBlock("query_block", {
                TEXT: obj.q.text,
                TYPE: obj.q.type
            });
        }

        if ('seq' in obj) {
            const block = createBlock("sequential_block");
            connectStack(obj.seq, block.getInput("STACK").connection);
            return block;
        }

        if ('par' in obj) {
            const block = createBlock("parallel_block");
            connectStack(obj.par, block.getInput("STACK").connection);
            return block;
        }

        return null;
    };

    const connectStack = (list, connection) => {
        let prevBlock = null;
        for (const item of list) {
            const current = buildFromObject(item);
            if (!current) continue;

            if (prevBlock) {
                prevBlock.nextConnection.connect(current.previousConnection);
            } else {
                // first block in stack goes into the input
                connection.connect(current.previousConnection);
            }

            prevBlock = current;
        }
    };

    const rootBlock = buildFromObject(data);
    if (rootBlock) {
        workspace.centerOnBlock(rootBlock.id);
    }
}
