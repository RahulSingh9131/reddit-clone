import React from 'react';
import { Menu, MenuButton, Button, MenuList, MenuItem, Icon, Flex, Text } from '@chakra-ui/react';
import {FaUserCircle,FaUserSlash} from "react-icons/fa"
import {MdOutlineLogin} from "react-icons/md"
import { signOut, User } from 'firebase/auth';
import { auth } from '../../../firebase/clientApp';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { clubState } from '../../../atoms/clubsAtom';

type UserMenuProps = {
    user?:User | null;
};

const UserMenu:React.FC<UserMenuProps> = ({user}) => {
    const resetClubState=useResetRecoilState(clubState);
    const setAuthModalState=useSetRecoilState(authModalState);

    const logout= async ()=>{
        await signOut(auth);
        resetClubState();
    }

    return (
        <Menu>
            <MenuButton >
                <Flex align="center">
                    {user ? (
                        <>
                            <Icon as={FaUserCircle} fontSize={24} mr={1} color="gray.300" />
                            <Flex direction="column" display={{base:"none",lg:"flex"}} fontSize="10pt" align="flex-start" mr={8}>
                                <Text>
                                    {user?.displayName || user.email?.split("@")[0]}
                                </Text>
                            </Flex>
                        </>
                    ):(
                        <Icon as={FaUserSlash} fontSize={24} mr={1} color="gray.300" />
                    )}
                </Flex>
            </MenuButton>
            <MenuList>
                {user?(
                    <>
                        <MenuItem fontSize="10pt" fontWeight={700} _hover={{bg:"blue.200"}}>
                            <Flex align="center">
                                <Icon as={FaUserCircle} mr={2} fontSize={20}/>
                                Profile
                            </Flex>
                        </MenuItem>
                        <MenuItem fontSize="10pt" fontWeight={700} _hover={{bg:"blue.200"}} onClick={logout}>
                            <Flex align="center">
                                <Icon as={MdOutlineLogin} mr={2} fontSize={20}/>
                                Logout
                            </Flex>
                        </MenuItem>
                    </>
                ):(
                    <>
                        <MenuItem fontSize="10pt" fontWeight={700} _hover={{bg:"blue.200"}} onClick={()=>setAuthModalState({open:true,view:"login"})}>
                            <Flex align="center">
                                <Icon as={MdOutlineLogin} mr={2} fontSize={20}/>
                                Login/Logout
                            </Flex>
                        </MenuItem>
                    </>
                )}
            </MenuList>
        </Menu>
    )
} 
export default UserMenu;