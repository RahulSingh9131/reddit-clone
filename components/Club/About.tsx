import { Box, Button, Divider, Flex, Icon, Image, Stack, Text,Spinner } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import {HiOutlineDotsHorizontal} from "react-icons/hi"
import {BiCake} from "react-icons/bi"
import { FaHome } from 'react-icons/fa';
import { club, clubState } from '../../atoms/clubsAtom';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '../../firebase/clientApp';
import useSelectFile from '../../hooks/useSelectFile';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';

type AboutProps = {
    clubData: club;
};

const About:React.FC<AboutProps> = ({clubData}) => {
    const router=useRouter();
    const [user]=useAuthState(auth);
    const selectedFileRef=useRef<HTMLInputElement>(null);
    const {selectedFile,setSelectedFile,onSelectFile}=useSelectFile();
    const [uploadingImage,setUploadingImage]=useState(false);
    const setClubStateValue=useSetRecoilState(clubState);

    const onUpdateImage=async()=>{
        if(!selectedFile) return;
        setUploadingImage(true);
        try {
            const imageRef=ref(storage,`clubs/${clubData.id}/image`);
            await uploadString(imageRef,selectedFile,"data_url");
            const downloadURL= await getDownloadURL(imageRef);
            await updateDoc(doc(firestore,"clubs",clubData.id),{
                imageURL:downloadURL,
            })

            setClubStateValue((prev)=>({
                ...prev,
                currentClub:{
                    ...prev.currentClub,
                    imageURL:downloadURL,
                } as club
            }))

        } catch (error) {
            console.log("onUpdateImage errro",error);
        }
        setUploadingImage(false);
    };

    return (
        <Box position="sticky" top="14px">
            <Flex justify="space-between" align="center" bg="blue.500" color="white" p={3} borderRadius={5}>
                <Text fontSize="9pt" fontWeight={700}>About Club</Text>
                <Icon as={HiOutlineDotsHorizontal}/>
            </Flex>
            <Flex direction="column" bg="white" p={3} borderRadius={5}>
                <Stack>
                    <Flex width="100%" p={2} fontSize="10pt">
                        <Flex direction="column" flexGrow={1}>
                            <Text>{clubData.numberOfMembers.toLocaleString()}</Text>
                            <Text>Members</Text>
                        </Flex>
                        <Flex direction="column" flexGrow={1}>
                            <Text>1</Text>
                            <Text>Online</Text>
                        </Flex>
                    </Flex>
                    <Divider/>
                    <Flex align="center" width="100%" fontSize="10pt" fontWeight={600}>
                        <Icon as={BiCake} fontSize={18} mr={2}/>
                        {clubData.createdAt && (
                        <Text>created on {moment(new Date(clubData.createdAt.seconds*1000)).format("DD/MM/YYYY")}</Text>
                        )}
                    </Flex>
                    <Link href={`/r/${router.query.clubId}/submit`}>
                        <Button mt={3} height="30px">Create Post</Button>
                    </Link>
                    {user?.uid===clubData.creatorId && (
                        <>
                            <Divider/>
                            <Stack spacing={1} fontSize="10pt">
                                <Text fontWeight={600}>Admin</Text>
                                <Flex align="center" justify="space-between">
                                    <Text color="blue.500" cursor="pointer" _hover={{textDecoration:"underline"}} onClick={()=>selectedFileRef.current?.click()}>Change Image</Text>
                                    {clubData.imageURL || selectedFile ? (
                                        <Image src={selectedFile || clubData.imageURL} borderRadius="full" alt="club Image" boxSize="40px"/>
                                    ):(
                                        <Icon 
                                            as={FaHome} 
                                            fontSize={64} 
                                            bg="blue.500"
                                            color="gray.100"
                                            border="4px solid white" 
                                            p={3}
                                            borderRadius="50%"
                                        />
                                    )}
                                </Flex>
                                {selectedFile && (
                                    (uploadingImage ? (
                                        <Spinner/>
                                    ):(
                                        <Text cursor="pointer" onClick={onUpdateImage}>Save Changes</Text>
                                    ))
                                )}
                                <input type="file" hidden ref={selectedFileRef} onChange={onSelectFile}/>
                            </Stack>
                        </>
                    )}
                </Stack>
            </Flex>
        </Box>
    )
}
export default About;