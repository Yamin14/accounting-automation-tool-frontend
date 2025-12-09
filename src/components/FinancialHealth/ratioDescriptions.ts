export const ratioDescriptions: Record<string, { title: string; description: string; formula?: string }> = {
    // Profitability
    grossProfitMargin: {
        title: 'Gross Profit Margin',
        description:
            `Gross Profit Margin measures how efficiently a company produces and sells its goods by showing the percentage of sales revenue that remains after deducting the cost of goods sold (COGS). It reflects the firm's production efficiency and pricing strategy.`,
        formula: 'Gross Profit / Net Sales * 100'
    },
    operatingProfitMargin: {
        title: 'Operating Profit Margin',
        description:
            `Operating Profit Margin measures how efficiently a company controls its operating costs and generates profit from its core business activities, before considering interest and taxes.`,
        formula: 'Operating Profit (EBIT) / Net Sales * 100'
    },
    pretaxMargin: {
        title: 'Pre-Tax Margin',
        description:
            `Pre-Tax Profit Margin measures the percentage of sales revenue that remains as profit before income tax is deducted. It shows how efficiently a company manages operating and non-operating activities to generate earnings before tax.`,
        formula: 'Profit Before Tax / Net Sales * 100'
    },
    netProfitMargin: {
        title: 'Net Profit Margin',
        description:
            `Net Profit Margin measures the percentage of sales revenue that remains as net profit after all expenses, including operating costs, interest, and taxes. It shows the company’s overall ability to turn revenue into final profit for shareholders.`,
        formula: 'Net Profit after Tax / Net Sales * 100'
    },
    cashFlowMargin: {
        title: 'Cash Flow Margin',
        description:
            `Cash Flow Margin measures how efficiently a company converts its sales revenue into actual cash from operating activities. It shows the percentage of sales that is realized as cash.`,
        formula: 'Operating Cash Flow / Net Sales * 100'
    },

    // Return
    roa: { title: 'Return on Assets (ROA)', description: 'Measures how efficiently total assets are used to generate profit.', formula: 'Net Profit After Tax / Total Assets * 100' },
    roe: { title: 'Return on Equity (ROE)', description: "Measures the return earned on shareholders' investment.", formula: 'Net Profit After Tax / Shareholders Equity * 100' },
    roce: { title: 'Return on Capital Employed (ROCE)', description: 'Measures how effectively long-term funds (equity + debt) are used to earn profit.', formula: 'Operating Profit / Capital Employed * 100' },
    roi: { title: 'Return on Investment (ROI)', description: 'Measures the overall return on total investment made in the business or project.', formula: 'Net Profit / Total Investment * 100' },


    // Solvency
    debtToEquity: { title: 'Debt to Equity Ratio', description: "Shows the proportion of debt used compared to shareholders' equity to finance assets.", formula: 'Total Debt / Shareholders Equity' },
    debtRatio: { title: 'Debt Ratio', description: "Measures how much of the company’s total assets are financed through debt.", formula: 'Total Debt / Total Assets' },
    interestCoverage: { title: 'Interest Coverage Ratio', description: "Measures how easily the company can pay interest on its debt from its operating profit.", formula: 'EBIT / Interest Expense' },
    equityRatio: { title: 'Equity Ratio', description: "Indicates how much of the company’s assets are financed by shareholders’ equity.", formula: 'Shareholders Equity / Total Assets' },


    // Liquidity
    currentRatio: { title: 'Current Ratio', description: "Measures the ability to pay short-term liabilities with total current assets. Ideal ≈ 2:1", formula: 'Current Assets / Current Liabilities' },
    quickRatio: { title: 'Quick Ratio', description: "Measures the ability to pay short-term liabilities using only the most liquid assets (excluding inventory). Ideal ≈ 1:1", formula: '(Current Assets - Inventory) / Current Liabilities' },
    cashRatio: { title: 'Cash Ratio', description: "Measures the ability to pay short-term liabilities using only cash and cash equivalents.", formula: '(Cash + Cash Equivalents) / Current Liabilities' },


    // Efficiency
    inventoryTurnover: { title: 'Inventory Turnover', description: 'Shows how many times inventory is sold and replaced during a period. Higher = efficient.', formula: 'COGS / Average Inventory' },
    receivablesTurnover: { title: 'Receivables Turnover', description: 'Measures how quickly a company collects cash from its customers. Higher = faster collection.', formula: 'Net Credit Sales / Average Accounts Receivable' },
    payablesTurnover: { title: 'Payables Turnover', description: 'Shows how promptly a company pays its suppliers.', formula: 'Net Credit Purchases / Average Accounts Payable' },
    assetTurnover: { title: 'Asset Turnover', description: 'Measures how efficiently the company uses its total assets to generate sales.', formula: 'Net Sales / Average Total Assets' },
    fixedAssetTurnover: { title: 'Fixed Asset Turnover', description: 'Indicates how effectively fixed assets are used to generate sales.', formula: 'Net Sales / Average Net Fixed Assets' },
    workingCapitalTurnover: { title: 'Working Capital Turnover', description: 'Shows how efficiently the company uses its working capital to generate revenue.', formula: 'Net Sales / Average Working Capital' },
    operatingCycle: { title: 'Operating Cycle', description: "Measures the time it takes to convert inventory into cash; shorter cycles indicate better efficiency.", formula: 'Inventory Period + Receivables Collection Period' }
};

export const ratioOverview: Record<string, { title: string, description: string }> = {
    profitability: {title: 'Profitability Ratios', description: 'Profitability ratios are financial metrics used to measure a company’s ability to generate profit from its sales, assets, and equity, indicating how efficiently it manages its resources to earn returns for shareholders.'},
    return: {title: 'Return Ratios', description: 'Return Ratios measure how efficiently a company uses its resources,such as assets, equity, or capital employed , to generate profit.'},
    solvency: {title: 'Solvency Ratios', description: 'Measure a company’s ability to meet its long-term debts and financial obligations. They show whether the business is financially stable and capable of surviving in the long run.'},
    liquidity: {title: 'Liquidity Ratios', description: 'Measure a company’s ability to meet its short-term obligations using its current or liquid assets. They show whether the business can pay its bills on time without financial stress.'},
    efficiency: {title: 'Efficiency Ratios', description: 'Efficiency ratios are also called activity ratios and they measure how effectively a company uses its assets and resources to generate revenue.'}
};