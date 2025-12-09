import type { Account } from "../store/types";

// ---------- Types ----------
export type YearlyBalance = { financialYear?: string; openingBalance?: number; closingBalance?: number };

export type Totals = {
  // Income statement
  revenue: number;
  contraRevenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpense: number; // includes depreciation
  depreciation: number;
  nonOperatingIncome: number;
  nonOperatingExpense: number;
  interestIncome: number;
  interestExpense: number;
  profitBeforeTax: number;
  taxExpense: number;
  netProfit: number;
  operatingCashFlow: number;

  // Balance sheet
  currentAssets: number;
  nonCurrentAssets: number;
  contraAssets: number;
  totalAssets: number;
  inventory: number;
  receivables: number;
  cashAndCashEquivalents: number;
  currentLiabilities: number;
  nonCurrentLiabilities: number;
  contraLiabilities: number;
  totalLiabilities: number;
  equity: number; // total equity
  capitalEmployed: number;

  // auxiliary
  assets: number; // alias for totalAssets
  liabilities: number; // alias for totalLiabilities
  totalEquity: number; // alias for equity
  // counts
  accountCount: number;
};

export type Ratios = {
  // Profitability
  grossProfitMargin: number;
  operatingMargin: number; // EBIT / Sales
  pretaxMargin: number;
  netProfitMargin: number;
  cashFlowMargin: number;

  // Returns
  ROA: number;
  ROE: number;
  ROCE: number;
  ROI: number | null; // optional

  // Solvency
  debtToEquity: number;
  debtRatio: number;
  equityRatio: number;
  interestCoverage: number | null;

  // Liquidity
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;

  // Efficiency
  assetTurnover: number;
  fixedAssetTurnover: number | null;
  inventoryTurnover: number | null;
  receivablesTurnover: number | null;
  payablesTurnover: number | null;
  workingCapitalTurnover: number | null;
  operatingCycleDays: number | null; // days
};

// ---------- Utility helpers ----------
const safe = (n?: number | null) => (typeof n === 'number' && !isNaN(n) ? n : 0);
const pct = (numerator: number, denominator: number) => (denominator === 0 ? 0 : (numerator / denominator) * 100);
const ratioSafe = (numerator: number, denominator: number) => (denominator === 0 ? 0 : numerator / denominator);

// Round helper
const round = (n: number, digits = 2) => {
  const m = Math.pow(10, digits);
  return Math.round((n + Number.EPSILON) * m) / m;
};

