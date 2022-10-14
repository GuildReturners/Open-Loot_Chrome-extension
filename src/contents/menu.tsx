import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div className="inline-flex items-center justify-center w-8 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
    <a href="/my-stats">
        <button className="inline-flex items-center justify-center w-8 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">My stats</button>
    </a>    
    <a onClick={loadOwnData}>
        <button className="inline-flex items-center justify-center w-8 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">Load my data</button>
    </a>
  </div>
  )
}

export default IndexPopup


import type { PlasmoContentScript, PlasmoGetInlineAnchor } from "plasmo";
import type { Purchases } from "./interfaces/purchase";

export const config: PlasmoContentScript = {
  matches : [ "https://openloot.com/*"]
}

export const getInlineAnchor : 
PlasmoGetInlineAnchor = () =>  
  document.querySelector(".chakra-link")



  function loadOwnData(){
    loadPurchase()
  }


  function loadPurchase(){

    let page = 1 
    const getPurchase = (page)=>{
        return fetch('https://openloot.com/api/market/purchases?pageSize=100&page='+page)
    }
  
    let purchasesAcc
    getPurchase(page)
      .then(res=> res.json())
      .then(async (purchases)=>{
        purchasesAcc = purchases
        purchasesAcc.items.map(purchasedItem=>{
          purchasedItem.createdAt = new Date(purchasedItem.createdAt).getTime().toString()
          if(purchasedItem.item.tags.includes("weapons"))     {  purchasedItem.category = "cosmetic" ;  purchasedItem.type = "Weapons"}
          if(purchasedItem.item.tags.includes("armor"))       {  purchasedItem.category = "cosmetic" ;  purchasedItem.type = "Armor"}
          if(purchasedItem.item.tags.includes("title"))       {  purchasedItem.category = "cosmetic" ;  purchasedItem.type = "Title"}
          if(purchasedItem.item.tags.includes("space"))       {  purchasedItem.category = "utility" ;  purchasedItem.type = "Space"}
          if(purchasedItem.item.tags.includes("mysterybox"))  {  purchasedItem.category = "utility" ;  purchasedItem.type = "Mystery box"}
          return purchasedItem
        })

        localStorage['purchases'] = JSON.stringify(purchasesAcc)

        for (let i = 2; i <= purchases.totalPages; i++) {
            await getPurchase(i)
              .then(res=> res.json())
              .then((obj)=>{
                let purchasedItemsFromCurrentPage = obj.items.map(purchasedItem=>{
                      purchasedItem.createdAt = new Date(purchasedItem.createdAt).getTime().toString()
                      if(purchasedItem.item.tags.includes("weapons"))     {  purchasedItem.category = "cosmetic" ;  purchasedItem.type = "Weapons"}
                      if(purchasedItem.item.tags.includes("armor"))       {  purchasedItem.category = "cosmetic" ;  purchasedItem.type = "Armor"}
                      if(purchasedItem.item.tags.includes("title"))       {  purchasedItem.category = "cosmetic" ;  purchasedItem.type = "Title"}
                      if(purchasedItem.item.tags.includes("space"))       {  purchasedItem.category = "utility" ;  purchasedItem.type = "Space"}
                      if(purchasedItem.item.tags.includes("mysterybox"))  {  purchasedItem.category = "utility" ;  purchasedItem.type = "Mystery box"}
                      return purchasedItem
                })
                console.log('purchasedItemsFromCurrentPage',purchasedItemsFromCurrentPage);
                
                purchasesAcc.items.push(...purchasedItemsFromCurrentPage);  
              })
              .then(()=>localStorage['purchases'] = JSON.stringify(purchasesAcc))
              
        }
    }).then(()=> alert('Your purchases history have been loaded'))
  }