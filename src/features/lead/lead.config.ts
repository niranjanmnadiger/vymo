import type { FieldConfig } from '../../types/form';
export const leadConfig = [
    {
        name: 'fullName',
        type: 'text',
        label: 'Full name',
        placeholder: 'Enter the full name',
        autoComplete: 'name',
        validations: [{ type: 'required', message: 'Enter a full name.' }],
    },
    {
        name: 'email',
        type: 'email',
        label: 'Email address',
        placeholder: 'alex@example.com',
        autoComplete: 'email',
        inputMode: 'email',
        validations: [
            { type: 'required', message: 'Enter an email address.' },
            { type: 'email', message: 'Enter a valid email, like alex@example.com.' },
        ],
    },
    {
        name: 'leadType',
        type: 'select',
        label: 'Lead type',
        placeholder: 'Select a lead type',
        options: [
            { label: 'Individual', value: 'Individual' },
            { label: 'Company', value: 'Company' },
        ],
        validations: [{ type: 'required', message: 'Choose Individual or Company.' }],
    },
    {
        name: 'companyName',
        type: 'text',
        label: 'Company name',
        placeholder: 'Enter the company name',
        autoComplete: 'organization',
        visibleWhen: { field: 'leadType', equals: 'Company' },
        validations: [{ type: 'required', message: 'Enter the company name.' }],
    },
    {
        name: 'phone',
        type: 'text',
        label: 'Phone number',
        placeholder: '9876543210',
        autoComplete: 'tel-national',
        inputMode: 'numeric',
        hint: 'Use 10 digits, without spaces or a country code.',
        validations: [
            { type: 'required', message: 'Enter a phone number.' },
            {
                type: 'digits',
                length: 10,
                message: 'Enter exactly 10 digits, without spaces or a country code.',
            },
        ],
    },
    {
        name: 'notes',
        type: 'textarea',
        label: 'Notes',
        placeholder: 'Add any useful details about this lead',
        hint: 'You can leave this empty. Maximum 200 characters.',
        rows: 4,
        span: 'full',
        validations: [
            { type: 'maxLength', length: 200, message: 'Keep notes to 200 characters or fewer.' },
        ],
    },
    {
        name: 'consent',
        type: 'checkbox',
        label: 'I have permission to contact this lead.',
        span: 'full',
        validations: [
            { type: 'required', message: 'Confirm permission to contact this lead.' },
        ],
    },
] as const satisfies readonly FieldConfig[];
