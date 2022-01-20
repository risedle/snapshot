import { ethers, providers } from "ethers";
import dotenv from "dotenv";
import cron from "node-cron";
import * as Sentry from "@sentry/node";
import { createConnection } from "typeorm";

import vault from "./vault";
import leveragedToken from "./leveragedToken";

// Load environment variables
dotenv.config();

// Initialize sentry
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.5,
});

Sentry.setTag("app_name", process.env.SENTRY_APP_NAME);

const leveragedTokensData = {
    kovan: {
        // rvUSDC
        "0x42B6BAE111D9300E19F266Abf58cA215f714432c": {
            // ETHRISE
            "0xc4676f88663360155c2bc6d2A482E34121a50b3b": {
                collateralDecimals: 18, // WETH
                debtDecimals: 6, // USDC
            },
        },
    },
};

const vaultTarget = { kovan: ["0x42B6BAE111D9300E19F266Abf58cA215f714432c"] };

const leveragedTokenTarget = {
    kovan: [
        {
            vault: "0x42B6BAE111D9300E19F266Abf58cA215f714432c",
            leveragedToken: "0xc4676f88663360155c2bc6d2A482E34121a50b3b",
        },
    ],
};

createConnection()
    .then((connection) => {
        // Initialize provider
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        const network = process.env.NETWORK;

        const vaultTask = cron.schedule("*/5 * * * *", async () => {
            for (let i = 0; i < vaultTarget[network].length; i++) {
                const vaultContractAddress = vaultTarget[network][i];
                try {
                    console.log("Snapshoting", vaultContractAddress, "...");
                    await vault.snapshot(vaultContractAddress, provider, connection);
                    console.log("Snapshoting", vaultContractAddress, "... DONE");
                } catch (e) {
                    console.error("Failed to run snapshot", vaultContractAddress, e);
                    Sentry.captureException(e);
                }
            }
        });
        const leveragedTokenTask = cron.schedule("*/5 * * * *", async () => {
            for (let i = 0; i < leveragedTokenTarget[network].length; i++) {
                const vault = leveragedTokenTarget[network][i].vault;
                const token = leveragedTokenTarget[network][i].leveragedToken;
                const data = leveragedTokensData[network][vault][token];
                try {
                    console.log("Snapshoting", vault, token, "...");
                    await leveragedToken.snapshot(vault, token, data.collateralDecimals, data.debtDecimals, provider, connection);
                    console.log("Snapshoting", vault, token, "... DONE");
                } catch (e) {
                    console.error("Failed to run snapshot", vault, token, e);
                    Sentry.captureException(e);
                }
            }
        });

        process.on("SIGTERM", () => {
            console.info("SIGTERM signal received.");
            console.log("Stopping cron job ...");
            vaultTask.stop();
            leveragedTokenTask.stop();
            console.log("Cronjob stopped ...");
        });
    })
    .catch((error) => console.log(error));
