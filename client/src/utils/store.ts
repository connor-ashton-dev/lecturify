import { create } from "zustand";

export const useLectureStore = create((set) => ({
  title: "",
  class: "",
  changeTitle: (name: string) => set(() => ({ title: name })),
  changeClass: (name: string) => set(() => ({ class: name })),
}));
