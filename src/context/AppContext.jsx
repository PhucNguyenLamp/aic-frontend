import { createContext, useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import * as Blockly from "blockly";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const savedQuestions = localStorage.getItem('workspace');
    const [questions, setQuestions] = useState(savedQuestions ? JSON.parse(savedQuestions) : []);;
    const [questionNumber, setQuestionNumber] = useState(0);
    const [images, setImages] = useState([]);
    const undoRef = useRef([]);
    const redoRef = useRef([]);
    const workspaceRef = useRef(null);
    const [somethingChange, setSomethingChange] = useState(false);

    useEffect(() => {
        console.log("question changed");
        if (!questions.length) return;

        setImages(questions[questionNumber].workspace.images)
        undoRef.current = questions[questionNumber].workspace.history.undoRef;
        redoRef.current = questions[questionNumber].workspace.history.redoRef;
        if (workspaceRef.current && questions[questionNumber].workspace.queries) {
            Blockly.serialization.workspaces.load(questions[questionNumber].workspace.queries, workspaceRef.current);
        }
    }, [questionNumber])


    useEffect(() => {
        const updatedQuestion = {
            ...questions[questionNumber],
            workspace: {
                images: images,
                history: {
                    undoRef: undoRef.current,
                    redoRef: redoRef.current,
                },
                queries: workspaceRef.current ? Blockly.serialization.workspaces.save(workspaceRef.current) : {},
            }
        };

        const updatedQuestions = [...questions];
        updatedQuestions[questionNumber] = updatedQuestion;
        setQuestions(updatedQuestions);
        saveWorkspace(updatedQuestions);
    }, [images, somethingChange]);

    const saveWorkspace = (q) => {
        // call api 

        // save to local storage
        console.log("saving", q);
        localStorage.setItem('workspace', JSON.stringify(q));
    }

    // useEffect(() => {
    //     // auto save
    //     const intervalId = setInterval(() => {
    //         saveWorkspace();
    //     }, 60000);
    //     return () => clearInterval(intervalId);
    // }, [questions])

    // useEffect(() => {
    //     // ctrl + s save
    //     const handleKeyDown = (e) => {
    //         if (e.ctrlKey && e.key === 's') {
    //             e.preventDefault();
    //             saveWorkspace();
    //         }
    //     }
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     }
    // }, [questions])


    return (
        <AppContext value={{ questions, setQuestions, questionNumber, setQuestionNumber, images, setImages, undoRef, redoRef, workspaceRef, somethingChange, setSomethingChange }}>
            {children}
        </AppContext>
    )
}

export { AppProvider, AppContext };