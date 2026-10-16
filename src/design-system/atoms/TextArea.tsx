import type { ComponentProps } from 'react';
import styles from './controls.module.css';
export function TextArea({ className = '', ...props }: ComponentProps<'textarea'>) {
    return <textarea {...props} className={`${styles.control} ${styles.textarea} ${className}`}/>;
}
