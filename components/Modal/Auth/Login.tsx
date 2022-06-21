import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';


type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const setAuthModalState=useSetRecoilState(authModalState);
    const [inputForm,setInputForm]=useState({
        email:"",
        password:"",
    })

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    //firebase logic will be added below..
    const onSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        signInWithEmailAndPassword(inputForm.email,inputForm.password);
    }

    const onChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setInputForm((prev)=>({
            ...prev,
            [e.target.name]:e.target.value,
        }))
    }

    return (
        <form onSubmit={onSubmit}>
            <Input
                required 
                name='email' 
                placeholder='email' 
                type="email" 
                value={inputForm.email}
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
                value={inputForm.password}
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
            {error && <Text color="red" textAlign="center" fontSize="10pt">{error.message}</Text>}
            <Button type='submit' width="100%" height="36px" mt={2} mb={2} isLoading={loading}>Login</Button>
            <Flex justifyContent="center" mb={2}>
                <Text fontSize="9pt" mr={1}>
                    Forgot Your Password?
                </Text>
                <Text 
                    fontSize="9pt"
                    color="blue.500"
                    cursor="pointer"
                    onClick={()=>{
                        setAuthModalState((prev)=>({
                            ...prev,
                            view:"resetPassword",
                        }))
                    }}
                >
                    Reset
                </Text>
            </Flex>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={2}>New User?</Text>
                <Text color="blue.500" fontWeight={700} cursor="pointer" onClick={()=>setAuthModalState((prev)=>({...prev,view:"signup"}))}>
                    SIGNUP
                </Text>
            </Flex>
        </form>
    )
}
export default Login;