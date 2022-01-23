import { Connection } from "typeorm";

export const getMarketData = async (conn: Connection, leveragedTokenAddress: string) => {
    const market = await conn.query(
        `
    WITH latest_data AS (
        SELECT
          lts."contractAddress" as leveraged_token_address,
          lts."vaultContractAddress" as leveraged_token_vault_address,
          lts."timestamp" as leveraged_token_timestamp,
          lts."nav" as leveraged_token_nav,
          lts."totalSupply" as leveraged_token_total_supply,
          (lts."totalCollateralPlusFee" - lts."totalPendingFees") as leveraged_token_total_collateral,
          (lts."nav" * lts."totalSupply") as leveraged_token_market_cap,
          lts."maxTotalCollateral" as leveraged_token_max_total_collateral,
          lts."collateralPrice" as leveraged_token_collateral_price,
          lts."leverageRatio" as leveraged_token_leverage_ratio,
          lts."collateralPerLeveragedToken" as leveraged_token_collateral_per_leveraged_token,
          lts."debtPerLeveragedToken" as leveraged_token_debt_per_leveraged_token,
          ROW_NUMBER() OVER (PARTITION BY lts."contractAddress" ORDER BY lts."timestamp" DESC) AS rn
        FROM public.leveraged_token_snapshot AS lts
        WHERE lts."timestamp" >= NOW() - INTERVAL '30 DAY' AND lts."contractAddress" = $1
      ),
      past_data AS (
        SELECT
          lts."contractAddress" as leveraged_token_address,
          lts."nav" as leveraged_token_nav,
          lts."timestamp" as leveraged_token_timestamp,
          ROW_NUMBER() OVER (PARTITION BY lts."contractAddress" ORDER BY lts."timestamp" ASC) AS rn
        FROM public.leveraged_token_snapshot AS lts
        WHERE lts."timestamp" >= NOW() - INTERVAL '30 DAY' AND lts."contractAddress" = $1
      ),
      vault_data as (
        SELECT
          vs."contractAddress" as vault_address,
          vs."timestamp" as vault_timestamp,
          vs."borrowAPY" as vault_borrow_apy,
          vs."supplyAPY" as vault_supply_apy,
          vs."utilizationRate" as vault_utilization_rate,
          vs."totalAvailableCash" as vault_total_available_cash,
          vs."totalOutstandingDebt" as vault_total_outstanding_debt,
          vs."maxTotalDeposit" as vault_max_total_deposit,
          ROW_NUMBER() OVER (PARTITION BY vs."contractAddress" ORDER BY vs."timestamp" DESC) AS rn
        FROM public.vault_snapshot AS vs
        WHERE vs."timestamp" >= NOW() - INTERVAL '30 DAY'
      )

      SELECT
          ld.leveraged_token_address,
          vd.vault_address,
          vd.vault_timestamp,
          ld.leveraged_token_timestamp as timestamp_last,
          pd.leveraged_token_timestamp as timestamp_past,
          ld.leveraged_token_nav as nav_last,
          pd.leveraged_token_nav as nav_past,
          ((ld.leveraged_token_nav - pd.leveraged_token_nav) / pd.leveraged_token_nav) * 100 as leveraged_token_price_change_percent,
          (ld.leveraged_token_nav - pd.leveraged_token_nav) as leveraged_token_price_change,
          ld.leveraged_token_market_cap,
          ld.leveraged_token_total_collateral,
          ld.leveraged_token_collateral_price,
          ld.leveraged_token_max_total_collateral,
          ld.leveraged_token_total_supply,
          ld.leveraged_token_leverage_ratio as leverage_ratio,
          ld.leveraged_token_collateral_per_leveraged_token as collateral_per_token,
          ld.leveraged_token_debt_per_leveraged_token as debt_per_token,
          vd.vault_total_available_cash,
          vd.vault_total_outstanding_debt,
          vd.vault_max_total_deposit,
          vd.vault_borrow_apy,
          vd.vault_supply_apy,
          vd.vault_utilization_rate
      FROM latest_data as ld
      LEFT JOIN past_data as pd
      ON ld.leveraged_token_address = pd.leveraged_token_address
      LEFT JOIN vault_data as vd
      ON ld.leveraged_token_vault_address = vd.vault_address
      WHERE ld.rn = 1 AND pd.rn = 1 AND vd.rn = 1
    `,
        [leveragedTokenAddress]
    );

    if (market.length) {
        return market[0];
    } else {
        return {};
    }
};
