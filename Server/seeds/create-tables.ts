// DEFAULT USER PASSWORD: abc123
import { Knex } from "knex";
import Chance from "chance";
import faker from "faker";
import { format } from "fecha";
import { hashPassword } from "../hash";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { logger } from "../logger";
import { NotificationType } from "../enums/enums";

const chance = new Chance();

function getRandomNumber(size: number) {
    return Math.floor(Math.random() * size);
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    logger.info("SEED RUN PRE START");
    await knex("notifications").del();
    await knex("notification_types").del();
    await knex("applied_jobs").del();
    await knex("company_reviews").del();
    await knex("user_employment_type").del();
    await knex("post_reports").del();
    await knex("user_reports").del();
    await knex("company_reports").del();
    await knex("post_report_types").del();
    await knex("report_types").del();
    await knex("comment_likes").del();
    await knex("subcomment_likes").del();
    await knex("post_subcomments").del();
    await knex("post_comments").del();
    await knex("post_likes").del();
    await knex("post_images").del();
    await knex("posts").del();
    await knex("saved_jobs").del();
    await knex("job_job_category").del();
    await knex("job_employment_type").del();
    await knex("jobs").del();
    await knex("followed_companies").del();
    await knex("company_owners").del();
    await knex("companies").del();
    await knex("user_skills").del();
    await knex("company_types").del();
    await knex("account_levels").del();
    await knex("user_hobbies").del();
    await knex("user_job_category").del();
    await knex("chatroom_users").del();
    await knex("conversations").del();
    await knex("chatrooms").del();
    await knex("networks").del();
    await knex("users").del();
    await knex("education").del();
    await knex("industries").del();
    await knex("job_categories").del();
    await knex("company_names").del();
    await knex("employment_types").del();
    await knex("commenter_types").del();
    await knex("features").del();
    await knex("price_units").del();
    await knex("control_levels").del();
    await knex("cities").del();
    await knex("countries").del();
    await knex("user_roles").del();

    // state default values
    logger.info("SEED RUN START");

    let chance_notification_types = ["new_post", "apply_job"];
    let chance_post_report_types = [
        "It's suspicious, spam or fake",
        "It contains sensitive photo or video",
        "It contains harassment or hateful speech",
        "It's abusive or harmful",
        "It express intentions of self-harm or suicide",
        "Other issue",
    ];
    let chance_report_types = [
        "It's suspicious, spam or fake",
        "It appears that their account is hacked",
        "They're pretending to be me or someone else",
        "Their profile info and/or images include abusive or hateful content",
        "Their posts are abusive or hateful",
        "They're expressing intentions of self-harm or suicide",
        "Other issue",
    ];
    let chance_education = [
        "None",
        "Kindergarten",
        "Primary School",
        "High school",
        "Higher Diploma",
        "Bachelor's Degree",
        "Master's Degree",
        "Doctoral Degree",
    ];
    let chance_industry = [
        "Agriculture, Food and Natural Resources",
        "Architecture and Construction",
        "Education and Training",
        "Business Management and Administration",
        "Arts, Audio/Video Technology and Communications",
        "Finance",
        "Government and Public Administration",
        "Health",
        "Tourism",
        "Human Services",
        "Information Technology",
        "Law, Public Safety, Corrections and Security",
        "Manufacturing",
        "Marketing, Sales and Service",
        "Science, Technology, Engineering and Mathematics",
        "Transportation, Distribution and Logistics",
    ];

    let chance_company_types = [
        "Public Company",
        "Private Company",
        "Non-Profit Organisation",
        "Non-Governmental Organisation",
        "Government",
        "Individual",
        "Others",
    ];

    let chance_account_levels = ["normal", "premier"];

    let chance_employment_types = [
        "Freelance",
        "Part Time",
        "Full Time",
        "Temporary",
        "Contract",
        "Internship",
    ];

    let chance_commenter_types = [
        "Current Employee",
        "Former Employee within 1 year",
        "Former Employee over a year ago",
    ];

    let chance_features = [
        "remote work",
        "work life balance",
        "no OT",
        "flexible working time",
        "shift",
        "overnight",
        "weekends working",
        "OT pay",
        "cash pay",
        "commission",
    ];

    let chance_price_units = [
        "Hourly",
        "Daily",
        "Weekly",
        "Monthly",
        "Project-Based",
        "Piecework",
    ];

    let chance_user_skills = [
        "Communication",
        "Teamwork",
        "Problem solving",
        "Initiative and enterprise",
        "Planning and organising",
        "Self-management",
    ];

    let chance_user_hobbies = [
        "Yoga",
        "Home-Brewing",
        "Wine",
        "Hiking",
        "YouTube",
        "Travel",
        "Bird-Watching",
        "Camping",
        "Animals",
        "Learn How to Code",
        "Fishing",
        "Explore a Different Language",
        "Knitting",
        "Rock Climbing",
        "Sports",
        "Make Bread",
    ];

    let chance_control_levels = ["admin", "master"];

    const locationWorkBook = XLSX.readFile(path.resolve("./locations.csv"));
    const sheetNameList = locationWorkBook.SheetNames;
    const locationData = XLSX.utils.sheet_to_json(
        locationWorkBook.Sheets[sheetNameList[0]],
        {
            raw: false,
            defval: null,
        }
    );

    let user_roles = [
        { name: "normal", level: 1 },
        { name: "admin", level: 10 },
    ];
    let countries: any[] = [];
    let cities: any[] = [];
    let education: any[] = [];
    let industries: any[] = [];
    let company_names: any[] = [];
    let users: any[] = [];
    let company_types: any[] = [];
    let account_levels: any[] = [];
    let companies: any[] = [];
    let job_categories: any[] = [];
    let employment_types: any[] = [];
    let commenter_types: any[] = [];
    let features: any[] = [];
    let price_units: any[] = [];
    let jobs: any[] = [];
    let saved_jobs: any[] = [];
    let user_skills: any[] = [];
    let user_hobbies: any[] = [];
    let user_job_category: any[] = [];
    let job_job_category: any[] = [];
    let user_employment_type: any[] = [];
    let job_employment_type: any[] = [];
    let followed_companies: any[] = [];
    let networks: any[] = [];
    let conversations: any[] = [];
    let control_levels: any[] = [];
    let company_owners: any[] = [];

    // report types seeds

    const report_types = [];

    for (let i = 0; i < chance_report_types.length; i++) {
        report_types.push({
            name: chance_report_types[i],
        });
    }
    const reportTypesResultId = await knex("report_types")
        .insert(report_types)
        .returning("id");

    const post_report_types = [];

    for (let i = 0; i < chance_post_report_types.length; i++) {
        post_report_types.push({
            name: chance_post_report_types[i],
        });
    }

    const postReportTypesResultId = await knex("post_report_types")
        .insert(post_report_types)
        .returning("*");

    // user_roles seeds
    const userRolesResultId = await knex("user_roles")
        .insert(user_roles)
        .returning("id");

    for (let i = 0; i < chance_education.length; i++) {
        education.push({
            name: chance_education[i],
        });
    }

    const educationResult = await knex
        .insert(education)
        .into("education")
        .returning("id");

    for (let i = 0; i < chance_industry.length; i++) {
        industries.push({
            name: chance_industry[i],
        });
    }

    const industriesResult = await knex
        .insert(industries)
        .into("industries")
        .returning("id");

    for (let i = 0; i < 200; i++) {
        let name = faker.company.companyName();

        while (company_names.some((str) => str === name)) {
            name = chance.bool({ likelihood: 50 })
                ? faker.company.companyName()
                : chance.company();
        }

        company_names.push({
            name: name,
        });
    }

    const company_nameResult = await knex
        .insert(company_names)
        .into("company_names")
        .returning("*");

    let uniqueCountries = [
        ...new Set(locationData.map((n: any) => n.country)),
        "Internation",
    ];

    for (let i = 0; i < uniqueCountries.length; i++) {
        countries.push({
            name: uniqueCountries[i],
        });
    }

    const countriesResult = await knex("countries")
        .insert(countries)
        .returning("*");

    cities = locationData.map((data: any) => {
        return {
            country_id: countriesResult.filter(
                (obj: any) => obj.name === data.country
            )[0].id,
            name: data.city_ascii,
        };
    });

    let citiesTableData = await knex
        .batchInsert("cities", cities, 1000)
        .returning("*");

    for (let i = 0; i < chance_company_types.length; i++) {
        company_types.push({
            name: chance_company_types[i],
        });
    }

    const company_typesResult = await knex
        .insert(company_types)
        .into("company_types")
        .returning("id");

    for (let i = 0; i < 2; i++) {
        account_levels.push({
            level: i + 1,
            name: chance_account_levels[i],
        });
    }

    const account_levelsResult = await knex
        .insert(account_levels)
        .into("account_levels")
        .returning("id");

    // Create companies seeds

    for (let i = 0; i < company_nameResult.length; i++) {
        let companyNameId = company_nameResult[i].id;
        let createDate = chance.date({
            year: 2022,
            month: chance.integer({ min: 0, max: new Date().getMonth() + 10 }),
        });
        const chosenCity =
            citiesTableData[
                chance.integer({
                    min: 0,
                    max: citiesTableData.length - 1,
                })
            ];
        const introduction = Array(
            chance.integer({
                min: 0,
                max: 4,
            })
        )
            .fill(chance.paragraph({ sentences: 3 }))
            .join("\n");
        companies.push({
            name_id: companyNameId,
            introduction: introduction,
            website: chance.url(),
            avatar: chance.bool({ likelihood: 80 })
                ? faker.image.imageUrl(400, 400, "business", true, true)
                : "",
            banner: chance.bool({ likelihood: 80 })
                ? faker.image.imageUrl(400, 400, "business", true, true)
                : "",
            city_id: chosenCity.id,
            address: `${faker.address.secondaryAddress()}, ${faker.address.streetAddress()}`,
            email: chance.email(),
            phone: chance.integer({ min: 90000000, max: 99999999 }),
            type_id:
                company_typesResult[
                    chance.integer({
                        min: 0,
                        max: company_typesResult.length - 1,
                    })
                ],
            industry_id:
                industriesResult[
                    chance.integer({
                        min: 0,
                        max: industriesResult.length - 1,
                    })
                ],
            business_size: chance.integer({ min: 5, max: 200 }),
            establish_in: chance.year({ min: 1900, max: 2022 }),
            company_registry: chance
                .integer({ min: 10000000, max: 99999999 })
                .toString(),
            is_verified: chance.bool({ likelihood: 90 }),
            is_activated: chance.bool({ likelihood: 90 }),
            account_level_id:
                account_levelsResult[
                    chance.integer({
                        min: 0,
                        max: account_levelsResult.length - 1,
                    })
                ],
            created_at: createDate,
            updated_at: createDate,
        });
    }
    const companiesResult = await knex("companies")
        .insert(companies)
        .into("companies")
        .returning("*");

    // Create users seeds

    users.push({
        email: "admin@gmail.com",
        password: await hashPassword("abc123"),
        first_name: chance.first(),
        last_name: chance.last(),
        is_admin: true,
    });

    const sampleUserEmailList: string[] = [];

    for (let i = 0; i < 200; i++) {
        let email = faker.internet.email().toLowerCase();
        while (sampleUserEmailList.some((n) => n == email)) {
            email = chance.email().toLowerCase();
        }
        sampleUserEmailList.push(email);

        let createDate = chance.date({
            year: 2022,
            month: chance.integer({ min: 0, max: new Date().getMonth() + 10 }),
        });
        const introduction = Array(
            chance.integer({
                min: 0,
                max: 4,
            })
        )
            .fill(chance.paragraph({ sentences: 3 }))
            .join("\n");
        const chosenCompany =
            companiesResult[
                chance.integer({
                    min: 0,
                    max: companiesResult.length - 1,
                })
            ];

        users.push({
            email: email,
            password: await hashPassword("abc123"),
            first_name: chance.first(),
            last_name: chance.last(),
            gender: chance.gender(),
            phone: chance.integer({ min: 90000000, max: 99999999 }),
            birthday: format(chance.birthday(), "YYYY-MM-DD"),
            city_id: chosenCompany.city_id,
            address: `${faker.address.secondaryAddress()}, ${faker.address.streetAddress()}`,
            avatar: chance.bool({ likelihood: 80 }) ? faker.image.avatar() : "",
            banner: chance.bool({ likelihood: 80 })
                ? faker.image.imageUrl(400, 400, "abstract", true, true)
                : "",
            headline: chance.profession({ rank: true }),
            company_name_id: chosenCompany.name_id,
            industry_id: chosenCompany.industry_id,
            introduction: introduction,
            education_id:
                educationResult[
                    chance.integer({
                        min: 0,
                        max: educationResult.length - 1,
                    })
                ],
            experience: chance.integer({ min: 1, max: 5 }),
            website: chance.url(),
            is_verified: chance.bool({ likelihood: 50 }),
            is_activated: chance.bool({ likelihood: 90 }),
            role_id:
                userRolesResultId[
                    chance.integer({
                        min: 0,
                        max: userRolesResultId.length - 1,
                    })
                ],
            created_at: createDate,
            updated_at: createDate,
        });
    }

    const json = JSON.stringify(sampleUserEmailList);
    fs.writeFileSync(path.resolve("sample_users.json"), json);

    const usersResult = await knex("users")
        .insert(users)
        .into("users")
        .returning("*");
    const users_id = usersResult.map((obj) => obj.id);

    for (let i = 0; i < 10; i++) {
        job_categories.push({
            name: chance.profession({ rank: true }),
        });
    }
    const job_categoriesResult = await knex
        .insert(job_categories)
        .into("job_categories")
        .returning("id");

    for (let i = 0; i < chance_employment_types.length; i++) {
        employment_types.push({
            name: chance_employment_types[i],
        });
    }

    const employment_typesResult = await knex
        .insert(employment_types)
        .into("employment_types")
        .returning("id");

    for (let i = 0; i < chance_commenter_types.length; i++) {
        commenter_types.push({
            name: chance_commenter_types[i],
        });
    }

    //const commenter_typesResult =
    const commenterTypesResultId = await knex
        .insert(commenter_types)
        .into("commenter_types")
        .returning("id");

    for (let i = 0; i < chance_features.length; i++) {
        features.push({
            name: chance_features[i],
        });
    }

    //const featuresResult = await knex
    //    .insert(features)
    //    .into("features")
    //    .returning("id");

    for (let i = 0; i < chance_price_units.length; i++) {
        price_units.push({
            name: chance_price_units[i],
        });
    }

    //const price_unitsResult = await knex
    //    .insert(price_units)
    //    .into("price_units")
    //    .returning("id");

    for (let i = 0; i < 10000; i++) {
        const jobDetail = Array(
            chance.integer({
                min: 0,
                max: 4,
            })
        )
            .fill(chance.paragraph({ sentences: 3 }))
            .join("\n");
        let randomCompanyId =
            companiesResult[
                chance.integer({
                    min: 0,
                    max: companiesResult.length - 1,
                })
            ].id;
        let matchedCompany = companiesResult.filter(
            (obj) => obj.id === randomCompanyId
        )[0];
        let date = new Date(matchedCompany.created_at);
        let createDate = faker.date.between(date, new Date());

        jobs.push({
            company_id: randomCompanyId,
            job_title: chance.profession({ rank: true }),
            job_detail: jobDetail,
            city_id:
                citiesTableData[
                    chance.integer({
                        min: 0,
                        max: citiesTableData.length - 1,
                    })
                ].id,
            education_requirement_id: chance.integer({
                min: educationResult[0] as any,
                max: (educationResult[0] as any) + 3,
            }),
            experience_requirement: chance.integer({ min: 1, max: 5 }),
            annual_leave: chance.integer({ min: 14, max: 21 }),
            contact_person: chance.name(),
            contact_email: chance.email(),
            contact_phone: chance.integer({ min: 90000000, max: 99999999 }),
            auto_delist: faker.date.between(createDate, new Date("2022-12-31")),
            created_at: createDate,
            updated_at: createDate,
        });
    }

    const jobsResult = await knex
        .batchInsert("jobs", jobs, 2000)
        .returning("*");

    const jobs_id = jobsResult.map((obj: any) => obj.id);

    for (let i = 0; i < users_id.length; i++) {
        let chosenUser = users_id[i];
        let selectedJob: any[] = [];
        for (let j = 0; j < 20; j++) {
            let chosenJobId =
                jobs_id[
                    chance.integer({
                        min: 0,
                        max: jobs_id.length - 1,
                    })
                ];
            if (
                !selectedJob.some((id: any) => id === chosenJobId) &&
                chance.bool({ likelihood: 60 })
            ) {
                saved_jobs.push({
                    user_id: chosenUser,
                    job_id: chosenJobId,
                });
                selectedJob.push(chosenJobId);
            }
        }
    }

    await knex.batchInsert("saved_jobs", saved_jobs, 2000);

    // Create user_skills seeds
    for (let i = 0; i < users_id.length; i++) {
        const targetUserId = users_id[i];
        const numberOfSkills = getRandomNumber(chance_user_skills.length);
        const chosenSkills: string[] = [];
        for (let j = 0; j < numberOfSkills; j++) {
            let randomSkill =
                chance_user_skills[getRandomNumber(chance_user_skills.length)];
            if (!chosenSkills.some((skill) => skill === randomSkill)) {
                chosenSkills.push(randomSkill);
            }
        }
        chosenSkills.forEach((skill) => {
            user_skills.push({
                user_id: targetUserId,
                content: skill,
            });
        });
    }

    await knex.insert(user_skills).into("user_skills");

    // Create user_hobbies seeds
    for (let i = 0; i < users_id.length; i++) {
        const targetUserId = users_id[i];
        const numberOfHobbies = getRandomNumber(chance_user_hobbies.length);
        const chosenHobbies: string[] = [];
        for (let j = 0; j < numberOfHobbies; j++) {
            let randomHobby =
                chance_user_hobbies[
                    getRandomNumber(chance_user_hobbies.length)
                ];
            if (!chosenHobbies.some((hobby) => hobby === randomHobby)) {
                chosenHobbies.push(randomHobby);
            }
        }
        chosenHobbies.forEach((hobby) => {
            user_hobbies.push({
                user_id: targetUserId,
                content: hobby,
            });
        });
    }

    await knex.insert(user_hobbies).into("user_hobbies");

    for (let i = 0; i < 50; i++) {
        user_job_category.push({
            user_id:
                users_id[
                    chance.integer({
                        min: 0,
                        max: users_id.length - 1,
                    })
                ],
            category_id:
                job_categoriesResult[
                    chance.integer({
                        min: 0,
                        max: job_categoriesResult.length - 1,
                    })
                ],
        });
    }

    await knex("user_job_category")
        .insert(user_job_category)
        .into("user_job_category");

    for (let i = 0; i < 50; i++) {
        job_job_category.push({
            job_id: jobs_id[
                chance.integer({
                    min: 0,
                    max: jobs_id.length - 1,
                })
            ],
            category_id:
                job_categoriesResult[
                    chance.integer({
                        min: 0,
                        max: job_categoriesResult.length - 1,
                    })
                ],
        });
    }

    await knex("job_job_category")
        .insert(job_job_category)
        .into("job_job_category");

    for (let i = 0; i < 50; i++) {
        user_employment_type.push({
            user_id:
                users_id[
                    chance.integer({
                        min: 0,
                        max: users_id.length - 1,
                    })
                ],
            type_id:
                employment_typesResult[
                    chance.integer({
                        min: 0,
                        max: employment_typesResult.length - 1,
                    })
                ],
        });
    }

    await knex("user_employment_type").insert(user_employment_type);

    for (let i = 0; i < 50; i++) {
        job_employment_type.push({
            job_id: jobs_id[
                chance.integer({
                    min: 0,
                    max: jobs_id.length - 1,
                })
            ],
            type_id:
                employment_typesResult[
                    chance.integer({
                        min: 0,
                        max: employment_typesResult.length - 1,
                    })
                ],
        });
    }

    await knex("job_employment_type")
        .insert(job_employment_type)
        .into("job_employment_type");

    for (let i = 0; i < users_id.length; i++) {
        let obj = {};
        for (let j = 0; j < chance.integer({ min: 0, max: 20 }); j++) {
            let randomCompanyId =
                companiesResult[
                    chance.integer({
                        min: 0,
                        max: companiesResult.length - 1,
                    })
                ].id;
            obj[randomCompanyId] = 1;
        }
        Object.keys(obj).forEach((companyId) => {
            followed_companies.push({
                user_id: users_id[i],
                company_id: companyId,
            });
        });
    }

    await knex("followed_companies")
        .insert(followed_companies)
        .into("followed_companies");

    // NETWORKS

    let networkRecord: {}[] = [];

    for (let i = 0; i < users.length * 10; i++) {
        let obj = {};

        obj["requester"] =
            users_id[
                chance.integer({
                    min: 0,
                    max: users_id.length - 1,
                })
            ];
        obj["receiver"] =
            users_id[
                chance.integer({
                    min: 0,
                    max: users_id.length - 1,
                })
            ];

        while (obj["requester"] === obj["receiver"]) {
            obj["receiver"] =
                users_id[
                    chance.integer({
                        min: 0,
                        max: users_id.length - 1,
                    })
                ];
        }

        let existed = networkRecord.some((item) => {
            return (
                (item["requester"] === obj["requester"] &&
                    item["receiver"] === obj["receiver"]) ||
                (item["requester"] === obj["receiver"] &&
                    item["receiver"] === obj["requester"])
            );
        });

        while (existed) {
            obj["receiver"] =
                users_id[
                    chance.integer({
                        min: 0,
                        max: users_id.length - 1,
                    })
                ];

            existed = networkRecord.some((item) => {
                return (
                    (item["requester"] === obj["requester"] &&
                        item["receiver"] === obj["receiver"]) ||
                    (item["requester"] === obj["receiver"] &&
                        item["receiver"] === obj["requester"])
                );
            });
        }

        networks.push({
            requester_id: obj["requester"],
            receiver_id: obj["receiver"],
            is_pending: chance.bool({ likelihood: 30 }),
        });
    }

    await knex.batchInsert("networks", networks, 2000);

    //CHATROOMS
    let chatroomsSampleData: {}[] = [];
    for (
        let i = 0;
        i <
        chance.integer({
            min: users_id.length,
            max: users_id.length * 2,
        });
        i++
    ) {
        chatroomsSampleData.push({
            name: chance.word(),
        });
    }

    const chatroomsResult = await knex("chatrooms")
        .insert(chatroomsSampleData)
        .returning("id");

    // CHATROOM USERS
    let chatRoomUsersPairRecord: {}[] = [];
    let chatRoomUsersSampleData: {}[] = [];
    for (let i = 0; i < chatroomsResult.length; i++) {
        let obj = {};

        obj["user1"] =
            users_id[
                chance.integer({
                    min: 0,
                    max: users_id.length - 1,
                })
            ];
        obj["user2"] =
            users_id[
                chance.integer({
                    min: 0,
                    max: users_id.length - 1,
                })
            ];

        while (obj["user1"] === obj["user2"]) {
            obj["user2"] =
                users_id[
                    chance.integer({
                        min: 0,
                        max: users_id.length - 1,
                    })
                ];
        }

        let existed =
            chatRoomUsersPairRecord.filter((item) => {
                return (
                    (item["user1"] === obj["user1"] &&
                        item["user2"] === obj["user2"]) ||
                    (item["user1"] === obj["user2"] &&
                        item["user2"] === obj["user1"])
                );
            }).length > 0;

        while (existed) {
            obj["user1"] =
                users_id[
                    chance.integer({
                        min: 0,
                        max: users_id.length - 1,
                    })
                ];
            obj["user2"] =
                users_id[
                    chance.integer({
                        min: 0,
                        max: users_id.length - 1,
                    })
                ];

            existed =
                chatRoomUsersPairRecord.filter((item) => {
                    return (
                        (item["user1"] === obj["user1"] &&
                            item["user2"] === obj["user2"]) ||
                        (item["user1"] === obj["user2"] &&
                            item["user2"] === obj["user1"])
                    );
                }).length > 0;
        }

        chatRoomUsersPairRecord.push(obj);

        chatRoomUsersSampleData.push({
            chatroom_id: chatroomsResult[i],
            user_id: obj["user1"],
        });
        chatRoomUsersSampleData.push({
            chatroom_id: chatroomsResult[i],
            user_id: obj["user2"],
        });
    }

    const chatroomUsersResult = await knex("chatroom_users")
        .insert(chatRoomUsersSampleData)
        .returning("*");

    // CONVERSATIONS

    for (let i = 0; i < chatroomUsersResult.length; i++) {
        for (let j = 0; j < chance.integer({ min: 10, max: 50 }); j++) {
            const sender = chatroomUsersResult[i]["user_id"];
            const roomId = chatroomUsersResult[i]["chatroom_id"];
            let randomDate = chance.date({ year: 2022 });

            while (randomDate > new Date()) {
                randomDate = chance.date({ year: 2022 });
            }

            conversations.push({
                sender_id: sender,
                content: chance.sentence(),
                room_id: roomId,
                is_sent: true,
                is_received: false,
                is_read: false,
                created_at: randomDate,
            });
        }
    }

    await knex("conversations").insert(conversations);

    for (let i = 0; i < chance_control_levels.length; i++) {
        control_levels.push({
            level: i + 1,
            name: chance_control_levels[i],
        });
    }

    const control_level_ids = await knex
        .insert(control_levels)
        .into("control_levels")
        .returning("id");
    logger.info("control_levels DONE");

    for (let i = 0; i < companiesResult.length; i++) {
        let count = 0;
        for (let j = 0; j < users_id.length; j++) {
            if (chance.bool({ likelihood: 3 })) {
                company_owners.push({
                    user_id: users_id[j],
                    company_id: companiesResult[i].id,
                    control_level_id:
                        control_level_ids[
                            chance.integer({
                                min: 0,
                                max: control_level_ids.length - 1,
                            })
                        ],
                });
                count++;
            }
        }
        if (count === 0) {
            company_owners.push({
                user_id:
                    users_id[
                        chance.integer({
                            min: 0,
                            max: users_id.length - 1,
                        })
                    ],
                company_id: companiesResult[i].id,
                control_level_id:
                    control_level_ids[
                        chance.integer({
                            min: 0,
                            max: control_level_ids.length - 1,
                        })
                    ],
            });
        }
    }

    await knex.insert(company_owners).into("company_owners");
    logger.info("company_owners DONE");

    let companyReviewsSampleData: any[] = [];

    for (let i = 0; i < companiesResult.length; i++) {
        let companyId = companiesResult[i].id;
        for (let j = 0; j < 20; j++) {
            if (chance.bool({ likelihood: 30 })) {
                companyReviewsSampleData.push({
                    user_id:
                        users_id[
                            chance.integer({ min: 0, max: users_id.length - 1 })
                        ],
                    job_title: chance.sentence(),
                    commenter_type_id:
                        commenterTypesResultId[
                            chance.integer({
                                min: 0,
                                max: commenterTypesResultId.length - 1,
                            })
                        ],
                    employment_type_id:
                        employment_typesResult[
                            chance.integer({
                                min: 0,
                                max: employment_typesResult.length - 1,
                            })
                        ],
                    company_id: companyId,
                    rating: chance.integer({
                        min: 1,
                        max: 5,
                    }),
                    review_title: chance.sentence(),
                    pos_comment: chance.sentence(),
                    neg_comment: chance.sentence(),
                    extra_comment: chance.paragraph({
                        sentences: chance.integer({ min: 1, max: 2 }),
                    }),
                });
            }
        }
    }

    await knex.insert(companyReviewsSampleData).into("company_reviews");
    logger.info("company_reviews DONE");

    // Create posts seeds
    const samplePostsData = [];
    for (let i = 0; i < users_id.length; i++) {
        for (let j = 0; j < chance.integer({ min: 0, max: 10 }); j++) {
            let userId = users_id[i];
            let matchedUser = usersResult.filter((obj) => obj.id === userId)[0];
            let date = new Date(matchedUser.created_at);
            let createDate = faker.date.between(date, new Date());

            samplePostsData.push({
                user_id: users_id[i],
                content: Array(
                    chance.integer({
                        min: 1,
                        max: 4,
                    })
                )
                    .fill(chance.paragraph({ sentences: 3 }))
                    .join("\n"),
                is_public: chance.bool({ likelihood: 60 }),
                is_activated: chance.bool({ likelihood: 90 }),
                created_at: createDate,
                updated_at: createDate,
            });
        }
    }
    for (let i = 0; i < companiesResult.length; i++) {
        for (let j = 0; j < chance.integer({ min: 0, max: 10 }); j++) {
            let companyId = companiesResult[i].id;

            let matchedCompany = companiesResult.filter(
                (obj) => obj.id === companyId
            )[0];
            let month = new Date(matchedCompany.created_at).getMonth();
            let createDate = chance.date({
                year: 2022,
                month: chance.integer({
                    min: month,
                    max: new Date().getMonth() + 10,
                }),
            });

            samplePostsData.push({
                company_id: companyId,
                content: Array(
                    chance.integer({
                        min: 1,
                        max: 4,
                    })
                )
                    .fill(chance.paragraph({ sentences: 3 }))
                    .join("\n"),
                is_public: chance.bool({ likelihood: 50 }),
                is_activated: chance.bool({ likelihood: 80 }),
                created_at: createDate,
                updated_at: createDate,
            });
        }
    }

    let postsResult = await knex
        .batchInsert("posts", samplePostsData, 1000)
        .returning("*");

    logger.info("posts DONE");

    // Create post_images seeds
    let samplePostImagesData: any[] = [];
    for (let i = 0; i < postsResult.length; i++) {
        let postId = postsResult[i]["id"];
        for (let j = 0; j < chance.integer({ min: 0, max: 5 }); j++) {
            samplePostImagesData.push({
                post_id: postId,
                image: faker.image.imageUrl(400, 400, undefined, true, true),
            });
        }
    }

    await knex("post_images").insert(samplePostImagesData);
    logger.info("post_images DONE");

    // Create post_likes seeds
    let samplePostLikesData: any[] = [];
    for (let i = 0; i < postsResult.length; i++) {
        let postId = postsResult[i]["id"];
        for (let j = 0; j < users_id.length; j++) {
            if (chance.bool({ likelihood: 20 })) {
                let likerId = users_id[j];
                samplePostLikesData.push({
                    post_id: postId,
                    user_id: likerId,
                });
            }
        }
    }

    await knex.batchInsert("post_likes", samplePostLikesData, 2000);
    logger.info("post_likes DONE");

    // create post_comments seeds
    let samplePostCommentsData: any[] = [];
    for (let i = 0; i < postsResult.length; i++) {
        let postId = postsResult[i]["id"];
        let createDate = postsResult[i]["created_at"];
        let randomCommentDate = faker.date.between(
            new Date(createDate),
            new Date()
        );
        for (let j = 0; j < 10; j++) {
            if (chance.bool({ likelihood: 20 })) {
                for (let k = 0; k < chance.integer({ min: 1, max: 3 }); k++) {
                    let likerId =
                        users_id[
                            chance.integer({ min: 0, max: users_id.length - 1 })
                        ];
                    samplePostCommentsData.push({
                        post_id: postId,
                        user_id: likerId,
                        content: faker.lorem.paragraphs(
                            chance.integer({ min: 1, max: 3 }),
                            "\n"
                        ),
                        created_at: randomCommentDate,
                        updated_at: randomCommentDate,
                    });
                }
            }
        }
    }

    let postCommentsResultId = await knex
        .batchInsert("post_comments", samplePostCommentsData, 2000)
        .returning("*");
    logger.info("post_comments DONE");

    // create post_subcomments seeds
    let samplePostSubcommentsData: any[] = [];
    for (let i = 0; i < postCommentsResultId.length; i++) {
        let commentId = postCommentsResultId[i]["id"];
        let createDate = postCommentsResultId[i]["created_at"];
        let randomCommentDate = faker.date.between(
            new Date(createDate),
            new Date()
        );
        if (chance.bool({ likelihood: 50 })) {
            for (let j = 0; j < 10; j++) {
                if (chance.bool({ likelihood: 80 })) {
                    let likerId =
                        users_id[
                            chance.integer({ min: 0, max: users_id.length - 1 })
                        ];
                    samplePostSubcommentsData.push({
                        comment_id: commentId,
                        user_id: likerId,
                        content: faker.lorem.paragraphs(
                            chance.integer({ min: 1, max: 2 }),
                            "\n"
                        ),
                        created_at: randomCommentDate,
                        updated_at: randomCommentDate,
                    });
                }
            }
        }
    }

    let postSubcommentsResultId = await knex
        .batchInsert("post_subcomments", samplePostSubcommentsData, 2000)
        .returning("id");
    logger.info("post_subcomments DONE");

    // Create comment_likes seeds
    let sampleCommentLikesData: any[] = [];
    for (let i = 0; i < postCommentsResultId.length; i++) {
        let commentId = postCommentsResultId[i]["id"];
        if (chance.bool({ likelihood: 50 })) {
            for (let j = 0; j < 5; j++) {
                if (chance.bool({ likelihood: 20 })) {
                    let likerId =
                        users_id[
                            chance.integer({ min: 0, max: users_id.length - 1 })
                        ];
                    sampleCommentLikesData.push({
                        comment_id: commentId,
                        user_id: likerId,
                    });
                }
            }
        }
    }

    await knex.batchInsert("comment_likes", sampleCommentLikesData, 2000);
    logger.info("comment_likes DONE");

    // Create subcomment_likes seeds
    let sampleSubcommentLikesData: any[] = [];
    for (let i = 0; i < postSubcommentsResultId.length; i++) {
        let subcommentId = postSubcommentsResultId[i];
        for (let j = 0; j < 5; j++) {
            if (chance.bool({ likelihood: 20 })) {
                let likerId = users_id[j];
                sampleSubcommentLikesData.push({
                    subcomment_id: subcommentId,
                    user_id: likerId,
                });
            }
        }
    }

    await knex.batchInsert("subcomment_likes", sampleSubcommentLikesData, 2000);
    logger.info("subcomment_likes DONE");

    // Create company_reports seeds
    let sampleCompanyReportsData: any[] = [];
    for (let i = 0; i < companiesResult.length; i++) {
        if (chance.bool({ likelihood: 20 })) {
            let companyId = companiesResult[i].id;

            let matchedCompany = companiesResult.filter(
                (obj) => obj.id === companyId
            )[0];
            let date = new Date(matchedCompany.created_at);
            let createDate = faker.date.between(date, new Date());

            let isSolved = chance.bool({ likelihood: 10 });

            sampleCompanyReportsData.push({
                company_id: companyId,
                type_id:
                    reportTypesResultId[
                        chance.integer({
                            min: 0,
                            max: reportTypesResultId.length - 1,
                        })
                    ],
                reporter_id:
                    users_id[
                        chance.integer({ min: 0, max: users_id.length - 1 })
                    ],
                remark: chance.paragraph({
                    sentences: chance.integer({ min: 1, max: 3 }),
                }),
                is_solved: isSolved,
                solved_at: isSolved ? createDate : null,
                created_at: createDate,
                updated_at: createDate,
            });
        }
    }

    await knex.batchInsert("company_reports", sampleCompanyReportsData, 2000);
    logger.info("company_reports DONE");

    // Create user_reports seeds
    let sampleUserReportsData: any[] = [];
    for (let i = 0; i < users_id.length; i++) {
        if (chance.bool({ likelihood: 20 })) {
            let userId = users_id[i];

            let matchedUser = usersResult.filter((obj) => obj.id === userId)[0];
            let date = new Date(matchedUser.created_at);
            let createDate = faker.date.between(date, new Date());

            let reporterId =
                users_id[chance.integer({ min: 0, max: users_id.length - 1 })];
            while (userId === reporterId) {
                reporterId =
                    users_id[
                        chance.integer({ min: 0, max: users_id.length - 1 })
                    ];
            }
            let isSolved = chance.bool({ likelihood: 10 });
            sampleUserReportsData.push({
                user_id: userId,
                type_id:
                    reportTypesResultId[
                        chance.integer({
                            min: 0,
                            max: reportTypesResultId.length - 1,
                        })
                    ],
                reporter_id: reporterId,
                remark: chance.paragraph({
                    sentences: chance.integer({ min: 1, max: 3 }),
                }),
                is_solved: isSolved,
                solved_at: isSolved ? createDate : null,
                created_at: createDate,
                updated_at: createDate,
            });
        }
    }

    await knex.batchInsert("user_reports", sampleUserReportsData, 2000);
    logger.info("user_reports DONE");

    // Create post_reports seeds
    let samplePostReportsData: any[] = [];
    for (let i = 0; i < postsResult.length; i++) {
        if (chance.bool({ likelihood: 20 })) {
            let postId = postsResult[i]["id"];

            let matchedPost = postsResult.filter(
                (obj) => obj["id"] === postId
            )[0];
            let date = new Date(matchedPost.created_at);
            let createDate = faker.date.between(date, new Date());

            let reporterId =
                users_id[chance.integer({ min: 0, max: users_id.length - 1 })];
            while (postsResult[i].user_id === reporterId) {
                reporterId =
                    users_id[
                        chance.integer({ min: 0, max: users_id.length - 1 })
                    ];
            }
            let isSolved = chance.bool({ likelihood: 10 });
            samplePostReportsData.push({
                post_id: postId,
                type_id:
                    postReportTypesResultId[
                        chance.integer({
                            min: 0,
                            max: postReportTypesResultId.length - 1,
                        })
                    ].id,
                reporter_id: reporterId,
                remark: chance.paragraph({
                    sentences: chance.integer({ min: 1, max: 3 }),
                }),
                is_solved: isSolved,
                solved_at: isSolved ? createDate : null,
                created_at: createDate,
                updated_at: createDate,
            });
        }
    }

    await knex.batchInsert("post_reports", samplePostReportsData, 2000);
    logger.info("post_reports DONE");

    // APPLIED JOBS SEEDS
    let appliedJobSampleData: any[] = [];
    for (let i = 0; i < users_id.length; i++) {
        let userId = users_id[i];
        for (let j = 0; j < 5; j++) {
            if (chance.bool({ likelihood: 50 })) {
                let randomJob =
                    jobsResult[
                        chance.integer({ min: 0, max: jobsResult.length - 1 })
                    ];
                let createDate = faker.date.between(
                    new Date(randomJob.auto_delist),
                    new Date()
                );

                appliedJobSampleData.push({
                    user_id: userId,
                    job_id: randomJob.id,
                    created_at: createDate,
                    updated_at: createDate,
                });
            }
        }
    }

    const appliedJobResult = await knex("applied_jobs")
        .insert(appliedJobSampleData)
        .returning("*");
    logger.info("applied_jobs DONE");

    // NOTIFICATION TYPE SEEDS
    let notificationTypeSampleData: any[] = [];

    for (let i = 0; i < chance_notification_types.length; i++) {
        notificationTypeSampleData.push({
            name: chance_notification_types[i],
        });
    }

    const notificationTypeResult = await knex("notification_types")
        .insert(notificationTypeSampleData)
        .returning("*");

    logger.info("notification_type DONE");

    // NOTIFICATION SEEDS

    function generatePrimaryId(type: NotificationType) {
        switch (type) {
            case NotificationType.APPLYJOB:
                return appliedJobResult[
                    chance.integer({ min: 0, max: appliedJobResult.length - 1 })
                ].id;
            case NotificationType.NEWPOST:
                return postsResult[
                    chance.integer({ min: 0, max: postsResult.length - 1 })
                ]["id"];
            default:
                return postsResult[
                    chance.integer({ min: 0, max: postsResult.length - 1 })
                ]["id"];
        }
    }

    let sampleNotificationData: any[] = [];

    for (let i = 0; i < 8; i++) {
        let targetUserId = users_id[1];
        let randomNotificationType =
            notificationTypeResult[
                chance.integer({
                    min: 0,
                    max: notificationTypeResult.length - 1,
                })
            ];
        let notificationTypeId = randomNotificationType.id;
        let notificationType = randomNotificationType.name;
        let primaryId = generatePrimaryId(notificationType);
        sampleNotificationData.push({
            user_id: targetUserId,
            primary_id: primaryId,
            type_id: notificationTypeId,
            content: chance.sentence(),
            is_read: false,
        });
    }

    await knex("notifications").insert(sampleNotificationData);
    logger.info("notification DONE");
}
