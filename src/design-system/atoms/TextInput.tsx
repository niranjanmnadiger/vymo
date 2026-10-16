import type { ComponentProps } from 'react';
import styles from './controls.module.css';
export function TextInput({ className = '', ...props }: ComponentProps<'input'>) {
    return <input {...props} className={`${styles.control} ${className}`}/>;
}
