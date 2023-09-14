import { create } from "zustand";

export type BearsState = {
  title: string;
  class: string;
  changeTitle: (name: string) => void;
  changeClass: (name: string) => void;
};

export const useLectureStore = create<BearsState>((set) => ({
  title: "",
  class: "",
  changeTitle: (name: string) => set(() => ({ title: name })),
  changeClass: (name: string) => set(() => ({ class: name })),
}));
