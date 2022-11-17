export {}


          

let previousUrl = '';
const observer = new MutationObserver(function(mutations) {
if (location.href !== previousUrl) {
    previousUrl = location.href;
    console.log(`URL changed to ${location.href}`);
    if ( location.href.includes('https://openloot.com/checkout?orderId')) injectCreatorCode()
    }
});
const config = {subtree: true, childList: true};
observer.observe(document, config);



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