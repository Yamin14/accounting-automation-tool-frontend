import useAlertStore from '../../store/alertStore';
import useAccountingStore from '../../store/accountingStore';
import api from '../../api/api';
import { useState } from 'react';
import Spinner from '../Layout/Spinner';

const SetFinancialYear = () => {
    const { financialYears, selectedFinancialYear, setSelectedFinancialYear } = useAccountingStore();
    const { setJournalEntries } = useAccountingStore();
    const { addAlert } = useAlertStore();
    const [loading, setLoading] = useState(false);

    // fetch entries
    const fetchEntries = async (fy: any) => {
        setLoading(true);
        try {
            const res = await api.get(`/journal-entries/${fy}`);
            setJournalEntries(res.data.entries);
            addAlert('Entries fetched successfully', 'success');

        } catch (error) {
            addAlert('Failed to fetch entries', 'error');
        } finally {
            setLoading(false);
        }
    };

    // return
    if (loading)
        return <Spinner />;
    
    return (
        <select
            value={selectedFinancialYear?._id || 'No FY Selected'}
            onChange={(e) => {
                const selected = financialYears.find(fy => fy._id === e.target.value);
                setSelectedFinancialYear(selected || null);
                fetchEntries(e.target.value);
            }}
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
            {financialYears.map((fy) => (
                <option key={fy._id} value={fy._id}>
                    {fy.name}
                </option>
            ))}
        </select>
    )
}

export default SetFinancialYear