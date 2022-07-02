import { Box, Button, Flex, Icon, Image, Skeleton, SkeletonCircle, Stack, Text } from '@chakra-ui/react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { club } from '../../atoms/clubsAtom';
import { firestore } from '../../firebase/clientApp';
import useClubData from '../../hooks/useClubData';

const Recommendations:React.FC = () => {
    const [clubs,setClubs]=useState<club[]>([]);
    const [loading,setLoading]=useState(false);
    const {clubStateValue,onJoinOrLeaveClub}=useClubData();
    const getClubRecommendation=async()=>{
        setLoading(true);
        try {
            const clubQuery=query(collection(firestore,"clubs"),orderBy("numberOfMembers","desc"),limit(5));
            const clubDoc=await getDocs(clubQuery);
            const clubs= clubDoc.docs.map((doc)=>({id:doc.id,...doc.data()}))
            setClubs(clubs as club[]);
        } catch (error) {
            console.log("getClubRecommendation error",error);
        }
        setLoading(false);
    }

    useEffect(()=>{
        getClubRecommendation();
    },[])

    return (
        <Flex direction="column" bg="white" border="1px solid" borderRadius={7} borderColor="gray.200">
            <Flex 
                align="flex-end"
                color="white"
                p="6px 10px" 
                height="100px"
                borderRadius="4px 4px 0px 0px" 
                fontWeight={700} 
                bgImage="url(https://img.freepik.com/free-photo/dark-background-landscape_57257-117.jpg)" 
                backgroundSize="cover"
            >
                <Text>Top Clubs</Text>
            </Flex>
            <Flex direction="column">
                {loading?(
                    <Stack mt={2} p={3}>
                        <Flex justify="space-between" align="center">
                            <SkeletonCircle size="10" />
                            <Skeleton height="10px" width="70%" />
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <SkeletonCircle size="10" />
                            <Skeleton height="10px" width="70%" />
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <SkeletonCircle size="10" />
                            <Skeleton height="10px" width="70%" />
                        </Flex>
                    </Stack>
                ):(
                    <>
                        {clubs.map((item,index)=>{
                            const isJoined=!!clubStateValue.mySnippets.find((snippet)=>snippet.clubId===item.id);
                            return (
                                <Link key={item.id} href={`/r/${item.id}`}>
                                    <Flex position="relative" align="center" fontSize="10pt" borderBottom="1px solid" borderColor="gray.300" p="10px 12px">
                                        <Flex width="80%" align="center">
                                            <Flex width="15%">
                                                <Text>{index+1}</Text>
                                            </Flex>
                                            <Flex width="80%" align="center">
                                                {item.imageURL?(
                                                    <Image src={item.imageURL} borderRadius="full" boxSize="20px" mr={2}/>
                                                ):(
                                                    <Icon as={FaUser} fontSize={18} color="brand.100" mr={2}/>
                                                )}
                                                <span style={{whiteSpace:"nowrap",overflow:"hidden",textDecoration:"ellipsis"}}>
                                                    {`r/${item.id}`}
                                                </span>
                                            </Flex>
                                        </Flex>
                                        <Box position="absolute" right="10px">
                                            <Button height="22px" fontSize="8pt" variant={isJoined?"outline":"solid"} onClick={(e)=>{e.stopPropagation(); onJoinOrLeaveClub(item,isJoined);}}>
                                                {isJoined?"Joined":"Join"}
                                            </Button>
                                        </Box>
                                    </Flex>
                                </Link>
                            )
                        })}
                    </>
                )}
            </Flex>
        </Flex>
    )
}
export default Recommendations;