import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { club } from '../../../atoms/clubsAtom';
import { firestore } from '../../../firebase/clientApp';
import safeJsonStringify from "safe-json-stringify";
import NotFound from '../../../components/Club/NotFound';
import Header from '../../../components/Club/Header';
import PageContent from '../../../components/Layout/PageContent';

type clubPageProps = {
    clubData: club,
};

const ClubPage:React.FC<clubPageProps> = ({clubData}) => {
    
    if(!clubData){
        return <NotFound/>
    }
    
    return (
        <>
            <Header clubData={clubData}/>
            <PageContent>
                <>
                    <div>LHS</div>
                </>
                <>
                    <div>RHS</div>
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