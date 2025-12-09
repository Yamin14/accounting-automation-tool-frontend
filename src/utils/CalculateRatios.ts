import { calculateTotals } from "./CalculateTotals";

interface Ratios {
    profitability: {
        grossProfitMargin: number | null;
        operatingProfitMargin: number | null;
        pretaxMargin: number | null;
        netProfitMargin: number | null;
        cashFlowMargin: number | null;
    };
    return: {
        roa: number | null;
        roe: number | null;
        roce: number | null;
        roi: number | null;
    };
    solvency: {
        debtToEquity: number | null;
        debtRatio: number | null;
        interestCoverage: number | null;
        equityRatio: number | null;
    };
    liquidity: {
        currentRatio: number | null;
        quickRatio: number | null;
        cashRatio: number | null;
    };
    efficiency: {
        inventoryTurnover: number | null;
        receivablesTurnover: number | null;
        payablesTurnover: number | null;
        assetTurnover: number | null;
        fixedAssetTurnover: number | null;
        workingCapitalTurnover: number | null;
        operatingCycle: number | null;
    };
}

export const calculateRatios = (totals: ReturnType<typeof calculateTotals>): Ratios => {
    // Helper function to avoid division by zero
    const safeDivide = (numerator: number, denominator: number): number | null => {
        return denominator !== 0 ? numerator / denominator : null;
    };

    // PROFITABILITY RATIOS
    const grossProfitMargin = safeDivide(totals.grossProfit, totals.netSales);
    const operatingProfitMargin = safeDivide(totals.operatingProfit, totals.netSales);
    const pretaxMargin = safeDivide(totals.profitBeforeTax, totals.netSales);
    const netProfitMargin = safeDivide(totals.netProfitAfterTax, totals.netSales);
    const cashFlowMargin = safeDivide(totals.operatingCashFlow, totals.netSales);

    // RETURN RATIOS
    const roa = safeDivide(totals.netProfitAfterTax, totals.assets);
    const roe = safeDivide(totals.netProfitAfterTax, totals.shareholdersEquity);
    const roce = safeDivide(totals.operatingProfit, totals.capitalEmployed);
    const roi = safeDivide(totals.netProfitAfterTax, totals.totalInvestment);

    // SOLVENCY RATIOS
    const debtToEquity = safeDivide(totals.totalDebt, totals.shareholdersEquity);
    const debtRatio = safeDivide(totals.totalDebt, totals.assets);
    const interestCoverage = safeDivide(totals.operatingProfit, totals.interestExpense);
    const equityRatio = safeDivide(totals.shareholdersEquity, totals.assets);

    // LIQUIDITY RATIOS
    const currentRatio = safeDivide(totals.currentAssets, totals.currentLiabilities);
    const quickRatio = safeDivide(totals.currentAssets - totals.inventory, totals.currentLiabilities);
    const cashRatio = safeDivide(totals.cashAndCashEquivalents, totals.currentLiabilities);

    // EFFICIENCY RATIOS
    const inventoryTurnover = safeDivide(totals.cogs, totals.inventory);
    const receivablesTurnover = safeDivide(totals.netCreditSales, totals.accountsReceivable);
    const payablesTurnover = safeDivide(totals.netCreditPurchases, totals.accountsPayable);
    const assetTurnover = safeDivide(totals.netSales, totals.assets);
    const fixedAssetTurnover = safeDivide(totals.netSales, totals.netFixedAssets);
    const workingCapitalTurnover = safeDivide(totals.netSales, totals.workingCapital);

    // Operating Cycle = Inventory Period + Receivables Collection Period
    // Inventory Period (Days) = 365 / Inventory Turnover
    // Receivables Collection Period (Days) = 365 / Receivables Turnover
    let operatingCycle: number | null = null;
    if (inventoryTurnover && receivablesTurnover) {
        const inventoryPeriod = 365 / inventoryTurnover;
        const receivablesPeriod = 365 / receivablesTurnover;
        operatingCycle = inventoryPeriod + receivablesPeriod;
    }

    return {
        profitability: {
            grossProfitMargin: grossProfitMargin !== null ? grossProfitMargin * 100 : null,
            operatingProfitMargin: operatingProfitMargin !== null ? operatingProfitMargin * 100 : null,
            pretaxMargin: pretaxMargin !== null ? pretaxMargin * 100 : null,
            netProfitMargin: netProfitMargin !== null ? netProfitMargin * 100 : null,
            cashFlowMargin: cashFlowMargin !== null ? cashFlowMargin * 100 : null,
        },
        return: {
            roa: roa !== null ? roa * 100 : null,
            roe: roe !== null ? roe * 100 : null,
            roce: roce !== null ? roce * 100 : null,
            roi: roi !== null ? roi * 100 : null,
        },
        solvency: {
            debtToEquity: debtToEquity,
            debtRatio: debtRatio,
            interestCoverage: interestCoverage,
            equityRatio: equityRatio,
        },
        liquidity: {
            currentRatio: currentRatio,
            quickRatio: quickRatio,
            cashRatio: cashRatio,
        },
        efficiency: {
            inventoryTurnover: inventoryTurnover,
            receivablesTurnover: receivablesTurnover,
            payablesTurnover: payablesTurnover,
            assetTurnover: assetTurnover,
            fixedAssetTurnover: fixedAssetTurnover,
            workingCapitalTurnover: workingCapitalTurnover,
            operatingCycle: operatingCycle,
        },
    };
};