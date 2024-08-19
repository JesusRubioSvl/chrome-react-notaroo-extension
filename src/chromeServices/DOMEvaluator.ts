import { delay } from 'lodash';
import { DOMMessage, DOMMessageResponse } from '../types';

const modifyDOMContent = (selector: string, newContent: string | number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const element = document.getElementsByName(selector)[0];
      if (element) {
        if (element instanceof HTMLInputElement) {
          if (element.type === 'checkbox') {
            element.checked = Boolean(newContent);
          }
          element.value = String(newContent);
          element.dispatchEvent(new Event('change', { bubbles: true }));
          resolve();
        } else if (element instanceof HTMLSelectElement) {
          const options = element.options;
          let optionFound = false;

          for (let i = 0; i < options.length; i++) {
            if (options[i].text === newContent) {
              element.selectedIndex = i;
              optionFound = true;
              break;
            }
          }

          if (optionFound) {
            element.dispatchEvent(new Event('change', { bubbles: true }));
            resolve();
          } else {
            reject(`Option with content "${newContent}" not found.`);
          }
        } else {
          reject(`Element with selector "${selector}" is not a supported input type.`);
        }
      } else {
        reject(`Element with selector "${selector}" not found.`);
      }
    } catch (error) {
      reject(`Error modifying DOM content: ${error}`);
    }
  });
};

const modifyDOMContentById = (selector: string, newContent: string | number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const element = document.getElementById(selector);
      if (element) {
        if (element && element instanceof HTMLDivElement) {
          element.style.display = 'flex';
        }else{
          element.innerText = String(newContent);
        }
      } else {
        reject(`Element with selector "${selector}" not found.`);
      }
    } catch (error) {
      reject(`Error modifying DOM content: ${error}`);
    }
  });
};
 
// Function called when a new message is received
const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void) => {

  const headlines = Array.from(document.getElementsByTagName<"h1">("h1"))
                      .map(h1 => h1.innerText);

  const hasNickname = true;

  modifyDOMContent('company_id', 'NCCI')
    .then(() => {
      modifyDOMContent('escrow_number', '12345');
      modifyDOMContent('closing_date', '08/23/2024');
      modifyDOMContent('closing_time_mode', 'At');
      modifyDOMContent('signer_name', 'John Doe');
      modifyDOMContent('contact_phone', '1234567980');
      modifyDOMContent('signer_email', 'john.doe@email.com');
      modifyDOMContent('cosigner_name', 'Johana Smith');
      modifyDOMContent('contact_altphone1_type', '0987654321');
      modifyDOMContent('cosigner_email', 'johana.smith@email.com');
      modifyDOMContent('property_address[address1]', 'San Jose 110');
      modifyDOMContent('property_address[address2]', 'Apt. 15');
      modifyDOMContent('property_address[city]', 'Houston');
      modifyDOMContent('property_address[zone_id]', 'TX');
      modifyDOMContent('property_address[zipcode]', '88730');
      if(hasNickname) {
        modifyDOMContent('signing_same_as_property_address', 0);
        delay(() => modifyDOMContent('signing_address[company]', 'Starbucks'), 500);
        delay(() => modifyDOMContent('signing_address[address1]', 'San Diego 330'), 500);
        delay(() => modifyDOMContent('signing_address[address2]', ''), 500);
        delay(() => modifyDOMContent('signing_address[city]', 'Houston'), 500);
        delay(() => modifyDOMContent('signing_address[zone_id]', 'TX'), 500);
        delay(() => modifyDOMContent('signing_address[zipcode]', '88730'), 500);
      }
      modifyDOMContent('special_instructions', 'Hello world :)');
      modifyDOMContentById('special-instructions-table', '');
      modifyDOMContentById('special-instructions-display-strong', 'Hello world :)');

      delay(() => modifyDOMContent('closing_time', '11:30AM'), 500);
      delay(() => modifyDOMContent('signing_type', '*HUD Partial Claim - $87.00'), 1000);
      
    })
    .then(() => {
      // Prepare the response object with information about the site
      const response: DOMMessageResponse = {
        title: document.title,
        headlines
      };

      sendResponse(response);
    })
    .catch(error => {
      console.error(error);
    });
};

// Function to inject a script into the webpage
function injectScript(file: string, node: string) {
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', chrome.runtime.getURL(file));
  th.appendChild(s);
}

// Inject the script into the webpage
injectScript('./static/js/injectedScript.js', 'body');
 
/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);