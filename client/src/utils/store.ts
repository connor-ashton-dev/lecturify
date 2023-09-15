import { User } from "@prisma/client";
import { create } from "zustand";

export type LectureState = {
  title: string;
  class: string;
  classId: string;
  changeClassId: (name: string) => void;
  changeTitle: (name: string) => void;
  changeClass: (name: string) => void;
};

export type UserState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useLectureStore = create<LectureState>((set) => ({
  title: "",
  class: "",
  classId: "",
  changeTitle: (name: string) => set(() => ({ title: name })),
  changeClass: (name: string) => set(() => ({ class: name })),
  changeClassId: (name: string) => set(() => ({ classId: name })),
}));

export const userStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: User) => set(() => ({ user: user })),
}));
