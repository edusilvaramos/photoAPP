import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./ImageSlice";

export default configureStore({
    reducer: {
        image: imageReducer,
    },
});
