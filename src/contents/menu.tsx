import { useState } from "react"
import type { PlasmoContentScript, PlasmoGetInlineAnchor } from "plasmo";
import type { Item, ItemLocalStorage, Market, Order, Orders } from "./interfaces/purchase";
import { DataArray } from "@mui/icons-material";
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import SaveIcon from '@mui/icons-material/Save';


import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Stack } from "@mui/material";


export const config: PlasmoContentScript = {
  matches: ["https://openloot.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.querySelector(".chakra-stack.css-1b63qzu")

const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

function Menu() {
  const [loading, setLoading] = useState(false);

  return (
    <CacheProvider value={styleCache}>
      <Stack direction="row" spacing={2}>
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          onClick={async () => {
            setLoading(true)
            await loadOwnData()
            setLoading(false)
          }}
        >
          Load my data
        </LoadingButton>
        <Button variant="contained" color="info" href="/dashboard">
          Dashboard
        </Button>
        <Button variant="contained" color="info" href="/my-stats">
          Data table
        </Button>
      </Stack>

    </CacheProvider>
  )
}

export default Menu


const api = {
  owned: 'https://openloot.com/api/market/items?pageSize=1000&page=',
  purchased: 'https://openloot.com/api/market/purchases?pageSize=100&page=',
  sold: 'https://openloot.com/api/market/orders?pageSize=100&status[0]=completed&page=',
  market: 'https://openloot.com/api/market/options?order=name&pageSize=100&primary=false&sort=asc&page=',
}

function notify(msg) {
  console.log(msg)
}


async function loadOwnData() {
  notify("Getting the NFT you own")
  let owned: Item[] = await getFromOpenLoot('owned')

  notify("Getting your purchase history")
  let purchased: Order[] = await getFromOpenLoot('purchased')

  notify("Getting your sale history")
  let sold: Order[] = await getFromOpenLoot('sold')

  notify("Getting market data")
  let market: Market[] = await getFromOpenLoot('market')


  let data: ItemLocalStorage[] = [];

  owned.map(nft => {
    delete nft.game
    let item: ItemLocalStorage = nft
    item.ownershipStatus = "Owned"
    item.obtentionMethod = "Looted" // At first we set all owned NFT as Looted

    setOwnCategory(nft)
    data.push(nft)
  })

  notify("Integrate your purchase history into your database")
  purchased.map(order => {
    formatOrderDate(order)
    let existingItem = data.filter(nft => nft.id == order.item.id)
    if (existingItem.length) {
      existingItem[0].purchasedDate = order.createdAt
      existingItem[0].purchasedFrom = order.createdBy
      existingItem[0].purchasedPrice = order.price
      existingItem[0].obtentionMethod = "Bought" // we overright the obtention methode
    }
    else {
      delete order.item.game
      let item: ItemLocalStorage = order.item
      item.purchasedDate = order.createdAt
      item.purchasedFrom = order.createdBy
      item.purchasedPrice = order.price
      item.ownershipStatus = "Owned" // the purchased item which are not sold will stay with as it is
      item.obtentionMethod = "Bought"

      data.push(item)
    }
  })

  notify("Integrate your sale history into your database")
  sold.map(order => {
    formatOrderDate(order)
    let existingItem = data.filter(nft => nft.id == order.item.id)
    if (existingItem.length) {
      existingItem[0].soldDate = order.createdAt
      existingItem[0].soldTo = order.completedBy
      existingItem[0].soldPrice = order.price
      existingItem[0].ownershipStatus = "Sold" // we overright the status
    }
    else {
      delete order.item.game
      let item: ItemLocalStorage = order.item
      item.soldDate = order.createdAt
      item.soldTo = order.completedBy
      item.soldPrice = order.price
      item.obtentionMethod = "Looted" // If it has not be added from the purchase data, it means it has been looted
      item.ownershipStatus = "Sold"

      data.push(item)
    }
  })

  notify("Integrate the market price into your database")
  data.map(nft => {

    let marketItem = market.filter(marketNft => marketNft.itemMetadata.archetypeId == nft.archetypeId)

    nft.marketFloorPrice = marketItem[0].lowestPrice
    nft.marketOpenOrdersCount = marketItem[0].openOrdersCount

  })

  console.log("NFT", data);

  localStorage['nft'] = JSON.stringify(data)

}

async function getFromOpenLoot(endpoint) {
  let page = 1
  let maxpage = await fetch(api[endpoint] + page).then(res => res.json()).then(res => res.totalPages)

  let restults = [];
  for (let i = 1; i <= maxpage; i++) {
    await fetch(api[endpoint] + i).then(res => res.json()).then(res => {
      restults.push(...res.items)
    })
  }
  return restults;
}


function formatOrderDate(orderItem: Order) {
  orderItem.createdAt = new Date(orderItem.createdAt).getTime().toString()
}

function setOwnCategory(item: ItemLocalStorage) {
  if (item.tags.includes("weapons")) { item.category = "Cosmetic"; item.type = "Weapons" }
  if (item.tags.includes("armor")) { item.category = "Cosmetic"; item.type = "Armor" }
  if (item.tags.includes("title")) { item.category = "Cosmetic"; item.type = "Title" }
  if (item.tags.includes("space")) { item.category = "Utility"; item.type = "Space" }
  if (item.tags.includes("mysterybox")) { item.category = "Utility"; item.type = "Mystery box" }
}