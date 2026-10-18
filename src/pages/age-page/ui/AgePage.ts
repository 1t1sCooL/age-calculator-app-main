import m from 'mithril'
import { AgeCard } from '@/widgets/age-card/ui/AgeCard'
import { SiteFooter } from '@/widgets/site-footer/ui/SiteFooter'
import './AgePage.css'

export const AgePage: m.Component = {
  view() {
    return m('div.app', [m('main.app__main', m(AgeCard)), m(SiteFooter)])
  },
}
