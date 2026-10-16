import type { FormValues } from '../../types/form';
export const individualExample = {
    fullName: 'Alex Morgan',
    email: 'alex@example.com',
    leadType: 'Individual',
    companyName: '',
    phone: '0123456789',
    notes: 'Interested in a product walkthrough next week.',
    consent: true,
} satisfies FormValues;
export const companyExample = {
    ...individualExample,
    leadType: 'Company',
    companyName: 'Acme Studio',
} satisfies FormValues;
