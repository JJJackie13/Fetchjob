import {
    IonAlert,
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage, IonCard, IonGrid, IonHeader, IonCol, IonRow, IonToolbar, IonTitle, IonIcon, useIonToast
} from '@ionic/react';
import { arrowRedo, logOut } from 'ionicons/icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { loginThunk } from '../redux/auth';
import { IRootState } from '../redux/state';



function LoginPage() {
    const history = useHistory();
    const isLoading = useSelector((state: IRootState) => state.auth.isLoading);
    const hasError = useSelector((state: IRootState) => state.auth.errorMessage);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [present, dismiss] = useIonToast()
    const { handleSubmit, register } = useForm();
    const dispatch = useDispatch();

    // LOGIN THUNK
    const onSubmit = () => {
        console.log('admin login button clicked');
        try {
            dispatch(loginThunk({ email, password }, history));
        } catch (error) {
            console.error(error);
            present({
                message: (error as Error).toString(),
                duration: 5000,
                buttons: [{ text: 'Dismiss', handler: () => dismiss() }]
            })
            return;
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle className="ion-title"><IonIcon icon={logOut} />&thinsp;FackJob Admin login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <br></br><br></br>

            <IonContent fullscreen>

                <IonCard>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="2"></IonCol>
                            <IonCol> <img height="67px" width="200px" src='/assets/icon/facejobmenu.png' />

                                <br></br><br></br>
                                <br></br><br></br>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <IonItem>
                                        <IonLabel position="floating">Login Email</IonLabel>
                                        <IonInput
                                            value={email}
                                            required={true}
                                            type="email"
                                            onIonChange={(e) =>
                                                setEmail((e.currentTarget as HTMLInputElement).value)
                                            }
                                            {...register('email')}
                                            disabled={isLoading}
                                        />
                                    </IonItem>
                                    <br></br>
                                    <IonItem>
                                        <IonLabel position="floating">Login Password</IonLabel>
                                        <IonInput
                                            value={password}
                                            required={true}
                                            type="password"
                                            onIonChange={(e) =>
                                                setPassword((e.currentTarget as HTMLInputElement).value)
                                            }
                                            {...register('password')}
                                            disabled={isLoading}
                                        />
                                    </IonItem>
                                    <br></br>
                                    <IonButton
                                        type="submit"
                                        className="ion-margin-top"
                                        expand="full"
                                        disabled={isLoading}
                                    >
                                        LOGIN
                                    </IonButton>
                                </form>
                                <br></br><br></br>
                                <br></br><br></br>
                                <IonAlert
                                    isOpen={!!hasError}
                                    header={'Incorrect login information'}
                                    message={'Please enter the correct login name and password'}
                                    buttons={['OK']}
                                    backdropDismiss={false}
                                />
                                <IonLoading isOpen={isLoading} message={'Processing'} />
                            </IonCol>
                            <IonCol size="2"></IonCol>
                        </IonRow>
                    </IonGrid>

                </IonCard>
            </IonContent>
        </IonPage >
    );
};

export default LoginPage;
