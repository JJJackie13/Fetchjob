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
    IonFooter, IonToggle, IonLoading, IonSpinner, useIonAlert, IonIcon, IonCard, IonCardContent, useIonToast, IonInput, IonBadge, useIonLoading, IonCheckbox, IonProgressBar
} from "@ionic/react";
import { people, checkmarkDoneSharp, refreshOutline, arrowBack, alertCircle, ellipsisVertical, createSharp, chatboxEllipsesSharp, calendarOutline } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getAPIResult } from "../helpers/api";
import { format } from 'fecha';
const { REACT_APP_API_SERVER } = process.env;


export const UserInfo: React.FC = () => {
    const [info, setUserInfo] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isVerified, setIsVerified] = useState<boolean>();
    const [isActivated, setIsActivated] = useState<boolean>();
    // const [present, dismiss] = useIonToast()
    const [present, dismiss] = useIonLoading();
    const [presentAlert] = useIonAlert()
    let params = useParams<any>()
    let id = params.id
    async function fetchGetUserInfo() {
        // setIsLoading(true)
        try {
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/user/getAllUserInfo/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            ));
            if (json.success) {
                setUserInfo(json.data);
                setIsActivated(json.data.is_activated)
                setIsVerified(json.data.is_verified)
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error);
            // presentAlert({
            //     header: 'error',
            //     buttons: ['Dismiss'],
            // })
        }
        setIsLoading(false);
    }
    useEffect(() => {
        setIsLoading(true)
        fetchGetUserInfo();
    }, [id]);
    ///-----
    async function save() {
        try {
            let body = { is_verified: isVerified, is_activated: isActivated };
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/admin/updateState/${id}`,
                {
                    method: 'PATCH',
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
            console.log('Failed', error);
        }
    }
    // setTimeout(() => {
    //     setIsLoading(false);
    // }, 2000);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButton slot="start" routerLink={"/Users"} >
                        <IonIcon icon={arrowBack} ></IonIcon>
                    </IonButton>&ensp;
                    <IonTitle className="ion-title"><IonIcon icon={people} />&thinsp;User Information</IonTitle>
                    <IonButton slot="end" color="primary" onClick={() => fetchGetUserInfo()} expand="block">
                        <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                    </IonButton>
                    {/* <IonLoading
                        cssClass='my-custom-class'
                        isOpen={isLoading}
                        onDidDismiss={() => setIsLoading(false)}
                        message={'Please wait...'}
                        duration={5000}
                    /> */}
                </IonToolbar>
            </IonHeader>

            <IonContent className="contentItem" color="light">

                {isLoading ? <div ><IonProgressBar type="indeterminate" /></div>
                    :
                    <IonGrid>
                        <IonRow>
                            <IonCol size="1"></IonCol>
                            <IonCard>
                                <IonCol size="10">
                                    <IonItem color="secondary">
                                        <IonRow>
                                            <IonCol size="1">
                                                <div>
                                                    {info.is_verified ? (
                                                        <IonBadge color="warning" slot="end">V</IonBadge>
                                                    ) : (
                                                        <IonBadge
                                                            color="medium"
                                                            style={{ opacity: '0' }}
                                                        >V</IonBadge>
                                                    )}
                                                </div>
                                            </IonCol>

                                            <IonCol size="11">
                                                <IonLabel>
                                                    <IonIcon icon={ellipsisVertical} />&thinsp;<b>{info.id} - &ensp;{info.first_name}&ensp;{info.last_name}</b>
                                                </IonLabel>
                                            </IonCol>
                                        </IonRow>
                                    </IonItem>

                                    <IonItem>
                                        <IonBadge slot="start" color="success">
                                            Avatar Img:
                                        </IonBadge>
                                        <IonCardContent>
                                            <img height="100pt" width="100pt" src={info.avatar || '/assets/icon/favicon.png'}
                                                alt="user_avatar" />
                                        </IonCardContent>

                                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                        <IonBadge color="success">
                                            Banner Img:
                                        </IonBadge>&emsp;&emsp;
                                        <IonCardContent>
                                            <img height="100pt" width="100pt" src={info.banner || '/assets/icon/favicon.png'}
                                                alt="user_banner" />
                                        </IonCardContent>
                                    </IonItem>

                                    <IonItem color="tertiary"><IonLabel><b>Basic Information:</b></IonLabel></IonItem>

                                    <IonRow>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    First Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.first_name}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Last Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.last_name}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonRow>
                                        <IonCol size="7">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Email:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.email}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="5">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Phone:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.phone}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonRow>
                                        <IonCol size="7">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Birthday:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.birthday}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="5">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Gender:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.gender}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonRow>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Address:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.address}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonRow>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    City:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.city}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Countrie:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.user_countrie}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonItem color="success"><IonLabel><b>User Verified:</b></IonLabel>
                                        {!isVerified ? (
                                            <IonToggle slot="end" checked={false} color="light" onIonChange={e => setIsVerified(e.detail.checked)} />
                                        ) : (
                                            <IonToggle slot="end" color="warning"
                                                checked={true} onIonChange={e => setIsVerified(e.detail.checked)} />
                                        )}
                                    </IonItem>
                                    <IonItem></IonItem>
                                    <IonItem color="tertiary"><IonLabel><b>Other Details:</b></IonLabel></IonItem>
                                    <IonRow>
                                        <IonCol size="12">
                                            <IonItem >
                                                <IonBadge color="success">
                                                    Headline:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.headline}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.company}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem >
                                                <IonBadge color="success">
                                                    Industry:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.industry}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem >
                                                <IonBadge color="success">
                                                    Education:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.education}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol>
                                            <IonItem >
                                                <IonLabel position="floating">
                                                    <IonBadge color="success">
                                                        Introduction:
                                                    </IonBadge>
                                                </IonLabel>
                                                <br></br>
                                                <IonCardContent> {info.introduction || "/"}</IonCardContent>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="4">
                                            <IonItem >
                                                <IonBadge color="success">
                                                    Experience:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.experience} /><IonBadge color="medium">Years</IonBadge>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="8">
                                            <IonItem >
                                                <IonBadge color="success">
                                                    Job Category:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.job_category || "/"} />
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem >
                                                <IonBadge color="success">
                                                    Skill:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.skill} />
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem >
                                                <IonBadge color="success">
                                                    Hobbie:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.hobbie} />
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonItem color="dark"><IonIcon icon={alertCircle} /><IonLabel>&emsp;<b>User Activated:</b></IonLabel>
                                        {!isActivated ? (
                                            <IonCheckbox slot="end" checked={false} color="danger" onIonChange={e => setIsActivated(e.detail.checked)} />
                                        ) : (
                                            <IonCheckbox slot="end" color="warning"
                                                checked={true} onIonChange={e => setIsActivated(e.detail.checked)} />
                                        )}
                                    </IonItem>

                                    <IonItem ></IonItem>
                                    <IonItem color="tertiary">
                                        <IonLabel>
                                            <b>About Posts:</b>
                                        </IonLabel>
                                        <IonButton slot="end" color="success" routerLink={"/UsersPostList/" + info.id}>&emsp;View more posts&emsp;</IonButton>
                                    </IonItem>
                                    <IonRow>
                                        <IonCol size="2"></IonCol>
                                        <IonCol size="8">
                                            <IonCard>
                                                <IonItem>
                                                    <IonIcon color="success" icon={createSharp} slot="start" />
                                                    <IonLabel>
                                                        <IonBadge color="success">Posts:</IonBadge>
                                                    </IonLabel>

                                                </IonItem>
                                                <IonCardContent>{info.posts || " !! Oh~ No !! This user has not posted any posts yet !!"}</IonCardContent>
                                                &emsp;&emsp;
                                                <IonBadge color="medium" >
                                                    {info.posts_updated_at && format(new Date(info.posts_updated_at), "[on] DD-MMM-YYYY [at] HH:mm")}
                                                </IonBadge>
                                            </IonCard>
                                        </IonCol>
                                        <IonCol size="2"></IonCol>
                                        {/* <IonCol size="6">
                                            <IonCard>
                                                <IonItem>
                                                    <IonIcon color="success" icon={chatboxEllipsesSharp} slot="start" />
                                                    <IonLabel>
                                                        <IonBadge color="success">Comment:</IonBadge>
                                                    </IonLabel>
                                                </IonItem>
                                                <IonCardContent>
                                                    {info.post_comment}
                                                </IonCardContent>
                                                &emsp;&emsp;
                                                <IonBadge color="medium" >
                                                    {info.comment_updated_at && format(new Date(info.comment_updated_at), "[on] DD-MMM-YYYY [at] HH:mm")}
                                                </IonBadge>
                                            </IonCard>
                                        </IonCol> */}
                                    </IonRow>

                                </IonCol></IonCard>
                            <IonCol size="1">

                            </IonCol>
                        </IonRow>
                    </IonGrid>}

            </IonContent>

            <IonFooter>
                <IonToolbar color="primary">
                    &emsp;<IonIcon icon={calendarOutline} />&emsp;
                    <b>Updated Date:
                        {info.updated_at && format(new Date(info.updated_at), " MM-DD-YYYY HH:mm")}
                    </b>

                    <IonButton color="success" slot="end" onClick={save} >
                        &emsp;<IonIcon icon={checkmarkDoneSharp} />
                        &emsp;Edit completed&emsp;&emsp;
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};
