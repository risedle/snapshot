import { Request, Response } from "express";

const Markets = {
    kovan: [
        {
            title: "ETHRISE",
            subtitle: "ETH Leverage Market",
            description: "You can Leverage your ETH without risk of liquidation or earn yield for your idle USDC",
            vault: "0x42B6BAE111D9300E19F266Abf58cA215f714432c",
            leveragedToken: "0xc4676f88663360155c2bc6d2A482E34121a50b3b",
        },
    ],
};

export const getMarketsData = async (req: Request, res: Response) => {
    // Get NAV

    res.send({ message: "hello" });
};
