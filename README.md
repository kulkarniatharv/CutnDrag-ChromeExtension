# CodeFloaterSnippet
A snippet for chromium-based browsers (chrome, edge, brave, etc) that allows you to drag and move around an element by inputting its selector (e.g,  #your-div-id > div:nth-child(2) > div)

## How to run
1. Create a new snippet in chrome
2. Paste the code below
3. Run the snippet on whichever website you want

For illustrations of creating, running and removing snippets, refer to this guide by [Chrome Developers](https://developer.chrome.com/docs/devtools/javascript/snippets/).


## JS code

```javascript
let floatThis = null;
let dragValue = null;

let userInput = prompt("Enter the selector of the element: (e.g., #your-div-id > div:nth-child(2) > div)")

floatThis = (elementSelector) => {
  console.log(elementSelector)
  try {
    let elem = document.querySelector(elementSelector);

    elem.style.position = "absolute";
    elem.style.top = elem.getBoundingClientRect().y;
    elem.style.left = elem.getBoundingClientRect().x;
    elem.style.boxShadow = "15px 15px 20px rgba(0, 0, 0, 0.2)";
    elem.style.border = "1px solid black";
    elem.style.zIndex = "10000"

    elem.onmousedown = (e) => {
      dragValue = elem;
    }


    document.onmousemove = (e) => {
      if (dragValue !== null) {
        let x = e.pageX;
        let y = e.pageY;
        dragValue.style.left = x + "px";
        dragValue.style.top = y + "px";
      }
    }

    document.onmouseup = () => {
      dragValue = null;
    }
  } catch (err) {
    console.log(err);
  }


}


if(userInput !== null) {
	floatThis(userInput);
}

```
