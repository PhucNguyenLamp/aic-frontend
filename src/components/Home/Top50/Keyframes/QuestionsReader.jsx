import Dropzone from "react-dropzone";
import { useStore } from "@/stores/questions";

export default function QuestionsReader() {
    // const { setQuestions, setImages, undoRef, redoRef, workspaceRef } = useContext(AppContext);
    const { addQuestions, questions, getId } = useStore();

    const readFileAysnc = async (file) => {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                const data = {
                    [file.name]: {
                        question: content,
                        images: [],
                        nodes: [{
                            id: getId(),
                            position: { x: 0, y: 0 },
                            type: 'text',
                            data: { text: content },
                            origin: [0.5, 0.0],
                        }],
                        edges: [],
                        undoArray: [],
                        redoArray: []
                    }
                };
                resolve(data);
            };
            reader.readAsText(file);
        });
    }

    const readFiles = (files) => {
        Promise.all(files.map(readFileAysnc)).then((data) => {
            data = Object.assign({}, ...data);
            addQuestions(data);
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
