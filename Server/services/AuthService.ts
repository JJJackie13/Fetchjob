import { hashPassword } from "../hash";
import { Knex } from "knex";
import fs from "fs";
import path from "path";
import jwtSimple from "jwt-simple";
import jwt from "../jwt";

interface GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export class AuthService {
    constructor(private knex: Knex) {}
    getToken = async (userId: number) => {
        try {
            const result = await this.knex("users")
                .select("*")
                .where("id", userId);
            if (result.length !== 1) {
                return false;
            }
            const user = result[0];
            const payload = {
                id: user.id,
                email: user.email,
                name: user.first_name + " " + user.last_name,
                avatar: user.avatar,
                banner: user.banner,
                role: user.role_id,
                updated_at: user.updated_at,
            };
            const token = jwtSimple.encode(payload, jwt.jwtSecret);
            return token;
        } catch (error) {
            return false;
        }
    };
    getUserInfo = async (email: string) => {
        const users = await this.knex("users")
            .select("*")
            .where("email", email.toLowerCase());
        return users;
    };
    register = async (
        email: string,
        hashedPassword: string,
        firstName: string,
        lastName: string
    ) => {
        try {
            await this.knex("users").insert({
                email: email.toLowerCase(),
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName,
            });
            return { success: true };
        } catch (error) {
            console.log("REGISTER", error);
            return { success: false };
        }
    };
    loginGoogle = async (googleUserInfo: GoogleUser) => {
        try {
            const { email, given_name, family_name, picture } = googleUserInfo;
            const users = (
                await this.knex.raw(
                    `SELECT * FROM users WHERE email = :email`,
                    { email }
                )
            ).rows;

            if (users.length > 0) {
                return { success: true, data: users[0] };
            } else {
                let hashedPassword = await hashPassword(
                    (Math.random() + 1).toString(36)
                );
                const createUserResult = (
                    await this.knex.raw(
                        `INSERT INTO users (email ,password, first_name, last_name, profile_img) VALUES (:email,:hashedPassword,:given_name,:family_name,:picture) RETURNING *`,
                        {
                            email,
                            hashedPassword,
                            given_name,
                            family_name,
                            picture,
                        }
                    )
                ).rows[0];
                return {
                    success: true,
                    data: createUserResult,
                    message: "Login successfully.",
                };
            }
        } catch (error) {
            return { success: false, message: error };
        }
    };
    editBasicInfo = async (userId: number, data: any) => {
        try {
            // const {
            //     birthday,
            //     city_id,
            //     education_id,
            //     first_name,
            //     gender,
            //     last_name,
            //     phone,
            //     website,
            //     industry_id,
            //     company_name_id,
            //     experience,
            //     headline,
            // } = data;
            console.log(data);
            const newData = { ...data, updated_at: this.knex.fn.now() };
            delete newData["hobbies"];
            delete newData["skills"];
            await this.knex.transaction(async (trx) => {
                await trx("users").update(newData).where("id", userId);
                await trx("user_hobbies").where("user_id", userId).del();
                if (data["hobbies"] && data["hobbies"].length > 0) {
                    await trx("user_hobbies").insert(
                        data["hobbies"].map((content: string) => {
                            return { user_id: userId, content };
                        })
                    );
                }
                await trx("user_skills").where("user_id", userId).del();
                if (data["skills"] && data["skills"].length > 0) {
                    await trx("user_skills").insert(
                        data["skills"].map((content: string) => {
                            return { user_id: userId, content };
                        })
                    );
                }
            });
            return true;
        } catch (error) {
            console.log("editBasicInfo =>", error);
            return false;
        }
    };
    deleteAvatar = async (userId: number) => {
        try {
            const oldImg = (
                await this.knex.raw(
                    "select avatar from users where id = :userId",
                    { userId }
                )
            ).rows[0]["avatar"];
            await this.knex.raw(
                "update users set avatar = '', updated_at = NOW() where id = :userId",
                { userId }
            );
            if (
                oldImg &&
                fs.existsSync(path.resolve("./uploads/user", oldImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/user", oldImg));
            }
            return true;
        } catch (error) {
            return false;
        }
    };
    deleteBanner = async (userId: number) => {
        try {
            const oldImg = (
                await this.knex.raw(
                    "select banner from users where id = :userId",
                    { userId }
                )
            ).rows[0]["banner"];
            await this.knex.raw(
                "update users set banner = '', updated_at = NOW() where id = :userId",
                { userId }
            );
            if (
                oldImg &&
                fs.existsSync(path.resolve("./uploads/user", oldImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/user", oldImg));
            }
            return true;
        } catch (error) {
            return false;
        }
    };
    updateAvatar = async (userId: number, fileData: any) => {
        const newImg = fileData["filename"];
        try {
            const oldImg = (
                await this.knex.raw(
                    "select avatar from users where id = :userId",
                    { userId }
                )
            ).rows[0]["avatar"];

            await this.knex.raw(
                "update users set avatar = :newImg , updated_at = NOW() where id = :userId",
                { newImg, userId }
            );
            if (
                oldImg &&
                fs.existsSync(path.resolve("./uploads/user", oldImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/user", oldImg));
            }

            if (
                newImg &&
                fs.existsSync(path.resolve("./uploads/temp", newImg))
            ) {
                fs.renameSync(
                    path.resolve("./uploads/temp", newImg),
                    path.resolve("./uploads/user", newImg)
                );
            }
            return true;
        } catch (error) {
            return false;
        } finally {
            if (
                newImg &&
                fs.existsSync(path.resolve("./uploads/temp", newImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/temp", newImg));
            }
        }
    };
    updateBanner = async (userId: number, fileData: any) => {
        const newImg = fileData["filename"];
        try {
            const oldImg = (
                await this.knex.raw(
                    "select avatar from users where id = :userId",
                    { userId }
                )
            ).rows[0]["banner"];

            await this.knex.raw(
                "update users set banner = :newImg , updated_at = NOW() where id = :userId",
                { newImg, userId }
            );
            if (
                oldImg &&
                fs.existsSync(path.resolve("./uploads/user", oldImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/user", oldImg));
            }

            if (
                newImg &&
                fs.existsSync(path.resolve("./uploads/temp", newImg))
            ) {
                fs.renameSync(
                    path.resolve("./uploads/temp", newImg),
                    path.resolve("./uploads/user", newImg)
                );
            }

            return true;
        } catch (error) {
            return false;
        } finally {
            if (
                newImg &&
                fs.existsSync(path.resolve("./uploads/temp", newImg))
            ) {
                fs.unlinkSync(path.resolve("./uploads/temp", newImg));
            }
        }
    };

    updateResume = async (userId: number, fileData: any) => {
        const newFile = fileData["filename"];
        try {
            const oldFile = (
                await this.knex.raw(
                    "select resume from users where id = :userId",
                    { userId }
                )
            ).rows[0]["resume"];

            await this.knex.raw(
                "update users set resume = :newFile , updated_at = NOW() where id = :userId",
                { newFile, userId }
            );
            if (
                oldFile &&
                fs.existsSync(path.resolve("./uploads/user", oldFile))
            ) {
                fs.unlinkSync(path.resolve("./uploads/user", oldFile));
            }

            if (
                newFile &&
                fs.existsSync(path.resolve("./uploads/temp", newFile))
            ) {
                fs.renameSync(
                    path.resolve("./uploads/temp", newFile),
                    path.resolve("./uploads/user", newFile)
                );
            }
            return true;
        } catch (error) {
            return false;
        } finally {
            if (
                newFile &&
                fs.existsSync(path.resolve("./uploads/temp", newFile))
            ) {
                fs.unlinkSync(path.resolve("./uploads/temp", newFile));
            }
        }
    };
}
