export interface TicketOptionType {
  label: string;
  value: number;
};

export interface SizeBox {
  size: number
}

export interface PriceItem {
  [index: string]: number | SizeBox
}

export interface PriceList {
  bids: PriceItem
  asks: PriceItem
}

export interface FeedData {
  feed: string
  bids: number[][]
  asks: number[][]
}
