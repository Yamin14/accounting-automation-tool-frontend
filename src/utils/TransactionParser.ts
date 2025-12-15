import api from "../api/api";

// Helper: Case-insensitive substring match
const fuzzyIncludes = (text: string, search: string): boolean => {
  return text.toLowerCase().includes(search.toLowerCase());
};

// Helper: Find best matching account by longest matching substring in accountName
function findBestMatch(
  promptLower: string,
  accounts: any[],
  filterFn?: (acc: any) => boolean
): any | null {
  let bestMatch: any | null = null;
  let longestMatchLength = 0;

  for (const acc of accounts) {
    if (filterFn && !filterFn(acc)) continue;

    const nameLower = acc.accountName.toLowerCase();
    if (promptLower.includes(nameLower)) {
      if (nameLower.length > longestMatchLength) {
        longestMatchLength = nameLower.length;
        bestMatch = acc;
      }
    }
  }

  return bestMatch;
}

interface ParsedTransaction {
  description: string;
  amount: number;
  debitAccount: string;
  creditAccount: string;
}

// Main parser – updated with improved intent detection
async function parseTransaction(prompt: string, user: any): Promise<ParsedTransaction> {
  const trimmedPrompt = prompt.trim();
  let amount = 0;
  let debitAccount = "Unknown Debit";
  let creditAccount = "Unknown Credit";

  if (!trimmedPrompt) {
    return { description: "", amount: 0, debitAccount, creditAccount };
  }

  // Fetch accounts
  const res = await api.get(`companies/${user.company._id}/accounts`);
  const accounts = res.data.accounts || [];

  if (accounts.length === 0) {
    return { description: trimmedPrompt, amount: 0, debitAccount, creditAccount };
  }

  const promptLower = trimmedPrompt.toLowerCase();

  // Extract amount: largest number with optional $ and up to 2 decimals
  const amountMatches = [...trimmedPrompt.matchAll(/\$?\s*(\d+(?:\.\d{1,2})?)/g)];
  const amounts = amountMatches.map(m => parseFloat(m[1]));
  if (amounts.length > 0) {
    amount = Math.max(...amounts);
  }

  // Category filters based on your Account model
  const isAsset = (acc: any) => acc.category === "Asset";
  const isLiability = (acc: any) => acc.category === "Liability";
  const isRevenue = (acc: any) => acc.category === "Revenue";
  const isExpenseCat = (acc: any) => acc.category === "Expense"; // renamed to avoid name clash

  const isCashOrBank = (acc: any) =>
    isAsset(acc) && (fuzzyIncludes(acc.accountName, "cash") || fuzzyIncludes(acc.accountName, "bank"));
  const isAccountsReceivable = (acc: any) =>
    isAsset(acc) && fuzzyIncludes(acc.accountName, "receivable");
  const isAccountsPayable = (acc: any) =>
    isLiability(acc) && fuzzyIncludes(acc.accountName, "payable");

  // === Improved intent detection ===
  let transactionType: "income" | "expense" | "transfer" | "unknown" = "unknown";

  // Strong income signals
  const strongIncomeKeywords = [
    "received", "sold", "sale", "revenue", "income", "deposit",
    "customer", "client", "collection", "payment received", "paid us", "paid me"
  ];
  const hasStrongIncome = strongIncomeKeywords.some(kw => promptLower.includes(kw));

  // Income-specific invoice patterns
  const invoiceToOrPaid = /invoice\s+(to|for)|customer.*invoice|invoice.*(paid|received)|paid\s+.*invoice/i.test(trimmedPrompt);

  // Strong expense signals
  const strongExpenseKeywords = [
    "paid", "spent", "bought", "purchased", "purchase",
    "bill", "expense", "rent", "salary", "payroll", "utilities", "utility",
    "supplier", "vendor"
  ];
  const hasStrongExpense = strongExpenseKeywords.some(kw => promptLower.includes(kw));

  // Directional phrases that strongly indicate expense
  const paidToForFrom = /paid\s+(to|for|the|my|our)|bought\s+from|spent\s+on|payment\s+to/i.test(trimmedPrompt);

  // Expense-specific invoice pattern
  const invoiceFrom = /invoice\s+from/i.test(trimmedPrompt);

  // Transfer signals
  const hasTransferKeywords = /transfer|moved|deposited\s+into|withdrew\s+from|from\s+.*\s+to|to\s+.*\s+from/i.test(trimmedPrompt);

  // Decision logic with clear priority: Income > Expense > Transfer
  if (hasStrongIncome || invoiceToOrPaid) {
    transactionType = "income";
  } else if (
    hasStrongExpense ||
    paidToForFrom ||
    invoiceFrom ||
    (promptLower.includes("invoice") && !invoiceToOrPaid)
  ) {
    transactionType = "expense";
  } else if (hasTransferKeywords) {
    transactionType = "transfer";
  }
  // else remains "unknown" – will fall back to mentioned accounts later

  let debitAccObj: any | null = null;
  let creditAccObj: any | null = null;

  if (transactionType === "expense") {
    // Debit: Expense account, Credit: Cash/Bank or Accounts Payable
    debitAccObj =
      findBestMatch(promptLower, accounts, isExpenseCat) ||
      findBestMatch(promptLower, accounts, (a) => isExpenseCat(a) || a.subCategory?.includes("Expense"));

    creditAccObj =
      findBestMatch(promptLower, accounts, isAccountsPayable) ||
      findBestMatch(promptLower, accounts, isCashOrBank) ||
      accounts.find(isCashOrBank) ||
      accounts.find(isAccountsPayable);

  } else if (transactionType === "income") {
    // Debit: Cash/Bank or Accounts Receivable, Credit: Revenue
    debitAccObj =
      findBestMatch(promptLower, accounts, isCashOrBank) ||
      findBestMatch(promptLower, accounts, isAccountsReceivable) ||
      accounts.find(isCashOrBank) ||
      accounts.find(isAccountsReceivable);

    creditAccObj =
      findBestMatch(promptLower, accounts, isRevenue) ||
      findBestMatch(promptLower, accounts, (a) => isRevenue(a) || a.subCategory === "Revenue");

  } else if (transactionType === "transfer") {
    // Transfer: Find two distinct mentioned accounts
    const mentioned = accounts
      .filter((a: any) => fuzzyIncludes(promptLower, a.accountName.toLowerCase()))
      .sort((a: any, b: any) => b.accountName.length - a.accountName.length);

    if (mentioned.length >= 2) {
      debitAccObj = mentioned[0];
      creditAccObj = mentioned[1];
    } else if (mentioned.length === 1) {
      const cashBank = accounts.find(isCashOrBank);
      if (cashBank && mentioned[0]._id !== cashBank._id) {
        if (/to/i.test(promptLower)) {
          debitAccObj = mentioned[0];
          creditAccObj = cashBank;
        } else {
          debitAccObj = cashBank;
          creditAccObj = mentioned[0];
        }
      }
    }
  }

  // Final fallback: use any accounts explicitly mentioned in the prompt
  if (!debitAccObj || !creditAccObj) {
    const mentioned = accounts
      .filter((a: any) => fuzzyIncludes(promptLower, a.accountName.toLowerCase()))
      .sort((a: any, b: any) => b.accountName.length - a.accountName.length);

    if (mentioned.length >= 1) debitAccObj = debitAccObj || mentioned[0];
    if (mentioned.length >= 2) creditAccObj = creditAccObj || mentioned[1];
  }

  // Assign names if objects were found
  if (debitAccObj) debitAccount = debitAccObj.accountName;
  if (creditAccObj) creditAccount = creditAccObj.accountName;

  return {
    description: trimmedPrompt,
    amount,
    debitAccount,
    creditAccount,
  };
}

export default parseTransaction;