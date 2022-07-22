import { Knex } from "knex";
// import { logger } from "../logger";

export class NetworkService {
    constructor(private knex: Knex) {}

    // static demoMethod() {
    //     console.log("Static method called");
    // }
    getRelationshipById = async (userId: number, counterpartId: number) => {
        try {
            const result = (
                await this.knex.raw(
                    `select 
            n.id, n.requester_id, n.receiver_id, n.is_pending from networks as n
            where (n.requester_id = :userId and n.receiver_id = :counterpartId) 
            or (n.requester_id = :counterpartId and n.receiver_id = :userId);`,
                    {
                        userId,
                        counterpartId,
                    }
                )
            ).rows;
            const noRelationship = result.length === 0;
            const hasRelationship = result.length > 0;
            const isFriend = hasRelationship && result[0].is_pending === false;
            const requestSent =
                hasRelationship &&
                result[0].is_pending === true &&
                result[0].receiver_id === counterpartId;
            const requestReceived =
                hasRelationship &&
                result[0].is_pending === true &&
                result[0].requester_id === counterpartId;

            if (noRelationship) {
                return "NONE";
            } else if (isFriend) {
                return "FRIEND";
            } else if (requestSent) {
                return "REQUESTED";
            } else if (requestReceived) {
                return "RECEIVED";
            } else {
                return false;
            }
        } catch (error) {
            console.log("getRelationshipById=>", error);
            return false;
        }
    };
    getAllConnections = async (userId: number) => {
        try {
            const result = (
                await this.knex.raw(
                    `select n.id as network_id, 
                    (select u.id where (u.id = n.requester_id or u.id = n.receiver_id) and u.id != :userId) as friend_id,
                    u.first_name,
                    u.last_name,
                    u.headline,
                    u.avatar,
                    u.banner,
                    cn.name as company_name
                    from networks as n 
                    join users as u on n.requester_id = u.id or n.receiver_id = u.id
                    join company_names as cn on u.company_name_id = cn.id 
                    where ((n.requester_id = :userId or n.receiver_id = :userId) and u.id != :userId) 
                    and is_pending = false
                    and is_activated = true
                    order by n.updated_at desc;`,
                    { userId }
                )
            ).rows;
            return result;
        } catch (error) {
            console.log("getAllConnections=>", error);
            return false;
        }
    };
    getAllNetworksForChat = async (id: number, param: string) => {
        const query = `and (u.first_name ilike '%${param}%' or u.first_name ilike '%${param}%' or u.headline ilike '%${param}%')`;

        const result = (
            await this.knex.raw(
                `select distinct on (n.id) n.id as room_id, (select u.id where (u.id = n.requester_id or u.id = n.receiver_id) and u.id != :id) as friend_id , (select u.first_name || ' ' || u.last_name where (u.id = n.requester_id or u.id = n.receiver_id) and u.id != :id) as friend_name, u.profile_img, u.cover_img, headline, i.name as industry, c.content, c.created_at as last_message from networks as n join users as u on n.requester_id = u.id or n.receiver_id = u.id left join industries as i on u.industry = i.id left join conversations as c on c.room_id = n.id where (n.requester_id = :id or n.receiver_id = :id) and u.id != :id and is_pending = false ${query} order by n.id, c.created_at desc`,
                { id }
            )
        ).rows;
        console.log("getAllnetwork Service => ", result);
        return result;
    };
    getSimilarIndustry = async (userId: number) => {
        try {
            const isValid = !!(
                await this.knex("users")
                    .select("industry_id")
                    .where("id", userId)
            )[0].industry_id;
            const result = (
                await this.knex.raw(
                    `select *, u.id as counterpart_id from users as u join industries as i on u.industry_id = i.id 
                    where u.industry_id = (select industry_id from users where users.id = :userId)
                    and (select count(*) from networks as n where ((n.requester_id = u.id and n.receiver_id = :userId) or (n.requester_id = :userId and n.receiver_id = u.id)) and n.is_pending != false) = 0
                    and u.id != :userId 
                    and u.industry_id notnull
                    order by random() limit 10`,
                    { userId }
                )
            ).rows;
            delete result["password"];
            return { data: result, isValid };
        } catch (error) {
            console.log("getSimilarIndustry=>", error);
            return false;
        }
    };
    getSimilarCompany = async (userId: number) => {
        try {
            const isValid = !!(
                await this.knex("users")
                    .select("company_name_id")
                    .where("id", userId)
            )[0].company_name_id;
            const result = (
                await this.knex.raw(
                    `select *, u.id as counterpart_id from users as u join company_names as cn on u.company_name_id = cn.id 
                    where u.company_name_id = (select company_name_id from users where users.id = :userId)
                    and (select count(*) from networks as n where ((n.requester_id = u.id and n.receiver_id = :userId) or (n.requester_id = :userId and n.receiver_id = u.id)) and n.is_pending != false) = 0
                    and u.company_name_id notnull 
                    and u.id != :userId
                    order by random() limit 10`,
                    { userId }
                )
            ).rows;
            delete result["password"];
            return { data: result, isValid };
        } catch (error) {
            console.log("getSimilarCompany=>", error);
            return false;
        }
    };
    getSimilarHobby = async (userId: number) => {
        try {
            const userHobbies = await this.knex("user_hobbies as uh")
                .join("users as u", "u.id", "uh.user_id")
                .where("uh.user_id", userId)
                .select("uh.id", "uh.content");

            if (userHobbies.length === 0) {
                return { isValid: false, data: [] };
            }
            const randomIndex = Math.floor(Math.random() * userHobbies.length);
            // const randomHobbyId = userHobbies[randomIndex].id;
            const HobbyName = userHobbies[randomIndex].content;

            const result = (
                await this.knex.raw(
                    `select *, u.id as counterpart_id from users as u join user_hobbies as uh on u.id = uh.user_id 
                    where uh.content ilike '%${HobbyName}%'
                    and (select count(*) from networks as n where ((n.requester_id = u.id and n.receiver_id = :userId) or (n.requester_id = :userId and n.receiver_id = u.id)) and n.is_pending != false) = 0
                    and u.id != :userId
                    order by random() limit 10`,
                    { userId }
                )
            ).rows;
            delete result["password"];
            return { isValid: true, data: result, hobbyName: HobbyName };
        } catch (error) {
            console.log("getSimilarHobby=>", error);
            return false;
        }
    };
    getSimilarSkill = async (userId: number) => {
        try {
            const userSkills = await this.knex("user_skills as uh")
                .join("users as u", "u.id", "uh.user_id")
                .where("uh.user_id", userId)
                .select("uh.id", "uh.content");

            if (userSkills.length === 0) {
                return { isValid: false, data: [] };
            }
            const randomIndex = Math.floor(Math.random() * userSkills.length);
            // const randomSkillId = userSkills[randomIndex].id;
            const SkillName = userSkills[randomIndex].content;

            const result = (
                await this.knex.raw(
                    `select *, u.id as counterpart_id from users as u join user_skills as us on u.id = us.user_id 
                    where us.content ilike '%${SkillName}%'
                    and (select count(*) from networks as n where ((n.requester_id = u.id and n.receiver_id = :userId) or (n.requester_id = :userId and n.receiver_id = u.id)) and n.is_pending != false) = 0
                    and u.id != :userId
                    order by random() limit 10`,
                    { userId }
                )
            ).rows;
            delete result["password"];
            return { isValid: true, data: result, skillName: SkillName };
        } catch (error) {
            console.log("getSimilarSkill=>", error);
            return false;
        }
    };
    getAllReceivedRequests = async (userId: number) => {
        try {
            const result = await this.knex("networks as n")
                .join("users as u", "u.id", "n.requester_id")
                .join("company_names as cn", "cn.id", "u.company_name_id")
                .select(
                    "n.id",
                    "n.requester_id as counterpartId",
                    "u.first_name",
                    "u.last_name",
                    "u.headline",
                    "u.avatar",
                    "u.banner",
                    "cn.name as company_name"
                )
                .where("n.receiver_id", userId)
                .andWhere("n.is_pending", true)
                .andWhereNot("u.id", userId);

            // console.log("getAllReceivedRequests Service => ", result);
            return result;
        } catch (error) {
            console.log("getAllReceivedRequests=>", error);
            return false;
        }
    };
    getAllSentRequests = async (userId: number) => {
        try {
            const result = await this.knex("networks as n")
                .join("users as u", "u.id", "n.receiver_id")
                .join("company_names as cn", "cn.id", "u.company_name_id")
                .select(
                    "n.id",
                    "n.receiver_id as counterpartId",
                    "u.first_name",
                    "u.last_name",
                    "u.headline",
                    "u.avatar",
                    "u.banner",
                    "cn.name as company_name"
                )
                .where("n.requester_id", userId)
                .andWhere("n.is_pending", true)
                .andWhereNot("u.id", userId);

            // console.log("getAllSentRequests Service => ", result);
            return result;
        } catch (error) {
            console.log("getAllSentRequests=>", error);
            return false;
        }
    };
    getAllRequests = async (userId: number) => {
        try {
            const result = await this.knex("networks")
                .join("users", function () {
                    this.on("networks.requester_id", "=", "users.id").orOn(
                        "networks.receiver_id",
                        "=",
                        "users.id"
                    );
                })
                .distinct(
                    { network_id: "networks.id" },
                    "requester_id",
                    "first_name",
                    "last_name",
                    "headline",
                    "profile_img"
                )
                .where("receiver_id", userId)
                .andWhere("is_pending", true)
                .andWhereNot("users.id", userId);

            // console.log("getAllRequest Service => ", result);
            return result;
        } catch (error) {
            return false;
        }
    };
    removeConnection = async (userId: number, counterpartId: number) => {
        try {
            // CHECK IF ALREADY FRIENDS/REQUESTED
            const result = await this.knex("networks")
                .join("users", function () {
                    this.on("networks.requester_id", "=", "users.id").orOn(
                        "networks.receiver_id",
                        "=",
                        "users.id"
                    );
                })
                .where(function () {
                    this.where("requester_id", userId).andWhere(
                        "receiver_id",
                        counterpartId
                    );
                })
                .orWhere(function () {
                    this.where("requester_id", counterpartId).andWhere(
                        "receiver_id",
                        userId
                    );
                });

            // console.log("request (check if already friend) =>", result);
            if (result.length > 0) {
                await this.knex("networks")
                    .where(function () {
                        this.where("requester_id", userId).andWhere(
                            "receiver_id",
                            counterpartId
                        );
                    })
                    .orWhere(function () {
                        this.where("requester_id", counterpartId).andWhere(
                            "receiver_id",
                            userId
                        );
                    })
                    .del();
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log("removeConnection", error);
            return false;
        }
    };
    makeRequest = async (requesterId: number, receiverId: number) => {
        try {
            // CHECK IF ALREADY FRIENDS/REQUESTED
            const result = await this.knex("networks")
                .join("users", function () {
                    this.on("networks.requester_id", "=", "users.id").orOn(
                        "networks.receiver_id",
                        "=",
                        "users.id"
                    );
                })
                .where(function () {
                    this.where("requester_id", requesterId).andWhere(
                        "receiver_id",
                        receiverId
                    );
                })
                .orWhere(function () {
                    this.where("requester_id", receiverId).andWhere(
                        "receiver_id",
                        requesterId
                    );
                });
            // console.log("request (check if already friend) =>", result);
            if (result.length === 0) {
                await this.knex("networks").insert({
                    requester_id: requesterId,
                    receiver_id: receiverId,
                    is_pending: true,
                });
                return true;
            } else if (
                result[0].requester_id === receiverId &&
                result[0].receiver_id === requesterId
            ) {
                // Already receied request from counterpart
                await this.knex("networks")
                    .update({
                        is_pending: false,
                        updated_at: this.knex.fn.now(),
                    })
                    .where("requester_id", receiverId)
                    .andWhere("receiver_id", requesterId);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log("makeRequest=>", error);
            return false;
        }
    };
    respondToRequest = async (networkId: number, isAccepted: boolean) => {
        try {
            if (isAccepted) {
                await this.knex("networks")
                    .where("id", networkId)
                    .update({ is_pending: false });
                return true;
            } else {
                await this.knex("networks").where("id", networkId).del();
                return true;
            }
        } catch (error) {
            console.log("respondToRequest=>", error);
            return false;
        }
    };
}
