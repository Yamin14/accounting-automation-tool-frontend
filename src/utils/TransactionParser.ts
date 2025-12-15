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

// Main parser – fixed to respect your Account model
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

  // Transaction intent detection
  const isExpense = /paid|spent|bought|purchase|bill|invoice|expense|supplier|vendor|rent|salary|utility|paid (to|for)/i.test(promptLower);
  const isIncome = /received|sold|sale|revenue|income|deposit|customer|client|invoice (from|to)|collection/i.test(promptLower);
  const isTransfer = /transfer|moved|from.*to|to.*from|deposit.*into|withdraw.*from/i.test(promptLower);

  let debitAccObj: any | null = null;
  let creditAccObj: any | null = null;

  // Helper filters based on CATEGORY (from your model)
  const isAsset = (acc: any) => acc.category === "Asset";
  const isLiability = (acc: any) => acc.category === "Liability";
  const isRevenue = (acc: any) => acc.category === "Revenue";

  // Common sub-filters
  const isCashOrBank = (acc: any) =>
    isAsset(acc) && (fuzzyIncludes(acc.accountName, "cash") || fuzzyIncludes(acc.accountName, "bank"));
  const isAccountsReceivable = (acc: any) =>
    isAsset(acc) && fuzzyIncludes(acc.accountName, "receivable");
  const isAccountsPayable = (acc: any) =>
    isLiability(acc) && fuzzyIncludes(acc.accountName, "payable");

  if (isExpense) {
    // Expense transaction: Debit Expense, Credit Cash/Bank/AP
    debitAccObj =
      findBestMatch(promptLower, accounts, isExpense) ||
      findBestMatch(promptLower, accounts, (a) => isExpense(a) || a.subCategory?.includes("Expense"));

    creditAccObj =
      findBestMatch(promptLower, accounts, isAccountsPayable) ||
      findBestMatch(promptLower, accounts, isCashOrBank) ||
      accounts.find(isCashOrBank) ||
      accounts.find(isAccountsPayable);
  } 
  else if (isIncome) {
    // Income transaction: Debit Cash/Bank/AR, Credit Revenue
    debitAccObj =
      findBestMatch(promptLower, accounts, isCashOrBank) ||
      findBestMatch(promptLower, accounts, isAccountsReceivable) ||
      accounts.find(isCashOrBank) ||
      accounts.find(isAccountsReceivable);

    creditAccObj =
      findBestMatch(promptLower, accounts, isRevenue) ||
      findBestMatch(promptLower, accounts, (a) => isRevenue(a) || a.subCategory === "Revenue");
  } 
  else if (isTransfer) {
    // Transfer: Find two distinct mentioned accounts
    const mentioned = accounts
      .filter((a: any) => fuzzyIncludes(promptLower, a.accountName.toLowerCase()))
      .sort((a, b) => b.accountName.length - a.accountName.length); // prefer longer matches

    if (mentioned.length >= 2) {
      debitAccObj = mentioned[0];
      creditAccObj = mentioned[1];
    } else if (mentioned.length === 1) {
      // If only one mentioned, assume transfer to/from cash
      const cashBank = accounts.find(isCashOrBank);
      if (cashBank && mentioned[0]._id !== cashBank._id) {
        // Try to determine direction based on words like "to", "from"
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

  // Final fallback: any accounts explicitly mentioned in prompt
  if (!debitAccObj || !creditAccObj) {
    const mentioned = accounts
      .filter((a: any) => fuzzyIncludes(promptLower, a.accountName.toLowerCase()))
      .sort((a, b) => b.accountName.length - a.accountName.length);

    if (mentioned.length >= 1) debitAccObj = mentioned[0];
    if (mentioned.length >= 2) creditAccObj = mentioned[1];
  }

  // Assign names if found
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