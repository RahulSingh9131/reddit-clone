import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { club } from '../../atoms/clubsAtom';
import useClubData from '../../hooks/useClubData';

type HeaderProps = {
    clubData:club;
};

const Header:React.FC<HeaderProps> = ({clubData}) => {
    const {clubStateValue,onJoinOrLeaveClub,loading}=useClubData();
   const isJoined=!!clubStateValue.mySnippets.find((item)=>item.clubId===clubData.id);
    return (
        <Flex direction="column" height="146px" width="100%">
            <Box height="50%" bg="blue.500" />
            <Flex justify="center" bg="white" flexGrow={1}>
                <Flex width="95%" maxWidth="660px">
                    {clubData.imageURL? (
                       <Image/>
                    ):(
                      <Icon 
                        as={FaHome} 
                        fontSize={64} 
                        bg="blue.500" 
                        position="relative" 
                        top={-3} 
                        border="4px solid white" 
                        borderRadius="50%"
                      />
                    )}
                    <Flex padding="10px 16px">
                        <Flex direction="column" mr={6}>
                            <Text fontWeight={800} fontSize="16pt">
                                {clubData.id}
                            </Text>
                            <Text fontWeight={600} fontSize="10pt" color="gray.500">
                                r/{clubData.id}
                            </Text>
                        </Flex>
                        <Button variant={isJoined?"outline":"solid"} height="30px" pr={6} pl={6} isLoading={loading} onClick={()=>onJoinOrLeaveClub(clubData,isJoined)}>
                            {isJoined ? "Joined" :"Join"}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}
export default Header;