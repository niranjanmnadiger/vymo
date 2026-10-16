import { describe, expect, it } from 'vitest';
import { createInitialValues, getVisibleValues } from '../../components/DynamicForm/form-utils';
import type { FieldConfig } from '../../types/form';
import { leadConfig } from './lead.config';
import { individualExample, companyExample } from './lead.fixtures';
import { validateLead } from './validateLead';
describe('lead validation contract', () => {
    it('returns all five initially required errors, without hidden or optional errors', () => {
        expect(Object.keys(validateLead(leadConfig, createInitialValues(leadConfig))))
            .toEqual(['fullName', 'email', 'leadType', 'phone', 'consent']);
    });
    it.each([individualExample, companyExample])('accepts a complete valid lead', values => {
        expect(validateLead(leadConfig, values)).toEqual({});
    });
    it('requires company name only while Company is selected', () => {
        expect(validateLead(leadConfig, { ...companyExample, companyName: '' })).toHaveProperty('companyName');
        expect(validateLead(leadConfig, { ...individualExample, companyName: '' })).not.toHaveProperty('companyName');
    });
    it('rejects whitespace-only required text', () => {
        expect(validateLead(leadConfig, { ...individualExample, fullName: '   ' })).toHaveProperty('fullName');
    });
    it.each(['alex', 'alex@', '@example.com', 'alex@example', 'alex @example.com'])('rejects malformed email %s', email => {
        expect(validateLead(leadConfig, { ...individualExample, email })).toHaveProperty('email');
    });
    it.each(['123456789', '12345678901', '12345abcde', '+919876543210', '98765 4321', ' 9876543210'])('rejects non-ten-digit phone %s', phone => {
        expect(validateLead(leadConfig, { ...individualExample, phone })).toHaveProperty('phone');
    });
    it('preserves leading zeros and accepts exactly ten digits', () => {
        expect(validateLead(leadConfig, individualExample)).not.toHaveProperty('phone');
        expect(getVisibleValues(leadConfig, individualExample).phone).toBe('0123456789');
    });
    it('accepts blank/200-character notes and rejects 201 characters', () => {
        for (const notes of ['', 'a'.repeat(200)]) {
            expect(validateLead(leadConfig, { ...individualExample, notes })).not.toHaveProperty('notes');
        }
        expect(validateLead(leadConfig, { ...individualExample, notes: 'a'.repeat(201) })).toHaveProperty('notes');
    });
    it('requires checked consent', () => {
        expect(validateLead(leadConfig, { ...individualExample, consent: false })).toHaveProperty('consent');
    });
    it('rejects an option outside the configured select options', () => {
        expect(validateLead(leadConfig, { ...individualExample, leadType: 'Unknown' })).toHaveProperty('leadType');
    });
    it('excludes hidden company data from the submission payload without erasing the draft', () => {
        const draft = { ...individualExample, companyName: 'Retained draft' };
        expect(getVisibleValues(leadConfig, draft)).not.toHaveProperty('companyName');
        expect(draft.companyName).toBe('Retained draft');
    });
    it('handles a new field entirely through config and does not mutate inputs', () => {
        const config: readonly FieldConfig[] = Object.freeze([...leadConfig, {
                name: 'city', type: 'text', label: 'City', validations: [{ type: 'required', message: 'Enter a city.' }],
            }]);
        const values = Object.freeze({ ...individualExample });
        expect(validateLead(config, values)).toEqual({ city: 'Enter a city.' });
        expect(validateLead(config, { ...values, city: 'Bengaluru' })).toEqual({});
        expect(values).not.toHaveProperty('city');
        expect(validateLead(config, values)).toEqual(validateLead(config, values));
    });
});
