import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'

const defaultQuestion = {
    questionName: 'default',
    question: 'default',
    images: [],
    searchImages: [],
    nodes: [],
    edges: [],
    undoArray: [],
    redoArray: [],
    undoSearchArray: [],
    redoSearchArray: []
}


export const useStore = create(
    persist((set, get) => ({
        currentQuestionId: "default",
        questions: { default: { ...defaultQuestion } },
        id: 1,
        fetched: false,
        getId: () => {
            set((state) => ({ id: state.id + 1 }));
            return get().id.toString();
        },

        toggleFetched: () => set((state) => ({ fetched: !state.fetched })),

        getCurrentQuestion: () => get().questions[get().currentQuestionId],

        setCurrentQuestion: (id) => set({ currentQuestionId: id }),

        addQuestions: (questions) => {
            set((state) => ({
                questions: {
                    ...state.questions,
                    ...questions
                }
            }))
        },
        setQuestions: (questions) => {
            set((state) => ({
                questions: questions,
            }))
        },
        updateQuestionField: (fields, history = true, id = get().currentQuestionId ) => {
            const currentQuestion = get().getCurrentQuestion();
            const { undoArray, undoSearchArray, images, searchImages } = currentQuestion;

            const historyData = history ? {
                undoArray: [...undoArray, images],
                redoArray: [],
                undoSearchArray: [...undoSearchArray, searchImages],
                redoSearchArray: [],
            } : {};

            set((state) => ({
                questions: {
                    ...state.questions,
                    [id]: {
                        ...state.questions[id],
                        ...historyData,
                        ...fields,
                    }
                }
            }))
        },
        // undo thì lấy update lại
        undo: () => {
            const currentQuestion = get().getCurrentQuestion();
            const undoArray = [...currentQuestion.undoArray];
            if (undoArray.length === 0) return;
            const images = [...currentQuestion.images];
            const searchImages = [...currentQuestion.searchImages];

            const undoSearchArray = [...currentQuestion.undoSearchArray];
            const redoArray = [...currentQuestion.redoArray];
            const redoSearchArray = [...currentQuestion.redoSearchArray];

            const undoTopElement = undoArray.pop()
            const undoSearchTopElement = undoSearchArray.pop()

            const updateQuestionField = get().updateQuestionField;

            updateQuestionField({
                images: undoTopElement,
                searchImages: undoSearchTopElement,
                undoArray: undoArray,
                redoArray: [...redoArray, images],
                undoSearchArray: undoSearchArray,
                redoSearchArray: [...redoSearchArray, searchImages],
            })
        },
        // redo thì update lại
        redo: () => {
            const currentQuestion = get().getCurrentQuestion();
            const redoArray = [...currentQuestion.redoArray];
            if (redoArray.length === 0) return;
            
            const images = [...currentQuestion.images];
            const searchImages = [...currentQuestion.searchImages];

            const undoArray = [...currentQuestion.undoArray];
            const undoSearchArray = [...currentQuestion.undoSearchArray];
            const redoSearchArray = [...currentQuestion.redoSearchArray];
            
            const redoTopElement = redoArray.pop()
            const redoSearchTopElement = redoSearchArray.pop()
            const updateQuestionField = get().updateQuestionField;
            updateQuestionField({
                images: redoTopElement,
                searchImages: redoSearchTopElement,
                undoArray: [...undoArray, images],
                redoArray: [...redoArray],
                undoSearchArray: [...undoSearchArray, searchImages],
                redoSearchArray: [...redoSearchArray]
            })
        }
        // fucking flow // fucking trash this, so bad
        // onNodesChange: (changes) =>
        //     set((state) => ({
        //         questions: {
        //             ...state.questions,
        //             [state.currentQuestionId]: {
        //                 ...state.questions[state.currentQuestionId],
        //                 nodes: applyNodeChanges(changes, state.questions[state.currentQuestionId].nodes)
        //             }
        //         }
        //     })),

        // onEdgesChange: (changes) =>
        //     set((state) => ({
        //         questions: {
        //             ...state.questions,
        //             [state.currentQuestionId]: {
        //                 ...state.questions[state.currentQuestionId],
        //                 edges: applyEdgeChanges(changes, state.questions[state.currentQuestionId].edges)
        //             }
        //         }
        //     })),

        // setNodes: (updater) => {
        //     set((state) => {
        //         const id = state.currentQuestionId;
        //         const prevNodes = state.questions[id].nodes;
        //         const newNodes = typeof updater === 'function' ? updater(prevNodes) : updater;
        //         return {
        //             questions: {
        //                 ...state.questions,
        //                 [id]: {
        //                     ...state.questions[id],
        //                     nodes: newNodes
        //                 }
        //             }
        //         };
        //     });
        // },

        // setEdges: (updater) => {
        //     set((state) => {
        //         const id = state.currentQuestionId;
        //         const prevEdges = state.questions[id].edges;
        //         const newEdges = typeof updater === 'function' ? updater(prevEdges) : updater;
        //         return {
        //             questions: {
        //                 ...state.questions,
        //                 [id]: {
        //                     ...state.questions[id],
        //                     edges: newEdges
        //                 }
        //             }
        //         };
        //     });
        // },

    }), { name: 'appState' })
)
