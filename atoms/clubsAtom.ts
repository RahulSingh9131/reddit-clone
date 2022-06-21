import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface club{
    id:string;
    creatorId:string;
    numberOfMembers:number;
    createdAt?:Timestamp;
    imageURL?:string;
}

