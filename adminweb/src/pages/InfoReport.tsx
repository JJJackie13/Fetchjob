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
    IonFooter, IonList, IonButtons, IonIcon, IonLoading, useIonToast, IonCard, IonCardContent, IonInput, IonBadge, IonToggle, IonSpinner, useIonAlert, IonCheckbox, IonProgressBar
} from "@ionic/react";
import { business, alertCircle, refreshOutline, calendarOutline, ellipsisVertical, arrowBack, createSharp, chatboxEllipsesSharp, checkmarkDoneSharp, chatboxEllipses, mailUnread, people, personOutline } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getAPIResult, } from "../helpers/api";
import { format } from 'fecha';
import Data from '../components/Data'
import { useObjectState } from "../hooks/use-object-state";
const { REACT_APP_API_SERVER } = process.env;




export const ReportInfo: React.FC = () => {
    const [info, setReportInfo] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSolved, setIsSolved] = useState<boolean>();
    const [present, dismiss] = useIonToast()
    let { report_id, report_table } = useParams<any>()
    const [type, setType] = useState<string>("")
    const [imageLabel, setImageLabel] = useState<string>("")
    const [goUrl, setGoUrl] = useState<string>("")

    // let type = info.report_table
    // if (type) {
    //     type = type[0].toUpperCase() + type.slice(1)
    // }
    async function fetchGetReportInfo() {
        try {
            let token = localStorage.getItem('token')
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/admin/ReportInfo/${report_table}/${report_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            ));
            if (json.success) {
                console.log(json.result)
                setReportInfo(json.result);
                setIsSolved(json.result.is_solved)
                if (json.result.report_table) {
                    setType(json.result.report_table[0].toUpperCase() + json.result.report_table.slice(1))
                }
                initImgLabelAndUrl()
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
    }

    function defineType(data: any): string {
        let type = "";
        if (data.company_id) {
            type = data.company_id + "?type=company"
        } else if (data.user_id) {
            type = data.user_id + "?type=user"
        } else if (data.post_id) {
            type = data.post_id + "?type=post"
        }
        return type
    }

    useEffect(() => {
        fetchGetReportInfo();
    }, [report_id, report_table]);

    async function save() {
        try {
            let body = { is_solved: isSolved };

            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/admin/ReportResolve/${report_table}/${report_id}`,
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
            console.log(json.result.solved_at)
        } catch (error) {
            console.log('Failed', error);
        }
    }


    function initImgLabelAndUrl() {
        switch (info.report_table) {
            case 'company':
                setImageLabel('Company Logo')
                break
            case 'user':
                setImageLabel('User Icon')
                break
            case 'post':
                setImageLabel('Post Image')
                break
        }

        switch (info.report_table) {
            case 'company':
                setGoUrl("/companyInfo/")
                break
            case 'user':
                setGoUrl("/UserInfo/")
                break
            case 'post':
                setGoUrl("/InfoPost/")
                break
        }
    }


    return (

        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButton routerLink={"/Report"} slot="start">
                        <IonIcon icon={arrowBack} ></IonIcon>
                    </IonButton>
                    <IonTitle className="ion-title"><IonIcon icon={chatboxEllipses} />&thinsp;Report Information</IonTitle>

                    <IonButton slot="end" color="primary" onClick={() => fetchGetReportInfo()} >
                        <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent className="contentItem" color="light">
                <div>

                    {isLoading ? <div ><IonProgressBar type="indeterminate" /></div>
                        :
                        <IonGrid >
                            <IonRow>
                                {/* {JSON.stringify(info)} */}
                                <IonCol ><IonCard>
                                    <IonItem color="dark">
                                        <IonRow>
                                            <IonCol>
                                                <IonLabel >
                                                    <b>#{info.report_id}&ensp;Report Details</b>
                                                </IonLabel>
                                            </IonCol>
                                        </IonRow>
                                    </IonItem>


                                    <IonRow>

                                        <IonCol size="9">
                                            <IonItem >
                                                <IonBadge color="dark">
                                                    Reporter Name:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.reported_user_name} />
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="3">
                                            <IonButton color="dark" fill="outline" routerLink={"/UserInfo/" + info.reporter_id}>View Archive</IonButton>
                                        </IonCol>


                                        <IonCol size="9">
                                            <IonItem>
                                                <IonBadge color="dark">
                                                    Report Type:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.report_type_name} />
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonLabel position="floating">
                                                    <IonBadge color="dark">
                                                        Report Remark:
                                                    </IonBadge>
                                                </IonLabel>
                                                <hr></hr>
                                                <IonCardContent>{info.report_remark}</IonCardContent>
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12">
                                            <IonItem>
                                                <IonBadge color="dark">
                                                    Report Updated Time:
                                                </IonBadge>&emsp;
                                                <IonInput disabled value={info.report_updated_time} />
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonItem></IonItem>

                                    <IonItem color="dark"><IonIcon icon={mailUnread} /><IonLabel>&emsp;<b>Admin Solved:</b></IonLabel>
                                        {!isSolved ? (
                                            <IonCheckbox slot="end" checked={false} color="danger" onIonChange={e => setIsSolved(e.detail.checked)} />
                                        ) : (
                                            <IonCheckbox slot="end" color="warning"
                                                checked={true} onIonChange={e => setIsSolved(e.detail.checked)} />
                                        )}
                                    </IonItem>

                                    <IonItem></IonItem>

                                    <IonItem color="tertiary">
                                        <IonLabel><IonIcon icon={ellipsisVertical} /><b>Report {type} Object</b></IonLabel>
                                        <IonButton color="success" slot="end" routerLink={goUrl + info.target_name_id}>&emsp;Check the {type}&emsp;</IonButton>
                                        {/* <IonButton slot="end" color="success" routerLink={"/Report/" + info.report_table}>&emsp;learn more&emsp;</IonButton> */}
                                    </IonItem>


                                    <div className='ion-text-center' style={{ display: 'flex', justifyContent: 'center', margin: '1em' }}>
                                        <IonBadge color="success" style={{ margin: 'auto 1em' }}>
                                            {imageLabel}:
                                            {/* {type} Id:&emsp;{info.target_name_id} */}
                                        </IonBadge>
                                        <img height="100pt" width="100pt" src={info.target_name_img || '/assets/icon/favicon.png'}
                                        />
                                        {/* alt="company_logo" */}
                                    </div>

                                    {/* <IonRow>

                                        <IonCol size="6">
                                            <IonLabel>
                                                <IonBadge slot="start" color="success">
                                                    {imageLabel}:
                                                    {type} Id:&emsp;{info.target_name_id}
                                                </IonBadge>
                                            </IonLabel>
                                            <IonCardContent>
                                                <img height="100pt" width="100pt" src={info.target_name_img}
                                                    alt="company_logo" />
                                            </IonCardContent>
                                        </IonCol>
                                        <IonCol size="2"></IonCol>
                                        <IonCol size="5">
                                                                                        
                                                <IonBadge color="success" >
                                                    {type} Id:&emsp;{info.target_name_id}
                                                </IonBadge>
                                           
                                        </IonCol>
                                    </IonRow> */}

                                    <IonRow>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonLabel position="floating">
                                                    <IonBadge color="success">
                                                        {type} Content:
                                                    </IonBadge>
                                                </IonLabel>
                                                <br></br>
                                                <IonCardContent >{info.target_name}</IonCardContent>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12">


                                            {/* <IonBadge color="success">
                                                    {type} Updated Time:
                                                </IonBadge> */}

                                            &emsp;<IonBadge color="success">
                                                {type} Updated Time:  {info.target_updated_at && format(new Date(info.target_updated_at), " MM-DD-YYYY HH:mm")}
                                            </IonBadge>
                                            {/* {info.target_updated_at && format(new Date(info.target_updated_at), " MM-DD-YYYY HH:mm")} */}


                                        </IonCol>

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
                    <b>&thinsp;Solved Date:
                        {info && info.solved_at && format(new Date(info.solved_at), " MM-DD-YYYY HH:mm")}</b>

                    <IonButton color="success" slot="end" onClick={save} >
                        &emsp;<IonIcon icon={checkmarkDoneSharp} />
                        &emsp;Edit completed&emsp;&emsp;
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage >
    );
};
