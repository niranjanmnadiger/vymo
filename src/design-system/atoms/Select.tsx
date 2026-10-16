import type { ComponentProps } from 'react';
import styles from './controls.module.css';
type Props = ComponentProps<'select'> & {
    options: readonly {
        label: string;
        value: string;
    }[];
    placeholder?: string;
};
export function Select({ options, placeholder = 'Choose an option', className = '', ...props }: Props) {
    return (<select {...props} className={`${styles.control} ${className}`}>
    
    <option value="">{placeholder}</option>
        {options.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
    </select>);
}
