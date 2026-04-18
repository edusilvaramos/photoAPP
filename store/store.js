import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./imageSlice";

export default configureStore({
    reducer: {
        // keep this key stable because selectors read state.image
        image: imageReducer,
    },
});
