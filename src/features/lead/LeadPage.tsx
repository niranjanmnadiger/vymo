import { useEffect, useRef, useState } from 'react';
import { DynamicForm } from '../../components/DynamicForm/DynamicForm';
import type { FormValues } from '../../types/form';
import { leadConfig } from './lead.config';
import { validateLead } from './validateLead';
import styles from './LeadPage.module.css';
export function LeadPage() {
    const [submitted, setSubmitted] = useState<FormValues | null>(null);
    const resultHeading = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        if (submitted)
            resultHeading.current?.focus();
    }, [submitted]);
    return (<main className={styles.page}>
    <header className={styles.heading}>
    <p className={styles.eyebrow}>LEAD CAPTURE</p>
    <h1>Add a new lead</h1>
    <p>Enter the contact details below. Fields marked * are required.</p>
    </header>

    <section className={styles.card} aria-label="New lead form">
    
    <DynamicForm config={leadConfig} validate={validateLead} onSubmit={setSubmitted} onEdit={() => setSubmitted(null)} submitLabel="Submit lead"/>
    </section>

    
        {submitted && (<section className={styles.result} aria-labelledby="result-title">
        <h2 id="result-title" ref={resultHeading} tabIndex={-1}>
Form submitted
        </h2>
        <p>These values are shown here only. Refreshing the page clears them.</p>
        
        <dl>
            {leadConfig
                .filter(field => Object.hasOwn(submitted, field.name))
                .map(field => (<div key={field.name}>
            <dt>{field.label}</dt>
            <dd>
                {typeof submitted[field.name] === 'boolean'
                    ? (submitted[field.name] ? 'Yes' : 'No')
                    : submitted[field.name] || 'Not provided'}
            </dd>
            </div>))}
        </dl>
        </section>)}
    </main>);
}
