import React from "react";
import { FC, useMemo, useReducer, useState } from "react"
import type { PlasmoContentScript, PlasmoGetInlineAnchor } from "plasmo";

import type { ItemLocalStorage, Order } from "./interfaces/purchase"
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

  let purchasesData:ItemLocalStorage[] = JSON.parse( localStorage['nft'])

  fixPopover()

  // Remove the error page
  document.querySelector("main .chakra-container").innerHTML = "";

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const columns = useMemo<MRT_ColumnDef<ItemLocalStorage>[]>(
    () => [
      {
        header: 'Item',
        accessorKey: 'name',
        enableGrouping: true, //don't let this column be grouped
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              alt="avatar"
              height={30}
              src={row.original.imageUrl}
              loading="lazy"
              style={{ borderRadius: '5%' }}
            />
            <Typography>{cell.getValue<string>()}</Typography>
          </Box>
        ),
      },
      {
        header :'Ownership Status',
        accessorKey : "ownershipStatus",
        size:50,
      },
      {
        header :'Obtention Methode',
        accessorKey : "obtentionMethod",
        size:50,
      },
      {
        header :'Floor Price',
        accessorKey : "marketFloorPrice",
        size:50,
        aggregationFn: 'sum', 
        Footer: ({table}) => (
          <Stack>
            Total at floor price:
            <Box color="success.main">{getFloorsSum(table)}</Box>
          </Stack>
        ),
      },
      {
        header: 'Bought at',
        accessorKey: 'purchasedPrice',
        size:50,
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
        header: 'Purchase Date',
        accessorKey: 'purchasedDate',
        size : 50,
        Cell: ({ cell }) => (
          <>
            {cell.getValue<string>() && new Date(parseInt(cell.getValue<string>())).toLocaleDateString()}
          </>
        ),
      },
      {
        header: 'Purchased From',
        accessorKey: 'purchasedFrom',
        Cell: ({ cell }) => (
          <>
            {(cell.getValue<string>() && cell.getValue<string>().substring(0,2))}... {(cell.getValue<string>() && cell.getValue<string>().slice(-2))}
          </>
        ),
      },
      {
        header: 'Sold Price',
        accessorKey: 'soldPrice',
        size : 50,
      },      
      {
        header: 'Sold Date',
        accessorKey: 'soldDate',
        size : 50,
        Cell: ({ cell }) => (
          <>
            {cell.getValue<string>() && new Date(parseInt(cell.getValue<string>())).toLocaleDateString()}
          </>
        ),
      },
      {
        header: 'Sold to',
        accessorKey: 'soldTo',
        Cell: ({ cell }) => (
          <>
            {(cell.getValue<string>() && cell.getValue<string>().substring(0,2))}... {(cell.getValue<string>() && cell.getValue<string>().slice(-2))}
          </>
        ),
      },                 
      {
        header: 'Id',
        accessorKey: 'issuedId',
        size : 50,
      },

      {
        header: 'Rarity',
        accessorKey: 'rarity',
        size : 50,
        Cell: ({ cell }) => (
          <>
            <Chip label={cell.getValue().toString()} color={getChipColorFromRarity(cell.getValue())}  />
          </>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        size : 50,
      },
      {
        header: 'Category',
        accessorKey: 'category',
        size : 50,
      },   
      {
        header: 'Type',
        accessorKey: 'type',
        size : 50,
      },      
      {
        header: 'openlootid',
        accessorKey: 'id',
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
   
   

  const handleExportRows = (rows: MRT_Row<ItemLocalStorage>[]) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const getFloorsSum = (table)=>{
    let count = 0;
    table.getRowModel().rows.map(val=>{
      count = count + val.original.marketFloorPrice
    })

    return count
  };

  return (
    <CacheProvider value={styleCache}>
      <MaterialReactTable
        columns={columns}
        data={purchasesData}
        enableGrouping
        enableStickyHeader
        enableStickyFooter
        initialState={{
          columnVisibility: { "id": false },
          density: 'compact',
          grouping: ['name'],
          pagination: { pageIndex: 0, pageSize: 200 },
           sorting: [{ id: 'purchasedDate', desc: true }], //sort by state by default
        }}
        muiToolbarAlertBannerChipProps={{ color: 'primary' }}
        muiTableContainerProps={{ sx: { maxHeight: 500 } }}
        positionActionsColumn="last"
        enableRowActions
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <a href={"/account/items/" + row.renderValue("id")} target="_blank">
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
               onClick={() =>handleExportRows(table.getPrePaginationRowModel().rows)}
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
