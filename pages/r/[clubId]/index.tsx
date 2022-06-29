import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { club, clubState } from '../../../atoms/clubsAtom';
import { firestore } from '../../../firebase/clientApp';
import safeJsonStringify from "safe-json-stringify";
import NotFound from '../../../components/Club/NotFound';
import Header from '../../../components/Club/Header';
import PageContent from '../../../components/Layout/PageContent';
import CreatePostLink from '../../../components/Club/CreatePostLink';
import Posts from '../../../components/Posts/Posts';
import { useSetRecoilState } from 'recoil';
import About from '../../../components/Club/About';

type clubPageProps = {
    clubData: club,
};

const ClubPage:React.FC<clubPageProps> = ({clubData}) => {
    const setClubStateValue=useSetRecoilState(clubState);
    if(!clubData){
        return <NotFound/>
    }

    useEffect(()=>{
        setClubStateValue((prev)=>({
            ...prev,
            currentClub:clubData,
        }))
    },[clubData])
    
    return (
        <>
            <Header clubData={clubData}/>
            <PageContent>
                <>
                    <CreatePostLink/>
                    <Posts clubData={clubData}/>
                </>
                <>
                    <About clubData={clubData}/>
                </>
            </PageContent>
        </>
    )
}

export async function getServerSideProps(context:GetServerSidePropsContext){
    // get a club data & pass it to a client
    try {
        const clubDocRef=doc(firestore,"clubs",context.query.clubId as string);
        const clubDoc=await getDoc(clubDocRef);

        return {
            props:{
                clubData: clubDoc.exists()?JSON.parse(safeJsonStringify({id:clubDoc.id,...clubDoc.data()})):"",
            },
        };
    } catch (error) {
        console.log("getServerSideProps error",error);
    }
}

export default ClubPage;