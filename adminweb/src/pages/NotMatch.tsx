import {
    IonButtons,
    IonCard,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar,
} from '@ionic/react'
import { useLocation, useParams } from 'react-router'
import Data from '../components/Data'
import './Page.css'

const NotMatch: React.FC = () => {
    const location = useLocation()

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="danger">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Page not Found</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" color="light">
                <IonCard >
                    <IonGrid>
                        <IonRow>
                            <IonCol size="3"></IonCol>
                            <IonCol size="6">
                                <img height="67px" width="200px" src='/assets/icon/404page.png' />
                                <Data data={location} />
                            </IonCol>
                            <IonCol size="3"></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default NotMatch
