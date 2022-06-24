import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface club{
    id:string;
    creatorId:string;
    numberOfMembers:number;
    createdAt?:Timestamp;
    imageURL?:string;
}

export interface ClubSnippet{
    clubId:string;
    isModerator?:boolean;
    imageURL?:boolean | string;
}

interface ClubState{
    mySnippets:ClubSnippet[];
}

const defaultClubState:ClubState={
    mySnippets:[],
}

export const clubState=atom<ClubState>({
    key:"clubState",
    default:defaultClubState,
})