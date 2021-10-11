export type AppReducerStateType = {
    isInitialize: boolean
}

const initState: AppReducerStateType = {
    isInitialize: false,
}
export type InitializedActionType = ReturnType<typeof initialized>

export type AppReducerActionTypes = InitializedActionType

export const appReducer = (state = initState, action: AppReducerActionTypes) => {
    switch (action.type) {
        case "SET-INITIALIZED___APP-REDUCER":
            return {
                ...state,
                isInitialize: action.value
            }
        default:
            return state
    }
}

export const initialized = (value: boolean) => {
    return {
        type: "SET-INITIALIZED___APP-REDUCER",
        value
    } as const
}