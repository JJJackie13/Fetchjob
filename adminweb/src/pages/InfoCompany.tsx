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
    IonFooter, IonList, IonButtons, IonIcon, IonLoading, useIonToast, IonCard, IonCardContent, IonInput, IonBadge, IonToggle, IonSpinner, useIonAlert, IonProgressBar, IonCheckbox
} from "@ionic/react";
import { business, alertCircle, refreshOutline, calendarOutline, ellipsisVertical, arrowBack, createSharp, chatboxEllipsesSharp, checkmarkDoneSharp } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getAPIResult, } from "../helpers/api";
import { format } from 'fecha';
import Data from '../components/Data'
import { useObjectState } from "../hooks/use-object-state";
const { REACT_APP_API_SERVER } = process.env;





///////////////////////////////////////////////////////////////////////////////////////////////

export const CompanyInfo: React.FC = () => {
    const [info, setCompanyInfo] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isVerified, setIsVerified] = useState<boolean>();
    const [isActivated, setIsActivated] = useState<boolean>();
    const [present, dismiss] = useIonToast()
    let params = useParams<any>()
    let id = params.id
    async function fetchGetCompanyInfo() {
        try {
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/company/companyInfo/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            ));
            if (json.success) {
                setCompanyInfo(json.data);
                setIsActivated(json.data.is_activated)
                setIsVerified(json.data.is_verified)
                setIsLoading(false)
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
        setIsLoading(true)
        fetchGetCompanyInfo();
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


    return (

        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButton routerLink={"/Company"} slot="start">
                        <IonIcon icon={arrowBack} ></IonIcon>
                    </IonButton>
                    <IonTitle className="ion-title"><IonIcon icon={business} />&thinsp;Company Info</IonTitle>

                    <IonButton slot="end" color="primary" onClick={() => fetchGetCompanyInfo()} >
                        <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent className="contentItem" color="light">
                <div>

                    {isLoading ? <div ><IonProgressBar type="indeterminate" />
                        {/* <IonSpinner /> */}
                    </div>
                        :
                        <IonGrid >
                            <IonRow>
                                {/* {JSON.stringify(info)} */}
                                <IonCol ><IonCard>
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
                                                    <IonIcon icon={ellipsisVertical} />&thinsp;<b>{info.id} - &ensp;{info.company_name}</b>
                                                </IonLabel>
                                            </IonCol>
                                        </IonRow>
                                    </IonItem>
                                    <IonRow>
                                        <IonCol size="3"></IonCol>
                                        <IonCol size="5">
                                            <IonItem>
                                                <IonLabel>
                                                    <IonBadge slot="start" color="success">
                                                        Company Logo:
                                                    </IonBadge>
                                                </IonLabel>
                                                <IonCardContent>
                                                    <img height="100pt" width="100pt" src={info.avatar || '/assets/icon/favicon.png'}
                                                        alt="company_logo" />
                                                </IonCardContent>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="4"></IonCol>
                                    </IonRow>
                                    <IonItem color="tertiary"><IonLabel><b>Basic Information:</b></IonLabel></IonItem>
                                    <IonRow>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.company_name}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Phone:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.phone}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Email:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.email}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Address:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.address}></IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Website:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.website}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonLabel position="floating">
                                                    <IonBadge color="success">
                                                        Introduction:
                                                    </IonBadge>
                                                </IonLabel>
                                                <br></br>
                                                <IonCardContent >{info.introduction || "/"}</IonCardContent>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonItem color="tertiary"><IonLabel><b>Other Details:</b></IonLabel></IonItem>
                                    <IonRow>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    City:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.city_name}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Type:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.type_name}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Industry:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.industry_name}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Account Level:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.company_ac_level || "/"}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Account Level Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.account_level}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Business Size:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.business_size}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Establish In:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.establish_in}> </IonInput>
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Registry:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.company_registry}> </IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonItem color="success"><IonLabel><b>Company Verified:</b></IonLabel>
                                        {!isVerified ? (
                                            <IonToggle slot="end" checked={false} color="light" onIonChange={e => setIsVerified(e.detail.checked)} />
                                        ) : (
                                            <IonToggle slot="end" color="warning"
                                                checked={true} onIonChange={e => setIsVerified(e.detail.checked)} />
                                        )}
                                    </IonItem>

                                    <IonItem></IonItem>

                                    <IonItem color="tertiary"><IonLabel><b>Owner Details:</b></IonLabel></IonItem>
                                    <IonRow>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Owner First Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.owner_first_name || "/"} />
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonItem>
                                                <IonBadge color="success">
                                                    Company Owner Last Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.owner_last_name} />
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonItem color="dark"><IonIcon icon={alertCircle} /><IonLabel>&emsp;<b>Company Activated:</b></IonLabel>
                                        {!isActivated ? (
                                            <IonCheckbox slot="end" checked={false} color="danger" onIonChange={e => setIsActivated(e.detail.checked)} />
                                        ) : (
                                            <IonCheckbox slot="end" color="warning"
                                                checked={true} onIonChange={e => setIsActivated(e.detail.checked)} />
                                        )}
                                    </IonItem>

                                    <IonItem></IonItem>
                                    <IonItem color="tertiary"><IonLabel><b>About Posts:</b></IonLabel>
                                        <IonButton slot="end" color="success" routerLink={"/CompanyPostList/" + info.id}>&emsp;View more posts&emsp;</IonButton>
                                    </IonItem>
                                    <IonRow>
                                        <IonCol size="2"></IonCol>
                                        <IonCol size="8">
                                            <IonCard>
                                                <IonItem>
                                                    <IonIcon color="success" icon={createSharp} slot="start" />
                                                    <IonLabel>
                                                        <IonBadge color="success">Posts: </IonBadge>
                                                        &emsp; <IonBadge color="medium">Post id: {info.post_id || "/"}</IonBadge>
                                                    </IonLabel>

                                                </IonItem>
                                                <IonCardContent>{info.post_content || " !! Oh~ No !! This user has not posted any posts yet !!"}</IonCardContent>
                                                <IonItem>

                                                    <IonBadge color="medium">Post Updated at:
                                                        {info.post_updated_at && format(new Date(info.post_updated_at), " DD-MMM-YYYY [at] HH:mm")}
                                                    </IonBadge>
                                                </IonItem>
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
                                                <IonCardContent>{info.post_comment}</IonCardContent>
                                                <IonItem>
                                                    <IonBadge color="medium">Comment Updated on:
                                                        {info.post_comment_updated && format(new Date(info.post_comment_updated), " DD-MMM-YYYY [at] HH:mm")}</IonBadge>
                                                </IonItem>
                                            </IonCard>
                                        </IonCol> */}
                                    </IonRow>
                                </IonCard>
                                </IonCol>

                            </IonRow>
                        </IonGrid>}

                </div>
            </IonContent >

            <IonFooter>
                <IonToolbar color="primary">
                    &emsp;<IonIcon icon={calendarOutline} />&emsp;
                    <b>&thinsp;Updated Date:
                        {info.updated_at && format(new Date(info.updated_at), " MM-DD-YYYY HH:mm")}</b>

                    <IonButton color="success" slot="end" onClick={save} >
                        &emsp;<IonIcon icon={checkmarkDoneSharp} />
                        &emsp;Edit completed&emsp;&emsp;
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage >
    );
};
