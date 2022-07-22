export enum Relationship {
    NONE = 'NONE',
    FRIEND = 'FRIEND',
    REQUESTED = 'REQUESTED',
    RECEIVED = 'RECEIVED',
}

export enum PostBottomsheetType {
    SELF = 'SELF',
    NONSELF = 'NONSELF',
}

export enum ReportType {
    POST,
    USER,
    COMPANY,
}

export enum CompanyControlLevel {
    NONE = 0,
    ADMIN = 1,
    MASTER = 2,
}

export enum NotificationType {
    NEWPOST = 'new_post',
    APPLYJOB = 'apply_job',
}

export enum ChatBotIntents {
    JPATH = 'User_Start_finding_Job',
    JINDUSTRY = 'User_finding_Job_By_Industry',
    JAL = 'User_finding_Job_By_AnnualLeave',
    JEDUCATION = 'User_finding_Job_By_Education',
}
