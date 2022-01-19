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
            const results = await connection
                .createQueryBuilder()
                .select([
                    "data.timestamp_truncated as timestamp",
                    "data.borrow_apy",
                    "data.supply_apy",
                    "data.utilization_rate",
                    "data.total_available_cash",
                    "data.total_outstanding_debt",
                ])
                .from((subQuery) => {
                    return subQuery
                        .select([
                            "vaultSnapshot.contractAddress as address",
                            "vaultSnapshot.borrowAPY as borrow_apy",
                            "vaultSnapshot.supplyAPY as supply_apy",
                            "vaultSnapshot.utilizationRate as utilization_rate",
                            "vaultSnapshot.totalAvailableCash as total_available_cash",
                            "vaultSnapshot.totalOutstandingDebt as total_outstanding_debt",
                            "date_trunc('day', vaultSnapshot.timestamp) as timestamp_truncated",
                            "row_number() over (partition by date_trunc('day', vaultSnapshot.timestamp) order by vaultSnapshot.timestamp desc) as row_number",
                        ])
                        .from(VaultSnapshot, "vaultSnapshot")
                        .where(
                            "vaultSnapshot.contractAddress = :contractAddress",
                            {
                                contractAddress: req.params.id,
                            }
                        )
                        .andWhere(
                            "vaultSnapshot.timestamp >= NOW() - INTERVAL '1 YEAR'"
                        );
                }, "data")
                .where("data.row_number = :rowNumber", { rowNumber: 1 })
                .getRawMany();
            return res.send(results);
        }
    );

    // Get daily data of leveraged tokens
    app.get(
        "/v1/leveragedTokens/daily/:id",
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
                            "snapshot.timestamp >= NOW() - INTERVAL '1 DAY'"
                        );
                }, "data")
                .where("data.row_number = :rowNumber", { rowNumber: 1 })
                .getRawMany();
            return res.send(results);
        }
    );

    // Get weekly data of vaults
    app.get(
        "/v1/leveragedTokens/weekly/:id",
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
                            "snapshot.timestamp >= NOW() - INTERVAL '7 DAY'"
                        );
                }, "data")
                .where("data.row_number = :rowNumber", { rowNumber: 1 })
                .getRawMany();
            return res.send(results);
        }
    );

    // Get monthly data of vaults
    app.get(
        "/v1/leveragedTokens/monthly/:id",
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
                            "snapshot.timestamp >= NOW() - INTERVAL '30 DAY'"
                        );
                }, "data")
                .where("data.row_number = :rowNumber", { rowNumber: 1 })
                .getRawMany();
            return res.send(results);
        }
    );

    // Get 3 months data of vaults
    app.get(
        "/v1/leveragedTokens/3months/:id",
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
                            "snapshot.timestamp >= NOW() - INTERVAL '90 DAY'"
                        );
                }, "data")
                .where("data.row_number = :rowNumber", { rowNumber: 1 })
                .getRawMany();
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
