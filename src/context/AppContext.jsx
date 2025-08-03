import { createContext } from "react";
import { useState } from "react";
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [questionNumber, setQuestionNumber] = useState("");

    return (
        <AppContext value={{ questions, setQuestions, questionNumber, setQuestionNumber }}>
            {children}
        </AppContext>
    )
}

export { AppProvider, AppContext };