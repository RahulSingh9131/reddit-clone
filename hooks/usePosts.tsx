import { collection, deleteDoc, doc, getDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtom';
import { clubState } from '../atoms/clubsAtom';
import { Post, postState, PostVote } from '../atoms/postsAtom';
import { auth, firestore, storage } from '../firebase/clientApp';


const usePosts= () => {
    const [user]=useAuthState(auth);
    const [postStateValue,setPostStateValue]=useRecoilState(postState);
    const currentClub=useRecoilValue(clubState).currentClub;
    const setAuthModalState=useSetRecoilState(authModalState);
    const router=useRouter();

    const onVote= async (event:React.MouseEvent<SVGElement,MouseEvent>,post:Post,vote:number,clubId:string)=>{
        event.stopPropagation();
        // if user is not signed in -> open auth Modal
        if(!user){
            setAuthModalState({open:true,view:"login"});
            return;
        }
        try {
            const {voteStatus}=post;
            const existingVote=postStateValue.postVotes.find(vote=>vote.postId===post.id);

            const batch=writeBatch(firestore);
            const updatedPost={...post};
            const updatedPosts=[...postStateValue.posts];
            let updatedPostVotes=[...postStateValue.postVotes];
            let voteChange=vote;

            //if user is voting for the first time on the post
            if(!existingVote){
                //create a new postVote document.
                const postVoteRef=doc(collection(firestore,"users",`${user?.uid}/postVotes`));

                const newVote:PostVote={
                    id:postVoteRef.id,
                    postId:post.id!,
                    clubId,
                    voteValue:vote,
                }
                batch.set(postVoteRef,newVote);

                //update the state value.
                updatedPost.voteStatus=voteStatus+vote;
                updatedPostVotes=[...updatedPostVotes,newVote];
    
            }
            //if user have voted on the post before
            else{
                const postVoteRef=doc(firestore,"users",`${user?.uid}/postVotes/${existingVote.id}`);

                //removing their vote (up-> neutral || down->neutral)
                if(existingVote.voteValue===vote){
                    updatedPost.voteStatus=voteStatus-vote;
                    updatedPostVotes=updatedPostVotes.filter((vote)=>vote.id!==existingVote.id);

                    //delete the postState document here.
                    batch.delete(postVoteRef);

                    voteChange *=-1;
                }
                //flipping their vote(up->down || down->up)
                else{
                    updatedPost.voteStatus=voteStatus +2*vote;
                    const voteIndex=postStateValue.postVotes.findIndex((vote)=>vote.id===existingVote.id);
                    updatedPostVotes[voteIndex]={
                        ...existingVote,
                        voteValue:vote,
                    };

                    //updating the existing postVote document.
                    batch.update(postVoteRef,{
                        voteValue:vote,
                    })
                    voteChange=2*vote;
                }
            }

            //now update state with updated state values.
            const postIndex=postStateValue.posts.findIndex((item)=>item.id===post.id);
            updatedPosts[postIndex]=updatedPost;
            setPostStateValue((prev)=>({
                ...prev,
                posts:updatedPosts,
                postVotes:updatedPostVotes,
            }));

            if(postStateValue.selectedPost){
                setPostStateValue((prev)=>({
                    ...prev,
                    selectedPost:updatedPost,
                }))
            }

            // now update our post document.
            const postRef=doc(firestore,"posts",post.id!);
            batch.update(postRef,{voteStatus:voteStatus+voteChange});

            await batch.commit()
        } catch (error) {
            console.log("onVote Error",error);
        }

    };

    const onSelectPost=(post:Post)=>{
        setPostStateValue((prev)=>({
            ...prev,
            selectedPost:post,
        }))
        router.push(`/r/${post.clubId}/comments/${post.id}`);
    };

    const onDeletePost= async (post:Post):Promise<Boolean>=>{
       try {
        //check if image exits.=> delete image
        if(post.imageURL){
            const imageRef=ref(storage,`posts/${post.id}/image`);
            await deleteObject(imageRef);
        }
        //delete post document from firestore
        const postDocRef=doc(firestore,"posts",post.id!);
        await deleteDoc(postDocRef);
        //upadate the post recoil state
        setPostStateValue((prev)=>({
            ...prev,
            posts:prev.posts.filter(item=>item.id!==post.id)
        }));
        return true;
       } catch (error) {
        return false;
       }

    };

    const getClubPostVotes= async (clubId:string)=>{
        const postVotesQuery=query(collection(firestore,"users",`${user?.uid}/postVotes`),where("clubId","==",clubId));
        const postVotesDocs= await getDocs(postVotesQuery);
        const postVotes=postVotesDocs.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
        }));

        setPostStateValue((prev)=>({
            ...prev,
            postVotes:postVotes as PostVote[],
        }))
    }

    useEffect(()=>{
        if(!user || !currentClub?.id) return;
        getClubPostVotes(currentClub?.id);
    },[user,currentClub]);

    useEffect(()=>{
        if(!user){
            setPostStateValue((prev)=>({
                ...prev,
                postVotes:[],
            }))
        }
    },[user])

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    } 
}
export default usePosts;