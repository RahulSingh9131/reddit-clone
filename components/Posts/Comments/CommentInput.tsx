import { Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import AuthButtons from '../../Navbar/RightContent/AuthButtons';

type CommentInputProps = {
    commentText:string;
    setCommentText:(value:string)=>void;
    user:User;
    createLoading:boolean;
    onCreateComment:(commentText:string)=>void;
};

const CommentInput:React.FC<CommentInputProps> = ({commentText,setCommentText,user,createLoading,onCreateComment}) => {
    
    return (
        <Flex direction="column" position="relative">
            {user ? (
                <>
                    <Text mb={2}>
                        Comment as{" "}
                        <span style={{color:"#182CE"}}>{user.email?.split("@")[0]}</span>
                    </Text>
                    <Textarea 
                        value={commentText}
                        onChange={(event)=>setCommentText(event.target.value)}
                        placeholder="post your comments"
                        fontSize="10pt"
                        borderRadius={4}
                        minHeight="160px"
                        pb={10}
                        _placeholder={{color:"gray.500"}}
                        _focus={{
                            outline:"none",
                            bg:"white",
                            border:"1px solid black",
                        }}
                    />
                    <Flex justify="flex-end" p="6px 8px" bg="gray.100" borderRadius="0px 0px 4px 4px">
                        <Button height="26px" disabled={!commentText.length} isLoading={createLoading} onClick={()=>onCreateComment(commentText)}>
                            Comment
                        </Button>
                    </Flex>
                </>
            ):(
                <Flex align="center" justify="space-between" borderRadius={2} border="1px solid" borderColor="gray.100" p={4}>
                    <Text fontWeight={600}>LogIn or SignUp to leave a comment</Text>
                    <AuthButtons/>
                </Flex>
            )}
        </Flex>
    )
}
export default CommentInput;