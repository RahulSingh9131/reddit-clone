import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DirectoryMenuItem, directoryMenuState } from '../atoms/directoryMenuAtom';
import { clubState } from '../atoms/clubsAtom';
import { FaHome } from 'react-icons/fa';

const useDirectory= () => {
    const [directoryState,setDirectoryState]=useRecoilState(directoryMenuState);
    const clubStateValue=useRecoilValue(clubState);
    const router=useRouter();

    const onSelectMenuItem=(menuItem:DirectoryMenuItem)=>{
        setDirectoryState((prev)=>({
            ...prev,
            selectedMenuItem:menuItem,
        }));
        router.push(menuItem.link);
        if(directoryState.isOpen){
            toggleMenuOpen();
        }
    }

    const toggleMenuOpen=()=>{
        setDirectoryState((prev)=>({
            ...prev,
            isOpen:!directoryState.isOpen,
        }))
    }

    useEffect(()=>{
        const {currentClub}=clubStateValue;
        if(currentClub){
            setDirectoryState((prev)=>({
                ...prev,
                selectedMenuItem:{
                    displayText:`r/${currentClub.id}`,
                    link:`/r/${currentClub.id}`,
                    icon:FaHome,
                    iconColor:"blue.500",
                    imageURL:currentClub.imageURL,
                }
            }))
        }
    },[clubStateValue.currentClub])

    return {
        directoryState,
        setDirectoryState,
        toggleMenuOpen,
        onSelectMenuItem,
    }
}
export default useDirectory;