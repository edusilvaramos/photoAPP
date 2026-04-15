import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [], // { uri, folderId }
  folders: [], // { id, name, createdAt }
};

// islice est compose de 3 coisas: name, reducers, inicalState
const imageSlice = createSlice({
  initialState,
  name: "image",
  reducers: {
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    removeFolder: (state, action) => {
      state.folders = state.folders.filter((folder) => folder.id !== action.payload);
    },
    assignImageToFolder: (state, action) => {
      const { uri, folderId } = action.payload;
      const existing = state.images.find((image) => image.uri === uri);
      if (existing) {
        existing.folderId = folderId;
      } else {
        state.images.push({ uri, folderId });
      }
    },
    removeImageFromFolder: (state, action) => {
      const { uri } = action.payload;
      const existing = state.images.find((image) => image.uri === uri);
      if (existing) {
        existing.folderId = null;
      }
    },
  },
});

// o que pode modificar os estados, cration automatica das atioes correspondentes.
export const {
  setImages,
  setFolders,
  addFolder,
  removeFolder,
  assignImageToFolder,
  removeImageFromFolder,
} = imageSlice.actions;

//  permete a selection dos slices dans estado global

export const selectImages = (state) => state.image.images;
export const selectFolders = (state) => state.image.folders;

// cria automaticamente as açoes correspondentes.
export default imageSlice.reducer;
