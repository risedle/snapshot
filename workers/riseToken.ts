import { BigNumber, ethers } from "ethers";
import { Connection } from "typeorm";
import { LeveragedTokenSnapshot } from "../entities/LeveragedTokenSnapshot";

import { RiseTokenABI, ERC20ABI, OracleABI } from "./abi";

export type RiseToken = {
    address: string,
    collateral: string,
    cdecimals: number,
    debt: string,
    ddecimals: number,
}

async function snapshot(
    token: RiseToken,
    provider: ethers.providers.JsonRpcProvider,
    connection: Connection
) {
    // Initialize the contract
    const riseToken = new ethers.Contract(
        token.address,
        RiseTokenABI,
        provider
    );

    // Get collateral per share
    const cpsBN: BigNumber = await riseToken.collateralPerShare();
    const cps = parseFloat(ethers.utils.formatUnits(cpsBN, token.cdecimals));
    console.log("DEBUG: Collateral per share", cps);

    // Get debt per share
    const dpsBN: BigNumber = await riseToken.debtPerShare();
    const dps = parseFloat(ethers.utils.formatUnits(dpsBN, token.ddecimals));
    console.log("DEBUG: Debt per share", dps);

    // Get leverage ratio in ether
    const lrBN: BigNumber = await riseToken.leverageRatio();
    const lr = parseFloat(ethers.utils.formatEther(lrBN));
    console.log("DEBUG: lr", lr);

    // Get nav price
    const navBN: BigNumber = await riseTokenVaultContract.getNAV(leveragedTokenContractAddress);
    const nav = parseFloat(ethers.utils.formatUnits(navBN, debtDecimals));
    console.log("DEBUG: nav", nav);

    // Get token metadata
    const metadata = await riseTokenVaultContract.getMetadata(leveragedTokenContractAddress);
    const maxTotalCollateral = parseFloat(ethers.utils.formatUnits(metadata.maxTotalCollateral, collateralDecimals));
    console.log("DEBUG: maxTotalCollateral", maxTotalCollateral);

    // Get total supply
    const totalSupplyBN: BigNumber = await leveragedTokenContract.totalSupply();
    const totalSupply = parseFloat(ethers.utils.formatUnits(totalSupplyBN, collateralDecimals));
    console.log("DEBUG: totalSupply", totalSupply);

    // Get outstanding debt
    const outstandingDebtBN: BigNumber = await riseTokenVaultContract.getOutstandingDebt(leveragedTokenContractAddress);
    const outstandingDebt = parseFloat(ethers.utils.formatUnits(outstandingDebtBN, debtDecimals));
    console.log("DEBUG: outstandingDebt", outstandingDebt);

    // Get blocknumber
    const blockNumber = await provider.getBlockNumber();
    console.log("DEBUG: blockNumber", blockNumber);

    // Connect to postgresql
    const repository = connection.getRepository(LeveragedTokenSnapshot);

    const snapshot = new LeveragedTokenSnapshot();
    snapshot.contractAddress = leveragedTokenContractAddress;
    snapshot.collateralPerLeveragedToken = collateralPerLeveragedToken;
    snapshot.debtPerLeveragedToken = debtPerLeveragedToken;
    snapshot.leverageRatio = leverageRatio;
    snapshot.nav = nav;
    snapshot.vaultContractAddress = vaultContractAddress;
    snapshot.totalSupply = totalSupply;
    snapshot.maxTotalCollateral = maxTotalCollateral;
    snapshot.totalCollateralPlusFee = totalCollateralPlusFee;
    snapshot.totalPendingFees = totalPendingFees;
    snapshot.outstandingDebt = outstandingDebt;
    snapshot.collateralPrice = collateralPrice;
    snapshot.blockNumber = blockNumber;
    await repository.save(snapshot);
}

export default {
    snapshot: snapshot,
};
