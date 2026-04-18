import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // each item maps one image uri to one folder id
  images: [],
  // user folders
  folders: [],
};


const imageSlice = createSlice({
  initialState,
  name: "image",
  reducers: {
    // loads the saved image list from storage back into redux when the app opens
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
    // assign one image uri to a folder or update its current folder
    assignImageToFolder: (state, action) => {
      const { uri, folderId } = action.payload;
      // update existing mapping when the uri is already in state
      const existing = state.images.find((image) => image.uri === uri);
      if (existing) {
        existing.folderId = folderId;
      } else {
        // create a new mapping when the uri is seen for the first time
        state.images.push({ uri, folderId });
      }
    },
    // unassign one image by clearing its folder id
    removeImageFromFolder: (state, action) => {
      const { uri } = action.payload;
      const existing = state.images.find((image) => image.uri === uri);
      if (existing) {
        existing.folderId = null;
      }
    },
  },
});

// export reducer actions for components and screens(important)
export const {
  setImages,
  setFolders,
  assignImageToFolder,
  removeImageFromFolder,
} = imageSlice.actions;

// selectors read this slice from the global redux state
export const selectImages = (state) => state.image.images;
export const selectFolders = (state) => state.image.folders;

// export slice reducer to register in the store
export default imageSlice.reducer;
