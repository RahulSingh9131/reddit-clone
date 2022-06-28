import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Post } from '../../../../atoms/postsAtom';
import About from '../../../../components/Club/About';
import PageContent from '../../../../components/Layout/PageContent';
import Comments from '../../../../components/Posts/Comments/Comments';
import PostItem from '../../../../components/Posts/PostItem';
import { auth, firestore } from '../../../../firebase/clientApp';
import useClubData from '../../../../hooks/useClubData';
import usePosts from '../../../../hooks/usePosts';


const PostPage:React.FC = () => {
    const [user]=useAuthState(auth);
    const {postStateValue,setPostStateValue,onDeletePost,onVote}=usePosts();
    const router=useRouter();
    const {clubStateValue}=useClubData();

    const fetchPost=async (postId:string)=>{
        try {
            const postDocRef=doc(firestore,"posts",postId);
            const postDoc= await getDoc(postDocRef);
            setPostStateValue((prev)=>({
                ...prev,
                selectedPost:{id:postDoc.id,...postDoc.data()} as Post,
            }));
        } catch (error) {
            console.log("fetchPost error",error)
        }
    };

    useEffect(()=>{
        const {pid}=router.query;
        if(pid && !postStateValue.selectedPost){
            fetchPost(pid as string);
        }
    },[router.query,postStateValue.selectedPost]);
    
    return (
        <PageContent>
            <>
                {postStateValue.selectedPost && (
                    <PostItem 
                        post={postStateValue.selectedPost} 
                        onDeletePost={onDeletePost} 
                        onVote={onVote}  
                        userVoteValue={postStateValue.postVotes.find((item)=>item.postId===postStateValue.selectedPost?.id)?.voteValue}
                        userIsCreator={user?.uid===postStateValue.selectedPost?.creatorId}
                    />
                )}
                <Comments user={user as User} selectedPost={postStateValue.selectedPost} clubId={postStateValue.selectedPost?.clubId as string}/>
            </>
            <>
                {clubStateValue.currentClub && <About clubData={clubStateValue.currentClub}/>}
            </>
        </PageContent>
    )
}
export default PostPage;