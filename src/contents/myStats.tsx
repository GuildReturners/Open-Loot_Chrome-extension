import { FC, useMemo, useReducer } from "react"


import type { PurchasedItem, Purchases } from "./interfaces/purchase"
import type { PlasmoContentScript, PlasmoGetInlineAnchor } from "plasmo";
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import { Box, Stack } from '@mui/material';


// import { purchasesData } from "./mocks/purchases";

import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import Button from "@mui/material/Button"
import Input from "@mui/material/Input"
import Link from "@mui/material/Link"
import Popover from '@mui/material/Popover';
import Typography from "@mui/material/Typography"
import { useState } from "react"
import React from "react";

const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

// document.querySelector("header").appendChild(styleElement)



export const config: PlasmoContentScript = {
  matches : [ "https://openloot.com/my-stats"]
}

// export const getInlineAnchor : 
// PlasmoGetInlineAnchor = () =>  
//   document.querySelector("main")


  import type { PlasmoGetOverlayAnchor } from "plasmo"
 


  export const getInlineAnchor = () => {
    return document.querySelector("header")
  }



function fixPopover(){

  const popoverStyle = document.createElement("style")
  popoverStyle.innerText = `.MuiPopover-root {background-color: white;}svg.MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.plasmo-mui-cache-i4bv87-MuiSvgIcon-root {height: 25px;}.MuiBox-root.plasmo-mui-cache-70qvj9 {display: flex;color: black;cursor: pointer;margin-bottom: 10px;}`;
  document.querySelector("body").appendChild(popoverStyle)
 
}

function MyStats() {
  // loadPurchase()
  let purchasesData:Purchases = JSON.parse( localStorage['purchases'])

  fixPopover()
  document.querySelector("main .chakra-container").innerHTML = "";





    const columns = useMemo<MRT_ColumnDef<PurchasedItem>[]>(
      () => [
        {
          header: 'Item',
          accessorKey: 'item.name',
          enableGrouping: true, //don't let this column be grouped
        },
        {
          header: 'Price',
          accessorKey: 'price',
        },        
        {
          header: 'Id',
          accessorKey: 'item.issuedId',
        },
        {
          header: 'Purchase Date',
          accessorKey: 'createdAt',
        },
        {
          header: 'Rarity',
          accessorKey: 'item.rarity',
        },
        {
          header: 'Status',
          accessorKey: 'item.status',
        },      
        {
          header: 'openlootid',
          accessorKey: 'item.id',
        },   
        {
          header: 'Seller',
          accessorKey: 'createdBy',
        },     
        
      ],
      [],
    );

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
  
    return (
      <CacheProvider value={styleCache}>
        <MaterialReactTable
          columns={columns}
          data={purchasesData.items}
          enableGrouping
          enableStickyHeader
          enableStickyFooter
          initialState={{
            columnVisibility: { "item.id": false },
            density: 'compact',
            grouping: ['item.name'],
            pagination: { pageIndex: 0, pageSize: 200 },
            sorting: [{ id: 'price', desc: false }], //sort by state by default
          }}
          muiToolbarAlertBannerChipProps={{ color: 'primary' }}
          muiTableContainerProps={{ sx: { maxHeight: 500 } }}
          positionActionsColumn="last"
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <a href={"/account/items/" + row.renderValue("item.id")} target="_blank">
              <Button>Sell</Button>
              </a>
            </Box>
          )}
        />
      </CacheProvider>
    );
  
  
}
  
export default MyStats;
