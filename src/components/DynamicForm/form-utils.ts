import type { FieldConfig, FormValues } from '../../types/form';
export function isFieldVisible(field: FieldConfig, values: FormValues): boolean {
    if (!field.visibleWhen)
        return true;
    return values[field.visibleWhen.field] === field.visibleWhen.equals;
}
export function createInitialValues(config: readonly FieldConfig[]): FormValues {
    return Object.fromEntries(config.map(field => [field.name, field.type === 'checkbox' ? false : '']));
}
export function getVisibleValues(config: readonly FieldConfig[], values: FormValues): FormValues {
    return Object.fromEntries(config
        .filter(field => isFieldVisible(field, values))
        .map(field => [field.name, values[field.name] ?? (field.type === 'checkbox' ? false : '')]));
}
