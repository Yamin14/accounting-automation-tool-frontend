
// account type
export type Account = {
    _id: string,
    accountName: string,
    accountType: string,
    balance: number,
    category: string,
    subCategory: string,
    financialStatement: string,
    cashFlowSection: string,
    yearlyBalances: [{ financialYear: string, openingBalance: number, closingBalance: number }]
};

// journal entry type
export type JournalEntry = {
    _id: string,
    date: string,
    description: string,
    debitAccount: {
        _id: string,
        accountName: string,
        accountType: string,
        category: string,
        subCategory: string,
        financialStatement: string,
        cashFlowSection: string
    },
    creditAccount: {
        _id: string,
        accountName: string,
        accountType: string,
        category: string,
        subCategory: string,
        financialStatement: string,
        cashFlowSection: string
    },
    amount: number,
    financialYear: string,
}

// financial year type
export type FinancialYear = {
    _id: string,
    name: string,
    startDate: string,
    endDate: string,
    isActive: boolean
}

// note type
export type Note = {
    _id: string,
    title: string,
    noteNumber: number,
    description: string,
    linkedAccount: string | null,
    financialYear: string,
    financialStatement: string
}

export type BudgetItem = {
    category: string;
    subCategory?: string | null;
    budgetedAmount: number;
  };
  
  export type BudgetType = {
    _id?: string;
    financialYear: { _id: string; name: string };
    company: string;
  
    revenue: BudgetItem;
    cogs: BudgetItem;
    operatingExpenses: BudgetItem;
    capex: BudgetItem;
    cashInflows: BudgetItem;
    cashOutflows: BudgetItem;
  
    netIncome: BudgetItem;
  
    createdBy?: string;
    createdAt?: string;
  };