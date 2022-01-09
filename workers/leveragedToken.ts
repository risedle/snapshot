import { BigNumber, ethers } from "ethers";
import { Connection } from "typeorm";
import { LeveragedTokenSnapshot } from "../entities/LeveragedTokenSnapshot";

import abi from "./abi";

async function snapshot(
    vaultContractAddress: string,
    leveragedTokenContractAddress: string,
    collateralDecimals: number,
    debtDecimals: number,
    provider: ethers.providers.JsonRpcProvider,
    connection: Connection
) {
    // Initialize the contract
    const riseTokenVaultContract = new ethers.Contract(
        vaultContractAddress,
        abi,
        provider
    );

    // Get collateral per leveraged token
    const collateralPerLeveragedTokenBN: BigNumber =
        await riseTokenVaultContract.getCollateralPerRiseToken(
            leveragedTokenContractAddress
        );
    const collateralPerLeveragedToken = parseFloat(
        ethers.utils.formatUnits(
            collateralPerLeveragedTokenBN,
            collateralDecimals
        )
    );
    console.log(
        "DEBUG: collateralPerLeveragedToken",
        collateralPerLeveragedToken
    );

    // Get debt per leveraged token
    const debtPerLeveragedTokenBN: BigNumber =
        await riseTokenVaultContract.getDebtPerRiseToken(
            leveragedTokenContractAddress
        );
    const debtPerLeveragedToken = parseFloat(
        ethers.utils.formatUnits(debtPerLeveragedTokenBN, debtDecimals)
    );
    console.log("DEBUG: debtPerLeveragedToken", debtPerLeveragedToken);

    // Get leverage ratio in ether
    const leverageRatioBN: BigNumber =
        await riseTokenVaultContract.getLeverageRatioInEther(
            leveragedTokenContractAddress
        );
    const leverageRatio = parseFloat(ethers.utils.formatEther(leverageRatioBN));
    console.log("DEBUG: leverageRatio", leverageRatio);

    // Get nav price
    const navBN: BigNumber = await riseTokenVaultContract.getDebtPerRiseToken(
        leveragedTokenContractAddress
    );
    const nav = parseFloat(ethers.utils.formatUnits(navBN, debtDecimals));
    console.log("DEBUG: nav", nav);

    // Connect to postgresql
    const repository = connection.getRepository(LeveragedTokenSnapshot);

    const snapshot = new LeveragedTokenSnapshot();
    snapshot.contractAddress = leveragedTokenContractAddress;
    snapshot.collateralPerLeveragedToken = collateralPerLeveragedToken;
    snapshot.debtPerLeveragedToken = debtPerLeveragedToken;
    snapshot.leverageRatio = leverageRatio;
    snapshot.nav = nav;
    await repository.save(snapshot);
}

export default {
    snapshot: snapshot,
};
