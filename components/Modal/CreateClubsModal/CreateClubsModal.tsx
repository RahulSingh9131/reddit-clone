import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Text, Input } from '@chakra-ui/react';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebase/clientApp';
import useDirectory from '../../../hooks/useDirectory';

type CreateClubsModalProps = {
    open:boolean;
    handleClose: () => void;
};

const CreateClubsModal:React.FC<CreateClubsModalProps> = ({open,handleClose}) => {
    const [user]=useAuthState(auth);
    const [clubName,setClubName]=useState("");
    const [charCount,setCharCount]=useState(20);
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);
    const router=useRouter();
    const {toggleMenuOpen}=useDirectory();

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.value.length>20) return;
        setClubName(e.target.value);
        setCharCount(20-e.target.value.length);
    }

    const handleCreateClub= async ()=>{
        if(error) setError("");
        // validate the community
        const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
        if(format.test(clubName) || clubName.length<3){
            setError("club name must be between 3-20, and can only contains letters , numbers");
            return;
        }
        setLoading(true);

        try {         
          const clubDocRef=doc(firestore,"clubs",clubName);
          await runTransaction(firestore, async (transaction)=>{
            const clubDoc= await transaction.get(clubDocRef);
            // check if clubs already exits.
      
            if(clubDoc.exists()){
                throw new Error(`sorry ${clubName} is taken, Please use another name.`)
            };

            //create a Club.  
            transaction.set(clubDocRef,{
            creatorId:user?.uid,
            createdAt:serverTimestamp(),
            numberOfMembers:1,
            });

            // create a clubSnippet
            transaction.set(doc(firestore,`users/${user?.uid}/clubSnippets`,clubName),{
              clubId:clubName,
              isModerator:true,
            })
          })
          handleClose();
          toggleMenuOpen();
          router.push(`r/${clubName}`);
        } catch (error: any) {
            console.log("handleCreateClub error",error)
            setError(error.message);
        }
        setLoading(false);
        setClubName("");
    }

    return (
        <>
          <Modal isOpen={open} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader display="flex" flexDirection="column" padding={3} fontSize={15}>Create a Club</ModalHeader>
              <Box pl={3} pr={3}>
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="column" padding="10px 0px">
                    <Text fontWeight={600} fontSize={15}>
                        Name
                    </Text>
                    <Text fontSize={11} color="gray.500">
                        Enter your club name below.
                    </Text>
                    <Input value={clubName} size="sm" color="gray.400" onChange={handleChange}/>
                    <Text color={charCount===0?"red":"gray.600"} fontSize="9pt">{charCount} Characters remaining</Text>
                    <Text fontSize="9pt" color="red" mt={1}>{error}</Text>
                </ModalBody>
              </Box>
              <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
                <Button variant="outline" height="30px" mr={3} onClick={handleClose}>
                  Close
                </Button>
                <Button variant='solid' height="30px" onClick={handleCreateClub} isLoading={loading}>Create Club</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}
export default CreateClubsModal;