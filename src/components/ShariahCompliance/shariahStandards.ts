import type { calculateTotals } from "../../utils/CalculateTotals";

export type ShariahStandardKey = 'meezan' | 'secMalaysia' | 'dowJones' | 'msci' | 'ftse';

export interface ScreeningCriterion {
  name: string;
  formula: string;
  threshold: string;
  value: number | null;
  pass: boolean;
  description?: string;
}

export interface ShariahStandard {
  id: ShariahStandardKey;
  name: string;
  referenceName: string;
  referenceUrl?: string;
  businessActivityRules?: string[];
  financialCriteria: ((totals: ReturnType<typeof calculateTotals>) => ScreeningCriterion[]);
  notes?: string;
}

export const shariahStandards: Record<ShariahStandardKey, ShariahStandard> = {
  meezan: {
    id: 'meezan',
    name: 'Meezan Bank',
    referenceName: 'Meezan Bank Shariah Screening Criteria',
    referenceUrl: 'https://www.meezanbank.com/shariah-screening-criteria/',
    businessActivityRules: [
      'Core business must be Shariah-compliant',
      'Non-compliant income < 5% of total revenue',
    ],
    financialCriteria: (t: ReturnType<typeof calculateTotals>) => [
      {
        name: 'Interest-Bearing Debt to Total Assets',
        formula: 'Interest-Bearing Debt ÷ Total Assets',
        threshold: '< 37%',
        value: t.totalDebt && t.assets ? (t.totalDebt / t.assets) * 100 : null,
        pass: t.totalDebt && t.assets ? (t.totalDebt / t.assets) < 0.37 : false,
      },
      {
        name: 'Non-Compliant Investments to Total Assets',
        formula: 'Non-Compliant Investments ÷ Total Assets',
        threshold: '< 33%',
        value: null,
        pass: false,
        description: 'Requires manual input (e.g., interest-bearing securities)',
      },
      {
        name: 'Non-Compliant Income to Total Revenue',
        formula: 'Non-Compliant Income ÷ Total Revenue',
        threshold: '< 5%',
        value: null,
        pass: false,
        description: 'Requires manual input of impure income',
      },
      {
        name: 'Illiquid Assets to Total Assets',
        formula: '(Fixed Assets + Inventory) ÷ Total Assets',
        threshold: '≥ 25%',
        value: t.assets ? ((t.netFixedAssets + t.inventory) / t.assets) * 100 : null,
        pass: t.assets ? ((t.netFixedAssets + t.inventory) / t.assets) >= 0.25 : false,
      },
    ],
    notes: 'Market Price > Net Liquid Assets per Share check requires share data.',
  },
  secMalaysia: {
    id: 'secMalaysia',
    name: 'Securities Commission Malaysia',
    referenceName: 'Shariah-Compliant Securities (SAC Malaysia)',
    referenceUrl: 'https://www.sc.com.my/regulation/guidelines/islamic-capital-market/shariah-compliant-securities',
    businessActivityRules: [
      '5% benchmark: Conventional banking, insurance, gambling, liquor, pork, tobacco, interest income, non-halal entertainment',
      '20% benchmark: Share trading, stockbroking, cinema, rental from non-compliant activities',
    ],
    financialCriteria: (t: ReturnType<typeof calculateTotals>) => [
      {
        name: 'Total Debt to Total Assets',
        formula: 'Total Debt ÷ Total Assets',
        threshold: '≤ 33%',
        value: t.totalDebt && t.assets ? (t.totalDebt / t.assets) * 100 : null,
        pass: t.totalDebt && t.assets ? (t.totalDebt / t.assets) <= 0.33 : false,
      },
      {
        name: 'Cash + Interest-Bearing Securities to Total Assets',
        formula: '(Cash + Interest Securities) ÷ Total Assets',
        threshold: '≤ 33%',
        value: t.cashAndCashEquivalents && t.assets ? (t.cashAndCashEquivalents / t.assets) * 100 : null,
        pass: t.cashAndCashEquivalents && t.assets ? (t.cashAndCashEquivalents / t.assets) <= 0.33 : false,
        description: 'Using Cash as proxy (interest-bearing securities not tracked)',
      },
    ],
  },
  dowJones: {
    id: 'dowJones',
    name: 'S&P Dow Jones Shariah',
    referenceName: 'S&P Dow Jones Islamic Market Indices',
    businessActivityRules: ['≤5% revenue from alcohol, pork, gambling, tobacco, conventional finance, etc.'],
    financialCriteria: () => [
      {
        name: 'Total Debt to Market Cap',
        formula: 'Total Debt ÷ Market Capitalization',
        threshold: '≤ 33%',
        value: null,
        pass: false,
        description: 'Requires Market Cap (not available from ledger)',
      },
      {
        name: '(Cash + Interest Securities) to Market Cap',
        formula: '(Cash + Interest Securities) ÷ Market Cap',
        threshold: '≤ 33%',
        value: null,
        pass: false,
      },
      {
        name: 'Accounts Receivable to Market Cap',
        formula: 'Accounts Receivable ÷ Market Cap',
        threshold: '≤ 49%',
        value: null,
        pass: false,
      },
    ],
  },
  msci: {
    id: 'msci',
    name: 'MSCI Islamic Index',
    referenceName: 'MSCI Islamic Index Series Methodology',
    financialCriteria: (t: ReturnType<typeof calculateTotals>) => [
      {
        name: 'Total Debt to Total Assets',
        formula: 'Total Debt ÷ Total Assets',
        threshold: '≤ 33.33%',
        value: t.totalDebt && t.assets ? (t.totalDebt / t.assets) * 100 : null,
        pass: t.totalDebt && t.assets ? (t.totalDebt / t.assets) <= 0.3333 : false,
      },
      {
        name: '(Cash + Interest Securities) to Total Assets',
        formula: '(Cash + Interest Securities) ÷ Total Assets',
        threshold: '≤ 33.33%',
        value: t.cashAndCashEquivalents && t.assets ? (t.cashAndCashEquivalents / t.assets) * 100 : null,
        pass: t.cashAndCashEquivalents && t.assets ? (t.cashAndCashEquivalents / t.assets) <= 0.3333 : false,
      },
      {
        name: 'Accounts Receivable to Total Assets',
        formula: 'Accounts Receivable ÷ Total Assets',
        threshold: '≤ 33.33%',
        value: t.accountsReceivable && t.assets ? (t.accountsReceivable / t.assets) * 100 : null,
        pass: t.accountsReceivable && t.assets ? (t.accountsReceivable / t.assets) <= 0.3333 : false,
      },
    ],
  },
  ftse: {
    id: 'ftse',
    name: 'FTSE Shariah Global Equity',
    referenceName: 'FTSE Yasaar Global Equity Shariah Index Series',
    referenceUrl: 'https://www.lseg.com/content/dam/ftse-russell/en_us/documents/ground-rules/ftse-yasaar-global-equity-shariah-index-series-ground-rules.pdf',
    businessActivityRules: ['≤5% revenue from prohibited activities'],
    financialCriteria: (t: ReturnType<typeof calculateTotals>) => [
      {
        name: 'Total Debt to Total Assets',
        formula: 'Total Debt ÷ Total Assets',
        threshold: '< 33%',
        value: t.totalDebt && t.assets ? (t.totalDebt / t.assets) * 100 : null,
        pass: t.totalDebt && t.assets ? (t.totalDebt / t.assets) < 0.33 : false,
      },
      {
        name: '(Cash + Interest Securities) to Total Assets',
        formula: '(Cash + Interest Securities) ÷ Total Assets',
        threshold: '< 33%',
        value: t.cashAndCashEquivalents && t.assets ? (t.cashAndCashEquivalents / t.assets) * 100 : null,
        pass: t.cashAndCashEquivalents && t.assets ? (t.cashAndCashEquivalents / t.assets) < 0.33 : false,
      },
      {
        name: '(Receivables + Cash) to Total Assets',
        formula: '(Receivables + Cash) ÷ Total Assets',
        threshold: '< 50%',
        value: t.assets ? ((t.accountsReceivable + t.cashAndCashEquivalents) / t.assets) * 100 : null,
        pass: t.assets ? ((t.accountsReceivable + t.cashAndCashEquivalents) / t.assets) < 0.50 : false,
      },
    ],
    notes: 'Minor interest income must be purified.',
  },
};

export const defaultStandard: ShariahStandardKey = 'meezan';