import React, { useState } from 'react';
import { IonContent, IonHeader, IonAvatar, IonPage, IonRow, IonInput, IonTitle, IonCol, IonToolbar, IonCard, IonGrid, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, useIonAlert, useIonLoading, IonSpinner, IonButtons, IonMenuButton, IonBadge, IonFooter, IonProgressBar } from '@ionic/react';
import { trashOutline, addOutline, idCard, pencil, arrowBack, refreshOutline, ellipsisVertical, checkmarkDoneSharp, calendarOutline, arrowUndoOutline } from 'ionicons/icons';
import { useParams } from 'react-router'
import { useEffect } from 'react';
import { getAPIResult } from "../helpers/api";
import { useSelector } from 'react-redux';
import './Page.css';
import { IRootState } from '../redux/state';
import { format } from 'fecha';
const { REACT_APP_API_SERVER } = process.env;
// import ExploreContainer from '../components/ExploreContainer'


export const AdminPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [info, setAdminInfo] = useState<any>({});
    const [firstName, setFirstName] = useState<any>();
    const [lastName, setLastName] = useState<any>();
    const [phone, setPhone] = useState<any>();
    const [address, setAddress] = useState<any>();
    const [presentAlert] = useIonAlert()
    const [present, dismiss] = useIonLoading();

    const id = useSelector((state: IRootState) => state.auth.user?.user_id)
    async function fetchAdminInfo() {
        try {
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/admin/adminInfo/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            ));
            if (json.success) {
                setAdminInfo(json.data);
                setFirstName(json.data.first_name);
                setLastName(json.data.last_name);
                setPhone(json.data.phone);
                setAddress(json.data.address);
                setIsLoading(false);
            }

        } catch (error) {
            console.log("error: ", error);

        }
        setIsLoading(false);
    }
    useEffect(() => {
        fetchAdminInfo();
    }, [id]);
    ///-----
    async function save() {
        try {
            let body = {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                address: address,
            };
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/admin/updateAdmin/${id}`,
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
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle > Admin Management</IonTitle>
                    <IonButton slot="end" onClick={() => fetchAdminInfo()} expand="block">
                        <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent className="contentItem" color="light">
                <IonCard >
                    <IonGrid>
                        <IonRow>
                            <IonCol size="4"></IonCol>
                            <IonCol size="4">
                                <img height="67px" width="200px" src='/assets/icon/facejobmenu.png' />
                            </IonCol>
                            <IonCol size="4"></IonCol>
                        </IonRow>
                    </IonGrid>


                    {isLoading ? <div ><IonProgressBar type="indeterminate" /></div>
                        :
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonRow>
                                        <IonCol size="7">

                                            <IonRow>
                                                <IonCol size="12">
                                                    <IonItem color="secondary">
                                                        <div style={{ display: 'flex' }}>
                                                            <IonAvatar className="postIconSize" slot="stard">
                                                                <img src='/assets/icon/admin.png' />
                                                            </IonAvatar>&ensp;&ensp;
                                                            <IonBadge color="secondary" style={{ display: 'flex' }}>
                                                                Admin Information
                                                            </IonBadge>
                                                        </div>
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>

                                            <IonRow>
                                                <IonCol>
                                                    <IonItem>
                                                        <IonBadge color="success">
                                                            Admin First Name:
                                                        </IonBadge>&emsp;
                                                        <IonInput value={firstName || info.first_name}
                                                            onIonChange={e =>
                                                                setFirstName(e.detail.value)
                                                            } />
                                                    </IonItem>
                                                </IonCol >
                                            </IonRow>

                                            <IonRow>
                                                <IonCol>
                                                    <IonItem>
                                                        <IonBadge color="success">
                                                            Admin Last Name:
                                                        </IonBadge>&emsp;
                                                        <IonInput value={lastName || info.last_name}
                                                            onIonChange={e =>
                                                                setLastName(e.detail.value)
                                                            } />
                                                    </IonItem>
                                                </IonCol >
                                            </IonRow>

                                            <IonRow>
                                                <IonCol>
                                                    <IonItem>
                                                        <IonBadge color="success">
                                                            Admin Email:
                                                        </IonBadge>&emsp;
                                                        <IonInput value={info.email} />
                                                    </IonItem>
                                                </IonCol >
                                            </IonRow>

                                            <IonRow>
                                                <IonCol>
                                                    <IonItem>
                                                        <IonBadge color="success">
                                                            Admin Phone:
                                                        </IonBadge>&emsp;
                                                        <IonInput value={phone || info.phone}
                                                            onIonChange={e =>
                                                                setPhone(e.detail.value)
                                                            } />
                                                    </IonItem>
                                                </IonCol >
                                            </IonRow>


                                            <IonRow>
                                                <IonCol>
                                                    <IonItem>
                                                        <IonBadge color="success">
                                                            Admin Address:
                                                        </IonBadge>&emsp;
                                                        <IonInput value={address || info.address}
                                                            onIonChange={e =>
                                                                setAddress(e.detail.value)
                                                            } />
                                                    </IonItem>
                                                </IonCol >
                                            </IonRow>


                                            <IonRow>
                                                <IonCol>
                                                    <IonItem>
                                                        <IonBadge color="success">
                                                            Login Password:
                                                        </IonBadge>&emsp;
                                                        <IonInput disabled value={info.password} />
                                                    </IonItem>
                                                </IonCol >
                                            </IonRow>
                                            <hr></hr>
                                            <IonRow>
                                                <IonCol size="2"></IonCol>
                                                <IonCol size="6">
                                                    <IonButton color="danger" margin-bottom="20px" href="/login" className="adminButton">
                                                        <IonIcon icon={arrowUndoOutline} slot="start" />
                                                        Logout
                                                    </IonButton>
                                                </IonCol>
                                                <IonCol size="2"></IonCol>
                                            </IonRow>


                                        </IonCol>
                                        <IonCol size="1"></IonCol>
                                        <IonCol size="4">
                                            <div style={{ margin: '30px 0 30px 0' }}></div>
                                            <img src='/assets/icon/adminpage.png' />
                                            <div style={{ margin: '30px 0 100px 0' }}></div>

                                            <img src='/assets/icon/adminpageb.png' />
                                        </IonCol>
                                    </IonRow>

                                </IonCol>
                            </IonRow>
                            {/* <IonRow>
                                <IonCol size="3"></IonCol>
                                <IonCol size="6">
                                    <img src='/assets/icon/adminpageb.png' />
                                </IonCol>
                                <IonCol size="3"></IonCol>
                            </IonRow> */}
                        </IonGrid>}
                </IonCard>
            </IonContent>

            <IonFooter>
                <IonToolbar color="primary">
                    &emsp;<IonIcon icon={calendarOutline} />&emsp;
                    <b>Updated Date:
                        {info.updated_at && format(new Date(info.updated_at), " MM-DD-YYYY HH:mm")}</b>
                    <IonButton color="success" slot="end" onClick={save}>

                        &emsp;<IonIcon icon={checkmarkDoneSharp} />
                        &emsp;Edit completed&emsp;&emsp;
                    </IonButton>
                </IonToolbar>
            </IonFooter>

        </IonPage>
    );
};