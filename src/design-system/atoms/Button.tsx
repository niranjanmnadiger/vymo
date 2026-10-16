import type { ComponentProps } from 'react';
import styles from './controls.module.css';
type Props = ComponentProps<'button'> & {
    variant?: 'primary' | 'secondary';
};
export function Button({ variant = 'primary', type = 'button', className = '', ...props }: Props) {
    return (<button {...props} type={type} className={`${styles.button} ${styles[variant]} ${className}`}/>);
}
