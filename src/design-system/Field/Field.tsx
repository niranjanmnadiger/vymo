import type { ReactNode } from 'react';
import styles from './Field.module.css';
interface Props {
    id: string;
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    inline?: boolean;
    counter?: string;
    children: ReactNode;
}
export function Field({ id, label, required, hint, error, inline, counter, children, }: Props) {
    const labelElement = (<label className={styles.label} htmlFor={id}>
    {label}
        {required
            ? <span className={styles.required} aria-hidden="true"> *</span>
            : <span className={styles.optional}> Optional</span>}
    </label>);
    return (<div className={`${styles.field} ${inline ? styles.inline : ''}`}>
    
        {inline
            ? <div className={styles.checkRow}>{children}{labelElement}</div>
            : <>{labelElement}{children}</>}

    
        {(hint || counter) && (<div className={styles.meta}>
        {hint && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
        {counter && <span className={styles.counter} aria-hidden="true">{counter}</span>}
        </div>)}

    
    {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
    </div>);
}
