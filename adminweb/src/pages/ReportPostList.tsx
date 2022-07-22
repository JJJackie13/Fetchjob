import React, { useState } from 'react';
import { IonContent, IonGrid, IonFab, IonButtons, IonBadge, IonFabButton, IonAvatar, IonChip, IonSpinner, useIonToast, IonSearchbar, IonRow, IonCol, IonHeader, IonIcon, IonButton, IonLabel, IonPage, IonTitle, IonToolbar, IonCard, IonItem, IonFooter, IonMenuButton, IonProgressBar, IonCardContent } from '@ionic/react';
import { person, refreshOutline, addOutline, caretForwardSharp, caretBackSharp, arrowBack } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { format } from 'fecha';
import { getAPIResult } from '../helpers/api';
import { useParams } from "react-router-dom";
const { REACT_APP_API_SERVER } = process.env;

export const ReportPostList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allReport, setAllReport] = useState<any[]>([]);
    let params = useParams<any>()
    let id = params.id

    async function fetchPostReport() {
        try {
            console.log(id)
            setIsLoading(true);
            const res = await fetch(
                `${REACT_APP_API_SERVER}/report/repoByPostId/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const json = await res.json()
            const { allReport } = json;
            console.log('All Report:', allReport)
            setAllReport(allReport);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        fetchPostReport();
    }, [id]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>#{id} Posts Report List</IonTitle>
                    <IonButton slot="end" routerLink={"/InfoPost/" + id} >
                        <IonIcon icon={arrowBack} ></IonIcon>&ensp;Post
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent color="light">
                <IonGrid>
                    <hr></hr>&ensp;&ensp;&ensp;
                    <IonBadge>&ensp;&ensp;&ensp;&ensp;
                        #{id} Posts Report Total Number: {allReport.length}
                        &ensp;&ensp;&ensp;&ensp; </IonBadge>
                    <hr></hr>
                    <IonItem color="tertiary">
                        <IonLabel><b>Reporter Id </b></IonLabel>
                    </IonItem>
                    {isLoading
                        ? <div><IonProgressBar type="indeterminate" /></div>
                        : allReport
                            .map(post_reports =>
                                <IonCard key={post_reports.report_id} className="list_row">

                                    <IonItem >
                                        <IonBadge color="success">{post_reports.reporter_id} </IonBadge>&ensp;&ensp;
                                        <IonBadge color="success">Reporter Name:&ensp;{post_reports.reporter_name} </IonBadge>
                                        <div slot="end" style={{ display: 'flex' }}>
                                            <IonAvatar slot="end" className="postIconSize">
                                                <img src={post_reports.user_avatar || '/assets/icon/favicon.png'}
                                                    alt='user avatar' />
                                            </IonAvatar>
                                            <div>
                                                {post_reports.user_verified ? (
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
                                        {post_reports.content}
                                    </IonCardContent>
                                    <IonItem>
                                        <IonBadge color="success" slot="start">
                                            {post_reports.updated_at && format(new Date(post_reports.updated_at), "[on] DD-MMM-YYYY [at] HH:mm")}
                                        </IonBadge>
                                        <IonButton slot="end" routerLink={"/UserInfo/" + post_reports.user_id}>
                                            <IonIcon icon={person} />
                                        </IonButton>
                                    </IonItem>
                                </IonCard>
                            )}
                </IonGrid>



                <IonFooter>
                    <IonToolbar color="primary">
                        <IonButton slot="end" onClick={() => fetchPostReport()} >
                            <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                        </IonButton>
                    </IonToolbar>
                </IonFooter>

            </IonContent>
        </IonPage>
    );
};



////////////////////////////////////////////////////////////////////

