import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';

type SignupProps = {
    
};

const Signup:React.FC<SignupProps> = () => {
    
    const setAuthModalState=useSetRecoilState(authModalState);
    const [signupForm,setSignupForm]=useState({
        email:"",
        password:"",
        confirmPassword:"",
    })

    //firebase logic will be added below..
    const onSubmit=()=>{}

    const onChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setSignupForm((prev)=>({
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
            <Button type='submit' width="100%" height="36px" mt={2} mb={2} >Sign Up</Button>
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