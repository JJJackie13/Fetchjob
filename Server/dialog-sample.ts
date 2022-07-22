// const dialogflow = require("@google-cloud/dialogflow");
// import * as dialogflow from "dialogflow";
import { SessionsClient } from "@google-cloud/dialogflow";
import { knex } from "./server";
import { chatbotService } from "./server";
const util = require("util");

// import
// const uuid = require("uuid");

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
const allUserData = {};
let theLastResultContexts: any[] = [];
let userFindJob_industry: string = "";
let userFindJob_annualLeave: number = 0;
let userFindJob_education: number = 1;
let companyFindStaff_education: number = 1;
let companyFindStaff_industry: string = "";
let companyFindStaff_workExp: number = 0;
let annul_leave_requirement: string | number = "";
let employmentTypes: string = "";
let template = {
    theLastResultContexts,
    userFindJob_industry,
    userFindJob_annualLeave,
    userFindJob_education,
    companyFindStaff_education,
    companyFindStaff_industry,
    companyFindStaff_workExp,
    annul_leave_requirement,
    employmentTypes,
};
let workingIntent = "";

async function getEducationLevel(name: string = "None") {
    try {
        const allEducationLevels = await knex("education").select("*");
        let matched = allEducationLevels.filter(
            (obj: any) => obj.name === name
        );
        let none = allEducationLevels.filter(
            (obj: any) => obj.name === "None"
        )[0].id;
        if (matched.length === 1) {
            return matched[0].id;
        } else {
            return none;
        }
    } catch (error) {
        return false;
    }
}

