import { Connection } from "typeorm";
import { RiseTokenSnapshot } from "../entities/RiseTokenSnapshot";

export const getRiseTokenThreeMonths = async (
    conn: Connection,
    tokenAddress: string
)=> {
    const results = await conn
        .createQueryBuilder()
        .select([
            "data.timestamp",
            "data.cps",
            "data.dps",
            "data.lr",
            "data.nav",
            "data.block_number"
        ])
        .from((subQuery) => {
            return subQuery
                .select([
                    "snapshot.address as address",
                    "snapshot.cps as cps",
                    "snapshot.dps as dps",
                    "snapshot.lr as lr",
                    "snapshot.nav as nav",
                    "snapshot.blockNumber as block_number",
                    "date_trunc('hour', timestamp) as timestamp", "row_number() over (partition by date_trunc('hour', timestamp) order by timestamp desc) as row_number"
                ])
                .from(RiseTokenSnapshot, "snapshot")
                .where("snapshot.address = :address", {
                    address: tokenAddress,
                })
                .andWhere("snapshot.timestamp >= NOW() - INTERVAL '90 DAY'");
        }, "data")
        .where("data.row_number = :rowNumber", { rowNumber: 1 })
        .getRawMany();
    return results;
};
