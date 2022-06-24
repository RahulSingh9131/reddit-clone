import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
    selectedFile?:string;
    onSelectImage:(event:React.ChangeEvent<HTMLInputElement>)=>void;
    setSelectedTab:(value:string)=>void;
    setSelectedFile:(value:string)=>void;
};

const ImageUpload:React.FC<ImageUploadProps> = ({selectedFile,onSelectImage,setSelectedTab,setSelectedFile}) => {
    const selectedFileRef=useRef<HTMLInputElement>(null)
    
    return (
        <Flex justify="center" direction="column" align="center" width="100%">
            {selectedFile?(
                <>
                    <Image src={selectedFile} maxWidth="400px" maxHeight="400px"/>
                    <Stack mt={2} direction="row">
                        <Button height="28px" onClick={()=>setSelectedTab("Post")}>Back to post</Button>
                        <Button height="28px" variant="outline" onClick={()=>setSelectedFile("")}>Remove</Button>
                    </Stack>
                </>
            ):(
                <Flex justify="center" align="center" p={20} width="100%" borderRadius={4}>
                    <Button height="30px" p="0px 20px" onClick={()=>selectedFileRef.current?.click()}>Upload</Button>
                    <input type="file" ref={selectedFileRef} hidden onChange={onSelectImage}/>
                </Flex>
            )}
        </Flex>
    )
}
export default ImageUpload;