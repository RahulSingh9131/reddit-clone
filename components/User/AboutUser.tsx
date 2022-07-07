import { Box, Button, Divider, Flex, Icon, Image, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import { updateDoc, doc} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { FaHome } from 'react-icons/fa';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useRecoilValue } from 'recoil';
import { clubState } from '../../atoms/clubsAtom';
import { auth, firestore, storage } from '../../firebase/clientApp';
import useSelectFile from '../../hooks/useSelectFile';


const AboutUser:React.FC= () => {
    const [user]=useAuthState(auth);
    const mySnippets=useRecoilValue(clubState).mySnippets;
    const selectedFileRef=useRef<HTMLInputElement>(null);
    const {selectedFile,onSelectFile}=useSelectFile();
    const [uploadingImage,setUploadingImage]=useState(false);
    const [value,loading,error]=useDocument(doc(firestore,`users/${user?.uid}`));

    const onUpdateImage=async()=>{
        if(!selectedFile) return;
        setUploadingImage(true);
        try {
            const imageRef=ref(storage,`users/${user?.uid}/image`);
            await uploadString(imageRef,selectedFile,"data_url");
            const downloadURL= await getDownloadURL(imageRef);
            await updateDoc(doc(firestore,`users/${user?.uid}`),{
                photoURL:downloadURL,
            })
        } catch (error) {
            console.log("onUpdateImage error",error);
        }
        setUploadingImage(false);
    };

    
    return (
        <>
            <Box position="sticky" top="14px">
                <Flex justify="space-between" align="center" bg="blue.500" color="white" p={3} borderRadius={5}>
                    <Text fontSize="9pt" fontWeight={700}>About User</Text>
                    <Icon as={HiOutlineDotsHorizontal}/>
                </Flex>
                <Flex direction="column" bg="white" p={3} borderRadius={5}>
                    <Stack>
                        <Flex width="100%" p={2} fontSize="10pt">
                            <Flex direction="column" flexGrow={1}>
                                <Text>{mySnippets.filter((snippet)=>snippet.isModerator).length}</Text>
                                <Text>Created Clubs</Text>
                            </Flex>
                            <Flex direction="column" flexGrow={1}>
                                <Text>{mySnippets.length}</Text>
                                <Text>Joined Clubs</Text>
                            </Flex>
                        </Flex>
                        <Divider/>
                        <Flex align="center" width="100%" fontSize="15pt" fontWeight={600}>
                            <Text>
                                {user?.displayName || user?.email?.split("@")[0]}
                            </Text>
                        </Flex>
                        <Link href="/">
                            <Button mt={3} height="30px" width="100%" _hover={{bg:"red"}}>Create Post</Button>
                        </Link>
                        {user?.uid && (
                            <>
                                <Divider/>
                                <Stack spacing={1} fontSize="10pt">
                                    <Text fontWeight={600}>Admin</Text>
                                    <Flex align="center" justify="space-between">
                                    <Text color="blue.500" cursor="pointer" _hover={{textDecoration:"underline"}} onClick={()=>selectedFileRef.current?.click()}>Change Image</Text>
                                        {user?.photoURL || selectedFile || value?.data()!!.photoURL ? (
                                            <Image src={selectedFile || value?.data()!!.photoURL || user?.photoURL as string} borderRadius="full" alt="profile Image" boxSize="60px"/>
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
        </>
    )
}
export default AboutUser;