import {
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
} from '@ionic/react'
import { useState } from 'react'

export type ObjectStateFlag = 'disabled'
export function useObjectState<Data extends object>() {
    const [data, setData] = useState<Data>()
    function input(field: string, flag?: ObjectStateFlag) {
        const value = (data as any)[field]
        return (
            <>
                <IonItem>
                    <IonLabel position="floating">{field}</IonLabel>
                    <IonInput
                        disabled={flag === 'disabled'}
                        value={value}
                        onIonChange={e => {
                            setData({ ...(data as any), [field]: e.detail.value })
                        }}>
                    </IonInput>
                </IonItem>
            </>
        )
    }

    function select(
        field: string,
        options: Array<{ value: string; text: string }>,
        flag?: ObjectStateFlag,
    ) {
        let value = (data as any)[field]
        if (value === null) {
            value = ''
        } else {
            value = value.toString()
        }
        return (
            <>
                <IonItem>
                    <IonLabel position="floating">
                        {field}: {value}
                    </IonLabel>
                    <IonSelect
                        disabled={flag === 'disabled'}
                        value={value}
                        onIonChange={e => {
                            setData({ ...(data as any), [field]: e.detail.value })
                        }}
                    >
                        {options.map(option => (
                            <IonSelectOption key={option.value} value={option.value}>
                                {option.text}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                    <IonButton
                        slot="end"
                        color="dark"
                        onClick={() => {
                            setData({ ...(data as any), [field]: null })
                        }}
                    >
                        Clear
                    </IonButton>
                </IonItem>
            </>
        )
    }
    return [data, setData, { input, select }] as const
}