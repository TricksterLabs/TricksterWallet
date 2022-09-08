export const shortenAddress = (str) =>
  `${str.slice(0, 10)}...${str.slice(-4)}`

export const shortenPolicy = (str) =>
  `${str.slice(0, 20)}...${str.slice(-4)}`
