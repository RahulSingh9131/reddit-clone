import React from 'react';
import { Menu, MenuButton, Button, MenuList, MenuItem, Icon, Flex, Text } from '@chakra-ui/react';
import {AiFillHome} from "react-icons/ai"
import { ChevronDownIcon } from '@chakra-ui/icons';
import ClubList from './ClubList';



const Clubs:React.FC = () => {
    
    return (
        <Menu>
            <MenuButton cursor="pointer" padding="0px 6px" border="1px solid" borderColor="gray.200" ml={2}>
                <Flex align="center">
                    <Flex align="center">
                        <Icon as={AiFillHome} fontSize={22} mr={{base: 1}} ml={{base: 1}}/>
                        <Flex display={{base:"none",lg:"flex"}}>
                          <Text fontSize="10pt" fontWeight={600}>Home</Text>
                        </Flex>
                    </Flex>
                    <Icon as={ChevronDownIcon}/>
                </Flex>
            </MenuButton>
            <MenuList>
                <ClubList/>
            </MenuList>
        </Menu>
    )
}
export default Clubs;