import m from 'mithril'
import './SiteFooter.css'

const link = (href: string, text: string): m.Vnode =>
  m('a', { href, target: '_blank', rel: 'noopener noreferrer' }, text)

export const SiteFooter: m.Component = {
  view() {
    return m('footer.site-footer', [
      m('p.site-footer__credit', [
        'Challenge by ',
        link('https://www.frontendmentor.io?ref=challenge', 'Frontend Mentor'),
        '. Coded by ',
        link('https://mmalabugin.ru/', '1t1sCooL'),
        '.',
      ]),
      m('nav.site-footer__links', { 'aria-label': 'Author links' }, [
        link('https://mmalabugin.ru/', 'Website'),
        link('https://www.frontendmentor.io/profile/1t1sCooL', 'Frontend Mentor'),
        link('https://www.twitter.com/vi_el_mar', 'Twitter'),
        link('https://t.me/ItIsCooL', 'Telegram'),
      ]),
    ])
  },
}
