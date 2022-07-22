import { Request, Response } from "express";
import { ThreadService } from "../services/ThreadService";

export class ThreadController {
    constructor(private threadService: ThreadService) {}
    // GET
    getAllConnectedThreadsByOffset = async (req: Request, res: Response) => {
        const userId = req["user"].id;
        const query = req.query.offset;
        if (!query) {
            return res
                .status(400)
                .json({ message: "Failed to retrieve posts" });
        }
        const offset = parseInt(query?.toString());
        const result = await this.threadService.getAllConnectedThreadsByOffset(
            userId,
            offset
        );
        if (result) {
            // console.log(result);
            return res.json(result);
        } else {
            return res
                .status(400)
                .json({ message: "Failed to retrieve posts." });
        }
    };
    getThreadByPostId = async (req: Request, res: Response) => {
        let paramId = req.params.id;

        if (!paramId) {
            return res.status(400).json({ message: "Failed to retrieve post" });
        }
        const userId = parseInt(req["user"].id);
        const postId = parseInt(paramId.toString());
        const result = await this.threadService.getThreadByPostId(
            userId,
            postId
        );
        if (result) {
            // console.log(result);
            return res.json(result);
        } else {
            return res
                .status(400)
                .json({ message: "Failed to retrieve posts" });
        }
    };
    getAllThreadsByPosterId = async (req: Request, res: Response) => {
        let paramId = req.params.id;
        let { type } = req.query;
        if (!paramId || !type) {
            return res.status(400).json({ message: "Failed to retrieve post" });
        }
        const userId = parseInt(req["user"].id);
        const posterId = parseInt(paramId.toString());
        const result = await this.threadService.getAllThreadsByPosterId(
            userId,
            posterId,
            type
        );
        if (result) {
            // console.log(result);
            return res.json(result);
        } else {
            return res
                .status(400)
                .json({ message: "Failed to retrieve posts" });
        }
    };
    // POST
    postUserThread = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const userName = req["user"].first_name + " " + req["user"].last_name;
        // console.log("userName", userName);
        const files = req.files;
        const content: string = req.body.content;
        const is_public: boolean = req.body.is_public;
        // console.log(userId);
        // console.log(files);
        // console.log(content);
        const success = await this.threadService.postUserThread(
            userId,
            userName,
            files,
            content,
            is_public
        );
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Failed" });
        }
    };
    postCompanyThread = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const companyId = parseInt(req.params.id);
        if (!companyId) {
            return res.status(400).json({ message: "Failed" });
        }
        // console.log("userName", userName);
        const files = req.files;
        const content: string = req.body.content;
        const is_public: boolean = req.body.is_public;
        // console.log(userId);
        // console.log(files);
        // console.log(content);
        const success = await this.threadService.postCompanyThread(
            userId,
            companyId,
            files,
            content,
            is_public
        );
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Failed" });
        }
    };
    postComment = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const { post_id, content } = req.body;
        // CHECKING
        if (content == "") {
            return res.status(400).json({ message: "Input cannot be empty" });
        }
        if (!post_id || isNaN(parseInt(post_id))) {
            return res.status(400).json({ message: "Invald post id" });
        }
        if (content.length > 400) {
            return res
                .status(400)
                .json({ message: "Exceeded word limit (400 characters)" });
        }
        const success = await this.threadService.postComment(
            userId,
            parseInt(post_id),
            content
        );
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Failed to post comment" });
        }
    };
    postSubcomment = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const { comment_id, content } = req.body;
        console.log(req.body);
        // CHECKING
        if (content == "") {
            return res.status(400).json({ message: "Input cannot be empty" });
        }
        if (!comment_id || isNaN(parseInt(comment_id))) {
            return res.status(400).json({ message: "Invald comment id" });
        }
        if (content.length > 400) {
            return res
                .status(400)
                .json({ message: "Exceeded word limit (400 characters)" });
        }
        const success = await this.threadService.postSubcomment(
            userId,
            parseInt(comment_id),
            content
        );
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Failed to post comment" });
        }
    };
    // PUT
    editUserThread = async (req: Request, res: Response) => {
        // const userId = parseInt(req["user"].id);
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Invalid input" });
        }
        const postId = parseInt(id);
        const files = req.files;
        const content: string = req.body.content;
        const is_public: boolean = req.body.is_public;

        const success = await this.threadService.editUserThread(
            postId,
            files,
            content,
            is_public
        );
        if (success) {
            return res.json({ message: "Success" });
        } else {
            return res.status(400).json({ message: "Failed" });
        }
    };
    likePost = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).json({ message: "Invalid post id" });
        }
        const userId = parseInt(req["user"].id);
        const postId = parseInt(req.params.id);
        const success = await this.threadService.likePost(userId, postId);
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Invalid post id" });
        }
    };
    likeComment = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).json({ message: "Invalid post id" });
        }
        const userId = parseInt(req["user"].id);
        const commentId = parseInt(req.params.id);
        const success = await this.threadService.likeComment(userId, commentId);
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Invalid comment id" });
        }
    };
    likeSubcomment = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).json({ message: "Invalid comment id" });
        }
        const userId = parseInt(req["user"].id);
        const subcommentId = parseInt(req.params.id);
        const success = await this.threadService.likeSubcomment(
            userId,
            subcommentId
        );
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Invalid reply id" });
        }
    };
    // DELETE
    deleteUserPost = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(404).json({ message: "Invalid post id" });
        }
        const userId = parseInt(req["user"].id);
        const postId = parseInt(req.params.id);
        const success = await this.threadService.deleteUserPost(userId, postId);
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Failed to remove post" });
        }
    };
}
