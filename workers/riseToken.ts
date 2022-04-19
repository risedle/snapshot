import { BigNumber, ethers } from "ethers";
import { Contract, Provider } from "ethers-multicall";
import { Connection } from "typeorm";
import { RiseTokenSnapshot } from "../entities/RiseTokenSnapshot";

// import RiseTokenABI from "./RiseTokenABI.json";
import { RiseTokenABI } from "./abi";

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
    dbConnection: Connection
) {
    // Initialize Multicall provider
    const multicallProvider = new Provider(provider);
    await multicallProvider.init();

    // Initialize the contract
    const riseToken = new Contract(
        token.address,
        RiseTokenABI
    );

    // RPC Calls
    const cpsCall = riseToken.collateralPerShare();
    const dpsCall = riseToken.debtPerShare();
    const lrCall  = riseToken.leverageRatio();
    const navCall = riseToken.nav();
    const totalSupplyCall = riseToken.totalSupply();
    const totalCollateralCall = riseToken.totalCollateral();
    const totalDebtCall = riseToken.totalDebt();

    // Run the multicall
    const [
        cpsBN,
        dpsBN,
        lrBN,
        navBN,
        totalSupplyBN,
        totalCollateralBN,
        totalDebtBN
    ] = await multicallProvider.all([
        cpsCall,
        dpsCall,
        lrCall,
        navCall,
        totalSupplyCall,
        totalCollateralCall,
        totalDebtCall
    ])

    // Parse the BigNumber
    const cps = parseFloat(ethers.utils.formatUnits(cpsBN, token.cdecimals));
    console.log("DEBUG: Collateral per share", cps);

    const dps = parseFloat(ethers.utils.formatUnits(dpsBN, token.ddecimals));
    console.log("DEBUG: Debt per share", dps);

    const lr = parseFloat(ethers.utils.formatEther(lrBN));
    console.log("DEBUG: lr", lr);

    const nav = parseFloat(ethers.utils.formatEther(navBN));
    console.log("DEBUG: nav", nav);

    const totalSupply = parseFloat(ethers.utils.formatUnits(totalSupplyBN, token.cdecimals));
    console.log("DEBUG: totalSupply", totalSupply);

    const totalCollateral = parseFloat(ethers.utils.formatUnits(totalCollateralBN, token.cdecimals));
    console.log("DEBUG: totalCollateral", totalCollateral);

    const totalDebt = parseFloat(ethers.utils.formatUnits(totalDebtBN, token.ddecimals));
    console.log("DEBUG: totalDebt", totalDebt);

    // Get blocknumber
    const blockNumber = await provider.getBlockNumber();
    console.log("DEBUG: blockNumber", blockNumber);

    // Connect to postgresql
    const repository = dbConnection.getRepository(RiseTokenSnapshot);

    const snapshot = new RiseTokenSnapshot();
    snapshot.address = token.address;
    snapshot.cps = cps;
    snapshot.dps = dps;
    snapshot.lr = lr;
    snapshot.nav = nav;
    snapshot.totalSupply = totalSupply;
    snapshot.totalCollateral = totalCollateral;
    snapshot.totalDebt = totalDebt;
    snapshot.blockNumber = blockNumber;
    await repository.save(snapshot);
}

export default {
    snapshot: snapshot,
};
