function StatusMessage({ tone = 'info', children }) {
  return (
    <p className={`status status--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}

export default StatusMessage
