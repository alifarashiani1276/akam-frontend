import { Inbox, TriangleAlert, WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Loader from './Loader'
import useDelayedFlag from '../../lib/useDelayedFlag'

// Shared loading / empty / error states. Texts: states.* in locales/<lang>/states.json. Styles: .state-* in index.css.
//
// Usage with React Query:
//   const { data, isPending, error, refetch, isFetching } = useQuery(...)
//   <PageState isLoading={isPending} error={error} isEmpty={data?.length === 0} onRetry={refetch} isRetrying={isFetching} skeleton="cards">
//     ...render data...
//   </PageState>
//
// Order: loading -> error -> empty -> children.
// skeleton: 'cards' (2-column grid, like the blog) | 'list' (rows) | 'text' (lines). skeletonCount: how many items.
// emptyTitle / emptyText: optional, already translated, to replace the default empty texts.

const PULSE = 'skeleton-block'

function Skeleton({ variant, count }) {
  const items = Array.from({ length: count }, (_, i) => i)
  if (variant === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {items.map((i) => <div key={i} className={`${PULSE} h-20`} />)}
      </div>
    )
  }
  if (variant === 'text') {
    return (
      <div className="flex flex-col gap-3">
        {items.map((i) => <div key={i} className={`${PULSE} h-4 ${i === count - 1 ? 'w-2/3' : 'w-full'}`} />)}
      </div>
    )
  }
  return (
    <div className="grid gap-x-5 gap-y-12 md:grid-cols-2">
      {items.map((i) => <div key={i} className={`${PULSE} aspect-[16/10]`} />)}
    </div>
  )
}

function Message({ icon: Icon, title, text, role, children }) {
  return (
    <div className="state-box" role={role}>
      <Icon size={40} className="state-icon" aria-hidden="true" />
      <h3 className="state-title">{title}</h3>
      <p className="state-text">{text}</p>
      {children}
    </div>
  )
}

export default function PageState({
  isLoading = false,
  error = null,
  isEmpty = false,
  onRetry,
  isRetrying = false,
  skeleton = 'cards',
  skeletonCount = 4,
  loadingLabel,
  loader = 'skeleton',
  emptyTitle,
  emptyText,
  children,
}) {
  const { t } = useTranslation()
  const keepLoadingVisible = useDelayedFlag(isLoading)
  const showRetryLoader = useDelayedFlag(isRetrying)

  if (isLoading || keepLoadingVisible) {
    return (
      <div aria-busy="true">
        {loader === 'skeleton' && <span className="sr-only" role="status" aria-live="polite">{loadingLabel || t('states.loading')}</span>}
        {loader === 'spinner' && <Loader layout="page" label={loadingLabel || t('states.loading')} />}
        {loader === 'both' && <Loader layout="block" label={loadingLabel || t('states.loading')} />}
        {(loader === 'skeleton' || loader === 'both') && <Skeleton variant={skeleton} count={skeletonCount} />}
      </div>
    )
  }

  if (error) {
    const offline = error.status === 0
    return (
      <Message
        role="alert"
        icon={offline ? WifiOff : TriangleAlert}
        title={t(offline ? 'states.error.networkTitle' : 'states.error.title')}
        text={t(offline ? 'states.error.networkText' : 'states.error.text')}
      >
        {onRetry && (
          <button type="button" className="btn btn-primary" onClick={() => onRetry()} disabled={isRetrying}>
            {(isRetrying || showRetryLoader) && <Loader layout="inline" size="sm" label={t('states.loading')} />}
            {t('states.error.retry')}
          </button>
        )}
      </Message>
    )
  }

  if (isEmpty) {
    return (
      <Message
        icon={Inbox}
        title={emptyTitle ?? t('states.empty.title')}
        text={emptyText ?? t('states.empty.text')}
      />
    )
  }

  return children
}
