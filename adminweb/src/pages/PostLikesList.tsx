import React, { useState } from 'react';
import { IonContent, IonGrid, IonFab, IonButtons, IonBadge, IonFabButton, IonAvatar, IonChip, IonSpinner, useIonToast, IonSearchbar, IonRow, IonCol, IonHeader, IonIcon, IonButton, IonLabel, IonPage, IonTitle, IonToolbar, IonCard, IonItem, IonFooter, IonMenuButton, IonProgressBar, IonCardContent } from '@ionic/react';
import { person, refreshOutline, addOutline, caretForwardSharp, caretBackSharp, arrowBack, ellipsisVertical } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { format } from 'fecha';
import { getAPIResult } from '../helpers/api';
import { useParams } from "react-router-dom";
const { REACT_APP_API_SERVER } = process.env;

export const PostLikesList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [allLikes, setAllLikes] = useState<any[]>([]);
    const [present, dismiss] = useIonToast()
    let params = useParams<any>()
    let id = params.id

    async function fetchPostLikes() {
        try {
            console.log(id)
            // setIsLoading(true);
            const res = await fetch(
                `${REACT_APP_API_SERVER}/user/getLikeByPost/${id}`,
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
                const { allLikes } = json;
                console.log('all Likes:', allLikes)
                setAllLikes(allLikes);
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
        fetchPostLikes();
    }, [id]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>#{id} Like Posts List</IonTitle>
                    <IonButton slot="end" routerLink={"/InfoPost/" + id} >
                        <IonIcon icon={arrowBack} ></IonIcon>&ensp;Bank
                    </IonButton>

                </IonToolbar>
            </IonHeader>



            <IonContent color="light">
                <IonCard>
                    <IonGrid>

                        <hr></hr>&ensp;&ensp;&ensp;
                        <IonBadge >&ensp;&ensp;&ensp;&ensp;
                            Likes Total Number: {allLikes.length}
                            &ensp;&ensp;&ensp;&ensp; </IonBadge>
                        <hr></hr>
                        <IonItem color="tertiary">
                            <IonLabel><b>User Icon </b></IonLabel>

                            {/* <IonLabel slot="end"><b>OPERATE</b></IonLabel> */}
                        </IonItem>
                        {isLoading
                            ? <div><IonProgressBar type="indeterminate" /></div>
                            : allLikes
                                .map(post_likes =>

                                    <IonRow key={post_likes.like_id} className="row_row">
                                        <IonCol>
                                            <IonItem routerLink={"/UserInfo/" + post_likes.user_id} >
                                                <div slot="start" style={{ display: 'flex' }}>
                                                    <IonAvatar slot="start" className="iconSize">
                                                        <img src={post_likes.post_like_user_avatar || '/assets/icon/favicon.png'}
                                                            alt='user avatar' />
                                                    </IonAvatar>
                                                    <div>
                                                        {post_likes.post_like_user_verified ? (
                                                            <IonBadge color="warning">V</IonBadge>
                                                        ) : (
                                                            <IonBadge
                                                                color="medium"
                                                                style={{ opacity: '0' }}
                                                            >V</IonBadge>
                                                        )}
                                                    </div>
                                                </div>
                                                <IonBadge color="medium">{post_likes.user_id} - {post_likes.post_like_user_first_name}&thinsp;{post_likes.post_like_user_last_name}</IonBadge>
                                                &emsp;
                                                <IonBadge color="medium" slot="end">
                                                    {post_likes.likes_updated && format(new Date(post_likes.likes_updated), "[on] DD-MMM-YYYY [at] HH:mm")}
                                                </IonBadge>

                                                {/* <IonButton shape="round" fill="outline" slot="end" color="success" routerLink={"/InfoPost/" + post_likes.post_id}><IonIcon icon={ellipsisVertical} /></IonButton> */}
                                            </IonItem>

                                            {/* <IonItem>
                                                &emsp;&emsp;
                                                <IonBadge color="medium" >
                                                    {post_likes.likes_updated && format(new Date(post_likes.likes_updated), "[on] DD-MMM-YYYY [at] HH:mm")}
                                                </IonBadge>
                                                <IonButton slot="end" color="success" routerLink={"/InfoPost/" + post_likes.post_id}>&emsp;Post&emsp;</IonButton>
                                            </IonItem> */}

                                        </IonCol>
                                    </IonRow>



                                )}
                    </IonGrid>
                </IonCard>


                <IonFooter>
                    <IonToolbar color="primary">
                        <IonButton slot="end" onClick={() => fetchPostLikes()} >
                            <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                        </IonButton>
                    </IonToolbar>
                </IonFooter>

            </IonContent>
        </IonPage>
    );
};



////////////////////////////////////////////////////////////////////

