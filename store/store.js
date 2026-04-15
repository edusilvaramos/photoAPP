import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "../components/ImageSlice";

export default configureStore({
    reducer: {
        image: imageReducer,
    },
});