// ---------- Calculate Totals ----------
export const calculateTotals = (accounts: Account[], financialYearId?: string): Totals => {
  const t: Partial<Totals> = {};

  // initialize
  const zeroFields = [
    'revenue','contraRevenue','cogs','grossProfit','operatingExpense','depreciation','nonOperatingIncome','nonOperatingExpense','interestIncome','interestExpense','profitBeforeTax','taxExpense','netProfit','operatingCashFlow','currentAssets','nonCurrentAssets','contraAssets','totalAssets','inventory','receivables','cashAndCashEquivalents','currentLiabilities','nonCurrentLiabilities','contraLiabilities','totalLiabilities','equity','capitalEmployed','assets','liabilities','totalEquity','accountCount'
  ];
  zeroFields.forEach(k => (t[k as keyof Totals] = 0));

  // Helper to get balance for the chosen financial year
  const getBalanceForYear = (acc: Account) => {
    if (financialYearId && Array.isArray(acc.yearlyBalances)) {
      const found = acc.yearlyBalances.find(y => y.financialYear === financialYearId);
      if (found && typeof found.closingBalance === 'number') return found.closingBalance;
    }
    if (typeof acc.balance === 'number') return acc.balance;
    // fallback to last yearly closingBalance
    if (Array.isArray(acc.yearlyBalances) && acc.yearlyBalances.length) {
      const last = acc.yearlyBalances[acc.yearlyBalances.length - 1];
      if (last && typeof last.closingBalance === 'number') return last.closingBalance;
    }
    return 0;
  };

  for (const acc of accounts || []) {
    const bal = safe(getBalanceForYear(acc));
    (t.accountCount as number) += 1;

    const cat = acc.category || '';
    const sub = acc.subCategory || '';

    // Income Statement grouping
    if (acc.financialStatement === 'Income Statement' || cat === 'Revenue' || cat === 'Expense') {
      switch (sub) {
        case 'Revenue':
          t.revenue = (t.revenue ?? 0) + bal;
          break;
        case 'Contra Revenue':
          t.contraRevenue = (t.contraRevenue ?? 0) + bal;
          break;
        case 'Cost of Goods Sold':
          t.cogs = (t.cogs ?? 0) + bal;
          break;
        case 'Operating Expense':
          t.operatingExpense = (t.operatingExpense ?? 0) + bal;
          break;
        case 'Operating Expense - Depreciation':
          t.depreciation = (t.depreciation ?? 0) + bal;
          t.operatingExpense = (t.operatingExpense ?? 0) + bal;
          break;
        case 'Non-operating Income':
          t.nonOperatingIncome = (t.nonOperatingIncome ?? 0) + bal;
          break;
        case 'Non-operating Expense':
          t.nonOperatingExpense = (t.nonOperatingExpense ?? 0) + bal;
          break;
        case 'Interest Income':
          t.interestIncome = (t.interestIncome ?? 0) + bal;
          break;
        case 'Interest Expense':
          t.interestExpense = (t.interestExpense ?? 0) + bal;
          break;
        case 'Tax Expense':
          t.taxExpense = (t.taxExpense ?? 0) + bal;
          break;
        default:
          // if accountType indicates revenue/expense via category
          if (cat === 'Revenue') t.revenue = (t.revenue ?? 0) + bal;
          if (cat === 'Expense') t.operatingExpense = (t.operatingExpense ?? 0) + bal;
      }
    }

    // Cash flow
    if (acc.cashFlowSection === 'Operating') {
      t.operatingCashFlow = (t.operatingCashFlow ?? 0) + bal;
    }

    // Balance sheet grouping
    if (acc.financialStatement === 'Balance Sheet' || cat === 'Asset' || cat === 'Liability' || cat === 'Equity') {
      switch (sub) {
        case 'Current Asset':
          t.currentAssets = (t.currentAssets ?? 0) + bal;
          break;
        case 'Non-current Asset':
          t.nonCurrentAssets = (t.nonCurrentAssets ?? 0) + bal;
          break;
        case 'Contra Asset':
          t.contraAssets = (t.contraAssets ?? 0) + bal;
          break;
        case 'Current Liability':
          t.currentLiabilities = (t.currentLiabilities ?? 0) + bal;
          break;
        case 'Non-current Liability':
          t.nonCurrentLiabilities = (t.nonCurrentLiabilities ?? 0) + bal;
          break;
        case 'Contra Liability':
          t.contraLiabilities = (t.contraLiabilities ?? 0) + bal;
          break;
        case 'Equity':
        case 'Share Capital':
        case 'Share Premium':
        case 'Retained Earnings':
        case 'Appropriation - Reserves':
        case 'Revaluation Surplus':
          t.equity = (t.equity ?? 0) + bal;
          break;
        case 'Treasury Shares':
          t.equity = (t.equity ?? 0) - bal; // treasury reduces equity
          break;
        default:
          // heuristics: identify inventories, receivables, payables by name
          { const name = (acc.accountName || '').toLowerCase();
          if (name.includes('inventory') || name.includes('stock')) t.inventory = (t.inventory ?? 0) + bal;
          if (name.includes('receivable') || name.includes('debtor')) t.receivables = (t.receivables ?? 0) + bal;
          if (name.includes('payable') || name.includes('creditor')) t.currentLiabilities = (t.currentLiabilities ?? 0) + bal;
          if (name.includes('cash') || name.includes('bank')) t.cashAndCashEquivalents = (t.cashAndCashEquivalents ?? 0) + bal; }
      }
    }
  }

  // aggregates and fallbacks
  t.totalAssets = (t.currentAssets ?? 0) + (t.nonCurrentAssets ?? 0) - (t.contraAssets ?? 0);
  t.totalLiabilities = (t.currentLiabilities ?? 0) + (t.nonCurrentLiabilities ?? 0) - (t.contraLiabilities ?? 0);
  t.capitalEmployed = (t.totalAssets ?? 0) - (t.currentLiabilities ?? 0);
  t.profitBeforeTax = (t.grossProfit ?? 0) - (t.operatingExpense ?? 0) + (t.nonOperatingIncome ?? 0) - (t.nonOperatingExpense ?? 0) - (t.interestExpense ?? 0);

  // compute gross profit and net profit
  t.grossProfit = (t.revenue ?? 0) - (t.cogs ?? 0) - (t.contraRevenue ?? 0);
  t.netProfit = (t.profitBeforeTax ?? 0) - (t.taxExpense ?? 0);

  t.totalEquity = t.equity ?? 0;
  t.assets = t.totalAssets ?? 0;
  t.liabilities = t.totalLiabilities ?? 0;

  // ensure numeric
  const out: Totals = {
    revenue: safe(t.revenue),
    contraRevenue: safe(t.contraRevenue),
    cogs: safe(t.cogs),
    grossProfit: safe(t.grossProfit),
    operatingExpense: safe(t.operatingExpense),
    depreciation: safe(t.depreciation),
    nonOperatingIncome: safe(t.nonOperatingIncome),
    nonOperatingExpense: safe(t.nonOperatingExpense),
    interestIncome: safe(t.interestIncome),
    interestExpense: safe(t.interestExpense),
    profitBeforeTax: safe(t.profitBeforeTax),
    taxExpense: safe(t.taxExpense),
    netProfit: safe(t.netProfit),
    operatingCashFlow: safe(t.operatingCashFlow),

    currentAssets: safe(t.currentAssets),
    nonCurrentAssets: safe(t.nonCurrentAssets),
    contraAssets: safe(t.contraAssets),
    totalAssets: safe(t.totalAssets),
    inventory: safe(t.inventory),
    receivables: safe(t.receivables),
    cashAndCashEquivalents: safe(t.cashAndCashEquivalents),
    currentLiabilities: safe(t.currentLiabilities),
    nonCurrentLiabilities: safe(t.nonCurrentLiabilities),
    contraLiabilities: safe(t.contraLiabilities),
    totalLiabilities: safe(t.totalLiabilities),
    equity: safe(t.equity),
    capitalEmployed: safe(t.capitalEmployed),

    assets: safe(t.assets),
    liabilities: safe(t.liabilities),
    totalEquity: safe(t.totalEquity),
    accountCount: safe(t.accountCount),
  };

  return out;
};

