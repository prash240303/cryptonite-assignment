'use client'

import { Provider } from 'react-redux'
import Store from './store'

export function ProviderWrapper({ children }) {
  return (
    <Provider store={Store}>
      {children}
    </Provider>
  )
}
