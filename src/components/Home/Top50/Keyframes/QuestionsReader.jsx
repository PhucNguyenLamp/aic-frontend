import Dropzone from "react-dropzone";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

export default function QuestionsReader() {
    const { setQuestions } = useContext(AppContext);
    const readFileAysnc = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                const data = {
                    fileName: file.name, content: content,
                    workspace: {
                        queries: {},
                        images: [],
                        history: {
                            undoRef: [],
                            redoRef: []
                        }
                    }
                };
                resolve(data);
            };
            reader.readAsText(file);
        });
    }

    const readFiles = (files) => {
        Promise.all(files.map(readFileAysnc)).then((data) => {
            setQuestions(data);
        })
    }

    const handleDrop = (acceptedFiles) => {
        readFiles(acceptedFiles);
    }
    return (
        <Dropzone onDrop={handleDrop} accept={{ 'text/plain': ['.txt'] }} multiple={true}>
            {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="p-4 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 inline-block h-[56px]">
                    <input {...getInputProps()} />
                    <span>Upload Questions</span>
                </div>
            )}
        </Dropzone>
    )
}
