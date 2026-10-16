import type { ComponentProps } from 'react';
import styles from './controls.module.css';
export function Checkbox({ className = '', ...props }: Omit<ComponentProps<'input'>, 'type'>) {
    return <input {...props} type="checkbox" className={`${styles.checkbox} ${className}`}/>;
}