// ---------- Ratios calculation ----------
export const calculateRatios = (totals: Totals, averages?: Partial<{
  avgInventory?: number;
  avgReceivables?: number;
  avgPayables?: number;
  avgTotalAssets?: number;
  avgNetFixedAssets?: number;
  avgWorkingCapital?: number;
}>): Ratios => {
  const rev = safe(totals.revenue);
  const assets = safe(totals.assets);
  const equity = safe(totals.totalEquity);
  const liabilities = safe(totals.liabilities);

  // Profitability
  const grossProfit = safe(totals.grossProfit);
  const operatingProfit = grossProfit - safe(totals.operatingExpense);
  const pretax = safe(totals.profitBeforeTax);
  const netProfit = safe(totals.netProfit);
  const operatingCashFlow = safe(totals.operatingCashFlow);

  const grossProfitMargin = pct(grossProfit, rev);
  const operatingMargin = pct(operatingProfit, rev);
  const pretaxMargin = pct(pretax, rev);
  const netProfitMargin = pct(netProfit, rev);
  const cashFlowMargin = pct(operatingCashFlow, rev);

  // Returns
  const ROA = pct(netProfit, assets);
  const ROE = equity === 0 ? 0 : pct(netProfit, equity);
  const ROCE = pct(operatingProfit, safe(totals.capitalEmployed));
  const ROI = null; // requires a clear definition of "total investment"; left null for now

  // Solvency
  const debtToEquity = equity === 0 ? (liabilities === 0 ? 0 : Infinity) : ratioSafe(liabilities, equity);
  const debtRatio = ratioSafe(liabilities, assets);
  const equityRatio = pct(equity, assets);
  const interestCoverage = totals.interestExpense === 0 ? null : ratioSafe(operatingProfit, totals.interestExpense);

  // Liquidity
  const currentRatio = ratioSafe(safe(totals.currentAssets), safe(totals.currentLiabilities));
  const quickRatio = ratioSafe(safe(totals.currentAssets) - safe(totals.inventory), safe(totals.currentLiabilities));
  const cashRatio = ratioSafe(safe(totals.cashAndCashEquivalents), safe(totals.currentLiabilities));

  // Efficiency
  const assetTurnover = ratioSafe(rev, assets);
  const fixedAssetTurnover = (averages && averages.avgNetFixedAssets) ? ratioSafe(rev, averages.avgNetFixedAssets) : null;

  const inventoryTurnover = (averages && averages.avgInventory) ? ratioSafe(safe(totals.cogs), averages.avgInventory) : null;
  const receivablesTurnover = (averages && averages.avgReceivables) ? ratioSafe(rev, averages.avgReceivables) : null;
  const payablesTurnover = (averages && averages.avgPayables) ? ratioSafe(safe(totals.cogs), averages.avgPayables) : null;

  //const workingCapital = safe(totals.currentAssets) - safe(totals.currentLiabilities);
  const workingCapitalTurnover = (averages && averages.avgWorkingCapital) ? ratioSafe(rev, averages.avgWorkingCapital) : null;

  // operating cycle days: inventory days + receivable days (if turnover available)
  let operatingCycleDays: number | null = null;
  if (inventoryTurnover && inventoryTurnover > 0 && receivablesTurnover && receivablesTurnover > 0) {
    const inventoryDays = 365 / inventoryTurnover;
    const receivableDays = 365 / receivablesTurnover;
    operatingCycleDays = inventoryDays + receivableDays;
  }

  const ratios: Ratios = {
    grossProfitMargin: round(grossProfitMargin, 2),
    operatingMargin: round(operatingMargin, 2),
    pretaxMargin: round(pretaxMargin, 2),
    netProfitMargin: round(netProfitMargin, 2),
    cashFlowMargin: round(cashFlowMargin, 2),

    ROA: round(ROA, 2),
    ROE: round(ROE, 2),
    ROCE: round(ROCE, 2),
    ROI: ROI,

    debtToEquity: isFinite(debtToEquity as number) ? round(debtToEquity as number, 2) : Infinity,
    debtRatio: round(debtRatio, 2),
    equityRatio: round(equityRatio, 2),
    interestCoverage: interestCoverage === null ? null : round(interestCoverage, 2),

    currentRatio: round(currentRatio, 2),
    quickRatio: round(quickRatio, 2),
    cashRatio: round(cashRatio, 2),

    assetTurnover: round(assetTurnover, 2),
    fixedAssetTurnover: fixedAssetTurnover === null ? null : round(fixedAssetTurnover, 2),
    inventoryTurnover: inventoryTurnover === null ? null : round(inventoryTurnover, 2),
    receivablesTurnover: receivablesTurnover === null ? null : round(receivablesTurnover, 2),
    payablesTurnover: payablesTurnover === null ? null : round(payablesTurnover, 2),
    workingCapitalTurnover: workingCapitalTurnover === null ? null : round(workingCapitalTurnover, 2),
    operatingCycleDays: operatingCycleDays === null ? null : round(operatingCycleDays, 0),
  };

  return ratios;
};

