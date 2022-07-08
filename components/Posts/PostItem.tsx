import { Alert, AlertIcon, Flex, Icon, Image, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Post } from '../../atoms/postsAtom';
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { FaUser,FaBookmark } from 'react-icons/fa';
import moment from 'moment';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '../../atoms/userAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import { authModalState } from '../../atoms/authModalAtom';

type PostItemProps = {
    post:Post;
    userIsCreator:boolean;
    userVoteValue?:number;
    onVote:(event:React.MouseEvent<SVGElement,MouseEvent>,post:Post,vote:number,clubId:string)=>void;
    onDeletePost:(post:Post)=>Promise<Boolean>;
    onSelectPost?:(post:Post)=>void;
    homePage?:boolean;
    myBookmark?:boolean;
};

const PostItem:React.FC<PostItemProps> = ({post,onDeletePost,onSelectPost,onVote,userIsCreator,userVoteValue,homePage,myBookmark}) => {
    const [loadingImage,setLoadingImage]=useState(true)
    const [user]=useAuthState(auth);
    const setAuthModalState=useSetRecoilState(authModalState);
    const [error,setError]=useState("");
    const [loadingDelete,setLoadingDelete]=useState(false)
    const singlePostPage=!onSelectPost;
    const router=useRouter();
    const [userStateValue,setUserStateValue]=useRecoilState(userState);

    const handleDelete= async (event:React.MouseEvent<HTMLDivElement,MouseEvent>)=>{
        event.stopPropagation();
        setLoadingDelete(true);
        try {
            const success= await onDeletePost(post);
            if(!success){
                throw new Error("Failed to delete Post")
            }
            if(singlePostPage){
                router.push(`/r/${post.clubId}`);
            }
        } catch (error:any) {
            setError(error.message);
        }
        setLoadingDelete(false);
    }

    const addBookmark=(event:React.MouseEvent<SVGElement, MouseEvent>)=>{
        event.stopPropagation();
        if(!user){
            setAuthModalState({open:true,view:"login"});
            return;
        }
        setUserStateValue((prev)=>({
            ...prev,
            myBookmarks:[...prev.myBookmarks,post] as Post[],
        }))
    }

    const removeBookmark=(event:React.MouseEvent<SVGElement, MouseEvent>)=>{
        event.stopPropagation();
        setUserStateValue((prev)=>({
            ...prev,
            myBookmarks:prev.myBookmarks.filter((item)=>item.id!==post.id),
        }))
    }

    return (
        <Flex 
            border="1px solid" 
            bg="white" 
            borderColor={singlePostPage?"white":"gray.400"}
            borderRadius={singlePostPage?"4px 4px 0px 0px":"4px"} 
            _hover={{borderColor:singlePostPage?"none":"gray.500"}} 
            cursor={singlePostPage?"default":"pointer"} 
            onClick={()=>onSelectPost && onSelectPost(post)}
        >
            <Flex direction="column" align="center" bg={singlePostPage?"white":"gray.100"} p={2} width="40px" borderRadius={4}>
                <Icon 
                as={userVoteValue===1?IoArrowUpCircleSharp:IoArrowUpCircleOutline}
                color={userVoteValue===1?"brand.100":"gray.600"}
                fontSize={22}
                onClick={(event)=>onVote(event,post,1,post.clubId)}
                cursor="pointer"
                />
                <Text fontSize="9pt">{post.voteStatus}</Text>
                <Icon 
                as={userVoteValue=== -1?IoArrowDownCircleSharp:IoArrowDownCircleOutline}
                color={userVoteValue=== -1?"#4379ff":"gray.600"}
                fontSize={22}
                onClick={(event)=>onVote(event,post,-1,post.clubId)}
                cursor="pointer"
                />
            </Flex>
            <Flex direction="column" width="100%">
                {error && (
                    <Alert status="error">
                        <AlertIcon/>
                        <Text mr={2}>{error}</Text>
                    </Alert>
                )}
                <Stack spacing={1} p="10px">
                    <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
                        {homePage && (
                            <>
                                {post.clubImageURL ? (
                                    <Image 
                                        src={post.clubImageURL}
                                        borderRadius="full"
                                        boxSize="22px"
                                        mr={2}
                                    />
                                ):(
                                    <Icon as={FaUser} color="blue.500" fontSize="10pt" mr={1}/>
                                )}
                                <Link href={`r/${post.clubId}`}>
                                    <Text fontWeight={600} _hover={{textDecoration:"underline"}} onClick={(event)=>event.stopPropagation()}>
                                        {`r/${post.clubId}`}
                                    </Text>
                                </Link>
                                <Icon as={BsDot} color="gray.500" fontSize={10}/>
                            </>
                        )}
                        <Text fontWeight={400}>
                            Posted by {post.creatorDisplayName}{" "}
                            {moment(new Date(post.createdAt.seconds*1000)).fromNow()}
                        </Text>
                    </Stack>
                    <Text fontSize="12pt" fontWeight={600}>{post.title}</Text>
                    <Text fontSize="10pt" fontWeight={500}>{post.body}</Text>
                    {post.imageURL && (
                        <Flex justify="center" align="center" p={2}>
                            {loadingImage && (
                                <Skeleton height="200px" width="100%" borderRadius={4} />
                            )}
                            <Image src={post.imageURL} maxHeight="460px" alt="Post Image" display={loadingImage?"none":"unset"} onLoad={()=>setLoadingImage(false)}/>
                        </Flex>
                    )}
                </Stack>
                {!myBookmark && (
                    <>
                        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
                            <Flex align="center" p="8px 10px" borderRadius={4} _hover={{bg:"gray.200"}} cursor="pointer">
                                <Icon as={BsChat} mr={2} />
                                <Text fontSize="9pt">{post.numberOfComments}</Text>
                            </Flex>
                            <Flex align="center" p="8px 10px" borderRadius={4} _hover={{bg:"gray.200"}} cursor="pointer" onClick={(event)=>event.stopPropagation()}>
                                <Icon as={IoArrowRedoOutline} mr={2} />
                                <Text fontSize="9pt">Share</Text>
                            </Flex>
                            <Flex align="center" p="8px 10px" borderRadius={4} _hover={{bg:"gray.200"}} cursor="pointer" onClick={(event)=>event.stopPropagation()}>
                                {userStateValue.myBookmarks.some((item)=>item.id===post.id)?(
                                    <Icon as={FaBookmark} mr={2} color="brand.100" onClick={(event)=>removeBookmark(event)}/>
                                ):(
                                <Icon as={IoBookmarkOutline} mr={2}  onClick={(event)=>addBookmark(event)}/>
                                )}
                                <Text fontSize="9pt">Save</Text>
                            </Flex>
                            {userIsCreator && (
                                <Flex align="center" p="8px 10px" borderRadius={4} _hover={{bg:"gray.200"}} cursor="pointer" onClick={handleDelete}>
                                    {loadingDelete ? (
                                        <Spinner size="sm"/>
                                    ):(
                                        <>
                                            <Icon as={AiOutlineDelete} mr={2} />
                                            <Text fontSize="9pt">Delete</Text>
                                        </>
                                    )}
                                </Flex>
                            )}
                        </Flex>
                    </>
                )}  
            </Flex>
        </Flex>
    )
}
export default PostItem;