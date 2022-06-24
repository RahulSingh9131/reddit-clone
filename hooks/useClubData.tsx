import { collection, doc, getDocs, increment, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtom';
import { club, ClubSnippet, clubState } from '../atoms/clubsAtom';
import { auth, firestore } from '../firebase/clientApp';


const useClubData = () => {
    const [clubStateValue,setClubStateValue]=useRecoilState(clubState);
    const [user]=useAuthState(auth);
    const setAuthModalState=useSetRecoilState(authModalState);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");

    const onJoinOrLeaveClub=(clubData:club,isJoined:boolean)=>{
        //check if user is signed in
        //if not open auth modal
        if(!user){
            setAuthModalState({open:true,view:"login"});
            return;
        }

        setLoading(true);
        if(isJoined){
            leaveClub(clubData.id);
            return;
        }
        joinClub(clubData);
    }

    const getMySnippets=async ()=>{
        setLoading(true);
        try {
            //get users snippets
            const snippetDocs=await getDocs(collection(firestore,`users/${user?.uid}/clubSnippets`));
            const snippets=snippetDocs.docs.map((doc)=>({...doc.data()}));
            setClubStateValue(prev=>({
                ...prev,
                mySnippets:snippets as ClubSnippet[]
            }))
        } catch (error:any) {
            console.log("getMySnippets error",error);
            setError(error.message);
        }
        setLoading(false);
    }

    const joinClub= async (clubData:club)=>{
     //batch write   
     
     try {
         const batch=writeBatch(firestore);
         // creating a new club snippet
         const newSnippet:ClubSnippet={
             clubId:clubData.id,
             imageURL:clubData.imageURL || "",
            };
            batch.set(doc(firestore,`users/${user?.uid}/clubSnippets`,clubData.id),newSnippet);
            
            // updating the numberOfMembers
            batch.update(doc(firestore,"clubs",clubData.id),{
                numberOfMembers: increment(1),
            });

            await batch.commit();
            //update the recoil state ->clubStateValue.mySnippet
            setClubStateValue(prev=>({
                ...prev,
                mySnippets:[...prev.mySnippets,newSnippet],
            }));
        } catch (error:any) {
            console.log("joinClub error",error)
            setError(error.message);
        }
        setLoading(false);
    };

    const leaveClub= async (clubId:string)=>{
     //batch writes   
     try {
            const batch=writeBatch(firestore);
            
            //deleting the club snippet from user
            batch.delete(doc(firestore,`users/${user?.uid}/clubSnippets`,clubId));
            
            //updating the numberOfMembers(-1)
            batch.update(doc(firestore,"clubs",clubId),{
                numberOfMembers:increment(-1),
            });

            await batch.commit();

            //update the recoil state
            setClubStateValue(prev=>({
                ...prev,
                mySnippets:prev.mySnippets.filter((item)=>item.clubId!==clubId),
            }));
        } catch (error:any) {
            console.log("leaveClub error",error);
            setError(error.message);
        }
        setLoading(false);
    };

    useEffect(()=>{
        if(!user) return;
        getMySnippets()
    },[user])

    return {
        clubStateValue,
        onJoinOrLeaveClub,
        loading,
    }
}
export default useClubData;