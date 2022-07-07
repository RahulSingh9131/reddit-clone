import { Flex, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsChat } from 'react-icons/bs';
import { IoBookmarkOutline, IoDocumentText } from 'react-icons/io5';
import TabItem from '../Posts/TabItem';
import UserBookmark from './UserBookmark';
import UserComments from './UserComments';
import UserPosts from './UserPosts';

type UserDetailsProps = {
    
};

const formTabs:UserTabItem[]=[
    {
        title:"Posts",
        icon:IoDocumentText,
    },
    {
        title:"Comments",
        icon:BsChat,
    },
    {
        title:"Bookmark",
        icon:IoBookmarkOutline,
    },
]

export type UserTabItem={
    title:string;
    icon: typeof Icon.arguments;
}


const UserDetails:React.FC<UserDetailsProps> = () => {
    const [selectedTab,setSelectedTab]=useState(formTabs[0].title);
    
    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex width="100%">
                {formTabs.map((item)=>(
                  <TabItem key={item.title} item={item} selected={item.title===selectedTab} setSelectedTab={setSelectedTab}/>
                ))}
            </Flex>
            <Flex  p="20px 10px" width="100%" minHeight="300px">
                {selectedTab==="Posts" && <UserPosts/>}
                {selectedTab==="Comments" && <UserComments/>}
                {selectedTab==="Bookmark" && <UserBookmark/>}
            </Flex>
        </Flex>
    )
}
export default UserDetails;