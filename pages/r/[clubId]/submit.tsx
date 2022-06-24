import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageContent from '../../../components/Layout/PageContent';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { auth } from '../../../firebase/clientApp';



const submitPostPage:React.FC= () => {
    const [user]=useAuthState(auth);
    return (
        <PageContent>
            <>
                <Box padding="14px 0px" borderBottom="1px solid" borderColor="white">
                    <Text>Create a Post</Text>
                </Box>
                {user && <NewPostForm user={user}/>}
            </>
            <>
                {/* About */}
            </>
        </PageContent>
    )
}
export default submitPostPage;