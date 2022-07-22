import React, { useState } from 'react';
import { IonContent, IonGrid, IonAvatar, IonRow, IonButtons, IonCol, IonBadge, IonHeader, IonChip, IonIcon, IonButton, IonLabel, IonPage, IonTitle, IonToolbar, IonCard, IonItem, IonFab, IonFabButton, IonCardTitle, IonCardContent, IonSpinner, IonSearchbar, useIonToast, IonFooter, IonMenuButton, IonProgressBar } from '@ionic/react';
import { refreshOutline, caretBackSharp, caretForwardSharp } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { getAPIResult } from '../helpers/api';
const { REACT_APP_API_SERVER } = process.env;

export const CompanyPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('');
    const [allCompany, setAllCompany] = useState<any[]>([]);
    const [allType, setAllType] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [present, dismiss] = useIonToast()
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1)
    const itemPerPage = 4;

    async function fetchAllCompany() {
        try {
            // setIsLoading(true);
            let param = new URLSearchParams()
            param.set("name", searchText)
            param.set("category", category)
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/company/getCompanyList?${param}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            ));
            if (json.success) {
                const { allCompany, allType } = json;
                console.log('set all company:', allCompany)
                setAllCompany(allCompany);
                setAllType(allType);
                let max = Math.ceil(allCompany.length / itemPerPage)
                setMaxPage(max)
                if (page > max) {
                    setPage(max)
                }
                if (max === 0) {
                    setPage(1)
                    setMaxPage(1)
                }
                setIsLoading(false);
            }

        } catch (error) {
            present({
                message: (error as Error).toString(),
                duration: 5000,
                buttons: [{ text: 'Dismiss', handler: () => dismiss() }]
            })
        }
        setIsLoading(false);
    }
    useEffect(() => {
        fetchAllCompany();
    }, [searchText, category]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Company List</IonTitle>

                    <IonButton slot="end" onClick={() => fetchAllCompany()} >
                        <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent color="light">
                <IonCard>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="1"></IonCol>
                            <IonCol>
                                <IonSearchbar value={searchText} onIonChange={e => {
                                    setSearchText(e.detail.value!)
                                }}></IonSearchbar>
                            </IonCol>
                            <IonCol size="1" ></IonCol>
                        </IonRow>
                        <IonRow className="rowTop">
                            <IonCol size="1"></IonCol>
                            <IonCol>
                                {allType.map(row =>
                                    <IonChip
                                        style={{
                                            userSelect: 'none'
                                        }}
                                        key={row.id}
                                        onClick={e => {
                                            if (category === row.id) {
                                                setCategory('')
                                            } else {
                                                setCategory(row.id)
                                            }
                                        }}
                                        color={row.id === category ? 'success' : 'tertiary'}

                                    >
                                        {row.name}
                                    </IonChip>)
                                }
                            </IonCol>

                        </IonRow>
                        &ensp;&ensp;&ensp;&ensp;
                        <IonBadge>&ensp;&ensp;&ensp;
                            Total Number: {allCompany.length}
                            &ensp;&ensp;&ensp; </IonBadge>
                        <hr></hr>
                        <IonItem color="tertiary">
                            <IonLabel><b>LOGO</b></IonLabel>
                            <IonLabel><b>COMPANY</b></IonLabel>
                            <IonLabel><b>EMAIL</b></IonLabel>
                            <IonLabel><b>PHONE</b></IonLabel>
                            <IonLabel slot="end"><b>OPERATE</b></IonLabel></IonItem>
                        {isLoading
                            ? <div ><IonProgressBar type="indeterminate" /></div>
                            : allCompany
                                .slice(itemPerPage * (page - 1), itemPerPage * (page))
                                .map(companies =>
                                    <IonRow key={companies.id} className="list_row">
                                        <IonCol >
                                            <IonItem routerLink={"/CompanyInfo/" + companies.id} >
                                                <div slot="start" style={{ display: 'flex' }}>
                                                    <IonAvatar slot="start" className="iconSize">
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
                                                <IonBadge color="medium">{companies.id}.</IonBadge>&ensp;
                                                <IonLabel>{companies.company_name}</IonLabel>
                                                <IonLabel>{companies.email}</IonLabel>
                                                <IonLabel>{companies.phone} </IonLabel>
                                                <IonButton slot="end" color="success" routerLink={"/CompanyInfo/" + companies.id}>
                                                    &emsp;View&emsp;
                                                </IonButton>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>)}
                    </IonGrid>
                </IonCard>

                <div className="ion-text-center" margin-bottom="30px">
                    <IonBadge color="primary">&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                        page: {page}/{maxPage}
                        &ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </IonBadge>
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

