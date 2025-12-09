import { calculateTotals } from "./CalculateTotals";
import { calculateRatios } from "./CalculateRatios";

const safe = (n?: number | null) => (typeof n === 'number' && !isNaN(n) ? n : 0);

// ---------- Health score ----------
/*******************************************************************************
  calculateHealthScore
  - totals: Totals
  - ratios: Ratios
  Returns integer 0..100
  The weights emulate a balanced view: Profitability 25, Liquidity 20, Solvency 15,
  Efficiency 15, Growth 10, Stability 10, Cash management 5
*******************************************************************************/
export const calculateHealthScore = (totals: ReturnType<typeof calculateTotals>, ratios: ReturnType<typeof calculateRatios>) => {
  const netIncome = safe(totals.netIncome);
  const { currentRatio, quickRatio: cashRatio} = ratios.liquidity;
  const { debtToEquity, equityRatio, interestCoverage } = ratios.solvency;
  const { assetTurnover } = ratios.efficiency;
  const netProfitMargin = safe(ratios.profitability.netProfitMargin);
  const ROA = safe(ratios.return.roa);

  let score = 0;

  // Profitability 25
  if (netIncome > 0 && netProfitMargin > 10) score += 25;
  else if (netIncome > 0 && netProfitMargin > 0) score += 15;
  else if (netIncome <= 0 && netIncome > -50000) score += 6;

  // Liquidity 20
  if (safe(currentRatio) >= 2) score += 20;
  else if (safe(currentRatio) >= 1.5) score += 16;
  else if (safe(currentRatio) >= 1) score += 12;
  else if (safe(currentRatio) >= 0.5) score += 6;

  // Solvency/Leverage 15
  if (debtToEquity === Infinity) score += 0;
  else if (safe(debtToEquity) <= 0.3) score += 15;
  else if (safe(debtToEquity) <= 0.5) score += 12;
  else if (safe(debtToEquity) <= 1) score += 8;
  else if (safe(debtToEquity) <= 2) score += 4;

  // Efficiency 15
  if (safe(assetTurnover) >= 1.5) score += 15;
  else if (safe(assetTurnover) >= 1) score += 12;
  else if (safe(assetTurnover) >= 0.5) score += 8;
  else if (safe(assetTurnover) >= 0.2) score += 4;

  // Growth potential 10 (based on revenue and ROA)
  if (safe(totals.revenue) > 500000 || ROA > 10) score += 10;
  else if (safe(totals.revenue) > 200000 || ROA > 5) score += 7;
  else if (safe(totals.revenue) > 100000 || ROA > 2) score += 4;
  else if (safe(totals.revenue) > 0) score += 2;

  // Stability 10 (equity ratio)
  if (safe(equityRatio) >= 60) score += 10;
  else if (safe(equityRatio) >= 40) score += 8;
  else if (safe(equityRatio) >= 30) score += 5;
  else if (safe(equityRatio) >= 20) score += 2;

  // Cash management 5 (cash ratio and interest coverage)
  if (safe(cashRatio) >= 0.2) score += 3;
  else if (safe(cashRatio) >= 0.1) score += 2;
  if (interestCoverage !== null) {
    if (interestCoverage > 6) score += 2;
    else if (interestCoverage > 3) score += 1;
  }

  return Math.min(100, Math.round(score));
};