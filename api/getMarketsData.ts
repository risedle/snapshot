import { Connection } from "typeorm";

const MarketsMetadata = {
    "0xc4676f88663360155c2bc6d2A482E34121a50b3b": {
        title: "ETHRISE",
        subtitle: "ETH Leverage Market",
        description: "You can Leverage your ETH without risk of liquidation or earn yield for your idle USDC",
    },
};

export const getMarketsData = async (conn: Connection) => {
    const markets = await conn.query(`
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
          ROW_NUMBER() OVER (PARTITION BY lts."contractAddress" ORDER BY lts."timestamp" DESC) AS rn
        FROM public.leveraged_token_snapshot AS lts
        WHERE lts."timestamp" >= NOW() - INTERVAL '30 DAY'
      ),
      past_data AS (
        SELECT
          lts."contractAddress" as leveraged_token_address,
          lts."nav" as leveraged_token_nav,
          lts."timestamp" as leveraged_token_timestamp,
          ROW_NUMBER() OVER (PARTITION BY lts."contractAddress" ORDER BY lts."timestamp" ASC) AS rn
        FROM public.leveraged_token_snapshot AS lts
        WHERE lts."timestamp" >= NOW() - INTERVAL '30 DAY'
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
          vd.vault_total_available_cash,
          vd.vault_total_outstanding_debt,
          vd.vault_max_total_deposit,
          vd.vault_borrow_apy,
          vd.vault_supply_apy
      FROM latest_data as ld
      LEFT JOIN past_data as pd
      ON ld.leveraged_token_address = pd.leveraged_token_address
      LEFT JOIN vault_data as vd
      ON ld.leveraged_token_vault_address = vd.vault_address
      WHERE ld.rn = 1 AND pd.rn = 1 AND vd.rn = 1
    `);

    // Get total AUM = sum of all market cap
    const totalAUM = markets.map((market) => market.leveraged_token_market_cap).reduce((total, marketCap) => total + marketCap, 0);
    // NOTE: This TVL calculation assume that one token one vault; TVL will inflated when there is one vault with two tokens
    const totalTVL = markets.map((market) => market.leveraged_token_market_cap + market.vault_total_available_cash + market.vault_total_outstanding_debt).reduce((total, tvlPerMarket) => total + tvlPerMarket, 0);
    const marketsWithMetadata = markets.map((market) => ({ title: MarketsMetadata[market.leveraged_token_address].title, subtitle: MarketsMetadata[market.leveraged_token_address].subtitle, description: MarketsMetadata[market.leveraged_token_address].description, ...market }));
    return {
        aum: totalAUM,
        tvl: totalTVL,
        markets: marketsWithMetadata,
    };
};
