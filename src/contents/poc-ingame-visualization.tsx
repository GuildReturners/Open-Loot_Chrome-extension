import { useState } from "react"
import type { PlasmoContentScript, PlasmoGetInlineAnchor } from "plasmo";
import { Box } from "@mui/material";


export const config: PlasmoContentScript = {
    matches : [ "https://openloot.com/items/BT0/Darkness_2H_Axe"]
  }
  
  export const getInlineAnchor : 
  PlasmoGetInlineAnchor = () =>  
    document.querySelector("main .chakra-container div")

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/oGnnoJ76ru8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </Box>
  )
}

export default IndexPopup





