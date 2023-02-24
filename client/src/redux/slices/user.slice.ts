import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import fetchInterceptors from "../../utils/fetchInterceptor";

export type UserState = {
    user: { userId: string; userName: string; email: string } | null;
    userLoading: boolean;
}

const initialState: UserState = {
    user: null,
    userLoading: true
}

export const fetchMe = createAsyncThunk("user/fetchMe", async () => {
    const {data} = await fetchInterceptors({
        url: "/users/me",
        baseUrl: `${process.env.REACT_APP_ENDPOINT}`
    });
    return data.result;
});

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logoutAction: (state) => {
            state.user = null;
        },
        setUserAction: (state, action: PayloadAction<{ userId: string; userName: string; email: string; } | null>) => {
            state.user = action.payload;

        }
    },
    extraReducers: (builder) => {
        const actionList = [fetchMe];
        actionList.forEach((action) => {
            builder.addCase(action.pending, (state) => {
                state.userLoading = true;
            });
        });

        builder.addCase(fetchMe.fulfilled, (state, action: PayloadAction<{ userId: string; userName: string; email: string; }>) => {
            state.user = action.payload;
            state.userLoading = false;
        });
    }
});

export const {logoutAction, setUserAction} = userSlice.actions;
export default userSlice.reducer;
