import { Flex, Stack, Text } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import { Post } from '../../atoms/postsAtom';
import { userState } from '../../atoms/userAtom';
import { auth, firestore } from '../../firebase/clientApp';
import usePosts from '../../hooks/usePosts';
import PostItem from '../Posts/PostItem';
import PostLoader from '../Posts/PostLoader';



const UserBookmark:React.FC= () => {
    const [user]=useAuthState(auth);
    const userStateValue=useRecoilValue(userState);
    const [myBookmarks,setMyBookmarks]=useState<Post[]>([]);
    const {postStateValue,onDeletePost,onSelectPost,onVote}=usePosts();
    const [loading,setLoading]=useState(false);

    const getUserBookmarks=async ()=>{
        setLoading(true);
        try {
            const myBookmarks=userStateValue.myBookmarks.map((item)=>item.title);
            const postQuery=query(collection(firestore,"posts"),where("title","in",myBookmarks));
            const postDocs= await getDocs(postQuery);
            const bookmarks=postDocs.docs.map((doc)=>({id:doc.id,...doc.data()}));
            setMyBookmarks(bookmarks as Post[])
        } catch (error) {
            console.log("getUserBookmarks error",error);
        }
        setLoading(false);
    }

    useEffect(()=>{
        getUserBookmarks();
    },[])
    
    return (
        <>
            {loading?(
                <PostLoader/>
            ):(
                <Stack width="100%">
                    {myBookmarks.length===0?(
                        <Flex direction="column" justify="center" align="center" p={20}>
                            <Text fontWeight={700} opacity={0.3}>No Saved Posts Here</Text>
                        </Flex>
                    ):(
                        <>
                            {myBookmarks.map((post)=>(
                                <PostItem 
                                    key={post.id} 
                                    post={post}
                                    onDeletePost={onDeletePost} 
                                    onSelectPost={onSelectPost} 
                                    onVote={onVote}
                                    userIsCreator={user?.uid===post.creatorId}
                                    userVoteValue={postStateValue.postVotes.find((item)=>item.postId===post.id)?.voteValue}
                                    myBookmark
                                />
                            ))}
                        </>
                    )}
                </Stack>
            )}
        </>
    )
}
export default UserBookmark;