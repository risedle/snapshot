import { BigNumber, ethers } from "ethers";
import { Connection } from "typeorm";
import { LeveragedTokenSnapshot } from "../entities/LeveragedTokenSnapshot";

import { VaultABI, ERC20ABI, OracleABI } from "./abi";

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
        VaultABI,
        provider
    );
    const leveragedTokenContract = new ethers.Contract(
        leveragedTokenContractAddress,
        ERC20ABI,
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
    const navBN: BigNumber = await riseTokenVaultContract.getNAV(
        leveragedTokenContractAddress
    );
    const nav = parseFloat(ethers.utils.formatUnits(navBN, debtDecimals));
    console.log("DEBUG: nav", nav);

    // Get token metadata
    const metadata = await riseTokenVaultContract.getMetadata(
        leveragedTokenContractAddress
    );
    const maxTotalCollateral = parseFloat(
        ethers.utils.formatUnits(
            metadata.maxTotalCollateral,
            collateralDecimals
        )
    );
    console.log("DEBUG: maxTotalCollateral", maxTotalCollateral);

    const totalCollateralPlusFee = parseFloat(
        ethers.utils.formatUnits(
            metadata.totalCollateralPlusFee,
            collateralDecimals
        )
    );
    console.log("DEBUG: totalCollateralPlusFee", totalCollateralPlusFee);

    const totalPendingFees = parseFloat(
        ethers.utils.formatUnits(metadata.totalPendingFees, collateralDecimals)
    );
    console.log("DEBUG: totalPendingFees", totalPendingFees);

    // Get oracle price
    const oracleContract = new ethers.Contract(
        metadata.oracleContract,
        OracleABI,
        provider
    );
    const collateralPriceBN: BigNumber = await oracleContract.getPrice();
    const collateralPrice = parseFloat(
        ethers.utils.formatUnits(collateralPriceBN, debtDecimals)
    );
    console.log("DEBUG: collateralPrice", collateralPrice);

    // Get total supply
    const totalSupplyBN: BigNumber = await leveragedTokenContract.totalSupply();
    const totalSupply = parseFloat(
        ethers.utils.formatUnits(totalSupplyBN, collateralDecimals)
    );
    console.log("DEBUG: totalSupply", totalSupply);

    // Get outstanding debt
    const outstandingDebtBN: BigNumber =
        await riseTokenVaultContract.getOutstandingDebt(
            leveragedTokenContractAddress
        );
    const outstandingDebt = parseFloat(
        ethers.utils.formatUnits(outstandingDebtBN, debtDecimals)
    );
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
