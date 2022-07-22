import React, { useState } from 'react';
import { IonContent, IonGrid, IonFab, IonButtons, IonBadge, IonFabButton, IonAvatar, IonChip, IonSpinner, useIonToast, IonSearchbar, IonRow, IonCol, IonHeader, IonIcon, IonButton, IonLabel, IonPage, IonTitle, IonToolbar, IonCard, IonItem, IonFooter, IonMenuButton, IonProgressBar, IonCardContent } from '@ionic/react';
import { person, refreshOutline, addOutline, caretForwardSharp, caretBackSharp, arrowBack } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { format } from 'fecha';
import { getAPIResult } from '../helpers/api';
import { useParams } from "react-router-dom";
const { REACT_APP_API_SERVER } = process.env;

export const PostCommentList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [present, dismiss] = useIonToast()
    const [allComment, setAllComment] = useState<any[]>([]);
    let params = useParams<any>()
    let id = params.id

    async function fetchComment() {
        try {
            console.log(id)
            // setIsLoading(true);
            const res = await fetch(
                `${REACT_APP_API_SERVER}/user/commentByPost/${id}`,
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
                const { allComment } = json;
                console.log('all Comment:', allComment)
                setAllComment(allComment);
                setIsLoading(false);
            }

        } catch (error) {
            present({
                message: (error as Error).toString(),
                duration: 5000,
                buttons: [{ text: 'Dismiss', handler: () => dismiss() }]
            })
            console.log(error);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        fetchComment();
    }, [id]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>#{id} Posts Comment List</IonTitle>
                    <IonButton slot="end" routerLink={"/InfoPost/" + id} >
                        <IonIcon icon={arrowBack} ></IonIcon>&ensp;Post
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent color="light">
                <IonGrid>
                    <hr></hr>&ensp;&ensp;&ensp;
                    <IonBadge>&ensp;&ensp;&ensp;&ensp;
                        #{id} Posts Comments Total Number: {allComment.length}
                        &ensp;&ensp;&ensp;&ensp; </IonBadge>
                    <hr></hr>
                    <IonItem color="tertiary">
                        <IonLabel><b>User Id </b></IonLabel>
                    </IonItem>
                    {isLoading
                        ? <div><IonProgressBar type="indeterminate" /></div>
                        : allComment
                            .map(post_comments =>
                                <IonCard key={post_comments.id} className="list_row">

                                    <IonItem >
                                        <IonBadge color="success">{post_comments.user_id} </IonBadge>&ensp;&ensp;
                                        <IonBadge color="success">{post_comments.first_name} {post_comments.last_name} </IonBadge>
                                        <div slot="end" style={{ display: 'flex' }}>
                                            <IonAvatar slot="end" className="postIconSize">
                                                <img src={post_comments.user_avatar || '/assets/icon/favicon.png'}
                                                    alt='user avatar' />
                                            </IonAvatar>
                                            <div>
                                                {post_comments.user_verified ? (
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
                                    <IonCardContent >
                                        &emsp;&emsp;
                                        {post_comments.content}
                                    </IonCardContent>
                                    <IonItem>
                                        <IonBadge color="success" slot="start">
                                            {post_comments.updated_at && format(new Date(post_comments.updated_at), "[on] DD-MMM-YYYY [at] HH:mm")}
                                        </IonBadge>
                                        <IonButton slot="end" routerLink={"/UserInfo/" + post_comments.user_id}>
                                            <IonIcon icon={person} />
                                        </IonButton>
                                    </IonItem>
                                </IonCard>
                            )}
                </IonGrid>



                <IonFooter>
                    <IonToolbar color="primary">
                        <IonButton slot="end" onClick={() => fetchComment()} >
                            <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                        </IonButton>
                    </IonToolbar>
                </IonFooter>

            </IonContent>
        </IonPage>
    );
};



////////////////////////////////////////////////////////////////////

