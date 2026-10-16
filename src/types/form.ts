export type FieldValue = string | boolean;
export type FormValues = Record<string, FieldValue>;
export type FormErrors = Partial<Record<string, string>>;
export type ValidationRule = {
    type: 'required';
    message: string;
} | {
    type: 'email';
    message: string;
} | {
    type: 'digits';
    length: number;
    message: string;
} | {
    type: 'maxLength';
    length: number;
    message: string;
};
interface BaseField {
    name: string;
    label: string;
    hint?: string;
    placeholder?: string;
    span?: 'full';
    validations: readonly ValidationRule[];
    visibleWhen?: {
        field: string;
        equals: FieldValue;
    };
}
export type FieldConfig = BaseField & ({
    type: 'text' | 'email';
    autoComplete?: string;
    inputMode?: 'text' | 'email' | 'numeric' | 'tel';
} | {
    type: 'select';
    options: readonly {
        label: string;
        value: string;
    }[];
} | {
    type: 'textarea';
    rows?: number;
} | {
    type: 'checkbox';
});
export type FormValidator = (config: readonly FieldConfig[], values: FormValues) => FormErrors;
