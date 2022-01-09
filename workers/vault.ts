import { BigNumber, ethers } from "ethers";
import dotenv from "dotenv";
import cron from "node-cron";
import * as Sentry from "@sentry/node";
import { createConnection, Connection } from "typeorm";
import { VaultSnapshot } from "../entities/VaultSnapshot";

// Load environment variables
dotenv.config();

// Initialize sentry
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.5,
});

Sentry.setTag("app_name", process.env.SENTRY_APP_NAME);

// Read data from the contract
const RISE_TOKEN_VAULT_INTERFACE = new ethers.utils.Interface([
    // Read only
    "function getBorrowRatePerSecondInEther() external view returns (uint256)",
    "function getSupplyRatePerSecondInEther() external view returns (uint256)",
    "function getUtilizationRateInEther() external view returns (uint256)",
    "function totalOutstandingDebt() external view returns (uint256)",
    "function getTotalAvailableCash() external view returns (uint256)",
]);

async function snapshot(
    vaultContractAddress: string,
    provider: ethers.providers.JsonRpcProvider,
    connection: Connection
) {
    // Initialize the contract
    const riseTokenVaultContract = new ethers.Contract(
        vaultContractAddress,
        RISE_TOKEN_VAULT_INTERFACE,
        provider
    );

    // Get supply APY
    const supplyRatePerSecondInEther: BigNumber =
        await riseTokenVaultContract.getSupplyRatePerSecondInEther();
    const supplyRatePerSecond = parseFloat(
        ethers.utils.formatEther(supplyRatePerSecondInEther)
    );
    const secondsPerDay = 86400;
    const daysPerYear = 365;
    const supplyAPY =
        (Math.pow(supplyRatePerSecond * secondsPerDay + 1, daysPerYear) - 1) *
        100;
    console.log("DEBUG: supplyAPY", supplyAPY);

    // Get borrow APY
    const borrowRatePerSecondInEther: BigNumber =
        await riseTokenVaultContract.getBorrowRatePerSecondInEther();
    const borrowRatePerSecond = parseFloat(
        ethers.utils.formatEther(borrowRatePerSecondInEther)
    );
    const borrowAPY =
        (Math.pow(borrowRatePerSecond * secondsPerDay + 1, daysPerYear) - 1) *
        100;
    console.log("DEBUG: borrowAPY", borrowAPY);

    // Get utilization rate
    const utilizationRateInEther: BigNumber =
        await riseTokenVaultContract.getUtilizationRateInEther();
    const utilizationRate = parseFloat(
        ethers.utils.formatEther(utilizationRateInEther)
    );
    const utilizationRatePercentage = utilizationRate * 100;
    console.log("DEBUG: utilizationRatePercentage", utilizationRatePercentage);

    // Get total outstanding debt
    const totalOutstandingDebt: BigNumber =
        await riseTokenVaultContract.totalOutstandingDebt();
    const totalOutstandingDebtFloat = parseFloat(
        ethers.utils.formatUnits(totalOutstandingDebt, 6)
    );
    console.log("DEBUG: totalOutstandingDebtFloat", totalOutstandingDebtFloat);

    // Get total outstanding debt
    const totalAvailableCash: BigNumber =
        await riseTokenVaultContract.getTotalAvailableCash();
    const totalAvailableCashFloat = parseFloat(
        ethers.utils.formatUnits(totalAvailableCash, 6)
    );
    console.log("DEBUG: totalAvailableCashFloat", totalAvailableCashFloat);

    // Connect to postgresql
    const repository = connection.getRepository(VaultSnapshot);

    const snapshot = new VaultSnapshot();
    snapshot.contractAddress = vaultContractAddress;
    snapshot.borrowAPY = borrowAPY;
    snapshot.supplyAPY = supplyAPY;
    snapshot.totalAvailableCash = totalAvailableCashFloat;
    snapshot.totalOutstandingDebt = totalOutstandingDebtFloat;
    snapshot.utilizationRate = utilizationRatePercentage;
    await repository.save(snapshot);
}

createConnection()
    .then((connection) => {
        const task = cron.schedule("* * * * *", async () => {
            // Initialize provider
            const provider = new ethers.providers.JsonRpcProvider(
                process.env.RPC_URL
            );

            // Contract addresses
            const vaultContractAddresses = process.env.VAULT_CONTRACTS;
            const addresses: Array<string> = vaultContractAddresses.split(",");
            for (let i = 0; i < addresses.length; i++) {
                try {
                    console.log("Snapshoting", addresses[i], "...");
                    await snapshot(addresses[i], provider, connection);
                    console.log("Snapshoting", addresses[i], "...DONE");
                } catch (e) {
                    console.error("Failed to run snapshot", addresses[i], e);
                    Sentry.captureException(e);
                }
            }
        });

        process.on("SIGTERM", () => {
            console.info("SIGTERM signal received.");
            console.log("Stopping cron job ...");
            task.stop();
            console.log("Cronjob stopped ...");
        });
    })
    .catch((error) => console.log(error));
