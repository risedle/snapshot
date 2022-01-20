import { Connection } from "typeorm";
import { VaultSnapshot } from "../entities/VaultSnapshot";

export const getVaultsYearly = async (conn: Connection, vaultAddress: string) => {
    const results = await conn
        .createQueryBuilder()
        .select(["data.timestamp_truncated as timestamp", "data.borrow_apy", "data.supply_apy", "data.utilization_rate", "data.total_available_cash", "data.total_outstanding_debt"])
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
                .where("vaultSnapshot.contractAddress = :contractAddress", {
                    contractAddress: vaultAddress,
                })
                .andWhere("vaultSnapshot.timestamp >= NOW() - INTERVAL '1 YEAR'");
        }, "data")
        .where("data.row_number = :rowNumber", { rowNumber: 1 })
        .getRawMany();
    return results;
};
