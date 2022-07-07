import { Flex, Stack, Text } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Post } from '../../atoms/postsAtom';
import { auth, firestore } from '../../firebase/clientApp';
import useClubData from '../../hooks/useClubData';
import usePosts from '../../hooks/usePosts';
import PostItem from '../Posts/PostItem';
import PostLoader from '../Posts/PostLoader';

const UserPosts:React.FC= () => {
    const [user,userLoading]=useAuthState(auth);
    const {postStateValue,setPostStateValue,onDeletePost,onSelectPost,onVote}=usePosts();
    const {clubStateValue}=useClubData();
    const [loading,setLoading]=useState(false);
    const [message,setMessage]=useState("");

    const getUserPosts=async()=>{
        //fetch userPosts from each community that user has joined.
        setLoading(true);
        try {
            if(clubStateValue.mySnippets.length){
                const myClubIds=clubStateValue.mySnippets.map((snippet)=>snippet.clubId);
                const postQuery=query(collection(firestore,"posts"),where("clubId","in",myClubIds));
                const PostDocs= await getDocs(postQuery);
                const posts= PostDocs.docs.map((doc)=>({id:doc.id,...doc.data()}));
                setPostStateValue((prev)=>({
                    ...prev,
                    posts:posts as Post[],
                }));
            }else{
                setMessage("You have Not made any posts yet..");
            }
        } catch (error) {
            console.log("getUserPosts error",error);
        }
        setLoading(false);
    }
    

    useEffect(()=>{
        if(clubStateValue.snippetsFetched) getUserPosts();
      },[clubStateValue.snippetsFetched])

    return (
        <>
            {loading?(
                <PostLoader/>
            ):(
                <Stack width="100%">
                    {postStateValue.posts.map((post)=>(
                        <PostItem 
                            key={post.id} 
                            post={post}
                            onDeletePost={onDeletePost} 
                            onSelectPost={onSelectPost} 
                            onVote={onVote}
                            userIsCreator={user?.uid===post.creatorId}
                            userVoteValue={postStateValue.postVotes.find((item)=>item.postId===post.id)?.voteValue}
                        />
                    ))}
                </Stack>
            )}
            {postStateValue.posts.length===0 && (
                <Flex justify="center" align="center">
                    <Text fontSize="10pt" color="gray.500" fontWeight={600}>{message}</Text>
                </Flex>
            )}
        </>
    )
}
export default UserPosts;