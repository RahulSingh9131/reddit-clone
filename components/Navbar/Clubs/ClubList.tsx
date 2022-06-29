import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import {GrAdd} from "react-icons/gr"
import { useRecoilValue } from 'recoil';
import { clubState } from '../../../atoms/clubsAtom';
import CreateClubsModal from '../../Modal/CreateClubsModal/CreateClubsModal';
import MenuListItem from './MenuListItem';

type ClubListProps = {
    
};

const ClubList:React.FC<ClubListProps> = () => {
    const [open,setOpen]=useState(false);
    const mySnippets=useRecoilValue(clubState).mySnippets;

    return (
        <>
            <CreateClubsModal open={open} handleClose={()=>setOpen(false)}/>
            <Box mb={3} ml={3}>
                <Text pl={3} mb={1} color="gray.500" fontSize="10pt" fontWeight={600}>Moderating</Text>
                {mySnippets.filter((snippet)=>snippet.isModerator).map((item)=>(
                    <MenuListItem
                        key={item.clubId}
                        icon={FaHome}
                        iconColor="brand.100"
                        displayText={`/r/${item.clubId}`}
                        link={`/r/${item.clubId}`}
                        imageURL={item.imageURL as string} 
                    />
                ))}
            </Box>
            <Box mb={3} ml={3}>
                <Text pl={3} mb={1} color="gray.500" fontSize="10pt" fontWeight={600}>My clubs</Text>
                <MenuItem width="100%" fontSize="10pt" _hover={{bg:"gray.200"}} onClick={()=>setOpen(true)}>
                    <Flex align="center">
                        <Icon as={GrAdd} fontSize={20} mr={2}/>
                        create Clubs
                    </Flex>
                </MenuItem>
                {mySnippets.map((item)=>(
                    <MenuListItem
                        key={item.clubId}
                        icon={FaHome}
                        iconColor="blue.500"
                        displayText={`/r/${item.clubId}`}
                        link={`/r/${item.clubId}`}
                        imageURL={item.imageURL as string} 
                    />
                ))}
            </Box>
        </>
    )
}
export default ClubList;