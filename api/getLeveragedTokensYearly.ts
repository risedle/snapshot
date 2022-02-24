import { Connection } from "typeorm";
import { LeveragedTokenSnapshot } from "../entities/LeveragedTokenSnapshot";

export const getLeveragedTokensYearly = async (conn: Connection, leveragedTokenAddress: string) => {
    const results = await conn
        .createQueryBuilder()
        .select(["data.timestamp", "data.collateral_per_leveraged_token", "data.debt_per_leveraged_token", "data.leverage_ratio", "data.nav", "data.block_number"])
        .from((subQuery) => {
            return subQuery
                .select(["snapshot.contractAddress as address", "snapshot.collateralPerLeveragedToken as collateral_per_leveraged_token", "snapshot.debtPerLeveragedToken as debt_per_leveraged_token", "snapshot.leverageRatio as leverage_ratio", "snapshot.nav as nav", "snapshot.blockNumber as block_number", "date_trunc('hour', timestamp) as timestamp", "row_number() over (partition by date_trunc('hour', timestamp) order by timestamp desc) as row_number"])
                .from(LeveragedTokenSnapshot, "snapshot")
                .where("snapshot.contractAddress = :contractAddress", {
                    contractAddress: leveragedTokenAddress,
                })
                .andWhere("snapshot.timestamp >= NOW() - INTERVAL '1 YEAR'");
        }, "data")
        .where("data.row_number = :rowNumber", { rowNumber: 1 })
        .getRawMany();
    return results;
};
