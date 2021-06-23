import { TicketOptionType } from '../interface/commonInterface';

export const wssURL = "wss://www.cryptofacilities.com/ws/v1"
export const msgXBTUSDSub = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
export const msgETHUSDSub = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}'
export const msgXBTUSDUnsub = '{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
export const msgETHUSDUnSub = '{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}'

export const ticketOptionsXBT: TicketOptionType[] = [
  { value: 0.5, label: 'Group 0.5' },
  { value: 1.0, label: 'Group 1.0' },
  { value: 2.5, label: 'Group 2.5' }
]

export const ticketOptionsETH: TicketOptionType[] = [
  { value: 0.05, label: 'Group 0.05' },
  { value: 0.1, label: 'Group 0.1' },
  { value: 0.25, label: 'Group 0.25' }
]

