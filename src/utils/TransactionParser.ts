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
  confidence: 'high' | 'medium' | 'low';
  error?: string;
}

// Main parser
async function parseTransaction(prompt: string, user: any): Promise<ParsedTransaction> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    return {
      description: "",
      debitAccount: "Unknown Debit",
      creditAccount: "Unknown Credit",
      amount: 0,
      confidence: "low",
      error: "Empty prompt",
    };
  }

  // Fetch accounts
  const res = await api.get(`companies/${user.company._id}/accounts`);
  const accounts = res.data.accounts;

  if (!accounts || accounts.length === 0) {
    return {
      description: trimmedPrompt,
      debitAccount: "Unknown Debit",
      creditAccount: "Unknown Credit",
      amount: 0,
      confidence: "low",
      error: "No accounts found",
    };
  }

  const promptLower = trimmedPrompt.toLowerCase();

  // Extract the most likely amount
  const amountMatches = trimmedPrompt.matchAll(/\$?\s*(\d+(?:\.\d{1,2})?)/g);
  const amounts = Array.from(amountMatches, (m) => parseFloat(m[1]));
  const amount = amounts.length > 0 ? Math.max(...amounts) : 0;

  // Determine transaction type
  const isExpense = /paid|spent|bought|purchase|bill|invoice|expense|supplier|vendor|paid to|paid for/i.test(promptLower);
  const isIncome = /received|sold|sale|revenue|income|deposit|customer|client/i.test(promptLower);
  const isTransfer = /transfer|moved|from.*to|to.*from/i.test(promptLower);

  let debitAccountName = "Unknown Debit";
  let creditAccountName = "Unknown Credit";
  let confidence: 'high' | 'medium' | 'low' = "low";

  let debitAccObj = null;
  let creditAccObj = null;

  if (isExpense) {
    const expenseCandidates = accounts.filter((a: any) =>
      ["Expense", "Cost of Goods Sold", "Other Expense", "Asset"].includes(a.accountType)
    );
    debitAccObj = findBestMatch(promptLower, expenseCandidates) ||
                  findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === "Expense"));

    const paymentSources = accounts.filter((a: any) =>
      ["Bank", "Credit Card", "Accounts Payable"].includes(a.accountType) ||
      a.accountName.toLowerCase().includes("cash")
    );
    creditAccObj = findBestMatch(promptLower, paymentSources) ||
                   findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === "Bank"));

  } else if (isIncome) {
    const bankAccounts = accounts.filter((a: any) =>
      ["Bank", "Cash"].includes(a.accountType)
    );
    debitAccObj = findBestMatch(promptLower, bankAccounts) ||
                  findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === "Bank"));

    const revenueAccounts = accounts.filter((a: any) =>
      ["Revenue", "Income", "Sales", "Accounts Receivable"].includes(a.accountType)
    );
    creditAccObj = findBestMatch(promptLower, revenueAccounts) ||
                   findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === "Revenue"));

  } else if (isTransfer) {
    const mentioned = accounts.filter((a: any) => fuzzyIncludes(promptLower, a.accountName.toLowerCase()));
    if (mentioned.length >= 2) {
      debitAccObj = mentioned[0];
      creditAccObj = mentioned[1];
    }
  }

  // Final fallback: any mentioned accounts
  if (!debitAccObj || !creditAccObj) {
    const allMatches = accounts.filter((a: any) => fuzzyIncludes(promptLower, a.accountName.toLowerCase()));
    if (allMatches.length >= 1) debitAccObj = allMatches[0];
    if (allMatches.length >= 2) creditAccObj = allMatches[1];
  }

  // Set names
  if (debitAccObj) debitAccountName = debitAccObj.accountName;
  if (creditAccObj) creditAccountName = creditAccObj.accountName;

  // Update confidence
  if (debitAccObj && creditAccObj) confidence = "high";
  else if (debitAccObj || creditAccObj) confidence = "medium";

  return {
    description: trimmedPrompt,
    amount,
    debitAccount: debitAccountName,
    creditAccount: creditAccountName,
    confidence,
  };
}

export default parseTransaction;