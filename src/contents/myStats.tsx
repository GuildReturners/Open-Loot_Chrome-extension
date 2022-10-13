import React from "react";
import { FC, useMemo, useReducer, useState } from "react"
import type { PlasmoContentScript, PlasmoGetInlineAnchor } from "plasmo";

import type { PurchasedItem, Purchases } from "./interfaces/purchase"
// import { purchasesData } from "./mocks/purchases";
import MaterialReactTable, { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import { ExportToCsv } from 'export-to-csv'; 

import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { Box, Divider, Stack, Button, Input, Link, Popover, Typography, Chip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Configure on which page this component will be mounted
export const config: PlasmoContentScript = {
  matches : [ "https://openloot.com/my-stats"]
}

// Configure under which element of the page this component will be mounted
export const getInlineAnchor = () => {
  return document.querySelector("header")
}

// Inject style from without the component shadow root
const styleElement = document.createElement("style")
const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})
export const getStyle = () => styleElement

// QUICK FIX : the MUI popover is not injected within the component shadow root, so the injected style above this liine is not applied to it.
// TODO : 
//   - Find a way to force to MUI Popover component to be injected in the component shadow root
//   - Or inject all the style directly into the webpage 
function fixPopover(){
  const popoverStyle = document.createElement("style")
  popoverStyle.innerText = `.MuiPopover-root {background-color: white;}svg.MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.plasmo-mui-cache-i4bv87-MuiSvgIcon-root {height: 25px;}.MuiBox-root.plasmo-mui-cache-70qvj9 {display: flex;color: black;cursor: pointer;margin-bottom: 10px;}`;
  document.querySelector("body").appendChild(popoverStyle)
}


// As we can't apply 2 aggregation function to a same column we need to define our own so the price aggregation row can show up the both the average and total price
function getAvgPrice(items) {
  return items.map( i => i.original.price).reduce( (acc, data) => (acc + data) ) /items.length
}    

function getChipColorFromRarity(rarity) {
  switch(rarity) {
    case 'uncommon':
      return 'success';
    case 'rare':
      return 'primary';
    case 'epic':
      return 'secondary';
    case 'legendary':
      return 'warning';
    case 'exalted':
      return 'error';
    default:
      return 'default';
  }
}



function UserStats() {

  let purchasesData:Purchases = JSON.parse( localStorage['purchases'])

  fixPopover()

  // Remove the error page
  document.querySelector("main .chakra-container").innerHTML = "";

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

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
        //required to render an aggregated cell, show the average salary in the group
        AggregatedCell: ({ cell, table, row, column }) => (
          <Stack
            direction="row"
            divider={<Divider orientation="horizontal" flexItem />}
            spacing={2}
          >
            <Stack>
              Avg :
              <Box color="success.main">{getAvgPrice(row.getLeafRows())?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
              })}</Box>
            </Stack>
            <Stack>
              Total:
              <Box color="success.main">{cell.getValue<number>()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              })}</Box>
            </Stack>
          </Stack>
        ),
      },            
      {
        header: 'Id',
        accessorKey: 'item.issuedId',
      },
      {
        header: 'Purchase Date',
        accessorKey: 'createdAt',
        Cell: ({ cell }) => (
          <>
            {new Date(parseInt(cell.getValue<string>())).toLocaleDateString()}
          </>
        ),
      },
      {
        header: 'Rarity',
        accessorKey: 'item.rarity',
        Cell: ({ cell }) => (
          <>
            <Chip label={cell.getValue().toString()} color={getChipColorFromRarity(cell.getValue())}  />
          </>
        ),
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
   
   
   const csvOptions = {
     fieldSeparator: ',',
     quoteStrings: '"',
     decimalSeparator: '.',
     showLabels: true,
     useBom: true,
     useKeysAsHeaders: false,
     headers: columns.map((c) => c.header),
   };
   const csvExporter = new ExportToCsv(csvOptions);
   
   

  const handleExportRows = (rows: MRT_Row<PurchasedItem>[]) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

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
          sorting: [{ id: 'createdAt', desc: true }], //sort by state by default
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
        positionToolbarAlertBanner="bottom"
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
          >
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              //export all rows, including from the next page, (still respects filtering and sorting)
              onClick={() =>
                handleExportRows(table.getPrePaginationRowModel().rows)
              }
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All
            </Button>
            <Button
              disabled={table.getRowModel().rows.length === 0}
              //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
              onClick={() => handleExportRows(table.getRowModel().rows)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export Current View
            </Button>
          </Box>
        )}
      />
    </CacheProvider>
  );
}
  
export default UserStats;
