import api from "../api/api";

// Helper: Simple fuzzy contains (case-insensitive substring)
const fuzzyIncludes = (text: string, search: string): boolean => {
  return text.toLowerCase().includes(search.toLowerCase());
};

// Helper: Find best matching account by longest matching substring
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

// Main parser
async function parseTransaction(prompt: string, user: any): Promise<ParsedTransaction> {
  const trimmedPrompt = prompt.trim();

  // Default fallback values
  let debitAccount = "Unknown Debit";
  let creditAccount = "Unknown Credit";
  let amount = 0;
  let description = trimmedPrompt || "";

  if (!trimmedPrompt) {
    return {
      description: "",
      amount: 0,
      debitAccount: "Unknown Debit",
      creditAccount: "Unknown Credit",
    };
  }

  // Fetch accounts from backend
  const res = await api.get(`companies/${user.company._id}/accounts`);
  const accounts = res.data.accounts;

  if (!accounts || accounts.length === 0) {
    return {
      description: trimmedPrompt,
      amount: 0,
      debitAccount: "Unknown Debit",
      creditAccount: "Unknown Credit",
    };
  }

  const promptLower = trimmedPrompt.toLowerCase();

  // Extract amount: find all numbers (with optional $ and decimals), pick the largest
  const amountMatches = trimmedPrompt.matchAll(/\$?\s*(\d+(?:\.\d{1,2})?)/g);
  const amounts = Array.from(amountMatches, (m) => parseFloat(m[1]));
  if (amounts.length > 0) {
    amount = Math.max(...amounts);
  }

  // Determine transaction type
  const isExpense = /paid|spent|bought|purchase|bill|invoice|expense|supplier|vendor|paid to|paid for/i.test(promptLower);
  const isIncome = /received|sold|sale|revenue|income|deposit|customer|client/i.test(promptLower);
  const isTransfer = /transfer|moved|from.*to|to.*from/i.test(promptLower);

  let debitAccObj: any | null = null;
  let creditAccObj: any | null = null;

  if (isExpense) {
    // Debit: Expense or Asset
    const expenseCandidates = accounts.filter((a: any) =>
      ["Expense", "Cost of Goods Sold", "Other Expense", "Asset"].includes(a.accountType)
    );
    debitAccObj =
      findBestMatch(promptLower, expenseCandidates) ||
      findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === "Expense"));

    // Credit: Payment source (Bank, Credit Card, Accounts Payable, Cash)
    const paymentSources = accounts.filter((a: any) =>
      ["Bank", "Credit Card", "Accounts Payable"].includes(a.accountType) ||
      a.accountName.toLowerCase().includes("cash")
    );
    creditAccObj =
      findBestMatch(promptLower, paymentSources) ||
      findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === "Bank"));
  } 
  else if (isIncome) {
    // Debit: Cash/Bank
    const bankAccounts = accounts.filter((a: any) =>
      ["Bank", "Cash"].includes(a.accountType)
    );
    debitAccObj =
      findBestMatch(promptLower, bankAccounts) ||
      findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === "Bank"));

    // Credit: Revenue
    const revenueAccounts = accounts.filter((a: any) =>
      ["Revenue", "Income", "Sales", "Accounts Receivable"].includes(a.accountType)
    );
    creditAccObj =
      findBestMatch(promptLower, revenueAccounts) ||
      findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === "Revenue"));
  } 
  else if (isTransfer) {
    // Try to match two mentioned accounts
    const mentioned = accounts.filter((a: any) =>
      fuzzyIncludes(promptLower, a.accountName.toLowerCase())
    );
    if (mentioned.length >= 2) {
      debitAccObj = mentioned[0];
      creditAccObj = mentioned[1];
    }
  }

  // Final fallback: any accounts mentioned in the prompt
  if (!debitAccObj || !creditAccObj) {
    const allMatches = accounts.filter((a: any) =>
      fuzzyIncludes(promptLower, a.accountName.toLowerCase())
    );
    if (allMatches.length >= 1) debitAccObj = allMatches[0];
    if (allMatches.length >= 2) creditAccObj = allMatches[1];
  }

  // Override defaults if we found real accounts
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