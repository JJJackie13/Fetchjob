export let friendRelationStatus = {
    ALREADY_FRIEND: {
        value: "AF",
        description: "already friend",
    },
    NOT_FRIEND: {
        value: "NF",
        description: "not friend",
    },
    ALREADY_MAKE_REQUEST: {
        value: "MR",
        description: "made request",
    },
    RECEIVED_FRIEND_REQUEST: {
        value: "RR",
        description: "received request",
    },
};

export interface EnumLayout {
    value: string;
    description: string;
}
