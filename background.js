chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        console.log("request.userElement", request.userElement)

        if(request.userElement !== undefined){
            sendResponse({"message": "Fetching element successful."})
        } else {
            sendResponse({"message": "Fetching element unsuccessful."})
        }
    }
)
