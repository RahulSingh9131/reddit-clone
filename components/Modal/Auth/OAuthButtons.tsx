import { Button, Flex, Image } from '@chakra-ui/react';
import React from 'react';


const OAuthButtons:React.FC = () => {
    
    return (
        <Flex width="100%" direction="column" mb={4}>
            <Button variant="oauth" mb={2}>
                <Image src='/images/google-logo.png' height="20px" mr={4}/>
                Continue With Google
            </Button>
        </Flex>
    )
}
export default OAuthButtons;