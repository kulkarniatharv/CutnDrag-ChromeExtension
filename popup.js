

let startSnipBtn = document.getElementById("startSnip");

startSnipBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: dragDrop,
    });
});


function dragDrop() {
    methods_obj.getElementFromDom();
}


