import { ethers } from "ethers";

// Read data from the contract
const abi = new ethers.utils.Interface([
    // Vaults
    "function getBorrowRatePerSecondInEther() external view returns (uint256)",
    "function getSupplyRatePerSecondInEther() external view returns (uint256)",
    "function getUtilizationRateInEther() external view returns (uint256)",
    "function totalOutstandingDebt() external view returns (uint256)",
    "function getTotalAvailableCash() external view returns (uint256)",

    // Leveraged token
    "function getCollateralPerRiseToken(address token) external view returns (uint256)",
    "function getDebtPerRiseToken(address token) external view returns (uint256)",
    "function getLeverageRatioInEther(address token) external view returns (uint256)",
    "function getNAV(address token) external view returns (uint256)",
]);

export default abi;
