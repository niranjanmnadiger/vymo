import type { ReactNode } from 'react';
import { TextInput } from '../../design-system/atoms/TextInput';
import { TextArea } from '../../design-system/atoms/TextArea';
import { Select } from '../../design-system/atoms/Select';
import { Checkbox } from '../../design-system/atoms/Checkbox';
import type { FieldConfig, FieldValue } from '../../types/form';
interface Props {
    field: FieldConfig;
    value: FieldValue;
    onChange: (value: FieldValue) => void;
    controlProps: {
        id: string;
        name: string;
        required: boolean;
        'aria-invalid': boolean;
        'aria-describedby'?: string;
        onBlur: () => void;
    };
}
function renderText({ field, value, controlProps, onChange }: Props) {
    return (<TextInput {...controlProps} type={field.type === 'email' ? 'email' : 'text'} value={typeof value === 'string' ? value : ''} placeholder={field.placeholder} autoComplete={'autoComplete' in field ? field.autoComplete : undefined} inputMode={'inputMode' in field ? field.inputMode : undefined} onChange={event => onChange(event.target.value)}/>);
}
const controls: Record<FieldConfig['type'], (props: Props) => ReactNode> = {
    text: renderText,
    email: renderText,
    select: ({ field, value, controlProps, onChange }) => (<Select {...controlProps} options={field.type === 'select' ? field.options : []} placeholder={field.placeholder} value={typeof value === 'string' ? value : ''} onChange={event => onChange(event.target.value)}/>),
    textarea: ({ field, value, controlProps, onChange }) => (<TextArea {...controlProps} rows={field.type === 'textarea' ? field.rows : undefined} placeholder={field.placeholder} value={typeof value === 'string' ? value : ''} onChange={event => onChange(event.target.value)}/>),
    checkbox: ({ value, controlProps, onChange }) => (<Checkbox {...controlProps} checked={value === true} onChange={event => onChange(event.target.checked)}/>),
};
export function FieldControl(props: Props) {
    return controls[props.field.type](props);
}
