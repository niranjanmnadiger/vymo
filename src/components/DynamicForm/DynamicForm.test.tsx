import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { leadConfig } from '../../features/lead/lead.config';
import { validateLead } from '../../features/lead/validateLead';
import { LeadPage } from '../../features/lead/LeadPage';
import type { FieldConfig } from '../../types/form';
import { DynamicForm } from './DynamicForm';
function renderForm(config: readonly FieldConfig[] = leadConfig) {
    const onSubmit = vi.fn();
    render(<DynamicForm config={config} validate={validateLead} onSubmit={onSubmit} submitLabel="Submit lead"/>);
    return { user: userEvent.setup(), onSubmit };
}
describe('form interactions', () => {
    it('waits until blur to reveal an error and clears it as the value is corrected', async () => {
        const { user } = renderForm();
        const email = screen.getByRole('textbox', { name: /email address/i });
        await user.type(email, 'alex');
        expect(screen.queryByText('Enter a valid email, like alex@example.com.')).not.toBeInTheDocument();
        await user.tab();
        expect(email).toHaveAttribute('aria-invalid', 'true');
        expect(email).toHaveAccessibleDescription('Enter a valid email, like alex@example.com.');
        await user.type(email, '@example.com');
        expect(email).toHaveAttribute('aria-invalid', 'false');
        expect(screen.queryByText('Enter a valid email, like alex@example.com.')).not.toBeInTheDocument();
    });
    it('blocks invalid submission, shows every current error and focuses the first invalid input', async () => {
        const { user, onSubmit } = renderForm();
        await user.click(screen.getByRole('button', { name: 'Submit lead' }));
        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByText('Please check 5 fields before submitting.')).toBeInTheDocument();
        expect(screen.getByText('Enter a full name.')).toBeInTheDocument();
        expect(screen.getByText('Enter an email address.')).toBeInTheDocument();
        expect(screen.getByText('Choose Individual or Company.')).toBeInTheDocument();
        expect(screen.getByText('Enter a phone number.')).toBeInTheDocument();
        expect(screen.getByText('Confirm permission to contact this lead.')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /full name/i })).toHaveFocus();
    });
    it('reveals company validation, then removes its error as soon as the field is hidden', async () => {
        const { user } = renderForm();
        const type = screen.getByRole('combobox', { name: /lead type/i });
        expect(screen.queryByRole('textbox', { name: /company name/i })).not.toBeInTheDocument();
        await user.selectOptions(type, 'Company');
        await user.click(screen.getByRole('button', { name: 'Submit lead' }));
        expect(screen.getByText('Enter the company name.')).toBeInTheDocument();
        await user.selectOptions(type, 'Individual');
        expect(screen.queryByText('Enter the company name.')).not.toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: /company name/i })).not.toBeInTheDocument();
    });
    it('retains a hidden company draft but excludes it from a valid individual submission', async () => {
        const { user, onSubmit } = renderForm();
        await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Alex Morgan');
        await user.type(screen.getByRole('textbox', { name: /email/i }), 'alex@example.com');
        const type = screen.getByRole('combobox', { name: /lead type/i });
        await user.selectOptions(type, 'Company');
        await user.type(screen.getByRole('textbox', { name: /company name/i }), 'Acme');
        await user.selectOptions(type, 'Individual');
        await user.selectOptions(type, 'Company');
        expect(screen.getByRole('textbox', { name: /company name/i })).toHaveValue('Acme');
        await user.selectOptions(type, 'Individual');
        await user.type(screen.getByRole('textbox', { name: /phone/i }), '0123456789');
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Submit lead' }));
        expect(onSubmit).toHaveBeenCalledExactlyOnceWith({
            fullName: 'Alex Morgan', email: 'alex@example.com', leadType: 'Individual', phone: '0123456789', notes: '', consent: true,
        });
    });
    it('shows the notes limit and rejects pasted over-limit text', async () => {
        const { user } = renderForm();
        const notes = screen.getByRole('textbox', { name: /notes/i });
        fireEvent.change(notes, { target: { value: 'a'.repeat(201) } });
        fireEvent.blur(notes);
        expect(screen.getByText('201 / 200')).toBeInTheDocument();
        expect(screen.getByText('Keep notes to 200 characters or fewer.')).toBeInTheDocument();
        await user.clear(notes);
        expect(screen.queryByText('Keep notes to 200 characters or fewer.')).not.toBeInTheDocument();
    });
    it('clears both values and revealed errors', async () => {
        const { user } = renderForm();
        await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Alex');
        await user.click(screen.getByRole('button', { name: 'Submit lead' }));
        await user.click(screen.getByRole('button', { name: 'Clear' }));
        expect(screen.getByRole('textbox', { name: /full name/i })).toHaveValue('');
        expect(screen.queryByText(/Please check/)).not.toBeInTheDocument();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
    it('renders and validates a newly configured field without renderer changes', async () => {
        const { user } = renderForm([...leadConfig, {
                name: 'city', type: 'text', label: 'City', validations: [{ type: 'required', message: 'Enter a city.' }],
            }]);
        expect(screen.getByRole('textbox', { name: /city/i })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Submit lead' }));
        expect(screen.getByText('Enter a city.')).toBeInTheDocument();
    });
    it('displays and focuses the actual submitted result, then dismisses it on edit', async () => {
        const user = userEvent.setup();
        render(<LeadPage />);
        fireEvent.change(screen.getByRole('textbox', { name: /full name/i }), { target: { value: 'Alex Morgan' } });
        fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'alex@example.com' } });
        await user.selectOptions(screen.getByRole('combobox'), 'Individual');
        fireEvent.change(screen.getByRole('textbox', { name: /phone/i }), { target: { value: '0123456789' } });
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Submit lead' }));
        const result = screen.getByRole('heading', { name: 'Form submitted' });
        expect(result).toHaveFocus();
        expect(screen.getByText('alex@example.com')).toBeInTheDocument();
        await user.type(screen.getByRole('textbox', { name: /full name/i }), ' Jr');
        expect(screen.queryByRole('heading', { name: 'Form submitted' })).not.toBeInTheDocument();
    });
});
