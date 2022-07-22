import React, { useState } from 'react';
import { IonContent, IonHeader, IonTextarea, useIonToast, IonFooter, IonGrid, IonBadge, IonSpinner, IonAvatar, IonSearchbar, IonPage, IonRow, IonCol, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonImg, useIonAlert, IonButtons, IonMenuButton, IonSegment, IonLoading, IonSegmentButton, IonRadioGroup, IonListHeader, IonRadio, IonProgressBar } from '@ionic/react';
import { caretBackSharp, caretForwardSharp, chatboxEllipses, chevronBackCircleSharp, refreshOutline, refreshSharp, scanSharp } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { getAPIResult } from '../helpers/api';
import { format } from 'fecha';
import { Link } from 'react-router-dom'

const { REACT_APP_API_SERVER } = process.env;


let filterList = ['All', 'User', 'Company', 'Post']
type Report = {
    reported_user_name: string
    reporter_id: number
    report_updated_time: string
    admin_is_solved: string | null // solved_at timestamp or null
    report_type_name: string // user selected type (text)
    target_name: string // company name or user name or post content
    report_id: number // user_id or company_id or post_id
    reject_reason?: string // to remove

    report_table: 'company' | 'user' | 'post'
}


const ReportManage = (props: {
    report: Report,
    loadReportList: () => void
}) => {
    let { report, loadReportList } = props
    const [reject_reason, set_reject_reason] = useState('')
    const [presentAlert] = useIonAlert()

    return (
        <>
            <IonItem>
                <IonLabel position="floating">Reject Reason</IonLabel>
                <IonTextarea
                    value={reject_reason || report.reject_reason}
                    onIonChange={e => set_reject_reason(e.detail.value || '')}
                />
            </IonItem>
        </>
    )
}

