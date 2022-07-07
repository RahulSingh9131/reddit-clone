import { Box, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import PageContent from '../components/Layout/PageContent';
import AboutUser from '../components/User/AboutUser';
import UserDetails from '../components/User/UserDetails';


const Profile:NextPage = () => {
    
    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/images/brand-logo.png" />
            </Head>
            <PageContent>
                <>
                    <Box padding="14px 0px" borderBottom="1px solid" borderColor="white">
                        <Text>My Profile</Text>
                    </Box>
                    <UserDetails/>
                </>
                <>
                  <AboutUser/>
                </>
            </PageContent>
        </>
    )
}
export default Profile;