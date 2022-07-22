import React, { useState } from 'react';
import { Bar, Doughnut, defaults, Line } from 'react-chartjs-2';
import { IonContent, IonGrid, IonAvatar, IonRow, IonRefresherContent, IonCol, IonHeader, IonIcon, IonButton, IonLabel, IonPage, IonTitle, IonToolbar, IonCard, IonItem, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButtons, IonMenuButton, IonBadge, IonProgressBar, useIonToast } from '@ionic/react';
import { business, people, receipt, refreshSharp } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { getAPIResult } from '../helpers/api';

const { REACT_APP_API_SERVER } = process.env;




/////////////////////////////////////////////
const VerticalBar: React.FC<any> = ({ dataset }) => {

    const data = {
        labels: ['Users', 'Companies', 'Company Owners', 'Posts'],
        datasets: [
            {
                data: dataset,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    // 'rgba(153, 102, 255, 0.2)',
                    // 'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    // 'rgba(153, 102, 255, 1)',
                    // 'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },


        ],
    };


    return (
        <>
            <IonGrid>
                <IonRow>

                    <IonCol>
                        <IonCard className="chartCard">
                            <div className='header'>
                                <h1 className='title'>Number of people established in 2021</h1>
                            </div>
                            <Bar data={data} />
                        </IonCard>
                    </IonCol>

                </IonRow>
            </IonGrid>
        </>)
};


/////////////////////////////1. user month///////////////////////////////////
const HorizontalBarChart: React.FC<any> = ({ datasetM }) => {
    console.log("datasetM", datasetM)
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Number of Users',
                data: datasetM,
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonCard className="chartCard">
                            <div className='header'>
                                <IonBadge color="success">
                                    Create a monthly statistics line chart for User:
                                </IonBadge>
                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                <IonButton slot="end" fill="outline" routerLink={"/Users"}>
                                    <IonIcon icon={people} />
                                </IonButton>
                            </div>

                            <Line data={data} options={options} />
                        </IonCard>
                    </IonCol>

                </IonRow>
            </IonGrid>
        </>
    );
}
/////////////////////////////1。5///////////////////////////////////
const Horizontal: React.FC<any> = ({ datasetM }) => {
    console.log("datasetM", datasetM)
    const data = {
        datasets: [
            {
                label: 'Number of Users',
                data: datasetM,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    };

    return (
        <>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonCard className="chartCard">
                            <div className='header'>
                                <IonBadge color="success">
                                    Create monthly statistics pie chart for User:
                                </IonBadge>

                            </div>
                            <Doughnut data={data} />
                        </IonCard>
                    </IonCol>

                </IonRow>
            </IonGrid>
        </>
    );
}
const HorizontalCom: React.FC<any> = ({ datasetC }) => {
    console.log("datasetM", datasetC)
    const data = {
        datasets: [
            {
                label: 'Number of Users',
                data: datasetC,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    };

    return (
        <>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonCard className="chartCard">
                            <div className='header'>
                                <IonBadge color="success">
                                    Create monthly statistics pie chart for Company:
                                </IonBadge>

                            </div>
                            <Doughnut data={data} />
                        </IonCard>
                    </IonCol>

                </IonRow>
            </IonGrid>
        </>
    );
}
////////////////////////////2////////////////////////////////////
const HorizontalBarCo: React.FC<any> = ({ datasetC }) => {
    console.log("datasetC", datasetC)
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Number of Companies',
                data: datasetC,
                fill: false,
                borderColor: 'rgba(153, 102, 255, 0.2)',
                backgroundColor: 'rgba(153, 102, 255, 1)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };


    return (
        <>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonCard className="chartCard">
                            <div className='header'>
                                <IonBadge color="success">
                                    Number of established Companies per month
                                </IonBadge>
                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                <IonButton slot="end" fill="outline" routerLink={"/Company"}>
                                    <IonIcon icon={business} />
                                </IonButton>

                            </div>
                            <Line data={data} options={options} />
                        </IonCard>
                    </IonCol>

                </IonRow>
            </IonGrid>
        </>
    );
}




const HorizontalBarPost: React.FC<any> = ({ datasetP }) => {

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                data: datasetP,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },


        ],
    };


    return (
        <>
            <IonGrid>
                <IonRow>

                    <IonCol>
                        <IonCard className="chartCard">
                            <div className='header'>

                                <h5> Number of established Posts per month</h5>

                                <IonButton slot="end" fill="outline" routerLink={"/Posts"}>
                                    <IonIcon icon={receipt} />
                                </IonButton>
                            </div>
                            <Bar data={data} />
                        </IonCard>
                    </IonCol>

                </IonRow>
            </IonGrid>
        </>)
};


////////////////////////////////////////////////////////////////

export const Dashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [present, dismiss] = useIonToast()
    const [userYear, setUserYear] = useState<number>();
    const [companyYear, setCompanyYear] = useState<number>();
    const [ownerYear, setOwnerYear] = useState<number>();
    const [postYear, setPostYear] = useState<number>();
    const [dataset, setDataset] = useState([0, 0, 0, 0]);

    const [userMonth, setUserMonth] = useState<number>();
    const [datasetM, setDatasetM] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    const [companyMonth, setCompanyMonth] = useState<number>();
    const [datasetC, setDatasetC] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    const [postMonth, setPostMonth] = useState<number>();
    const [datasetP, setDatasetP] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])



    async function dash() {
        try {
            const res = await fetch(
                `${REACT_APP_API_SERVER}/user/dashBoard`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const parseRes = await res.json()
            if (res.ok) {
                console.log("userYear", parseRes.userYear)
                console.log("companyYear", parseRes.companyYear)
                console.log("ownerYear", parseRes.ownerYear)
                console.log("postYear", parseRes.postYear)
                console.log("userMonth", parseRes.userMonth)
                setUserYear(parseRes.userYear[0].year)
                setCompanyYear(parseRes.companyYear[0].year)
                setOwnerYear(parseRes.ownerYear[0].year)
                setPostYear(parseRes.postYear[0].year)
                setDataset([
                    parseRes.userYear[0].number_of_new_register_user,
                    parseRes.companyYear[0].number_of_new_register_company,
                    parseRes.ownerYear[0].number_of_new_register_company_owner,
                    parseRes.postYear[0].number_of_new_register_post
                ])
                setUserMonth(parseRes.userMonth.map((obj: any) => obj.month))
                setDatasetM(
                    parseRes.userMonth.map((obj: any) => parseInt(obj.number_of_new_user_month))
                )
                setCompanyMonth(parseRes.companyMonth.map((obj: any) => obj.month))
                setDatasetC(
                    parseRes.companyMonth.map((obj: any) => parseInt(obj.number_of_new_co_month))
                )
                setPostMonth(parseRes.postMonth.map((obj: any) => obj.month))
                setDatasetP(
                    parseRes.postMonth.map((obj: any) => parseInt(obj.number_of_new_post_month))
                )

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
    useEffect(() => {
        dash()
    }, [isLoading])
    useEffect(() => {
        console.log(datasetM)
    }, [datasetM])



    return (
        <IonPage>

            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Dashboard</IonTitle>
                    <IonButton slot="end" >
                        {/* onClick={loadReportList} */}
                        <IonIcon icon={refreshSharp} />&ensp;Refresh
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent color="light">
                {isLoading ? <div ><IonProgressBar type="indeterminate" /></div> :
                    <>
                        <IonGrid>
                            <IonItem color="tertiary"><IonLabel><b>Establish monthly statistics for Company and User:</b></IonLabel></IonItem>
                            <IonRow>
                                <IonCol size="6"> <Horizontal datasetM={datasetM} /></IonCol>
                                <IonCol size="6"> <HorizontalCom datasetC={datasetC} /></IonCol>
                                <IonCol size="12"> <HorizontalBarChart datasetM={datasetM} /></IonCol>
                                <IonCol size="12"> <HorizontalBarCo datasetC={datasetC} /></IonCol>

                            </IonRow>
                            <IonItem color="tertiary"><IonLabel><b>Establish monthly statistics for Post:</b></IonLabel></IonItem>
                            <IonRow>
                                <IonCol> <HorizontalBarPost datasetP={datasetP} /></IonCol>
                            </IonRow>

                            <IonItem color="tertiary"><IonLabel><b>Average number of posts created per month:</b></IonLabel></IonItem>
                            <IonRow>
                                <IonCol> <VerticalBar dataset={dataset} /></IonCol>
                            </IonRow>
                        </IonGrid>
                    </>
                }

            </IonContent>

        </IonPage >
    );
};



////////////////////////////////////////////////////////////////////

