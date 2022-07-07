import { Stack, Box, SkeletonCircle, SkeletonText, Flex, Text, Icon } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaUserCircle } from 'react-icons/fa';
import { auth, firestore } from '../../firebase/clientApp';
import { Comment } from '../Posts/Comments/CommentItem';


const UserComments:React.FC= () => {
    const [user]=useAuthState(auth);
    const [loading,setLoading]=useState(false);
    const [comments,setComments]=useState<Comment[]>([]);

    const getUserComments=async()=>{
        setLoading(true);
        try {
            const commentQuery=query(collection(firestore,"comments"),where("creatorId","==",user?.uid));
            const commentDocs= await getDocs(commentQuery);
            const comments=commentDocs.docs.map((doc)=>({id:doc.id,...doc.data()}));
            setComments(comments as Comment[]);
        } catch (error) {
            console.log("getUserComments error",error);
        }
        setLoading(false);
    }

    useEffect(()=>{
        getUserComments();
    },[])
    
    return (
        <Stack spacing={6} p={2} width="100%">
            {loading ? (
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
                                <Flex key={comment.id}>
                                  <Box mr={2}>
                                      <Icon as={FaUserCircle} fontSize={30}/>
                                  </Box>
                                  <Stack spacing={1}>
                                      <Stack direction="row" align="center" fontSize="8pt">
                                          <Text fontWeight={700}>{comment.creatorDisplayName}</Text>
                                          <Text color="gray.600">{moment(new Date(comment.createdAt.seconds*1000)).fromNow()}</Text>
                                      </Stack>
                                      <Text fontSize="10pt">{comment.text}</Text>
                                      <Stack direction="row" align="center" cursor="pointer" color="gray.500">
                                        <Text fontSize="sm">commented by you on {comment.postTitle} in {comment.clubId}</Text>
                                      </Stack>
                                  </Stack>
                                </Flex>
                            ))}
                        </>
                    )}
                </>
            )}
        </Stack>
    )
}
export default UserComments;