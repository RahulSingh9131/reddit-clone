import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { collection, doc, getDocs, increment, orderBy, query, serverTimestamp, Timestamp, where, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { Post, postState } from '../../../atoms/postsAtom';
import { firestore } from '../../../firebase/clientApp';
import CommentInput from './CommentInput';
import CommentItem, { Comment } from './CommentItem';

type CommentsProps = {
    user:User;
    selectedPost:Post | null;
    clubId:string;
};


const Comments:React.FC<CommentsProps> = ({user,selectedPost,clubId}) => {
    const [commentText,setCommentText]=useState("");
    const [comments,setComments]=useState<Comment[]>([]);
    const [fetchLoading,setFetchLoading]=useState(true);
    const [createLoading,setCreateLoading]=useState(false);
    const [loadingDeleteId,setLoadingDeleteId]=useState("");
    const setPostState=useSetRecoilState(postState);

    const onCreateComment= async ()=>{
        setCreateLoading(true);
        try {
            const batch=writeBatch(firestore);
            
            //create a comment document
            const commentDocRef=doc(collection(firestore,"comments"));

            const newComment:Comment={
                id:commentDocRef.id,
                creatorId:user.uid,
                creatorDisplayName:user.email!.split("@")[0],
                clubId,
                postId:selectedPost?.id!,
                postTitle:selectedPost?.title!,
                text:commentText,
                createdAt:serverTimestamp() as Timestamp,
            }

            batch.set(commentDocRef,newComment);

            newComment.createdAt={seconds:Date.now()/1000} as Timestamp;

            //update numberOnComments in post
            const postDocRef=doc(firestore,"posts",selectedPost?.id as string)
            batch.update(postDocRef,{
                numberOfComments: increment(1),
            });
            await batch.commit();    

           //update state on client side
            setCommentText("");
            setComments((prev)=>[newComment,...prev]);
            setPostState((prev)=>({
                ...prev,
                selectedPost:{
                    ...prev.selectedPost,
                    numberOfComments:prev.selectedPost?.numberOfComments!+1,
                } as Post,
            }));
        } catch (error) {
            console.log("onCreateComment error",error);
        }

        setCreateLoading(false);
    };

    const onDeleteComment= async (comment:Comment)=>{
        setLoadingDeleteId(comment.id);
        try {
            const batch=writeBatch(firestore);
            
            // delete a comment document
            const commentDocRef=doc(firestore,"comments",comment.id);
            batch.delete(commentDocRef);

            //update numberOfComments on a post
            const postDocRef=doc(firestore,"posts",selectedPost?.id!);
            batch.update(postDocRef,{
                numberOfComments: increment(-1),
            })

            await batch.commit();

            //update the post state
            setPostState((prev)=>({
                ...prev,
                selectedPost:{
                    ...prev.selectedPost,
                    numberOfComments:prev.selectedPost?.numberOfComments!-1,
                } as Post
            }));
            // update the comments state
            setComments((prev)=>prev.filter((item)=>item.id!==comment.id));
        } catch (error) {
            console.log("onDeleteComments",error);
        }
        setLoadingDeleteId("");
    };

    const getPostComments= async ()=>{
        try {
            const commentsQuery=query(collection(firestore,"comments")
            ,where("postId","==",selectedPost?.id),
            orderBy("createdAt","desc"));
            const commentDoc= await getDocs(commentsQuery);
            const comments= commentDoc.docs.map((doc)=>({id:doc.id,...doc.data()}));
            setComments(comments as Comment[]);
        } catch (error) {
            console.log("getPostComments error",error);
        }
        setFetchLoading(false);
    };

    useEffect(()=>{
        if(!selectedPost) return;
        getPostComments();
    },[selectedPost]);

    return (
        <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
            <Flex direction="column" pl={2} pr={2} mb={6} width="100%" fontSize="10pt">
                <CommentInput 
                    commentText={commentText} 
                    setCommentText={setCommentText} 
                    createLoading={createLoading}
                    user={user}
                    onCreateComment={onCreateComment}
                />
            </Flex>
            <Stack spacing={6} p={2}>
                {fetchLoading ? (
                    <>
                        {[0,1,2].map((item)=>(
                            <Box key={item} padding="6" bg="white">
                                <SkeletonCircle size="10"/>
                                <SkeletonText mt="4" noOfLines={2} spacing="4"/>
                            </Box>
                        ))}
                    </>
                ):(
                    <>
                        {comments.length===0?(
                            <Flex direction="column" justify="center" align="center" borderTop="1px solid" borderColor="gray.100" p={20}>
                                <Text fontWeight={700} opacity={0.3}>No comments here</Text>
                            </Flex>
                        ):(
                            <>
                                {comments.map((comment)=>(
                                    <CommentItem 
                                        key={comment.id}
                                        comment={comment} 
                                        onDeleteComment={onDeleteComment} 
                                        loadingDelete={loadingDeleteId===comment.id} 
                                        userId={user.uid}
                                    />
                                ))}
                            </>
                        )}
                    </>
                )}
            </Stack>
        </Box>
    )
}
export default Comments;