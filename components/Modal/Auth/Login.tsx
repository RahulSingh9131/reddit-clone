import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';

type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const setAuthModalState=useSetRecoilState(authModalState);
    const [inputForm,setInputForm]=useState({
        email:"",
        password:"",
    })

    //firebase logic will be added below..
    const onSubmit=()=>{}

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
            <Button type='submit' width="100%" height="36px" mt={2} mb={2} >Login</Button>
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