// ---------- Health score ----------
/*******************************************************************************
  calculateHealthScore
  - totals: Totals
  - ratios: Ratios
  Returns integer 0..100
  The weights emulate a balanced view: Profitability 25, Liquidity 20, Solvency 15,
  Efficiency 15, Growth 10, Stability 10, Cash management 5
*******************************************************************************/
export const calculateHealthScore = (totals: Totals, ratios: Ratios) => {
  const netIncome = safe(totals.netProfit);
  const { currentRatio, debtToEquity, assetTurnover, equityRatio, cashRatio, netProfitMargin, ROA, interestCoverage } = ratios;

  let score = 0;

  // Profitability 25
  if (netIncome > 0 && netProfitMargin > 10) score += 25;
  else if (netIncome > 0 && netProfitMargin > 0) score += 15;
  else if (netIncome <= 0 && netIncome > -50000) score += 6;

  // Liquidity 20
  if (currentRatio >= 2) score += 20;
  else if (currentRatio >= 1.5) score += 16;
  else if (currentRatio >= 1) score += 12;
  else if (currentRatio >= 0.5) score += 6;

  // Solvency/Leverage 15
  if (debtToEquity === Infinity) score += 0;
  else if (debtToEquity <= 0.3) score += 15;
  else if (debtToEquity <= 0.5) score += 12;
  else if (debtToEquity <= 1) score += 8;
  else if (debtToEquity <= 2) score += 4;

  // Efficiency 15
  if (assetTurnover >= 1.5) score += 15;
  else if (assetTurnover >= 1) score += 12;
  else if (assetTurnover >= 0.5) score += 8;
  else if (assetTurnover >= 0.2) score += 4;

  // Growth potential 10 (based on revenue and ROA)
  if (safe(totals.revenue) > 500000 || ROA > 10) score += 10;
  else if (safe(totals.revenue) > 200000 || ROA > 5) score += 7;
  else if (safe(totals.revenue) > 100000 || ROA > 2) score += 4;
  else if (safe(totals.revenue) > 0) score += 2;

  // Stability 10 (equity ratio)
  if (equityRatio >= 60) score += 10;
  else if (equityRatio >= 40) score += 8;
  else if (equityRatio >= 30) score += 5;
  else if (equityRatio >= 20) score += 2;

  // Cash management 5 (cash ratio and interest coverage)
  if (cashRatio >= 0.2) score += 3;
  else if (cashRatio >= 0.1) score += 2;
  if (interestCoverage !== null) {
    if (interestCoverage > 6) score += 2;
    else if (interestCoverage > 3) score += 1;
  }

  return Math.min(100, Math.round(score));
};

