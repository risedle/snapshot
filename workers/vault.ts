import { BigNumber, ethers } from "ethers";
import { Connection } from "typeorm";
import { VaultSnapshot } from "../entities/VaultSnapshot";

import { VaultABI } from "./abi";

async function snapshot(vaultContractAddress: string, provider: ethers.providers.JsonRpcProvider, connection: Connection) {
    // Initialize the contract
    const riseTokenVaultContract = new ethers.Contract(vaultContractAddress, VaultABI, provider);

    // Get supply APY
    const supplyRatePerSecondInEther: BigNumber = await riseTokenVaultContract.getSupplyRatePerSecondInEther();
    const supplyRatePerSecond = parseFloat(ethers.utils.formatEther(supplyRatePerSecondInEther));
    const secondsPerDay = 86400;
    const daysPerYear = 365;
    const supplyAPY = (Math.pow(supplyRatePerSecond * secondsPerDay + 1, daysPerYear) - 1) * 100;
    console.log("DEBUG: supplyAPY", supplyAPY);

    // Get borrow APY
    const borrowRatePerSecondInEther: BigNumber = await riseTokenVaultContract.getBorrowRatePerSecondInEther();
    const borrowRatePerSecond = parseFloat(ethers.utils.formatEther(borrowRatePerSecondInEther));
    const borrowAPY = (Math.pow(borrowRatePerSecond * secondsPerDay + 1, daysPerYear) - 1) * 100;
    console.log("DEBUG: borrowAPY", borrowAPY);

    // Get utilization rate
    const utilizationRateInEther: BigNumber = await riseTokenVaultContract.getUtilizationRateInEther();
    const utilizationRate = parseFloat(ethers.utils.formatEther(utilizationRateInEther));
    const utilizationRatePercentage = utilizationRate * 100;
    console.log("DEBUG: utilizationRatePercentage", utilizationRatePercentage);

    // Get total outstanding debt
    const totalOutstandingDebt: BigNumber = await riseTokenVaultContract.totalOutstandingDebt();
    const totalOutstandingDebtFloat = parseFloat(ethers.utils.formatUnits(totalOutstandingDebt, 6));
    console.log("DEBUG: totalOutstandingDebtFloat", totalOutstandingDebtFloat);

    // Get total outstanding debt
    const totalAvailableCash: BigNumber = await riseTokenVaultContract.getTotalAvailableCash();
    const totalAvailableCashFloat = parseFloat(ethers.utils.formatUnits(totalAvailableCash, 6));
    console.log("DEBUG: totalAvailableCashFloat", totalAvailableCashFloat);

    // Get max capacity
    const maxTotalDeposit: BigNumber = await riseTokenVaultContract.maxTotalDeposit();
    const maxTotalDepositFloat = parseFloat(ethers.utils.formatUnits(maxTotalDeposit, 6));
    console.log("DEBUG: maxTotalDepositFloat", maxTotalDepositFloat);

    // Get blocknumber
    const blockNumber = await provider.getBlockNumber();
    console.log("DEBUG: blockNumber", blockNumber);

    // Connect to postgresql
    const repository = connection.getRepository(VaultSnapshot);

    const snapshot = new VaultSnapshot();
    snapshot.contractAddress = vaultContractAddress;
    snapshot.borrowAPY = borrowAPY;
    snapshot.supplyAPY = supplyAPY;
    snapshot.totalAvailableCash = totalAvailableCashFloat;
    snapshot.totalOutstandingDebt = totalOutstandingDebtFloat;
    snapshot.utilizationRate = utilizationRatePercentage;
    snapshot.maxTotalDeposit = maxTotalDepositFloat;
    snapshot.blockNumber = blockNumber;
    await repository.save(snapshot);
}

export default {
    snapshot: snapshot,
};
