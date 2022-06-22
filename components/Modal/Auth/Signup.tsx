import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebase/clientApp';
import { User } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';


const Signup:React.FC = () => {
    
    const setAuthModalState=useSetRecoilState(authModalState);
    const [signupForm,setSignupForm]=useState({
        email:"",
        password:"",
        confirmPassword:"",
    })
    const[error,setError]=useState("");

    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
      ] = useCreateUserWithEmailAndPassword(auth);

    //firebase logic will be added below..
    const onSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(error) setError("");
        if(signupForm.password!==signupForm.confirmPassword){
            setError("password does not matched!!");
            return;
        }
        createUserWithEmailAndPassword(signupForm.email,signupForm.password);
    }

    const onChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setSignupForm((prev)=>({
            ...prev,
            [e.target.name]:e.target.value,
        }))
    }

    const createUserDocument=async (user:User)=>{
        const userDocRef=doc(firestore,"users",user?.uid);
        await setDoc(userDocRef,JSON.parse(JSON.stringify(user)));
    };
    console.log(userCred);
    useEffect(()=>{
        if(userCred){
            createUserDocument(userCred.user);
        }
    },[userCred])

    return (
        <form onSubmit={onSubmit}>
            <Input
                required 
                name='email' 
                placeholder='email' 
                type="email"
                value={signupForm.email} 
                onChange={onChange}
                mb={2}
                fontSize="10pt"
                _placeholder={{color:"gray.500"}}
                _hover={{
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                _focus={{
                    outline:"none",
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                bg="gray.50"
            />
            <Input 
                required
                name='password' 
                placeholder='password' 
                type="password" 
                value={signupForm.password}
                onChange={onChange}
                mb={2}
                fontSize="10pt"
                _placeholder={{color:"gray.500"}}
                _hover={{
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                _focus={{
                    outline:"none",
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                bg="gray.50"
            />
            <Input 
                required
                name='confirmPassword' 
                placeholder='confirm password' 
                type="password" 
                value={signupForm.confirmPassword}
                onChange={onChange}
                mb={2}
                fontSize="10pt"
                _placeholder={{color:"gray.500"}}
                _hover={{
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                _focus={{
                    outline:"none",
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                bg="gray.50"
            />
            {error || userError && <Text textAlign="center" color="red" fontSize="10pt">{error || userError.message}</Text>}
            <Button type='submit' width="100%" height="36px" mt={2} mb={2} isLoading={loading}>Sign Up</Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={2}>Already have an account?</Text>
                <Text color="blue.500" fontWeight={700} cursor="pointer" onClick={()=>setAuthModalState((prev)=>({...prev,view:"login"}))}>
                    LOGIN
                </Text>
            </Flex>
        </form>
    )
}
export default Signup;