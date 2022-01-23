import express from "express";
import { Request, Response } from "express";
import { createConnection } from "typeorm";
import morgan from "morgan";
import cors from "cors";

// APIs
import { getVaultsDaily } from "./getVaultsDaily";
import { getVaultsWeekly } from "./getVaultsWeekly";
import { getVaultsMonthly } from "./getVaultsMonthly";
import { getVaultsThreeMonths } from "./getVaultsThreeMonths";
import { getVaultsYearly } from "./getVaultsYearly";
import { getLeveragedTokensDaily } from "./getLeveragedTokensDaily";
import { getLeveragedTokensWeekly } from "./getLeveragedTokensWeekly";
import { getLeveragedTokensMonthly } from "./getLeveragedTokensMonthly";
import { getLeveragedTokensThreeMonths } from "./getLeveragedTokensThreeMonths";
import { getLeveragedTokensYearly } from "./getLeveragedTokensYearly";
import { getMarketsData } from "./getMarketsData";
import { getMarketData } from "./getMarketData";

// create typeorm connection
createConnection().then((connection) => {
    // create and setup express app
    const app = express();
    app.use(express.json());
    app.use(morgan("combined"));
    app.use(
        cors({
            origin: ["https://risedle.com", "http://localhost:6006", "http://localhost:3000", /.frontend-3mt\.pages\.dev$/],
        })
    );

    app.get("/", async function (req: Request, res: Response) {
        return res.send({ message: "OK" });
    });

    app.get("/health", async function (req: Request, res: Response) {
        return res.send({ message: "OK" });
    });

    // Get daily data of vaults
    app.get("/v1/vaults/daily/:id", async function (req: Request, res: Response) {
        const results = await getVaultsDaily(connection, req.params.id);
        return res.send(results);
    });

    // Get weekly data of vaults
    app.get("/v1/vaults/weekly/:id", async function (req: Request, res: Response) {
        const results = await getVaultsWeekly(connection, req.params.id);
        return res.send(results);
    });

    // Get monthly data of vaults
    app.get("/v1/vaults/monthly/:id", async function (req: Request, res: Response) {
        const results = await getVaultsMonthly(connection, req.params.id);
        return res.send(results);
    });

    // Get 3 months data of vaults
    app.get("/v1/vaults/3months/:id", async function (req: Request, res: Response) {
        const results = await getVaultsThreeMonths(connection, req.params.id);
        return res.send(results);
    });

    // Get 12 months data of vaults
    app.get("/v1/vaults/yearly/:id", async function (req: Request, res: Response) {
        const results = await getVaultsYearly(connection, req.params.id);
        return res.send(results);
    });

    // Get daily data of leveraged tokens
    app.get("/v1/leveragedTokens/daily/:id", async function (req: Request, res: Response) {
        const results = await getLeveragedTokensDaily(connection, req.params.id);
        return res.send(results);
    });

    // Get weekly data of vaults
    app.get("/v1/leveragedTokens/weekly/:id", async function (req: Request, res: Response) {
        const results = await getLeveragedTokensWeekly(connection, req.params.id);
        return res.send(results);
    });

    // Get monthly data of vaults
    app.get("/v1/leveragedTokens/monthly/:id", async function (req: Request, res: Response) {
        const results = await getLeveragedTokensMonthly(connection, req.params.id);
        return res.send(results);
    });

    // Get 3 months data of vaults
    app.get("/v1/leveragedTokens/3months/:id", async function (req: Request, res: Response) {
        const results = await getLeveragedTokensThreeMonths(connection, req.params.id);
        return res.send(results);
    });

    // Get 12 months data of vaults
    app.get("/v1/leveragedTokens/yearly/:id", async function (req: Request, res: Response) {
        const results = await getLeveragedTokensYearly(connection, req.params.id);
        return res.send(results);
    });

    app.get("/v1/markets", async function (req: Request, res: Response) {
        const results = await getMarketsData(connection);
        return res.send(results);
    });

    app.get("/v1/markets/:id", async function (req: Request, res: Response) {
        const results = await getMarketData(connection, req.params.id);
        return res.send(results);
    });

    // start express server
    console.log("Starting server :3000 ...");
    app.listen(3000);
});
