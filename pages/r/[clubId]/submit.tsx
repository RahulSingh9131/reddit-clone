import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import { clubState } from '../../../atoms/clubsAtom';
import About from '../../../components/Club/About';
import PageContent from '../../../components/Layout/PageContent';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { auth } from '../../../firebase/clientApp';
import useClubData from '../../../hooks/useClubData';



const submitPostPage:React.FC= () => {
    const [user]=useAuthState(auth);
    const {clubStateValue}=useClubData();
    return (
        <PageContent>
            <>
                <Box padding="14px 0px" borderBottom="1px solid" borderColor="white">
                    <Text>Create a Post</Text>
                </Box>
                {user && <NewPostForm user={user} clubImageURL={clubStateValue.currentClub?.imageURL}/>}
            </>
            <>
                {clubStateValue.currentClub && <About clubData={clubStateValue.currentClub}/>}
            </>
        </PageContent>
    )
}
export default submitPostPage;