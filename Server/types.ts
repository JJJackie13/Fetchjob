export interface UserProfileProps {
    id: string;
    avatar: string;
    banner: string;
    first_name: string;
    last_name: string;
    headline: string;
    industry: string;
    company_name: string;
    city: string;
    country: string;
    introduction: string;
    created_at: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    education: string;
    website: string;
    gender: string;
    city_id: string;
    education_id: string;
    industry_id: string;
    experience: string;
    company_name_id: string;
}

interface Reply {
    title: string;
    value: string;
    messageId?: any;
}

interface QuickReplies {
    type: "radio" | "checkbox";
    values: Reply[];
    keepIt?: boolean;
}

export interface IMessage {
    _id: string | number;
    text: string;
    user: UserProfileProps;
    createdAt: Date | number;
    image?: string;
    video?: string;
    audio?: string;
    system?: boolean;
    sent?: boolean;
    received?: boolean;
    pending?: boolean;
    quickReplies?: QuickReplies;
}
