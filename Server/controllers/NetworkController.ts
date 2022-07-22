import { Request, Response } from "express";
import { NetworkService } from "../services/NetworkService";

export class NetworkController {
    constructor(private networkService: NetworkService) {}
    getAllConnections = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req["user"].id);
            const result = await this.networkService.getAllConnections(userId);
            if (result) {
                return res.json({ data: result });
            } else {
                return res.status(400).json({ messsage: "Invalid user" });
            }
        } catch (error) {
            return res.status(400).json({ messsage: "Invalid user" });
        }
    };
    getAllNetworksForChat = async (req: Request, res: Response) => {
        try {
            const { keywords } = req.query;
            let query = "";
            const id = parseInt(req.session["userId"]);
            if (keywords && typeof keywords === "string") {
                query = keywords;
            }
            const result = await this.networkService.getAllNetworksForChat(
                id,
                query
            );
            res.json({ success: true, data: result });
        } catch (error) {
            res.json({ success: false, message: error });
        }
    };
    getRelationshipById = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ messsage: "Invalid request" });
        }
        const counterpartId = parseInt(id);
        const result = await this.networkService.getRelationshipById(
            userId,
            counterpartId
        );
        if (result) {
            return res.json({ result });
        } else {
            return res
                .status(400)
                .json({ messsage: "Failed to retrieved data" });
        }
    };
    getSimilarIndustry = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req["user"].id);
            const result = await this.networkService.getSimilarIndustry(userId);
            if (result) {
                return res.json(result);
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to retrieve data" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getSimilarCompany = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req["user"].id);
            const result = await this.networkService.getSimilarCompany(userId);
            if (result) {
                return res.json(result);
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to retrieve data" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getSimilarHobby = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req["user"].id);
            const result = await this.networkService.getSimilarHobby(userId);
            if (result) {
                return res.json(result);
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to retrieve data" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getSimilarSkill = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req["user"].id);
            const result = await this.networkService.getSimilarSkill(userId);
            if (result) {
                return res.json(result);
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to retrieve data" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    getAllRequests = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req["user"].id);
            const receivedRequests =
                await this.networkService.getAllReceivedRequests(userId);
            const sentRequests = await this.networkService.getAllSentRequests(
                userId
            );
            if (receivedRequests && sentRequests) {
                return res.json({ data: { receivedRequests, sentRequests } });
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to retrieve data" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Failed to retrieve data" });
        }
    };
    removeConnection = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req["user"].id);
            const counterpartId = req.params.id;
            if (!counterpartId || !userId) {
                return res.status(400).json({ message: "Failed" });
            }
            if (parseInt(counterpartId) == userId) {
                return res.status(400).json({ message: "Invalid users" });
            }
            const success = await this.networkService.removeConnection(
                userId,
                parseInt(counterpartId)
            );
            const newRelationship =
                await this.networkService.getRelationshipById(
                    userId,
                    parseInt(counterpartId)
                );
            if (success && newRelationship) {
                return res.json({ relationship: newRelationship });
            } else {
                return res.status(400).json({ message: "Failed" });
            }
            // console.log("networkController request => ", result);
        } catch (error) {
            return res.status(400).json({ message: "Failed" });
        }
    };
    makeRequest = async (req: Request, res: Response) => {
        try {
            // console.log("request received");
            const userId = parseInt(req["user"].id);
            const id = req.params.id;
            if (!id) {
                return res
                    .status(400)
                    .json({ message: "Failed to make request" });
            }
            if (parseInt(id) == userId) {
                return res.status(400).json({ message: "Invalid users" });
            }
            const success = await this.networkService.makeRequest(
                userId,
                parseInt(id)
            );
            const newRelationship =
                await this.networkService.getRelationshipById(
                    userId,
                    parseInt(id)
                );
            if (success && newRelationship) {
                return res.json({ relationship: newRelationship });
            } else {
                return res
                    .status(400)
                    .json({ message: "Failed to make request" });
            }
            // console.log("networkController request => ", result);
        } catch (error) {
            return res.status(400).json({ message: "Failed to make request" });
        }
    };
    respondToRequest = async (req: Request, res: Response) => {
        const { networkId, isAccepted } = req.body;
        if (!networkId || isAccepted === undefined) {
            return res.status(400).json({
                message: "Invalid request",
            });
        }
        const success = await this.networkService.respondToRequest(
            parseInt(networkId),
            isAccepted
        );
        if (success) {
            return res.json(true);
        } else {
            return res.status(400).json({
                message: "Failed to respond to request",
            });
        }
    };
}
