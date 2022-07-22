import React, { useState } from 'react';
import { IonContent, IonGrid, IonFab, IonButtons, IonBadge, IonFabButton, IonAvatar, IonChip, IonSpinner, useIonToast, IonSearchbar, IonRow, IonCol, IonHeader, IonIcon, IonButton, IonLabel, IonPage, IonTitle, IonToolbar, IonCard, IonItem, IonFooter, IonMenuButton, IonProgressBar } from '@ionic/react';
import { person, refreshOutline, addOutline, caretForwardSharp, caretBackSharp } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { getAPIResult } from '../helpers/api';
const { REACT_APP_API_SERVER } = process.env;

export const UsersPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('');
    const [allUser, setAllUser] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [present, dismiss] = useIonToast()
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1)
    const itemPerPage = 4;

    async function fetchAllUser() {
        try {
            // setIsLoading(true);
            let param = new URLSearchParams()
            param.set("name", searchText)
            param.set("category", category)
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/user/allUserList?${param}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            ));
            if (json.success) {
                const { allUser } = json;
                console.log('set all user:', allUser)
                setAllUser(allUser);
                let max = Math.ceil(allUser.length / itemPerPage)
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
        fetchAllUser();
    }, [searchText]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Users List</IonTitle>

                    <IonButton slot="end" onClick={() => fetchAllUser()} >
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
                                <IonSearchbar value={searchText} onIonChange={
                                    e => setSearchText(e.detail.value!)}>
                                </IonSearchbar>
                            </IonCol>
                            <IonCol size="1"></IonCol>
                        </IonRow>
                        <hr></hr>&ensp;&ensp;&ensp;
                        <IonBadge>&ensp;&ensp;&ensp;&ensp;
                            Total Number: {allUser.length}
                            &ensp;&ensp;&ensp;&ensp; </IonBadge>
                        <hr></hr>
                        <IonItem color="tertiary">
                            <IonLabel><b>LOGO</b></IonLabel>
                            <IonLabel><b>NAME</b></IonLabel>
                            <IonLabel><b>EMAIL</b></IonLabel>
                            <IonLabel><b>PHONE</b></IonLabel>
                            <IonLabel slot="end"><b>OPERATE</b></IonLabel></IonItem>
                        {isLoading
                            ? <div><IonProgressBar type="indeterminate" /></div>
                            : allUser
                                // .slice(itemPerPage * page, itemPerPage * (page + 1))
                                .slice(itemPerPage * (page - 1), itemPerPage * (page))
                                .map(users =>
                                    <IonRow key={users.id} className="list_row">
                                        <IonCol>
                                            <IonItem routerLink={"/UserInfo/" + users.id}>
                                                <div slot="start" style={{ display: 'flex' }}>
                                                    <IonAvatar slot="start" className="iconSize">
                                                        <img src={users.avatar || '/assets/icon/favicon.png'}
                                                            alt='avatar' />
                                                    </IonAvatar>
                                                    <div>
                                                        {users.is_verified ? (
                                                            <IonBadge color="warning">V</IonBadge>
                                                        ) : (
                                                            <IonBadge
                                                                color="medium"
                                                                style={{ opacity: '0' }}
                                                            >V</IonBadge>
                                                        )}
                                                    </div>
                                                </div>
                                                <IonBadge color="medium">{users.id}.</IonBadge>&ensp;
                                                <IonLabel>{users.first_name}&ensp;{users.last_name}</IonLabel>
                                                <IonLabel>{users.email}</IonLabel>
                                                <IonLabel>{users.phone || '/'}</IonLabel>
                                                <IonButton slot="end" color="success" routerLink={"/UserInfo/" + users.id}>
                                                    &emsp;View&emsp;
                                                </IonButton>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>)
                        }
                    </IonGrid>
                </IonCard>

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



////////////////////////////////////////////////////////////////////

