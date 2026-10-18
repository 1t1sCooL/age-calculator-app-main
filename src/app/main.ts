import m from 'mithril'
import { AgePage } from '@/pages/age-page'
import './styles/global.css'

const root = document.querySelector<HTMLElement>('#app')

if (!root) {
  throw new Error('#app root is missing')
}

m.mount(root, AgePage)
