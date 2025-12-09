const validateEntry = (entry: any, accounts: any) => {

    // validate all data
    if (!entry.description || !entry.debitAccount || !entry.creditAccount || !entry.amount) {
        return {
            valid: false,
            message: "All fields (description, debit account, credit account, amount) are required."
        };
    }

    // validate negative amount
    if (entry.amount <= 0) {
        return {
            valid: false,
            message: "Amount must be a positive number."
        };
    }

    // validate debit and credit amounts
    if (!entry.debitAccount || !entry.creditAccount) {
        return {
            valid: false,
            message: "Both debit and credit accounts must be provided."
        };
    }

    // validate account names
    if (!accounts.includes(entry.debitAccount)) {
        return {
            valid: false,
            message: "Invalid debit account."
        };
    }

    if (!accounts.includes(entry.creditAccount)) {
        return {
            valid: false,
            message: "Invalid credit account."
        };
    }

    // all validations passed
    return { valid: true, message: "Entry is valid." };
}

export default validateEntry;