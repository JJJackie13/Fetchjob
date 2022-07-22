import {ReportType} from './enums';

export interface PostPhoto {
    fileName: string;
    type: string;
    uri: string;
}

export type RootStackParamList = {
    Welcome: undefined;
    Search: undefined;
    Login: undefined;
    Register: undefined;
    Home: {refreshed?: number};
    Network: undefined;
    Job: undefined;
    SavedJob: undefined;
    MoreJobByExp: undefined;
    MoreJobByIndustry: undefined;
    ApplyJobUserContact: {
        jobId: number;
        companyName: string;
        job_title: string;
    };
    Post: {
        postId?: number;
        companyId?: number;
        companyName?: string;
        companyAvatar?: string;
    };
    Drawer: undefined;
    UserProfile: {userId: number};
    SelectOwnedCompany: undefined;
    UserSetting: undefined;
    BasicInfoEdit: undefined;
    UserIntroductionEdit: undefined;
    CompanyBasicInfoEdit: {companyId: number};
    CompanyIntroductionEdit: {companyId: number};
    PostJob: {companyId: number; companyName: string; jobId?: number};
    MangeCompanyController: {companyId: number; companyName: string};
    CompanyProfile: {companyId: number};
    CompanySetting: {
        companyId: number;
        companyName: string;
        companyAvatar: string;
        controlLevel: number;
    };
    PostComment: {id: number};
    ManageConnection: undefined;
    ConnectionList: undefined;
    ConnectionRequestList: undefined;
    Chat: {
        roomId: number | undefined;
        counterpartId: number;
        counterpartName: string;
    };
    ChatHome: undefined;
    ChatUserSearch: undefined;
    ChatBot: undefined;
    Report: {id: number | string; type: ReportType};
    SearchAll: {input: string | undefined};
    // Feed: { sort: 'latest' | 'top' } | undefined;
    PostJobReview: {companyId: number};
    ReviewJobApplications: {jobId: number};
    ReviewSelectCompany: undefined;
    UserCheckAppliedJob: undefined;
};

export interface UserProfileProps {
    id: number;
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
    city_id: number;
    education_id: number;
    industry_id: number;
    experience: string;
    company_name_id: number;
    updated_at: string;
}

export interface CompanyProfileProps {
    id: number;
    account_level_id: number;
    company_type: string;
    address: string;
    avatar: string;
    banner: string;
    business_size: string;
    city: string;
    city_id: number;
    company_name: string;
    company_registry: string;
    country: string;
    country_id: number;
    created_at: string;
    email: string;
    establish_in: number;
    industry: string;
    industry_id: number;
    introduction: string;
    is_activated: boolean;
    is_verified: boolean;
    name: string;
    name_id: number;
    phone: string;
    type_id: number;
    updated_at: string;
    website: string;
}

export interface PostProps {
    like_number: string;
    comment_number: string;
    company_followers: string;
    user_liked: boolean;
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    headline: string;
    user_avatar: string;
    company_id: string;
    company_name: string;
    company_avatar: string;
    content: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    images: [];
}

export interface IContactProps {
    content: string;
    counterpart_avatar: string;
    counterpart_id: string;
    counterpart_name: string;
    created_at: string;
    is_online: boolean;
    is_read: boolean;
    is_received: boolean;
    is_sent: boolean;
    room_id: string;
    sender_avatar: string;
    sender_id: string;
    sender_name: string;
    unread_number: string;
}

interface Reply {
    title: string;
    value: string;
    messageId?: any;
}

interface QuickReplies {
    type: 'radio' | 'checkbox';
    values: Reply[];
    keepIt?: boolean;
}

interface ChatUser {
    _id: string | number;
    name: string;
    avatar: string;
}

export interface IMessage {
    _id: string | number;
    temp_id?: string;
    text: string;
    createdAt: Date | number;
    user: ChatUser;
    image?: string;
    video?: string;
    audio?: string;
    system?: boolean;
    sent?: boolean;
    received?: boolean;
    pending?: boolean;
    quickReplies?: QuickReplies;
}

export interface NotificationCardProps {
    id: number;
    user_id: number;
    type_id: number;
    name: string;
    primary_id: number;
    content: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}
