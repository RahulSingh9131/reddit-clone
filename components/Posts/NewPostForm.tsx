import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {IoDocumentText,IoImageOutline} from "react-icons/io5"
import { Post } from '../../atoms/postsAtom';
import { firestore, storage } from '../../firebase/clientApp';
import ImageUpload from './PostForm/ImageUpload';
import TextInputs from './PostForm/TextInputs';
import TabItem from './TabItem';

type NewPostFormProps = {
    user: User;
};

const formTabs:TabItem[]=[
    {
        title:"Post",
        icon:IoDocumentText,
    },
    {
        title:"Image",
        icon:IoImageOutline,
    }
]

export type TabItem={
    title:string;
    icon: typeof Icon.arguments;
}

const NewPostForm:React.FC<NewPostFormProps> = ({user}) => {
    const [selectedTab,setSelectedTab]=useState(formTabs[0].title);
    const [textInputs,setTextInputs]=useState({
        title:"",
        body:"",
    })
    const [selectedFile,setSelectedFile]=useState<string>();
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(false);
    const router=useRouter();

    const handleCreatePost= async ()=>{
        const {clubId}=router.query;
        //create new post object => type Post
        const newPost:Post={
            clubId:clubId as string,
            creatorId: user?.uid,
            creatorDisplayName:user.email!.split("@")[0],
            title:textInputs.title,
            body:textInputs.body,
            numberOfComments:0,
            voteStatus:0,
            createdAt:serverTimestamp() as Timestamp,
        };
        setLoading(true);
        try {
            //store the post in db
            const postDocRef=await addDoc(collection(firestore,"posts"),newPost)
            // check for selectedFile
            if(selectedFile){               
                //store in storage=> getDownloadURL
                const imageRef=ref(storage,`posts/${postDocRef.id}/image`);
                await uploadString(imageRef,selectedFile,"data_url");
                const downloadURL= await getDownloadURL(imageRef);
                
                // update the post doc
                await updateDoc(postDocRef,{
                    imageURL:downloadURL,
                });
            };
             //  redirect the user back to clubPage using the router.
             router.back();
        } catch (error:any) {
            console.log("handleCreatePost error",error.message);
            setError(true)
        }
        setLoading(false);
       
    }

    const onSelectImage=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const reader= new FileReader();
        if(event.target.files?.[0]){
            reader.readAsDataURL(event.target.files[0]);
        }
        reader.onload=(readerEvent)=>{
            if(readerEvent.target?.result){
                setSelectedFile(readerEvent.target.result as string)
            }
        };
    };

    const onTextChange=(event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        const {target:{name,value}}=event;
        setTextInputs((prev)=>({
            ...prev,
            [name]:[value],
        }))
    };

    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex width="100%">
                {formTabs.map((item)=>(
                  <TabItem key={item.title} item={item} selected={item.title===selectedTab} setSelectedTab={setSelectedTab}/>
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab==="Post" && (
                    <TextInputs textInputs={textInputs} onChange={onTextChange} handleCreatePost={handleCreatePost} loading={loading}/>
                )}
                {selectedTab==="Image" && (
                    <ImageUpload selectedFile={selectedFile} onSelectImage={onSelectImage} setSelectedFile={setSelectedFile} setSelectedTab={setSelectedTab}/>
                )}
            </Flex>
            {error && (
                <Alert status="error">
                    <AlertIcon/>
                    <Text mr={2}>error creating post</Text>
                </Alert>
            )}
        </Flex>
    )
}
export default NewPostForm;