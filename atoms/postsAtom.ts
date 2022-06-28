import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post={
    id?:string;
    clubId:string;
    creatorId:string;
    creatorDisplayName:string;
    title:string;
    body:string;
    numberOfComments:number;
    voteStatus:number;
    imageURL?:string;
    clubImageURL?:string;
    createdAt:Timestamp;
}

export type PostVote={
    id:string;
    postId:string;
    clubId:string;
    voteValue:number;
}

interface PostState{
    selectedPost: Post | null;
    posts: Post[];
    postVotes:PostVote[];
}

const defaultPostState:PostState={
    selectedPost:null,
    posts:[],
    postVotes:[],
}

export const postState=atom<PostState>({
    key:"postState",
    default:defaultPostState,
})