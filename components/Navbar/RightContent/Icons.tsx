import { Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import { BsArrowUpRightCircle, BsChatDots,BsBookmark } from "react-icons/bs";
import {IoNotificationsOutline,IoVideocamOutline} from "react-icons/io5";
import { GrAdd } from "react-icons/gr";
import useDirectory from '../../../hooks/useDirectory';


const Icons:React.FC = () => {
    const {toggleMenuOpen}=useDirectory();
    return (
        <Flex>
            <Flex display={{base:"none",md:"flex"}} align="center" border="1px solid" borderColor="gray.200">
                <Flex mr={1.5} ml={1.5} cursor="pointer" borderRadius={4} _hover={{bg:"gray.200"}}>
                    <Icon as={BsArrowUpRightCircle} fontSize={20}/>
                </Flex>
                <Flex mr={1.5} ml={1.5} cursor="pointer" borderRadius={4} _hover={{bg:"gray.200"}}>
                    <Icon as={IoVideocamOutline} fontSize={22}/>
                </Flex>
                <Flex mr={1.5} ml={1.5} cursor="pointer" borderRadius={4} _hover={{bg:"gray.200"}}>
                    <Icon as={BsChatDots} fontSize={18}/>
                </Flex>
            </Flex>
            <>
                <Flex mr={1.5} ml={1.5} cursor="pointer" borderRadius={4} _hover={{bg:"gray.200"}}>
                    <Icon as={IoNotificationsOutline} fontSize={20}/>
                </Flex>
                <Flex mr={1.5} ml={1.5} cursor="pointer" borderRadius={4} _hover={{bg:"gray.200"}}>
                    <Icon as={BsBookmark} fontSize={20}/>
                </Flex>
                <Flex display={{base:"none",md:"flex"}} mr={1.5} ml={1.5} cursor="pointer" onClick={()=>toggleMenuOpen()} borderRadius={4} _hover={{bg:"gray.200"}}>
                    <Icon as={GrAdd} fontSize={20}/>
                </Flex>
            </>
        </Flex>
    )
}
export default Icons;