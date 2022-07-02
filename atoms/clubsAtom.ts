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
    currentClub?:club,
    snippetsFetched:boolean;
}

const defaultClubState:ClubState={
    mySnippets:[],
    snippetsFetched:false,
}

export const clubState=atom<ClubState>({
    key:"clubState",
    default:defaultClubState,
})