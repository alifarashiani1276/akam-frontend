import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCreateInquiry } from './useCreateInquiry'
import Loader from '../../components/ui/Loader'
import useDelayedFlag from '../../lib/useDelayedFlag'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9٠-٩۰-۹][0-9٠-٩۰-۹\s().-]{5,}$/
const FIELD_NAMES = ['name', 'company', 'phone', 'email', 'country', 'message']

function validate(values, type, t) {
  const errors = {}
  if (!values.name.trim()) errors.name = t('forms.validation.required')
  if (!values.phone.trim()) errors.phone = t('forms.validation.required')
  else if (!PHONE_RE.test(values.phone.trim())) errors.phone = t('forms.validation.phone')
  if (!values.email.trim()) errors.email = t('forms.validation.required')
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = t('forms.validation.email')
  if (type === 'export' && !values.country.trim()) errors.country = t('forms.validation.required')
  if (!values.message.trim()) errors.message = t('forms.validation.required')
  return errors
}

export default function InquiryForm({ type = 'contact', productId, serviceId }) {
  const { lang = 'fa' } = useParams()
  const { t } = useTranslation()
  const mutation = useCreateInquiry()
  const showSendingLoader = useDelayedFlag(mutation.isPending)
  const [values, setValues] = useState({ name: '', company: '', phone: '', email: '', country: '', message: '', website: '' })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setNotice(null)
  }

  const submit = async (event) => {
    event.preventDefault()
    setNotice(null)
    const nextErrors = validate(values, type, t)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (values.website) return

    try {
      await mutation.mutateAsync({
        lang, type, name: values.name.trim(), company: values.company.trim() || undefined,
        phone: values.phone.trim(), email: values.email.trim(),
        country: type === 'export' ? values.country.trim() : undefined,
        message: values.message.trim(), product_id: productId, service_id: serviceId,
      })
      setValues({ name: '', company: '', phone: '', email: '', country: '', message: '', website: '' })
      setErrors({})
      setNotice({ kind: 'success', text: t('forms.success') })
    } catch (error) {
      const serverErrors = error?.errors ?? error?.response?.data?.errors
      if (error?.status === 422 && serverErrors && typeof serverErrors === 'object') {
        const mapped = {}
        for (const field of FIELD_NAMES) {
          const message = serverErrors[field]
          if (message) mapped[field] = Array.isArray(message) ? message[0] : String(message)
        }
        setErrors(mapped)
        setNotice({ kind: 'error', text: t('forms.validation.server') })
      } else {
        setNotice({ kind: 'error', text: t('forms.error') })
      }
    }
  }

  const fieldClass = (field) => `input input-bordered w-full bg-base-200 ${errors[field] ? 'input-error' : ''}`
  const labelClass = 'mb-2 block text-sm font-semibold text-base-content'

  return (
    <section className="rounded-box border border-base-300 bg-base-100 p-5 md:p-8">
      <div className="mb-7">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary">{t(`forms.types.${type}.eyebrow`)}</span>
        <h2 className="mb-3 text-2xl font-black md:text-3xl">{t(`forms.types.${type}.title`)}</h2>
        <p className="max-w-2xl text-sm leading-7 text-base-content/65">{t(`forms.types.${type}.description`)}</p>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor={`inquiry-${type}-name`}>{t('forms.fields.name')} *</label>
            <input id={`inquiry-${type}-name`} name="name" autoComplete="name" className={fieldClass('name')} value={values.name} onChange={update('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `error-${type}-name` : undefined} required />
            {errors.name && <p id={`error-${type}-name`} className="mt-1 text-sm text-error">{errors.name}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor={`inquiry-${type}-company`}>{t('forms.fields.company')}</label>
            <input id={`inquiry-${type}-company`} name="company" autoComplete="organization" className={fieldClass('company')} value={values.company} onChange={update('company')} />
            {errors.company && <p className="mt-1 text-sm text-error">{errors.company}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor={`inquiry-${type}-phone`}>{t('forms.fields.phone')} *</label>
            <input id={`inquiry-${type}-phone`} name="phone" type="tel" dir="ltr" inputMode="tel" autoComplete="tel" className={`${fieldClass('phone')} text-left`} value={values.phone} onChange={update('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `error-${type}-phone` : undefined} required />
            {errors.phone && <p id={`error-${type}-phone`} className="mt-1 text-sm text-error">{errors.phone}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor={`inquiry-${type}-email`}>{t('forms.fields.email')} *</label>
            <input id={`inquiry-${type}-email`} name="email" type="email" dir="ltr" inputMode="email" autoComplete="email" className={`${fieldClass('email')} text-left`} value={values.email} onChange={update('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `error-${type}-email` : undefined} required />
            {errors.email && <p id={`error-${type}-email`} className="mt-1 text-sm text-error">{errors.email}</p>}
          </div>
          {type === 'export' && (
            <div>
              <label className={labelClass} htmlFor={`inquiry-${type}-country`}>{t('forms.fields.country')} *</label>
              <input id={`inquiry-${type}-country`} name="country" autoComplete="country-name" className={fieldClass('country')} value={values.country} onChange={update('country')} aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? `error-${type}-country` : undefined} required />
              {errors.country && <p id={`error-${type}-country`} className="mt-1 text-sm text-error">{errors.country}</p>}
            </div>
          )}
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor={`inquiry-${type}-message`}>{t('forms.fields.message')} *</label>
            <textarea id={`inquiry-${type}-message`} name="message" rows={5} className={`textarea textarea-bordered w-full bg-base-200 ${errors.message ? 'textarea-error' : ''}`} value={values.message} onChange={update('message')} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? `error-${type}-message` : undefined} required />
            {errors.message && <p id={`error-${type}-message`} className="mt-1 text-sm text-error">{errors.message}</p>}
          </div>
        </div>

        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`inquiry-${type}-website`}>Website</label>
          <input id={`inquiry-${type}-website`} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update('website')} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-primary min-w-44" disabled={mutation.isPending}>
            {showSendingLoader ? <Loader layout="inline" size="sm" delay={0} label={t('states.loaders.sending')} /> : t('forms.submit')}
          </button>
          <p className="text-xs text-base-content/50">{t('forms.requiredNote')}</p>
        </div>
        <div className="mt-4 min-h-6" aria-live="polite" aria-atomic="true" role="status">
          {notice && <p className={notice.kind === 'success' ? 'text-sm text-success' : 'text-sm text-error'}>{notice.text}</p>}
        </div>
      </form>
    </section>
  )
}