export async function runSample(
    message: string = "Default message",
    userId: number = 1
) {
    if (!allUserData[userId]) {
        allUserData[userId] = template;
    }

    console.log(
        "now before_req_theLastResultContexts=",
        allUserData[userId].theLastResultContexts
    );
    console.log(
        "now userFindJob_industry =",
        allUserData[userId].userFindJob_industry
    );
    console.log(
        "now userFindJob_salary =",
        allUserData[userId].userFindJob_education
    );
    console.log(
        "now companyFindStaff_education =",
        allUserData[userId].companyFindStaff_education
    );
    console.log(
        "now companyFindStaff_industry =",
        allUserData[userId].companyFindStaff_industry
    );
    console.log(
        "now companyFindStaff_workExp =",
        allUserData[userId].companyFindStaff_workExp
    );
    console.log(
        "now annul_leave_requirement =",
        allUserData[userId].annul_leave_requirement
    );

    // A unique identifier for the given session
    const sessionId = `${userId}`;
    // const sessionId = uuid.v4();

    const projectId = "small-talk-vfci";

    // Create a new session
    const sessionClient = new SessionsClient({
        keyFilename: "./small-talk-vfci-445a3c992d8b.json",
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );

    let request: any = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: message,
                // The language used by the client (en-US)
                languageCode: "en-US",
            },
        },
    };
    // The text query request.
    if (allUserData[userId].theLastResultContexts.length > 0) {
        request = {
            session: sessionPath,
            queryParams: {
                contexts: allUserData[userId].theLastResultContexts,
            },
            queryInput: {
                text: {
                    // The query to send to the dialogflow agent
                    text: message,
                    // The language used by the client (en-US)
                    languageCode: "en-US",
                },
            },
        };
    }

    console.log(
        "request=====================================================================================",
        request
    );

    // Send request and log result
    try {
        let dialogResponse: any = {};
        dialogResponse = {
            data: {},
            queryResult: {},
        };

        const responses = await sessionClient.detectIntent(request);
        // console.log(
        //     "responsesresponsesresponsesresponsesresponsesresponsesresponsesresponses",
        //     responses
        // );
        if (!responses) return "System error";
        // console.log("responses = ", responses[0].queryResult);
        const queryResult: any = responses[0].queryResult;
        // console.log("result =", queryResult);
        console.log(
            "outputContexts =",
            util.inspect(
                queryResult.outputContexts.map((obj: any) => obj.parameters),
                {
                    showHidden: false,
                    depth: null,
                    colors: true,
                }
            )
        );
        // console.log(`  Query: ${queryResult.queryText}`);
        // console.log(`  Response: ${queryResult.fulfillmentText}`);
        if (queryResult.intent!.displayName == "User asking about Fetchjob") {
            console.log(`testing chance the result`);
        }
        if (queryResult.intent!.displayName == "User finding Job") {
            queryResult.fulfillmentText += "user???";
            workingIntent = "User_finding_Job_By_Industry";
        }
        //if (
        //    result.intent!.displayName ==
        //    "User finding Job - custom - by industry"
        //) {
        //    result.fulfillmentText +=
        //        "We have [numberOfJobs] [industryOfJobs] jobs right now,do you want to see morn detail?";
        //}
        if (queryResult.intent) {
            console.log(`  Intent: ${queryResult.intent.displayName}`);
        } else {
            console.log("  No intent matched.");
        }
        if (queryResult.outputContexts) {
            console.log("result.outputContexts=", queryResult.outputContexts);
            allUserData[userId].theLastResultContexts =
                queryResult.outputContexts;
        }

        //save userFindingData
        if (
            queryResult.intent!.displayName ==
            "User finding Job - custom - by industry"
        ) {
            // REFENCE VALUE AND INPUT VALUE
            const referenceValue =
                queryResult.outputContexts[0] &&
                queryResult.outputContexts[0].parameters &&
                queryResult.outputContexts[0].parameters.fields &&
                queryResult.outputContexts[0].parameters.fields
                    .industry_user_choosed &&
                queryResult.outputContexts[0].parameters.fields
                    .industry_user_choosed.listValue &&
                queryResult.outputContexts[0].parameters.fields
                    .industry_user_choosed.listValue.values &&
                queryResult.outputContexts[0].parameters.fields
                    .industry_user_choosed.listValue.values[0] &&
                queryResult.outputContexts[0].parameters.fields
                    .industry_user_choosed.listValue.values[0].stringValue;
            const originalInput = queryResult.queryText;
            const value = referenceValue ? referenceValue : originalInput;

            allUserData[userId].userFindJob_industry = value;
            workingIntent = "User_finding_Job_By_AnnualLeave";
        }

        if (
            queryResult.intent!.displayName ==
            "User finding Job - custom - by industry - by annualLeave"
        ) {
            // REFENCE VALUE AND INPUT VALUE
            const referenceValue =
                queryResult.outputContexts[0] &&
                queryResult.outputContexts[0].parameters &&
                queryResult.outputContexts[0].parameters.fields &&
                queryResult.outputContexts[0].parameters.fields.number &&
                queryResult.outputContexts[0].parameters.fields.number
                    .numberValue;
            // const originalInput = queryResult.queryText;
            const value = isNaN(parseInt(referenceValue)) ? 0 : referenceValue;
            // console.log("referenceValue=>", referenceValue);
            // console.log("originalInput=>", originalInput);
            allUserData[userId].userFindJob_annualLeave = value;
            // allUserData[userId].annul_leave_requirement = queryResult.queryText;
            workingIntent = "User_finding_Job_By_Education";
        }

        if (
            queryResult.intent!.displayName ==
            "User finding Job - custom - by industry - by annualLeave - by education"
        ) {
            // REFENCE VALUE AND INPUT VALUE
            const referenceValue =
                queryResult.outputContexts[0] &&
                queryResult.outputContexts[0].parameters &&
                queryResult.outputContexts[0].parameters.fields &&
                queryResult.outputContexts[0].parameters.fields
                    .education_level &&
                queryResult.outputContexts[0].parameters.fields.education_level
                    .stringValue;
            // const originalInput = queryResult.queryText;
            const value = referenceValue ? referenceValue : "";
            const level = await getEducationLevel(value);
            allUserData[userId].userFindJob_education = parseInt(level);
            // console.log("referenceValue=>", referenceValue);
            // console.log("originalInput=>", originalInput);
            workingIntent = "User_finding_Job_By_Education";
        }

        // give user finding Job result here //
        if (
            queryResult.intent!.displayName ==
            "User finding Job - custom - by industry - by annualLeave - by education - by employment_types"
        ) {
            // REFENCE VALUE AND INPUT VALUE
            const referenceValue =
                queryResult.outputContexts[0] &&
                queryResult.outputContexts[0].parameters &&
                queryResult.outputContexts[0].parameters.fields &&
                queryResult.outputContexts[0].parameters.fields
                    .employment_types &&
                queryResult.outputContexts[0].parameters.fields.employment_types
                    .stringValue;
            const value = referenceValue ? referenceValue : "";
            allUserData[userId].employmentTypes = value;

            // get data from database
            const IndustryQuery =
                allUserData[userId].userFindJob_industry.trim();
            let educationQuery = allUserData[userId].userFindJob_education;
            let annualLeaveQuery = allUserData[userId].userFindJob_annualLeave;
            const employmentTypesQuery =
                allUserData[userId].employmentTypes.trim();

            const jobData = await chatbotService.getJobSearchRes(
                userId,
                IndustryQuery,
                educationQuery,
                annualLeaveQuery,
                employmentTypesQuery
            );
            // TODO: handle failure
            if (!jobData || jobData.length === 0) {
                queryResult.fulfillmentText =
                    "We don't have a suitable job for you right now, please change your conditions or try one more times later.";
                delete allUserData[userId];
                return { message: queryResult.fulfillmentText, data: {} };
            }
            console.log("jobData=", jobData);
            //result.fulfillmentText;
            dialogResponse.data.jobData = jobData;
            dialogResponse.queryResult = queryResult;
            delete allUserData[userId];
            return { message: queryResult.fulfillmentText, data: { jobData } };
            // return dialogResponse;
            // return Object {"message": "*^%^$&^"", "data": JSON.stringify(data)}
        }
        if (queryResult.intent!.displayName == "Company_finding_Staff") {
            workingIntent = "Company_Start_finding_Staff";
        }

        if (
            queryResult.intent!.displayName ==
            "Company_finding_Staff - By education"
        ) {
            // REFENCE VALUE AND INPUT VALUE
            const referenceValue =
                queryResult.outputContexts[0] &&
                queryResult.outputContexts[0].parameters &&
                queryResult.outputContexts[0].parameters.fields &&
                queryResult.outputContexts[0].parameters.fields
                    .education_level &&
                queryResult.outputContexts[0].parameters.fields.education_level
                    .stringValue;
            // const originalInput = queryResult.queryText;
            const value = referenceValue ? referenceValue : "";
            let level = await getEducationLevel(value);
            allUserData[userId].companyFindStaff_education = parseInt(level);
            workingIntent = "Company_finding_Staff_By_Education";
        }
        if (
            queryResult.intent!.displayName ==
            "Company_finding_Staff - By education - By industry"
        ) {
            // REFENCE VALUE AND INPUT VALUE
            const referenceValue =
                queryResult.outputContexts[0] &&
                queryResult.outputContexts[0].parameters &&
                queryResult.outputContexts[0].parameters.fields &&
                queryResult.outputContexts[0].parameters.fields
                    .industry_user_choosed &&
                queryResult.outputContexts[0].parameters.fields
                    .industry_user_choosed.stringValue;
            // const originalInput = queryResult.queryText;
            const value = referenceValue ? referenceValue : "";

            allUserData[userId].companyFindStaff_industry = value;
            workingIntent = "Company_finding_Staff_By_Industry";
        }
        if (
            queryResult.intent!.displayName ==
            "Company_finding_Staff - By education - By industry - By work Exp"
        ) {
            workingIntent = "Company_finding_Staff_By_WorkExp";

            // REFENCE VALUE AND INPUT VALUE
            const referenceValue =
                queryResult.outputContexts[0] &&
                queryResult.outputContexts[0].parameters &&
                queryResult.outputContexts[0].parameters.number &&
                queryResult.outputContexts[0].parameters.number.numberValue;
            const value = isNaN(parseInt(referenceValue)) ? 0 : referenceValue;


            allUserData[userId].companyFindStaff_workExp = value;
            const experience = allUserData[userId].companyFindStaff_workExp;
            const education = allUserData[userId].companyFindStaff_education;
            const industry =
                allUserData[userId].companyFindStaff_industry.trim();

            const staffData = await chatbotService.getStaffSearchRes(
                education,
                industry,
                experience
            );
            if (!staffData || staffData.length === 0) {
                queryResult.fulfillmentText =
                    "We don't have a suitable talent for you right now, please change your conditions or try one more times later.";
                delete allUserData[userId];
                return { message: queryResult.fulfillmentText, data: {} };
            }
            dialogResponse.data.staffData = staffData;
            dialogResponse.queryResult = queryResult;
            delete allUserData[userId];
            return {
                message: queryResult.fulfillmentText,
                data: { staffData },
            };
        }

        // clean data if user finish and intent = well_done
        if (
            queryResult.intent!.displayName == "smalltalk.appraisal.well_done"
        ) {
            delete allUserData[userId];
            dialogResponse = {
                data: {},
                queryResult: {},
            };
        }

        let message = queryResult.fulfillmentMessages[0].text.text[0];
        let data = queryResult.data ? queryResult.data : {};
        let intents = workingIntent;
        return { message, data, intents };
    } catch (error) {
        console.log(" error = ", error);
        return "Catch error";
    }
}
