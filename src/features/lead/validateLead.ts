import { isFieldVisible } from '../../components/DynamicForm/form-utils';
import type { FieldConfig, FieldValue, FormErrors, FormValues, ValidationRule, } from '../../types/form';
function failsRule(rule: ValidationRule, value: FieldValue | undefined): boolean {
    const text = typeof value === 'string' ? value : '';
    if (rule.type === 'required') {
        return value === undefined || value === false ||
            (typeof value === 'string' && text.trim() === '');
    }
    if (value === undefined || value === '')
        return false;
    switch (rule.type) {
        case 'email':
            return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
        case 'digits':
            return !/^\d+$/.test(text) || text.length !== rule.length;
        case 'maxLength':
            return text.length > rule.length;
    }
}
export function validateLead(config: readonly FieldConfig[], values: FormValues): FormErrors {
    const errors: FormErrors = {};
    for (const field of config) {
        if (!isFieldVisible(field, values))
            continue;
        const value = values[field.name];
        const failedRule = field.validations.find(rule => failsRule(rule, value));
        if (failedRule) {
            errors[field.name] = failedRule.message;
        }
        else if (field.type === 'select' && value &&
            !field.options.some(option => option.value === value)) {
            errors[field.name] = 'Choose one of the available options.';
        }
    }
    return errors;
}
