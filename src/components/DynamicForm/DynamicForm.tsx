import { useId, useState, type FormEvent } from 'react';
import { Button } from '../../design-system/atoms/Button';
import { Field } from '../../design-system/Field/Field';
import type { FieldConfig, FieldValue, FormValidator, FormValues, } from '../../types/form';
import { FieldControl } from './FieldControl';
import { createInitialValues, getVisibleValues, isFieldVisible, } from './form-utils';
import styles from './DynamicForm.module.css';
interface Props {
    config: readonly FieldConfig[];
    validate: FormValidator;
    onSubmit: (values: FormValues) => void;
    onEdit?: () => void;
    submitLabel?: string;
}
export function DynamicForm({ config, validate, onSubmit, onEdit, submitLabel = 'Submit', }: Props) {
    const formId = useId();
    const [values, setValues] = useState<FormValues>(() => createInitialValues(config));
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [attempted, setAttempted] = useState(false);
    const errors = validate(config, values);
    const visibleFields = config.filter(field => isFieldVisible(field, values));
    const errorCount = Object.keys(errors).length;
    function changeValue(name: string, value: FieldValue) {
        setValues(current => ({ ...current, [name]: value }));
        onEdit?.();
    }
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setAttempted(true);
        if (errorCount > 0) {
            const firstInvalid = visibleFields.find(field => errors[field.name]);
            const control = firstInvalid &&
                event.currentTarget.elements.namedItem(firstInvalid.name);
            if (control instanceof HTMLElement)
                control.focus();
            return;
        }
        onSubmit(getVisibleValues(config, values));
    }
    function resetForm() {
        setValues(createInitialValues(config));
        setTouched({});
        setAttempted(false);
        onEdit?.();
    }
    return (<form noValidate onSubmit={handleSubmit} onReset={resetForm} className={styles.form} aria-label="Lead details">
    <div className={styles.grid}>
        {visibleFields.map(field => {
            const id = `${formId}-${field.name}`;
            const required = field.validations.some(rule => rule.type === 'required');
            const maxLength = field.validations.find(rule => rule.type === 'maxLength');
            const value = values[field.name] ?? (field.type === 'checkbox' ? false : '');
            const error = attempted || touched[field.name]
                ? errors[field.name]
                : undefined;
            const describedBy = [
                field.hint && `${id}-hint`,
                error && `${id}-error`,
            ].filter(Boolean).join(' ') || undefined;
            const counter = field.type === 'textarea' && maxLength &&
                typeof value === 'string'
                ? `${value.length} / ${maxLength.length}`
                : undefined;
            return (<div key={field.name} className={field.span === 'full' ? styles.fullWidth : styles.cell}>
            <Field id={id} label={field.label} required={required} hint={field.hint} error={error} inline={field.type === 'checkbox'} counter={counter}>
            <FieldControl field={field} value={value} onChange={nextValue => changeValue(field.name, nextValue)} controlProps={{
                    id,
                    name: field.name,
                    required,
                    'aria-invalid': Boolean(error),
                    'aria-describedby': describedBy,
                    onBlur: () => setTouched(current => ({
                        ...current, [field.name]: true,
                    })),
                }}/>
            </Field>
            </div>);
        })}
    </div>

    
    <div className={styles.summary} aria-live="polite" aria-atomic="true">
        {attempted && errorCount > 0 && (<p>Please check {errorCount} {errorCount === 1 ? 'field' : 'fields'} before submitting.</p>)}
    </div>

    
    <div className={styles.actions}>
    <Button type="reset" variant="secondary">Clear</Button>
    <Button type="submit">{submitLabel}</Button>
    </div>
    </form>);
}
