import api from "../api/api";

// parser.js
async function parseTransaction(prompt: string, user: any) {

  // Fetch account names from backend
  const res = await api.get(`companies/${user.company._id}/accounts`);
  const accounts = res.data.accounts;

  // Normalize for easier matching
  const accountNames = accounts.map((acc: any) => acc.accountName.toLowerCase());

  // Extract numbers (amount)
  const amountMatch = prompt.match(/\d+(?:\.\d+)?/);
  const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

  // Try to find matching accounts
  let debitAccount = null;
  let creditAccount = null;

  for (const acc of accountNames) {
    if (prompt.toLowerCase().includes(acc)) {
      // You can customize this logic
      if (/paid|spent|bought|purchase/.test(prompt.toLowerCase())) {
        debitAccount = acc.includes('Expense') || acc.includes('Asset') ? acc : debitAccount;
        creditAccount = acc.includes('Cash') || acc.includes('Bank') ? acc : creditAccount;
      } else if (/received|sold/.test(prompt.toLowerCase())) {
        debitAccount = acc.includes('Cash') || acc.includes('Bank') ? acc : debitAccount;
        creditAccount = acc.includes('Sevenue') || acc.includes('Sales') ? acc : creditAccount;
      }
    }
  }

  // Fallbacks
  if (!debitAccount && /paid|bought|spent/.test(prompt)) {
    debitAccount = 'Expense';
  }
  if (!creditAccount) creditAccount = 'Cash';

  return {
    description: prompt,
    debitAccount: debitAccount || 'Unknown Debit',
    creditAccount: creditAccount || 'Unknown Credit',
    amount: amount | 0,
  };

}

export default parseTransaction;