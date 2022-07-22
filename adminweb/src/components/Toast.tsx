import { useIonRouter } from '@ionic/react';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export const ToastExample: React.FC = () => {
    const notify = () => toast("Wow so easy!");

    return (
        <div>
            <button onClick={notify}>Notify!</button>
            <ToastContainer />
        </div>
    );
};

export const notify = (content: string, onClick?: () => void) => toast(<div onClick={onClick}>
    {content}
</div>);

export const TestReportToast: React.FC = () => {
    const router = useIonRouter()
    return (
        <div>
            <button onClick={() => notify("Test Report Notice!", () => router.push('/Report'))}>
                Test Report Notice
            </button>
            <ToastContainer />
        </div>
    );
};
