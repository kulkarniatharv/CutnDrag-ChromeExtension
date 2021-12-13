# CodeFloaterSnippet
A snippet for chromium-based browsers (chrome, edge, brave, etc) that allows you to drag and move around an element by inputting its selector (e.g,  #your-div-id > div:nth-child(2) > div)

## Adding the snippet to your browser
For illustrations of creating, running and removing snippets, refer to this 2-minute guide by [Chrome Developers](https://developer.chrome.com/docs/devtools/javascript/snippets/).


## How does it work

Demonstration video: https://youtu.be/sFSIstmPH3s

1. Create the snippet and paste the JS code given below. To create a snippet, check the guide by Chrome Developers shared above.
1. Select an element on the page by pressing Ctrl+Shift+C or Open up the developer console by pressing F12 or Ctrl+Shift+J and find the element that you are trying to move around.
2. After you locate the element, copy its selector by right clicking on it (under the elements tab of developer tools window)

![image](https://user-images.githubusercontent.com/15829308/145865863-65d4d0e1-46de-4c7c-8917-40d14b94be4a.png)

3. Run the snippet by going to sources tab of developer tools window.

![image](https://user-images.githubusercontent.com/15829308/145865781-1c058cb1-437a-4ec7-a3df-3826b62fdf8d.png)

4. Paste the selector in the prompt window and press enter.

![image](https://user-images.githubusercontent.com/15829308/145865941-d0ae8351-143c-4b8e-8b95-dd5ca91bd312.png)

5. Now you can move around the element on the website. 

**To restore the state of the website, reload it.**


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
