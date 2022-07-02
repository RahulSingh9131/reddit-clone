import React from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { User } from 'firebase/auth';

type SearchInputProps = {
    user?:User | null;
};

const SearchInput:React.FC<SearchInputProps> = ({user}) => {
    
    return (
        <Flex flexGrow={1} mr={2} ml={2} maxWidth={user ? "auto" : "600px"} align="center">
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.300' mb={1} />
                </InputLeftElement>
                <Input 
                    type='tel' 
                    placeholder='Searh posts' 
                    _placeholder={{color:"gray.500"}} 
                    _hover={{bg:"white",border:"1px solid",borderColor:"blue.500"}}
                    _focus={{outline:"none",border:"1px solid",borderColor:"blue.500"}}
                    height="34px"
                    bg="gray.50"
                />
            </InputGroup>
        </Flex>
    )
}
export default SearchInput;