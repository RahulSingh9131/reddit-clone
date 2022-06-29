import React from 'react';
import { Menu, MenuButton, Button, MenuList, MenuItem, Icon, Flex, Text, Image } from '@chakra-ui/react';
import {AiFillHome} from "react-icons/ai"
import { ChevronDownIcon } from '@chakra-ui/icons';
import ClubList from './ClubList';
import useDirectory from '../../../hooks/useDirectory';



const Clubs:React.FC = () => {
    const {directoryState,toggleMenuOpen}=useDirectory();
    
    return (
        <Menu isOpen={directoryState.isOpen}>
            <MenuButton cursor="pointer" padding="0px 6px" border="1px solid" borderColor="gray.200" ml={2} onClick={toggleMenuOpen}>
                <Flex align="center">
                    <Flex align="center">
                        {directoryState.selectedMenuItem.imageURL?(
                            <Image src={directoryState.selectedMenuItem.imageURL} borderRadius="full" boxSize="24px" mr={2}/>
                        ):(
                            <Icon 
                                as={directoryState.selectedMenuItem.icon} 
                                fontSize={22} 
                                mr={{base: 1}} 
                                ml={{base: 1}}
                                color={directoryState.selectedMenuItem.iconColor}
                            />
                        )}
                        <Flex display={{base:"none",lg:"flex"}}>
                          <Text fontSize="10pt" fontWeight={600}>
                            {directoryState.selectedMenuItem.displayText}
                          </Text>
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