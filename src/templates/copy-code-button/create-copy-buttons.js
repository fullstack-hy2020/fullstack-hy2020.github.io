/*This code exports a function named createCopyButton which adds a "copy" button to all pre elements
 containing code snippets. The function checks if it's being run in a browser before executing 
 the code, because SSR from Gatsby. In the copyCode function, it copies the text content of the code element to 
 the clipboard using the Clipboard API.*/

import './copy-code-button-style.css';

//Declaring a variable to check if the code is running on a browser or not.
const isBrowser = typeof document !== undefined;

//Exporting a function that creates a copy button for pre elements containing code.
export function createCopyButton() {
  //Checking if the code is running on a browser.
  if (isBrowser) {
    //Selecting all the pre elements containing code on the page.
    let blocks = document.querySelectorAll('pre');

    //Function to copy the text content of the code element to clipboard.
    function copyCode() {
      const pre = this.parentElement;
      let code = pre.querySelectorAll('code')[0];
      navigator.clipboard.writeText(code.innerText);
    }

    //Adding a copy button to each pre block.
    blocks.forEach((block) => {
      let button = document.createElement('button');
      //Adding the CSS class for the copy button style.
      button.classList.add('copy-code-button');
      button.innerText = 'copy';
      button.addEventListener('click', copyCode);
      block.appendChild(button);
    });
  }
}
