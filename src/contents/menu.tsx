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

    const getPurchase = (page)=>{
        return fetch('https://openloot.com/api/market/purchases?pageSize=100&page='+page)
    }
  
    let page = 1 
    let purchases:Purchases;
  
    getPurchase(page).then(res=>{
        console.log('result',res)
        res.json().then((obj)=>{
            console.log('obj',obj)
            purchases  = obj
            let totalPage = obj.totalPages
  
            for (let i = 2; i <= purchases.totalPages; i++) {
                console.log(purchases.items)
                getPurchase(i).then(res=>{
                    console.log('result',res)
                    res.json().then((obj)=>{
                        purchases.items.push(...obj.items);
                        console.log('total page',purchases.items);

                        // purchases.items = purchases.items.map(purchasesItem=>{
                        //      purchasesItem.createdAt = new Date(purchasesItem.createdAt.toString()).getDate().toString()
                        //      return purchasesItem
                        // })

                        localStorage['purchases'] = JSON.stringify(purchases)

                    })
                })
            }
        })
    })
  }