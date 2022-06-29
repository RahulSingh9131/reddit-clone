import { Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { defaultMenuItem } from '../../atoms/directoryMenuAtom';
import { auth } from '../../firebase/clientApp';
import useDirectory from '../../hooks/useDirectory';
import Clubs from './Clubs/Clubs';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';


const Navbar:React.FC= () => {
    const [user,loading,error]=useAuthState(auth);
    const {onSelectMenuItem}=useDirectory();
    
    return (
        <Flex bg="white" height="44px" padding="4px 12px" justify={{md:"space-between"}}>
           <Flex align="center" width={{base:"40px", md:"auto"}} mr={{base:"auto",md:2}} cursor="pointer" onClick={()=>onSelectMenuItem(defaultMenuItem)}>
                <Image src="/images/brand-logo.png" height="30px"/>
                <Text display={{base:"none",md:"unset"}}>SocialClub</Text>
           </Flex> 
           {user && <Clubs/>}
           <SearchInput user={user}/>
           <RightContent user={user}/>
        </Flex>
    )
}
export default Navbar;