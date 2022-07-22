import { IonItem, IonContent, IonPage, IonNote } from '@ionic/react';
import { useSelector } from 'react-redux';
import { IRootState } from '../redux/state';

function NoMatch() {
    const pathname = useSelector((state: IRootState) => state.router.location.pathname);
    return (
        <IonPage>
            <IonContent>
                <IonItem>Page Not Found</IonItem>
                <IonNote>{pathname}</IonNote>
            </IonContent>
        </IonPage>
    );
}

export default NoMatch;
