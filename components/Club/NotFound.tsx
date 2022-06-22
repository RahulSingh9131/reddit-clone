import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';



const NotFound:React.FC= () => {
    
    return (
        <Flex direction="column" justifyContent="center" alignItems="center" minHeight="60vh">
            oops!!! this club does not exits..
            <Link href="/">
              <Button mt={4}>Go HOME</Button>
            </Link>
        </Flex>
    )
}
export default NotFound;