export const ReportPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [isLoading, setLoading] = useState(true)
    const [reportList, setReportList] = useState<Report[]>([])
    const [filter, setFilter] = useState('All')
    const [presentAlert] = useIonAlert()
    const [page, setPage] = useState(1);
    // const [maxPage, setMaxPage] = useState(1)
    const itemPerPage = 4;
    const maxPage = Math.ceil(reportList.length / itemPerPage)
    async function loadReportList() {
        try {
            // setLoading(true);
            let param = new URLSearchParams()
            param.set("name", searchText)
            param.set('filter', filter)
            // const json = await getAPIResult(fetch(
            //     `${REACT_APP_API_SERVER}/admin/reportList?filter=${filter}`,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${localStorage.getItem(
            //                 'token',
            //             )}`,
            //         },
            //     },
            // ));
            const json = await fetch(`${REACT_APP_API_SERVER}/admin/reportList?` + param,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                });
            const parseJson = await json.json()
            if (json.ok) {
                console.log('set all report:', parseJson)

                setReportList(parseJson.report_list.result);
                if (page > maxPage) {
                    setPage(maxPage)
                }
                if (maxPage === 0) {
                    setPage(1)
                }

                setLoading(false);
            }

        } catch (error) {
            setLoading(false)
            presentAlert({
                message: (error as Error).toString(),
                header: 'Failed to load report list',
                buttons: ['Dismiss'],
            })
        }
        setLoading(false);
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
        loadReportList();
    }, [filter, searchText]);


    function Th(props: { hidden?: boolean; children: any }) {
        return (
            <th hidden={props.hidden} >
                <div>
                    {props.children}
                </div>
            </th>
        )
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Report List</IonTitle>
                    <IonButton slot="end" onClick={loadReportList}>
                        <IonIcon icon={refreshSharp} />&ensp;Refresh
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent color="light">
                <IonGrid>
                    <IonRow>
                        <IonCol size="1"></IonCol>
                        {/* <IonLoading message="Loading report list" isOpen={isLoading} /> */}

                        <IonCol> <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
                        </IonCol>
                        <IonSegment
                            mode="ios"
                            value={filter}
                            onIonChange={e => setFilter(e.detail.value || filter)}
                            color="success"
                        >
                            {filterList.map(filter => (
                                <IonSegmentButton value={filter} key={filter}>
                                    <IonLabel>{filter}</IonLabel>
                                </IonSegmentButton>
                            ))}
                        </IonSegment>
                        <IonCol size="1"></IonCol>
                    </IonRow>
                    <hr></hr>
                    <hr></hr>
                    &ensp;&ensp;&ensp;
                    <IonBadge >&ensp;&ensp;&ensp;
                        Total number: {reportList.length}
                        &ensp;&ensp;&ensp;</IonBadge>


                    <IonItem color="tertiary">
                        <IonLabel><b>REPORT ID</b></IonLabel>
                        <IonLabel slot="end"><b>STATUS</b></IonLabel>
                    </IonItem>
                    {isLoading ?
                        <div><IonProgressBar type="indeterminate" /></div>
                        : reportList
                            .slice(itemPerPage * (page - 1), itemPerPage * (page))
                            .map(report => {
                                let type = defineType(report)
                                let detailPageUrl: string = `/ReportInfo/${report.report_table}/${report.report_id}`
                                return <IonCard key={report.report_id} className="list_row" routerLink={detailPageUrl}>
                                    <IonCol >
                                        <IonItem  >
                                            <IonBadge color="medium">
                                                {report.report_id}.
                                            </IonBadge>
                                            &emsp;
                                            <IonBadge color="tertiary" >&ensp;
                                                Reporter:&emsp;{report.reported_user_name}&ensp;
                                            </IonBadge>
                                            &emsp;
                                            <IonBadge color="danger" >&emsp;
                                                Report Time:&emsp;{report.report_updated_time &&
                                                    format(new Date(report.report_updated_time), "[on] DD-MMM-YYYY [at] HH:mm")}
                                                &emsp;</IonBadge>
                                            <div slot="end" style={{ display: 'flex' }}>
                                                <div>
                                                    {report.admin_is_solved ? (
                                                        <IonBadge color="primary">&ensp; ✔ &ensp;Processed&ensp;</IonBadge>
                                                    ) : (
                                                        <IonBadge
                                                            color="dark"
                                                        >&ensp; ● &ensp;Pending&ensp;</IonBadge>
                                                    )}
                                                </div>
                                            </div>
                                        </IonItem >
                                        &emsp;&emsp;&emsp;&emsp;

                                        <IonCardContent>
                                            &emsp;&emsp;&emsp;&emsp;
                                            <IonBadge color="light" >
                                                Report Content:</IonBadge>&emsp;
                                            {report.target_name}
                                        </IonCardContent>

                                        <IonItem>
                                            <IonBadge color="tertiary" >&emsp;
                                                Report Type:&emsp;{report.report_type_name}
                                                &emsp;</IonBadge>
                                            <IonButton slot="end" color="success" routerLink={"/Report/" + type}>&emsp;Check the Details&emsp;</IonButton>
                                            {/* <IonButton slot="end" color="success" routerLink={"/InfoPost/" + report.report_id }>&emsp;Check the Details&emsp;</IonButton> */}
                                        </IonItem>
                                    </IonCol>
                                </IonCard>
                            }
                            )}
                </IonGrid>

                <div className="ion-text-center" margin-bottom="30px">
                    <IonBadge color="primary">&ensp;&ensp;&ensp;&ensp;
                        page: {page}/{maxPage}
                        &ensp;    &ensp;&ensp;&ensp;  </IonBadge>
                </div>
                <hr></hr>
                <IonFooter>
                    <IonToolbar color="primary">
                        &emsp;&emsp;
                        <IonButton slot="start" onClick={() => setPage(page => page - 1)} disabled={page <= 1}>
                            <IonIcon icon={caretBackSharp} />
                            &emsp;Prev Page
                        </IonButton>
                        <IonButton slot="end" onClick={() => setPage(page => page + 1)} disabled={page >= maxPage}>
                            <IonIcon icon={caretForwardSharp} />
                            &emsp;  Next Page
                        </IonButton>
                    </IonToolbar>
                </IonFooter>
            </IonContent>
        </IonPage>
    );







};