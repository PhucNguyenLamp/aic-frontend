import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'

const defaultQuestion = {
    question: 'default',
    images: [],
    nodes: [],
    edges: [],
    undoArray: [],
    redoArray: []
}


export const useStore = create(
    persist((set, get) => ({
        currentQuestionId: "default",
        questions: { default: { ...defaultQuestion } },
 // { [id]: {
        //  question,
        //  images,
        //  nodes,
        //  edges,
        //  undoArray,
        //  redoArray } }
        id: 1,
        getId: () => {
            set((state) => ({ id: state.id + 1 }));
            return get().id.toString();
        },

        getCurrentQuestion: () => get().questions[get().currentQuestionId],

        setCurrentQuestion: (id) => set({ currentQuestionId: id }),

        updateQuestionField: (field, value, id = get().currentQuestionId) =>
            set((state) => ({
                questions: {
                    ...state.questions,
                    [id]: { ...state.questions[id], [field]: value }
                }
            })),

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
