import { User } from "firebase/auth";
import { atom } from "recoil";
import { Post } from "./postsAtom";

export interface userState{
    currentUser?:User;
    myBookmarks:Post[];
}

const defaultUserState:userState={
    myBookmarks:[],
}

export const userState=atom<userState>({
    key:"useState",
    default:defaultUserState,
})