import api from "../api/api";

// Helper: Simple fuzzy contains (case-insensitive substring)
const fuzzyIncludes = (text: string, search: string) => {
  return text.toLowerCase().includes(search.toLowerCase());
};

// Helper: Find best matching account by longest matching substring
function findBestMatch(promptLower: string, accounts: any[], filterFn?: (acc: any) => boolean) {
  let bestMatch: any = null;
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

  // Optional: fallback to partial matches or fuzzy logic here (e.g., using Fuse.js later)
  return bestMatch;
}

// Main parser
async function parseTransaction(prompt: string, user: any) {
  if (!prompt.trim()) {
    return { description: "", debitAccount: null, creditAccount: null, amount: 0, error: "Empty prompt" };
  }

  // Fetch accounts
  const res = await api.get(`companies/${user.company._id}/accounts`);
  const accounts = res.data.accounts;

  if (!accounts || accounts.length === 0) {
    return { description: prompt, debitAccount: null, creditAccount: null, amount: 0, error: "No accounts found" };
  }

  const promptLower = prompt.toLowerCase();

  // Extract the most likely amount: look for currency patterns or last/biggest number
  const amountMatches = prompt.matchAll(/\$?\s*(\d+(?:\.\d{1,2})?)/g);
  const amounts = Array.from(amountMatches, m => parseFloat(m[1]));
  const amount = amounts.length > 0 ? Math.max(...amounts) : 0; // Use largest as primary amount

  // Determine transaction type
  const isExpense = /paid|spent|bought|purchase|bill|invoice|expense|supplier|vendor|paid to|paid for/i.test(promptLower);
  const isIncome = /received|sold|sale|revenue|income|deposit|customer|client/i.test(promptLower);
  const isTransfer = /transfer|moved|from.*to|to.*from/i.test(promptLower);

  let debitAccount = null;
  let creditAccount = null;

  if (isExpense) {
    // Debit: likely an Expense or Asset
    const expenseCandidates = accounts.filter((a: any) =>
      a.accountType === 'Expense' ||
      a.accountType === 'Cost of Goods Sold' ||
      a.accountType === 'Other Expense' ||
      a.accountType === 'Asset' // e.g., buying equipment
    );
    debitAccount = findBestMatch(promptLower, expenseCandidates) ||
                   findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === 'Expense'));

    // Credit: likely Cash, Bank, or Accounts Payable
    const liabilityOrBank = accounts.filter((a: any) =>
      a.accountType === 'Bank' ||
      a.accountType === 'Credit Card' ||
      a.accountType === 'Accounts Payable'
    );
    creditAccount = findBestMatch(promptLower, liabilityOrBank) ||
                    findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === 'Bank')) ||
                    findBestMatch(promptLower, accounts.filter((a: any) => a.accountName.toLowerCase().includes('cash')));
  } 
  else if (isIncome) {
    // Debit: Bank or Cash
    const bankAccounts = accounts.filter((a: any) => a.accountType === 'Bank' || a.accountType === 'Cash');
    debitAccount = findBestMatch(promptLower, bankAccounts) ||
                   findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === 'Bank'));

    // Credit: Revenue or Accounts Receivable
    const revenueAccounts = accounts.filter((a: any) =>
      a.accountType === 'Revenue' ||
      a.accountType === 'Income' ||
      a.accountType === 'Sales' ||
      a.accountType === 'Accounts Receivable'
    );
    creditAccount = findBestMatch(promptLower, revenueAccounts) ||
                    findBestMatch(promptLower, accounts.filter((a: any) => a.accountType === 'Revenue'));
  }
  else if (isTransfer) {
    // Try to find two accounts mentioned
    const mentioned = accounts.filter((a: any) => fuzzyIncludes(promptLower, a.accountName.toLowerCase()));
    if (mentioned.length >= 2) {
      debitAccount = mentioned[0];
      creditAccount = mentioned[1];
    }
  }

  // Final fallback: if nothing matched, try generic keyword match
  if (!debitAccount || !creditAccount) {
    const allMatches = accounts.filter((a: any) => fuzzyIncludes(promptLower, a.accountName.toLowerCase()));
    if (allMatches.length === 1) {
      // Ambiguous direction — could ask user later
      debitAccount = allMatches[0];
    } else if (allMatches.length >= 2) {
      debitAccount = allMatches[0];
      creditAccount = allMatches[1];
    }
  }

  return {
    description: prompt.trim(),
    amount,
    debitAccount: debitAccount ? debitAccount.accountName : 'Unknown Debit',
    creditAccount: creditAccount ? creditAccount.accountName : 'Unknown Credit',
    confidence: debitAccount && creditAccount ? 'high' : debitAccount || creditAccount ? 'medium' : 'low'
  };
}

export default parseTransaction;