// ---------- Recommendations & Bot Reply ----------
export const formatRecommendations = (recs: string[]) => {
  if (!recs || recs.length === 0) return 'Your financial metrics look balanced. Continue monitoring performance.';
  return 'Recommendations: ' + recs.join('; ') + '.';
};

export const generateBotReply = (
  userMessage: string,
  args: { totals: Totals; ratios: Ratios; healthScore: number; selectedFinancialYear?: { name?: string } | null }
) => {
  const { totals, ratios, healthScore, selectedFinancialYear } = args;
  const text = (userMessage || '').toLowerCase();

  const netIncome = safe(totals.netProfit);
  const { currentRatio, debtToEquity, assetTurnover, operatingMargin, netProfitMargin, cashRatio } = ratios;

  if (text.includes('health score') || text.includes('overall')) {
    const status = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Poor';
    return `Your financial health score for ${selectedFinancialYear?.name ?? 'the selected period'} is ${healthScore}/100 — ${status}. Key drivers: net income ${netIncome >= 0 ? 'positive' : 'negative'}, current ratio ${currentRatio.toFixed(2)}, debt-to-equity ${isFinite(debtToEquity as number) ? (debtToEquity as number).toFixed(2) : '∞'}, asset turnover ${assetTurnover.toFixed(2)}.`;
  }

  if (text.includes('profit') || text.includes('margin')) {
    return `Operating margin: ${operatingMargin.toFixed(1)}%. Net profit margin: ${netProfitMargin.toFixed(1)}%. ${netProfitMargin > 10 ? 'Excellent.' : netProfitMargin > 0 ? 'Positive but consider improvement.' : 'Concerning — work on revenue or cost structure.'}`;
  }

  if (text.includes('liquidity') || text.includes('cash')) {
    return `Current ratio: ${currentRatio.toFixed(2)}. Quick ratio: ${ratios.quickRatio.toFixed(2)}. Cash ratio (approx): ${cashRatio.toFixed(2)}. ${currentRatio >= 1.5 ? 'Strong liquidity.' : 'Consider improving liquidity position.'} Working capital approx: PKR ${((totals.currentAssets ?? 0) - (totals.currentLiabilities ?? 0)).toLocaleString()}.`;
  }

  if (text.includes('debt') || text.includes('leverage')) {
    return `Debt-to-equity: ${isFinite(debtToEquity as number) ? (debtToEquity as number).toFixed(2) : '∞'}. Debt ratio: ${round(ratios.debtRatio * 100, 1)}%. ${debtToEquity < 0.5 ? 'Conservative leverage.' : 'Monitor leverage and consider reduction if needed.'}`;
  }

  if (text.includes('efficiency') || text.includes('turnover')) {
    return `Asset turnover: ${assetTurnover.toFixed(2)}x. ${assetTurnover > 1 ? 'Efficient asset utilization.' : 'Room for improvement.'}`;
  }

  if (text.includes('interest') || text.includes('coverage')) {
    const ic = ratios.interestCoverage;
    return ic === null ? 'Interest coverage: No interest expense recorded or insufficient data.' : `Interest coverage (EBIT / Interest): ${ic.toFixed(2)}x. ${ic > 6 ? 'Very comfortable.' : ic > 3 ? 'Comfortable' : 'Potential risk — consider reducing interest-bearing debt.'}`;
  }

  if (text.includes('recommend') || text.includes('improve')) {
    const recs: string[] = [];
    if (netProfitMargin < 10) recs.push('Improve profit margins through cost controls or pricing');
    if (currentRatio < 1.5) recs.push('Strengthen liquidity (accelerate receivables, manage payables)');
    if ((ratios.debtRatio * 100) > 50) recs.push('Consider debt reduction or refinancing');
    if (assetTurnover < 1) recs.push('Improve asset utilization (sell unused assets or increase sales)');
    if (ratios.inventoryTurnover !== null && ratios.inventoryTurnover < 4) recs.push('Review inventory management to improve turnover');
    if (ratios.receivablesTurnover !== null && ratios.receivablesTurnover < 6) recs.push('Tighten credit terms and strengthen collections');

    return formatRecommendations(recs);
  }

  // default
  return `I can help with health score, profitability, liquidity, leverage, efficiency, sector analysis, or recommendations. Try asking "What is my health score?" or "How to improve liquidity?"`;
};
