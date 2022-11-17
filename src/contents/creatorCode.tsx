import type { PlasmoContentScript } from "plasmo";

export const config: PlasmoContentScript = {
    matches: ["https://openloot.com/*"],
  }
  
          

let previousUrl = '';
const observer = new MutationObserver(function(mutations) {
    if (location.href !== previousUrl) {
    previousUrl = location.href;
    console.log(`URL changed to ${location.href}`);
    if ( location.href.includes('https://openloot.com/checkout?orderId')) injectCreatorCode()
    if ( location.href.includes('https://openloot.com/items/BT0/')) injectVideo()
    }
});
const configObs = {
    subtree: true, childList: true};
observer.observe(document, configObs);




function injectCreatorCode(){
    console.log('in inject', document.querySelector("#creatorCode"));
    setTimeout(()=>{
            // @ts-ignore

        document.querySelector("#creatorCode").value = "Returners"
        document.querySelector("#creatorCode").addEventListener('change', (event) => {
                        // @ts-ignore
            document.querySelector("#creatorCode").value = "Returners"
        });


    },1500)
}


function injectVideo(){
    console.log('in inject video');
    setTimeout(()=>{  
        let videoContainer  = document.createElement('div')
        videoContainer.id = "video-container"
        document.querySelector('main .chakra-container ').appendChild(videoContainer)
        document.querySelector('#video-container').innerHTML = '<br><p>A video showcasing how we could have an in-game preview for <b>each NFT</b></p> <iframe width="560" height="315" src="https://www.youtube.com/embed/oGnnoJ76ru8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>'
  
  
    },1500)
}
export {}
