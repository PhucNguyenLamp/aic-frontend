import { createContext, useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import * as Blockly from "blockly";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [questionNumber, setQuestionNumber] = useState("");
    const [images, setImages] = useState([]);
    const undoRef = useRef([]);
    const redoRef = useRef([]);
    const workspaceRef = useRef(null);
    const questionsRef = useRef(questions);

    useEffect(() => {
        const savedQuestions = localStorage.getItem('workspace');
        console.log(savedQuestions)
        if (savedQuestions) {
            setQuestions(JSON.parse(savedQuestions));
        }
    }, [])

    useEffect(() => {
        console.log(questions)
        if (questions.length > 0) {
            if (questionNumber === "") {
                setQuestionNumber(0);
            } else {
                setImages(questions[questionNumber].workspace.images)
                undoRef.current = questions[questionNumber].workspace.history.undoRef;
                redoRef.current = questions[questionNumber].workspace.history.redoRef;
                if (workspaceRef.current && questions[questionNumber].workspace.queries) {
                    Blockly.serialization.workspaces.load(questions[questionNumber].workspace.queries, workspaceRef.current);
                }
            }
        }
    }, [questionNumber, questions])

    const saveWorkspace = useCallback((workspace) => {
        console.log("Saving workspace...");
        // call api 

        // save to local storage
        console.log(questions)
        localStorage.setItem('workspace', JSON.stringify(workspace));
    }, []);

    useEffect(() => {
        // auto save
        const intervalId = setInterval(() => {
            saveWorkspace(questionsRef.current);
            console.log("Workspace auto-saved.");
        }, 60000);
        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        // ctrl + s save
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveWorkspace(questionsRef.current);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    useEffect(() => {
        questionsRef.current = questions;
    }, [questions]);

    return (
        <AppContext value={{ questions, setQuestions, questionNumber, setQuestionNumber, images, setImages, undoRef, redoRef, workspaceRef }}>
            {children}
        </AppContext>
    )
}

export { AppProvider, AppContext };