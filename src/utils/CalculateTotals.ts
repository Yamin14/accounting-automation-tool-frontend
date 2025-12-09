import type { JournalEntry } from "../store/types";

export const calculateTotals = (entries: JournalEntry[]) => {
    const totals = {
        // Existing totals
        netIncome: 0,
        oci: 0,
        assets: 0,
        liabilities: 0,
        totalEquity: 0,
        currentAssets: 0,
        nonCurrentAssets: 0,
        currentLiabilities: 0,
        nonCurrentLiabilities: 0,
        revenue: 0,
        expenses: 0,

        // Additional totals for ratio calculations
        netSales: 0,
        cogs: 0,
        grossProfit: 0,
        operatingExpenses: 0,
        operatingProfit: 0, // EBIT
        profitBeforeTax: 0,
        netProfitAfterTax: 0,
        operatingCashFlow: 0,
        totalDebt: 0,
        shareholdersEquity: 0,
        capitalEmployed: 0,
        totalInvestment: 0,
        interestExpense: 0,
        cashAndCashEquivalents: 0,
        inventory: 0,
        accountsReceivable: 0,
        accountsPayable: 0,
        netFixedAssets: 0,
        workingCapital: 0,
        netCreditSales: 0,
        netCreditPurchases: 0,
        cashInflows: 0,
        cashOutflows: 0,
    };

    for (const entry of entries) {
        const { debitAccount, creditAccount, amount } = entry;

        // Debit side impact
        if (debitAccount.category === 'Asset') totals.assets += amount;
        if (debitAccount.category === 'Liability') totals.liabilities -= amount;
        if (debitAccount.category === 'Equity') totals.totalEquity -= amount;

        if (debitAccount.category === 'Revenue' && debitAccount.financialStatement === 'Income Statement') totals.netIncome -= amount;
        if (debitAccount.category === 'Expense' && debitAccount.financialStatement === 'Income Statement') totals.netIncome -= amount;

        if (debitAccount.category === 'Revenue' && debitAccount.financialStatement === 'Income Statement') totals.revenue -= amount;
        if (debitAccount.category === 'Expense' && debitAccount.financialStatement === 'Income Statement') totals.expenses += amount;

        // Credit side impact
        if (creditAccount.category === 'Asset') totals.assets -= amount;
        if (creditAccount.category === 'Liability') totals.liabilities += amount;
        if (creditAccount.category === 'Equity') totals.totalEquity += amount;

        if (creditAccount.category === 'Revenue' && creditAccount.financialStatement === 'Income Statement') totals.netIncome += amount;
        if (creditAccount.category === 'Expense' && creditAccount.financialStatement === 'Income Statement') totals.netIncome += amount;

        if (creditAccount.category === 'Revenue' && creditAccount.financialStatement === 'Income Statement') totals.revenue += amount;
        if (creditAccount.category === 'Expense' && creditAccount.financialStatement === 'Income Statement') totals.expenses -= amount;

        // current and non-current
        // debit side
        if (debitAccount.subCategory === 'Current Asset') totals.currentAssets = totals.currentAssets + amount;
        if (debitAccount.subCategory === 'Non-current Asset') totals.nonCurrentAssets = totals.nonCurrentAssets + amount;
        if (debitAccount.subCategory === 'Current Liability') totals.currentLiabilities = totals.currentLiabilities - amount;
        if (debitAccount.subCategory === 'Non-current Liability') totals.nonCurrentLiabilities = totals.nonCurrentLiabilities - amount;

        // credit side
        if (creditAccount.subCategory === 'Current Asset') totals.currentAssets = totals.currentAssets - amount;
        if (creditAccount.subCategory === 'Non-current Asset') totals.nonCurrentAssets = totals.nonCurrentAssets - amount;
        if (creditAccount.subCategory === 'Current Liability') totals.currentLiabilities = totals.currentLiabilities + amount;
        if (creditAccount.subCategory === 'Non-current Liability') totals.nonCurrentLiabilities = totals.nonCurrentLiabilities + amount;

        // Contra Asset decreases assets and non-current assets
        if (creditAccount.subCategory === 'Contra Asset') totals.nonCurrentAssets -= amount;

        // Contra Liability decreases liabilities and non-current liabilities
        if (debitAccount.subCategory === 'Contra Liability') {
            totals.nonCurrentLiabilities -= amount;
        }

        // oci
        if (debitAccount.financialStatement === 'Comprehensive Income') totals.oci -= amount;
        if (creditAccount.financialStatement === 'Comprehensive Income') totals.oci += amount;

        // ===== NEW: Additional tracking for ratio calculations =====

        // Sales Revenue (assuming account name contains "Sales" or "Revenue")
        if (debitAccount.category === 'Revenue' && (debitAccount.accountName.toLowerCase().includes('sales') || debitAccount.accountName.toLowerCase().includes('revenue'))) {
            totals.netSales -= amount;
        }
        if (creditAccount.category === 'Revenue' && (creditAccount.accountName.toLowerCase().includes('sales') || creditAccount.accountName.toLowerCase().includes('revenue'))) {
            totals.netSales += amount;
        }

        // Cost of Goods Sold (COGS)
        if (debitAccount.category === 'Expense' && debitAccount.accountName.toLowerCase().includes('cost of goods sold')) {
            totals.cogs += amount;
        }
        if (creditAccount.category === 'Expense' && creditAccount.accountName.toLowerCase().includes('cost of goods sold')) {
            totals.cogs -= amount;
        }

        // Interest Expense
        if (debitAccount.category === 'Expense' && debitAccount.accountName.toLowerCase().includes('interest')) {
            totals.interestExpense += amount;
        }
        if (creditAccount.category === 'Expense' && creditAccount.accountName.toLowerCase().includes('interest')) {
            totals.interestExpense -= amount;
        }

        // Cash and Cash Equivalents
        if (debitAccount.accountName.toLowerCase().includes('cash')) {
            totals.cashAndCashEquivalents += amount;
        }
        if (creditAccount.accountName.toLowerCase().includes('cash')) {
            totals.cashAndCashEquivalents -= amount;
        }

        // Inventory
        if (debitAccount.accountName.toLowerCase().includes('inventory')) {
            totals.inventory += amount;
        }
        if (creditAccount.accountName.toLowerCase().includes('inventory')) {
            totals.inventory -= amount;
        }

        // Accounts Receivable
        if (debitAccount.accountName.toLowerCase().includes('accounts receivable') || debitAccount.accountName.toLowerCase().includes('receivable')) {
            totals.accountsReceivable += amount;
        }
        if (creditAccount.accountName.toLowerCase().includes('accounts receivable') || creditAccount.accountName.toLowerCase().includes('receivable')) {
            totals.accountsReceivable -= amount;
        }

        // Accounts Payable
        if (debitAccount.accountName.toLowerCase().includes('accounts payable') || debitAccount.accountName.toLowerCase().includes('payable')) {
            totals.accountsPayable -= amount;
        }
        if (creditAccount.accountName.toLowerCase().includes('accounts payable') || creditAccount.accountName.toLowerCase().includes('payable')) {
            totals.accountsPayable += amount;
        }

        // Fixed Assets (Non-current assets excluding intangibles for simplicity)
        if (debitAccount.subCategory === 'Non-current Asset' && !debitAccount.accountName.toLowerCase().includes('intangible')) {
            totals.netFixedAssets += amount;
        }
        if (creditAccount.subCategory === 'Non-current Asset' && !creditAccount.accountName.toLowerCase().includes('intangible')) {
            totals.netFixedAssets -= amount;
        }

        // Total Debt (Long-term + Short-term debt/loans)
        if ((debitAccount.category === 'Liability') &&
            (debitAccount.accountName.toLowerCase().includes('loan') ||
                debitAccount.accountName.toLowerCase().includes('debt') ||
                debitAccount.accountName.toLowerCase().includes('bond'))) {
            totals.totalDebt -= amount;
        }
        if ((creditAccount.category === 'Liability') &&
            (creditAccount.accountName.toLowerCase().includes('loan') ||
                creditAccount.accountName.toLowerCase().includes('debt') ||
                creditAccount.accountName.toLowerCase().includes('bond'))) {
            totals.totalDebt += amount;
        }

        // Operating Cash Flow (from operating activities in cash flow statement)
        if (debitAccount.financialStatement === 'Cash Flow Statement' &&
            debitAccount.cashFlowSection.toLowerCase().includes('operating')) {
            totals.operatingCashFlow += amount;
        }
        if (creditAccount.financialStatement === 'Cash Flow Statement' &&
            creditAccount.cashFlowSection.toLowerCase().includes('operating')) {
            totals.operatingCashFlow -= amount;
        }

        // operating expenses
        if (debitAccount.subCategory.includes('Operating Expense')) {
            totals.operatingExpenses += amount;
        }
        if (creditAccount.subCategory.includes('Operating Expense')) {
            totals.operatingExpenses -= amount;
        }

        // cash inflows / outflows
        if (debitAccount.accountName.toLocaleLowerCase().includes("cash") && debitAccount.subCategory === 'Current Asset') {
            totals.cashInflows += amount;
        }
        if (creditAccount.accountName.toLocaleLowerCase().includes("cash") && creditAccount.subCategory === 'Current Asset') {
            totals.cashOutflows += amount;
        }
    }

    // Retained earnings (profit) flow into equity
    totals.totalEquity += totals.netIncome;

    // accumulated oci
    totals.totalEquity += totals.oci;

    // ===== Calculated totals =====

    // Gross Profit = Net Sales - COGS
    totals.grossProfit = totals.netSales - totals.cogs;

    // Operating Profit (EBIT) = Gross Profit - Operating Expenses
    // Operating Expenses = Total Expenses - COGS - Interest Expense
    totals.operatingProfit = totals.grossProfit - totals.operatingExpenses;

    // Profit Before Tax = Operating Profit - Interest Expense + Other Income
    totals.profitBeforeTax = totals.operatingProfit - totals.interestExpense;

    // Net Profit After Tax (using netIncome which should already account for tax)
    totals.netProfitAfterTax = totals.netIncome;

    // Shareholders' Equity = Total Equity
    totals.shareholdersEquity = totals.totalEquity;

    // Capital Employed = Shareholders' Equity + Total Debt
    // OR = Total Assets - Current Liabilities
    totals.capitalEmployed = totals.shareholdersEquity + totals.totalDebt;

    // Total Investment = Total Assets (common interpretation)
    totals.totalInvestment = totals.assets;

    // Working Capital = Current Assets - Current Liabilities
    totals.workingCapital = totals.currentAssets - totals.currentLiabilities;

    // Net Credit Sales (assuming most sales are credit sales)
    totals.netCreditSales = totals.netSales;

    // Net Credit Purchases (COGS is often used as proxy)
    totals.netCreditPurchases = totals.cogs;

    return totals;
};