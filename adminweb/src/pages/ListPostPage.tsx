import React, { useState } from 'react';
import { IonContent, IonHeader, useIonToast, IonFooter, IonGrid, IonBadge, IonSpinner, IonAvatar, IonSearchbar, IonPage, IonRow, IonCol, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonImg, IonButtons, IonMenuButton, IonProgressBar } from '@ionic/react';
import { caretBackSharp, caretForwardSharp, list, refreshOutline } from 'ionicons/icons';
import './Page.css';
import { useEffect } from 'react';
import { getAPIResult } from '../helpers/api';
import { format } from 'fecha';
const { REACT_APP_API_SERVER } = process.env;

export const PostPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [present, dismiss] = useIonToast();
    const [page, setPage] = useState(0);
    const itemPerPage = 4;
    const maxPage = Math.ceil(allPosts.length / itemPerPage)
    async function fetchAllPosts() {
        try {
            // setIsLoading(true);
            let param = new URLSearchParams()
            param.set("q", searchText)
            const json = await getAPIResult(fetch(
                `${REACT_APP_API_SERVER}/user/allPostsList?${param}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            ));
            if (json.success) {
                const { allPosts } = json;
                console.log('set all post:', allPosts)
                setAllPosts(allPosts);
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
        fetchAllPosts();
    }, [searchText]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Posts List</IonTitle>

                    <IonButton slot="end" onClick={() => fetchAllPosts()} >
                        <IonIcon icon={refreshOutline} ></IonIcon>&ensp;Refresh
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent color="light">
                <IonGrid>
                    <IonRow>
                        <IonCol size="1"></IonCol>
                        <IonCol> <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
                        </IonCol>
                        <IonCol size="1"></IonCol>
                    </IonRow>

                    <hr></hr>&ensp;&ensp;&ensp;&ensp;
                    <IonBadge>&ensp;&ensp;&ensp;
                        Total Number: {allPosts.length}
                        &ensp;&ensp;&ensp; </IonBadge>
                    <hr></hr>
                    <IonItem color="tertiary">
                        <IonLabel><b>POST ID</b></IonLabel>
                        <IonLabel slot="end"><b>ICON</b></IonLabel>
                    </IonItem>
                    {isLoading
                        ? <div><IonProgressBar type="indeterminate" /></div> :
                        allPosts
                            .slice(itemPerPage * page, itemPerPage * (page + 1))
                            .map(posts =>
                                <IonCard key={posts.id} className="list_row">
                                    <IonCol >
                                        <IonItem >
                                            <IonBadge color="medium">{posts.id}.</IonBadge>&emsp;
                                            <IonBadge color="primary">{posts.post_user_name}</IonBadge>
                                            <IonBadge color="primary">{posts.comany_name}</IonBadge>
                                            <div slot="end" style={{ display: 'flex' }}>
                                                <IonAvatar slot="end" className="postIconSize">
                                                    <img src={posts.post_user_icon || posts.post_company_icon || '/assets/icon/favicon.png'}
                                                        alt='user avatar' />
                                                </IonAvatar>
                                                <div>
                                                    {posts.post_company_verified ? (
                                                        <IonBadge color="warning">V</IonBadge>
                                                    ) : (
                                                        <IonBadge
                                                            color="medium"
                                                            style={{ opacity: '0' }}
                                                        >V</IonBadge>
                                                    ) || posts.post_user_verified ? (
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
                                        <IonCardContent>

                                            <img height="100pt" width="100pt"
                                                src={posts.post_image || '/assets/icon/favicon.png'}
                                                alt='avatar' />

                                            &emsp;&emsp;
                                            {posts.content}
                                        </IonCardContent>
                                        <IonItem>
                                            &emsp;&emsp;
                                            <IonBadge color="medium" >
                                                {posts.updated_at && format(new Date(posts.updated_at), "[on] DD-MMM-YYYY [at] HH:mm")}
                                            </IonBadge>
                                            <IonButton slot="end" color="success" routerLink={"/InfoPost/" + posts.id}>&emsp;View&emsp;</IonButton>
                                        </IonItem>
                                    </IonCol>
                                </IonCard>
                            )}
                </IonGrid>
                <div className="ion-text-center" margin-bottom="30px">
                    <IonBadge color="primary">&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                        page: {page + 1}/{maxPage}
                        &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;  </IonBadge>
                </div>
                <hr></hr>
                <IonFooter>
                    <IonToolbar color="primary">
                        &emsp;&emsp;
                        <IonButton slot="start" onClick={() => setPage(page - 1)} disabled={page <= 0}>
                            <IonIcon icon={caretBackSharp} />
                            &emsp;Prev Page
                        </IonButton>
                        <IonButton slot="end" onClick={() => setPage(page + 1)} disabled={page + 1 >= maxPage}>
                            <IonIcon icon={caretForwardSharp} />
                            &emsp;  Next Page
                        </IonButton>
                    </IonToolbar>
                </IonFooter>

            </IonContent>
        </IonPage>
    );
};