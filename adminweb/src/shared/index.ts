export type FormFields = {
    label: string;
    props: {
        name: string;
        type?: 'email' | 'password' | 'text' | 'tel';
        required?: boolean;
        placeholder?: string;
        value?: string;
        selectOptions?: SelectOptions[];
        pattern?: string;
        minlength?: number;
        maxlength?: number;
    };
}[];




export type SelectOptions = {
    value: number | string;
    placeholder: string;
};



// export type EmailContent = {
//     subject: string;
//     html: string;
//     text: string;
//   };

export type JWTPayload = {
    is_admin: boolean;
    user_id: number;
    user_type_id: number;
    email?: string;
    company_name?: string;
    company_tel?: string;
    company_address1?: string;
    company_address2?: string;
    district_id?: number;
    person_in_charge?: string;
    person_in_charge_prefix?: string;
    person_in_charge_job_title?: string;
    email_verified?: boolean;
    username?: string;
    tel?: string;
    name?: string;
};

export type User = {
    user_id: number;
    user_type_id: number;

    // admin 
    email?: string;


    //  admin types
    username?: string;
    tel?: string;
    hash_password?: string;
    password?: string;
    name?: string;
};


export type LoginInput = {
    email?: string;
    passcode?: string;
    username?: string;
    password?: string;
};


//   export const emailMessages = {
//     confirm: 'Email sent, please check your inbox to confirm',
//     confirmed: 'Your email is confirmed!',
//     resend: 'Confirmation email resent, maybe check your spam?',
//     couldNotFind: 'Could not find you!',
//     alreadyConfirmed: 'Your email was already confirmed',
//   };


export const authMessages = {
    failure: 'Cannot login',
};