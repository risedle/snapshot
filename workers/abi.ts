import { ethers } from "ethers";

// Read data from the contract
export const VaultABI = new ethers.utils.Interface([
    // Vaults
    "function getBorrowRatePerSecondInEther() external view returns (uint256)",
    "function getSupplyRatePerSecondInEther() external view returns (uint256)",
    "function getUtilizationRateInEther() external view returns (uint256)",
    "function totalOutstandingDebt() external view returns (uint256)",
    "function getTotalAvailableCash() external view returns (uint256)",
    "function maxTotalDeposit() external view returns (uint256)",

    // Leveraged token
    "function getCollateralPerRiseToken(address token) external view returns (uint256)",
    "function getDebtPerRiseToken(address token) external view returns (uint256)",
    "function getLeverageRatioInEther(address token) external view returns (uint256)",
    "function getNAV(address token) external view returns (uint256)",
    "function getMetadata(address token) external view returns (bool isETH, address token, address collateral, address oracleContract, address swapContract, uint256 maxSwapSlippageInEther, uint256 initialPrice, uint256 feeInEther, uint256 totalCollateralPlusFee,  uint256 totalPendingFees, uint256 minLeverageRatioInEther, uint256 maxLeverageRatioInEther, uint256 maxRebalancingValue, uint256 rebalancingStepInEther, uint256 maxTotalCollateral)",
    "function getOutstandingDebt(address token) external view returns (uint256)",
]);

export const ERC20ABI = new ethers.utils.Interface(["function totalSupply() external view returns (uint256)"]);

export const OracleABI = new ethers.utils.Interface(["function getPrice() external view returns (uint256)"]);

// Source: https://github.com/risedle/flt/blob/main/src/interfaces/IRiseToken.sol
export const RiseTokenABI = new ethers.utils.Interface([
    "function collateralPerShare() external view returns (uint256)",
    "function debtPerShare() external view returns (uint256)",
    "function value(uint256 _shares, address _quote) external view returns (uint256)",
    "function nav() external view returns (uint256)",
    "funtion leverageRatio() external view returns (uint256)"
]);
