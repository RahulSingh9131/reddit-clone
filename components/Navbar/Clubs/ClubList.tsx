import { Flex, Icon, MenuItem } from '@chakra-ui/react';
import React, { useState } from 'react';
import {GrAdd} from "react-icons/gr"
import CreateClubsModal from '../../Modal/CreateClubsModal/CreateClubsModal';

type ClubListProps = {
    
};

const ClubList:React.FC<ClubListProps> = () => {
    const [open,setOpen]=useState(false);
    return (
        <>
            <CreateClubsModal open={open} handleClose={()=>setOpen(false)}/>
            <MenuItem width="100%" fontSize="10pt" _hover={{bg:"gray.200"}} onClick={()=>setOpen(true)}>
                <Flex align="center">
                    <Icon as={GrAdd} fontSize={20} mr={2}/>
                    create Clubs
                </Flex>
            </MenuItem>
        </>
    )
}
export default ClubList;