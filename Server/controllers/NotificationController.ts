import { NotificationService } from "../services/NotificationService";
import { Request, Response } from "express";

export class NotificationController {
    constructor(private notificationService: NotificationService) {}
    getNotifications = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const result = await this.notificationService.getNotifications(userId);

        if (result) {
            return res.json({ data: result });
        } else {
            return res
                .status(400)
                .json({ message: "Failed to retrive notifications" });
        }
    };
    readNotifications = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const success = await this.notificationService.readNotifications(
            userId
        );
        if (success) {
            return res.json(success);
        } else {
            return res.status(400).json({ message: "Request Failed" });
        }
    };
    deleteNotification = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const success = await this.notificationService.deleteNotification(id);
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({ message: "Failed" });
        }
    };
}
