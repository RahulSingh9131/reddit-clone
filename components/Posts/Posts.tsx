import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { club } from '../../atoms/clubsAtom';
import { Post } from '../../atoms/postsAtom';
import { auth, firestore } from '../../firebase/clientApp';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostsProps = {
    clubData:club;
};

const Posts:React.FC<PostsProps> = ({clubData}) => {
    const [user]=useAuthState(auth);
    const [loading,setLoading]=useState(false);
    const {postStateValue,setPostStateValue,onVote,onDeletePost,onSelectPost}=usePosts();
    const getPosts =async ()=>{
        try {
            setLoading(true);
            // get posts for this club
            const postQuery=query(collection(firestore,"posts"),where("clubId","==",clubData.id),orderBy("createdAt","desc"));
            const postDocs=await getDocs(postQuery);

            //store post in state
            const posts=postDocs.docs.map((doc)=>({id:doc.id,...doc.data()}));
            setPostStateValue((prev)=>({
                ...prev,
                posts:posts as Post[],
            }))
        } catch (error:any) {
            console.log("getPosts error",error.message);
        }
        setLoading(false);
    }

    useEffect(()=>{
        getPosts();
    },[])
    
    return (
        <>
            {loading?(
                <PostLoader/>
            ):(
                <Stack>
                    {postStateValue.posts.map((item)=>(
                        <PostItem 
                            key={item.id}
                            post={item} 
                            userIsCreator={user?.uid===item.creatorId} 
                            onSelectPost={onSelectPost} 
                            onDeletePost={onDeletePost} 
                            onVote={onVote} 
                            userVoteValue={undefined}
                        />
                    ))}
                </Stack>
            )}
        </>
    )
}
export default Posts;