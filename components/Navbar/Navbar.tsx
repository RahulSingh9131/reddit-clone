import { Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';


const Navbar:React.FC= () => {
    
    return (
        <Flex bg="white" height="44px" padding="4px 12px">
           <Flex align="center">
                <Image src="/images/brand-logo.png" height="30px"/>
                <Text display={{base:"none",md:"unset"}}>SocialClub</Text>
           </Flex> 
           <SearchInput/>
           <RightContent/>
        </Flex>
    )
}
export default Navbar;