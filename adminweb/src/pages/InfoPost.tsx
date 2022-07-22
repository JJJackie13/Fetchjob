import React, { useState } from "react";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonButton,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonToolbar,
    IonItem,
    IonLabel,
    IonFooter, IonToggle, IonSpinner, IonIcon, IonCard, IonAvatar, IonCardContent, useIonToast, IonInput, IonBadge, IonCheckbox, IonLoading, IonButtons
} from "@ionic/react";
import { alertCircle, person, refreshOutline, calendarOutline, arrowBack, receipt, business, lockOpen, checkmarkDoneSharp, chatboxEllipses, thumbsUp } from 'ionicons/icons';
import './Page.css';
import { format } from 'fecha';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getAPIResult } from "../helpers/api";
const { REACT_APP_API_SERVER } = process.env;


export const InfoPost: React.FC = () => {
    const [postInfo, setPostInfo] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [present, dismiss] = useIonToast()
    const [isActivated, setIsActivated] = useState<boolean>();
    let params = useParams<any>()
    let id = params.id

    async function fetchPostInfo() {
        try {
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/byPostId/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            ));
            if (json.success) {
                setPostInfo(json.data)
                setIsActivated(json.data.is_activated)
                setIsLoading(false)
            }

        } catch (error) {
            present({
                header: ' Oops, something went wrong！！！',
                message: (error as Error).toString(),
                duration: 5000,
                buttons: [{ text: 'Cancel', handler: () => dismiss() }]
            })
            console.log(error)
        };
        setIsLoading(false);
    }
    useEffect(() => {
        fetchPostInfo();
    }, [id]);
    ///-----
    async function save() {
        try {
            let body = { is_activated: isActivated };
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/admin/PostUpdate/${id}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body),
                },
            ));
            setIsLoading(false);
        } catch (error) {
            present({
                header: 'Oh, no response！！！',
                message: (error as Error).toString(),
                duration: 5000,
                buttons: [{ text: 'Cancel', handler: () => dismiss() }]
            })
            console.log('Failed', error);
        }
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButton slot="start" routerLink={"/Posts"} >
                        <IonIcon icon={arrowBack} ></IonIcon>
                    </IonButton>&ensp;
                    <IonTitle className="ion-title"><IonIcon icon={receipt} />&thinsp;Post Information</IonTitle>
                    <IonButton slot="end" color="primary" onClick={() => fetchPostInfo()} >
                        <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                    </IonButton>
                </IonToolbar>
            </IonHeader>


            <IonContent color="light">

                {isLoading ? <div ><IonLoading message="Loading Post Info" isOpen={isLoading} /></div>
                    :
                    <IonGrid>
                        <IonRow>
                            <IonCol size="1"></IonCol>
                            <IonCard >
                                <IonCol size="10">
                                    <IonItem color="secondary">
                                        <IonRow>
                                            <IonCol>
                                                <div style={{ display: 'flex' }}>
                                                    <IonAvatar className="postIconSize">
                                                        <img src={postInfo.user_avatar || postInfo.company_avatar || '/assets/icon/favicon.png'}
                                                            alt='user avatar' />
                                                    </IonAvatar>
                                                    <div>
                                                        {postInfo.post_company_verified ? (
                                                            <IonBadge color="warning">V</IonBadge>
                                                        ) : (
                                                            <IonBadge
                                                                color="medium"
                                                                style={{ opacity: '0' }}
                                                            >V</IonBadge>
                                                        ) || postInfo.post_user_verified ? (
                                                            <IonBadge color="warning">V</IonBadge>
                                                        ) : (
                                                            <IonBadge
                                                                color="medium"
                                                                style={{ opacity: '0' }}
                                                            >V</IonBadge>
                                                        )}
                                                    </div>
                                                </div>
                                            </IonCol>
                                        </IonRow>
                                    </IonItem>


                                    <IonRow>
                                        <IonCol size="8">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Post Image:
                                                </IonBadge>
                                                <IonCardContent>
                                                    <img height="100pt" width="100pt" src={postInfo.post_image || '/assets/icon/favicon.png'}
                                                        alt="user_avatar" />
                                                </IonCardContent>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="4">
                                            <IonCard >
                                                <IonItem color="secondary" disabled >
                                                    <IonIcon icon={lockOpen} />&emsp;
                                                    <IonLabel><b>Post Public:</b></IonLabel>
                                                    <div>
                                                        {!postInfo.is_public ? (
                                                            <IonCheckbox checked={false} color="light" slot="end" />
                                                        ) : (
                                                            <IonCheckbox color="warning"
                                                                checked={true} slot="end" />
                                                        )}
                                                    </div>

                                                </IonItem>
                                            </IonCard >
                                        </IonCol>
                                    </IonRow>
                                    <IonItem color="tertiary"><IonLabel><b>{id} - Post Content:</b></IonLabel></IonItem>
                                    <IonRow>
                                        <IonCol>
                                            <IonCardContent> {postInfo.content}</IonCardContent>
                                            <IonItem>
                                                &emsp;&emsp;
                                                <IonBadge color="medium" >
                                                    {postInfo.updated_at && format(new Date(postInfo.updated_at), "[on] DD-MMM-YYYY [at] HH:mm")}
                                                </IonBadge>

                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="6">
                                            &emsp;&emsp; &emsp;&emsp; &emsp;<IonButton color="warning" fill="outline" routerLink={"/PostCommentList/" + postInfo.id}><IonIcon icon={chatboxEllipses} />&ensp;View Comments&emsp;</IonButton>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonButton color="danger" fill="outline" routerLink={"/PostLikesList/" + postInfo.id}><IonIcon icon={thumbsUp} />&ensp;View Likes&emsp;</IonButton>
                                        </IonCol>
                                    </IonRow>

                                    <IonItem color="tertiary">
                                        <IonLabel><b>Post Author's Information:</b></IonLabel>
                                    </IonItem>

                                    <IonRow>
                                        <IonCol size="4">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    User Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={postInfo.user_name || "/"}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="8">
                                            <IonItem>
                                                <IonButton slot="end" routerLink={"/UserInfo/" + postInfo.user_id}><IonIcon icon={person} />&emsp;Go to user file</IonButton>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={postInfo.company_name || "/"}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonButton slot="end" routerLink={"/companyInfo/" + postInfo.company_id}><IonIcon icon={business} />&emsp;Go to company file</IonButton>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>



                                    <IonItem ></IonItem>
                                    <IonItem color="dark"><IonIcon icon={alertCircle} />&emsp;
                                        <IonLabel><b>Post Activated:</b>
                                        </IonLabel>
                                        <div>
                                            {!isActivated ? (
                                                <IonCheckbox checked={false} color="danger" slot="end" onIonChange={e => setIsActivated(e.detail.checked)} />
                                            ) : (
                                                <IonCheckbox color="warning"
                                                    checked={true} slot="end" onIonChange={e => setIsActivated(e.detail.checked)} />
                                            )}
                                        </div>
                                    </IonItem>
                                </IonCol>
                            </IonCard>
                            <IonCol size="1"></IonCol>
                        </IonRow>
                    </IonGrid>}
            </IonContent >

            <IonFooter>
                <IonToolbar color="primary">
                    &emsp;<IonIcon icon={calendarOutline} />&emsp;
                    <b>Updated Date:
                        {postInfo.updated_at && format(new Date(postInfo.updated_at), " MM-DD-YYYY HH:mm")}</b>
                    <IonButton color="success" slot="end" onClick={save} >
                        &emsp;<IonIcon icon={checkmarkDoneSharp} />
                        &emsp;Edit completed&emsp;&emsp;
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage >
    );
};
