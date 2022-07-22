import { configureStore } from "@reduxjs/toolkit";
import chatsReducer from "../reducers/mychats"

const store=configureStore({
    reducer:{
        chats:chatsReducer
    }
})
export default store