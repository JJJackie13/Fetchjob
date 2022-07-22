import React, { useState } from 'react';
import { IonContent, IonGrid, IonFab, IonButtons, IonBadge, IonFabButton, IonAvatar, IonChip, IonSpinner, useIonToast, IonSearchbar, IonRow, IonCol, IonHeader, IonIcon, IonButton, IonLabel, IonPage, IonTitle, IonToolbar, IonCard, IonItem, IonFooter, IonMenuButton, IonProgressBar, IonCardContent } from '@ionic/react';
import { person, refreshOutline, addOutline, caretForwardSharp, caretBackSharp, arrowBack, chatboxEllipses, thumbsUp, reader } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { format } from 'fecha';
import { getAPIResult } from '../helpers/api';
import { useParams } from "react-router-dom";
const { REACT_APP_API_SERVER } = process.env;

export const CompanyPostList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allPosts, setAllPost] = useState<any[]>([]);
    const [present, dismiss] = useIonToast()
    let params = useParams<any>()
    let id = params.id

    async function fetchCompanyPost() {
        try {
            console.log(id)
            setIsLoading(true);
            const res = await fetch(
                `${REACT_APP_API_SERVER}/company/getPostByCo/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const json = await res.json()
            if (json.success) {
                const { allPosts } = json;
                console.log('all Post:', allPosts)
                setAllPost(allPosts);
                setIsLoading(false);
            }

        } catch (error) {
            console.log(error);
            present({
                message: (error as Error).toString(),
                duration: 5000,
                buttons: [{ text: 'Dismiss', handler: () => dismiss() }]
            })
        }
        setIsLoading(false);
    }
    useEffect(() => {
        fetchCompanyPost();
    }, [id]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>#{id} Company Posts List</IonTitle>
                    <IonButton slot="end" routerLink={"/companyInfo/" + id} >
                        <IonIcon icon={arrowBack} ></IonIcon>&ensp;Back
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent color="light">
                <IonGrid>
                    <hr></hr>&ensp;&ensp;&ensp;
                    <IonBadge>&ensp;&ensp;&ensp;&ensp;
                        #{id} Company Posts Total Number - {allPosts.length}
                        &ensp;&ensp;&ensp;&ensp; </IonBadge>
                    <hr></hr>
                    <IonItem color="tertiary">
                        <IonLabel><b>Post Id</b></IonLabel>
                    </IonItem>
                    {isLoading
                        ? <div><IonProgressBar type="indeterminate" /></div>
                        : allPosts
                            .map(companies =>
                                <IonCard key={companies.post_id} className="list_row" >
                                    <IonCol>
                                        <IonItem >
                                            <IonBadge color="success">{companies.post_id}.</IonBadge>&emsp;
                                            <div slot="end" style={{ display: 'flex' }}>
                                                <IonAvatar slot="end" className="postIconSize">
                                                    <img src={companies.avatar || '/assets/icon/favicon.png'}
                                                        alt='user avatar' />
                                                </IonAvatar>
                                                <div>
                                                    {companies.is_verified ? (
                                                        <IonBadge color="warning">V</IonBadge>
                                                    ) : (
                                                        <IonBadge
                                                            color="medium"
                                                            style={{ opacity: '0' }}
                                                        >V</IonBadge>
                                                    )}
                                                </div>
                                            </div>
                                        </IonItem>
                                        <IonCardContent>
                                            &emsp;&emsp;
                                            {companies.post_content}
                                        </IonCardContent>
                                        <IonItem>
                                            &emsp;&emsp;
                                            <IonBadge color="success" slot="start" >
                                                {companies.post_updated && format(new Date(companies.post_updated), "[on] DD-MMM-YYYY [at] HH:mm")}
                                            </IonBadge>
                                            <IonButtons slot="end" >
                                                <IonButton color="warning" fill="outline" routerLink={"/PostCommentList/" + companies.post_id}><IonIcon icon={chatboxEllipses} />&ensp;Comment&emsp;</IonButton>
                                                <IonButton color="danger" fill="outline" routerLink={"/PostLikesList/" + companies.post_id}><IonIcon icon={thumbsUp} />&ensp;Likes&emsp;</IonButton>
                                                <IonButton color="success" fill="outline" routerLink={"/InfoPost/" + companies.post_id}><IonIcon icon={reader} />&ensp;View Details&emsp;</IonButton>
                                            </IonButtons>
                                        </IonItem>
                                    </IonCol>
                                </IonCard>
                            )}
                </IonGrid>



                <IonFooter>
                    <IonToolbar color="primary">
                        <IonButton slot="end" onClick={() => fetchCompanyPost()} >
                            <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                        </IonButton>
                    </IonToolbar>
                </IonFooter>

            </IonContent>
        </IonPage>
    );
};



////////////////////////////////////////////////////////////////////

