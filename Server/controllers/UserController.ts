import { Request, Response } from "express";
//import { userRoutes } from "../router/userRoutes";
import { UserService } from "../services/UserService";

export class UserController {
    constructor(private userService: UserService) { }
    getCurrentUser = async (req: Request, res: Response) => {
        res.json({ success: true, data: req["user"] });
        // if (req.session && req.session["userId"]) {
        //     const result = await this.userService.getCurrentUser(
        //         parseInt(req.session["userId"])
        //     );
        //     res.json({ success: true, data: result });
        // } else {
        //     res.json({ success: false, message: "Please login first." });
        // }
    };

    getUserProfileById = async (req: Request, res: Response) => {
        const targetId: number = parseInt(req.params.id);
        const userId = parseInt(req["user"].id);

        if (!targetId || isNaN(targetId) || !userId) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const result = await this.userService.getUserProfileById(
            userId,
            targetId
        );
        if (result.success) {
            return res.json({ data: result.data });
        } else {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };

    addFriend = async (req: Request, res: Response) => {
        const paramUserId: any = req.params.id;
        const receiverId = parseInt(paramUserId);
        const requesterId = req.session["userId"];

        if (receiverId === requesterId) {
            res.status(400).json({ msg: "u cant' add a friend with yourself" });
        }

        const addFriendResult = await this.userService.makeRequest(
            requesterId,
            receiverId
        );

        res.json({ result: addFriendResult });
    };

    getFriendRelationStatusById = async (req: Request, res: Response) => {
        const paramUserId: any = req.params.id;
        const targetUserId = parseInt(paramUserId);
        let userId = req.session["userId"];
        console.log("(getingFriendRelation)userId=", userId);
        console.log("(getingFriendRelation)paramUserId=", paramUserId);

        //userId = 1;

        if (!targetUserId || !userId) {
            res.status(400).json({ msg: "Invalid request" });
            return;
        }

        const friendRelationResult =
            await this.userService.getFriendRelationStatusById(
                userId,
                targetUserId
            );

        res.json({ result: friendRelationResult });
    };
    getAllUsersByKeywords = async (req: Request, res: Response) => {
        const { keywords } = req.query;
        let query = "";
        const currentUserId = parseInt(req.session["userId"]);

        if (keywords && typeof keywords === "string") {
            query = keywords;
        }
        const result = await this.userService.getAllUsersByKeywords(
            currentUserId,
            query
        );
        res.json(result);
    };
    getEducationOptions = async (req: Request, res: Response) => {
        const result = await this.userService.getEducationOptions();
        res.json(result);
    };

    createPost = async (req: Request, res: Response) => {
        const content = req.body.content;
        const userId = req.session["userId"];
        console.log("UserPostController=", content);
        console.log("postingUserId=", userId);
        if (content) {
            const result = await this.userService.createPost(userId, content);
            res.json(result);
            return;
        }
        res.json({ message: "error" });
    };

    getUserPosts = async (req: Request, res: Response) => {
        const paramUserId: any = req.params.id;
        const userId = parseInt(paramUserId);
        const readerId = parseInt(req.session["userId"]);

        if (!paramUserId || !userId) {
            res.status(400).json({ msg: "invalid input" });
        }

        const result = await this.userService.getUserPosts(userId, readerId);
        console.log();
        res.json(result);
    };
    likePost = async (req: Request, res: Response) => {
        const postId = parseInt(req.params.id);
        const userId = parseInt(req.session["userId"]);

        if (!postId || !userId) {
            res.status(400).json({ success: false, message: "invalid input" });
        }

        const result = await this.userService.likePost(userId, postId);
        // console.log();
        res.json(result);
    };


    // ELSA
    allUserList = async (req: Request, res: Response) => {
        console.log(req.query);
        const result = await this.userService.allUserList(
            req.query.name,
        );
        res.json(result);
    };


    getAllUserInfo = async (req: Request, res: Response) => {
        const usersId = parseInt(req.params.id);
        const result = await this.userService.getAllUserInfo(
            usersId
        );
        res.json(result);
    };



    allPostsList = async (req: Request, res: Response) => {
        console.log(req.query);
        const result = await this.userService.allPostsList(
            req.query.q,
        );
        res.json(result);
    };
    dashBoard = async (req: Request, res: Response) => {
        const result = await this.userService.dashBoard();
        console.log("result:", result)
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(400).json(result);
        }
    }

    getPostInfoById = async (req: Request, res: Response) => {
        const postsId = parseInt(req.params.id);
        const result = await this.userService.getPostInfoById(
            postsId
        );
        res.json(result);
    };

    getUserInfo = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const query = await this.userService.getUserInfo(userId);
        console.log("result ==", query)
        res.json(query);
    };

    getPostByUser = async (req: Request, res: Response) => {
        const userId = parseInt(req.params.id);
        const result = await this.userService.getPostByUser(userId);
        console.log("result:", result)
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(400).json(result);
        }
    };

    getLikeByPost = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const result = await this.userService.getLikeByPost(id);
        console.log("result:", result)
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(400).json(result);
        }
    };


    commentByPost = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const result = await this.userService.commentByPost(id);
        console.log("result:", result)
        if (result.success) {
            return res.json(result);
        } else {
            return res.status(400).json(result);
        }
    };


}
