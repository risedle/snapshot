import express from "express";
import { Request, Response } from "express";
import { createConnection } from "typeorm";
import { VaultSnapshot } from "../entities/VaultSnapshot";
import { LeveragedTokenSnapshot } from "../entities/LeveragedTokenSnapshot";
import morgan from "morgan";

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

// create typeorm connection
createConnection().then((connection) => {
    // create and setup express app
    const app = express();
    app.use(express.json());
    app.use(morgan("combined"));

    app.get("/", async function (req: Request, res: Response) {
        return res.send({ message: "OK" });
    });

    app.get("/health", async function (req: Request, res: Response) {
        return res.send({ message: "OK" });
    });

    // Get daily data of vaults
    app.get(
        "/v1/vaults/daily/:id",
        async function (req: Request, res: Response) {
            const results = await getVaultsDaily(connection, req.params.id);
            return res.send(results);
        }
    );

    // Get weekly data of vaults
    app.get(
        "/v1/vaults/weekly/:id",
        async function (req: Request, res: Response) {
            const results = await getVaultsWeekly(connection, req.params.id);
            return res.send(results);
        }
    );

    // Get monthly data of vaults
    app.get(
        "/v1/vaults/monthly/:id",
        async function (req: Request, res: Response) {
            const results = await getVaultsMonthly(connection, req.params.id);
            return res.send(results);
        }
    );

    // Get 3 months data of vaults
    app.get(
        "/v1/vaults/3months/:id",
        async function (req: Request, res: Response) {
            const results = await getVaultsThreeMonths(
                connection,
                req.params.id
            );
            return res.send(results);
        }
    );

    // Get 12 months data of vaults
    app.get(
        "/v1/vaults/yearly/:id",
        async function (req: Request, res: Response) {
            const results = await getVaultsYearly(connection, req.params.id);
            return res.send(results);
        }
    );

    // Get daily data of leveraged tokens
    app.get(
        "/v1/leveragedTokens/daily/:id",
        async function (req: Request, res: Response) {
            const results = await getLeveragedTokensDaily(
                connection,
                req.params.id
            );
            return res.send(results);
        }
    );

    // Get weekly data of vaults
    app.get(
        "/v1/leveragedTokens/weekly/:id",
        async function (req: Request, res: Response) {
            const results = await getLeveragedTokensWeekly(
                connection,
                req.params.id
            );
            return res.send(results);
        }
    );

    // Get monthly data of vaults
    app.get(
        "/v1/leveragedTokens/monthly/:id",
        async function (req: Request, res: Response) {
            const results = await getLeveragedTokensMonthly(
                connection,
                req.params.id
            );
            return res.send(results);
        }
    );

    // Get 3 months data of vaults
    app.get(
        "/v1/leveragedTokens/3months/:id",
        async function (req: Request, res: Response) {
            const results = await getLeveragedTokensThreeMonths(
                connection,
                req.params.id
            );
            return res.send(results);
        }
    );

    // Get 12 months data of vaults
    app.get(
        "/v1/leveragedTokens/yearly/:id",
        async function (req: Request, res: Response) {
            const results = await connection
                .createQueryBuilder()
                .select([
                    "data.timestamp",
                    "data.collateral_per_leveraged_token",
                    "data.debt_per_leveraged_token",
                    "data.leverage_ratio",
                    "data.nav",
                ])
                .from((subQuery) => {
                    return subQuery
                        .select([
                            "snapshot.contractAddress as address",
                            "snapshot.collateralPerLeveragedToken as collateral_per_leveraged_token",
                            "snapshot.debtPerLeveragedToken as debt_per_leveraged_token",
                            "snapshot.leverageRatio as leverage_ratio",
                            "snapshot.nav as nav",
                            "date_trunc('hour', timestamp) as timestamp",
                            "row_number() over (partition by date_trunc('hour', timestamp) order by timestamp desc) as row_number",
                        ])
                        .from(LeveragedTokenSnapshot, "snapshot")
                        .where("snapshot.contractAddress = :contractAddress", {
                            contractAddress: req.params.id,
                        })
                        .andWhere(
                            "snapshot.timestamp >= NOW() - INTERVAL '1 YEAR'"
                        );
                }, "data")
                .where("data.row_number = :rowNumber", { rowNumber: 1 })
                .getRawMany();
            return res.send(results);
        }
    );

    // start express server
    console.log("Starting server :3000 ...");
    app.listen(3000);
});
