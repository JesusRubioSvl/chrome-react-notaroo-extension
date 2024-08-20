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
  if(msg.order){
    const order = msg.order;
    const hasNickname = order.signingAddressCompany !== '';
    const closingTimeMode = order.closingTime === undefined ? 'TBD' : 'At';

    modifyDOMContent('company_id', order.companyId)
      .then(() => {
        modifyDOMContent('escrow_number', order.escrowNumber || '');
        modifyDOMContent('closing_date', order.closingDate || '');
        modifyDOMContent('closing_time_mode', closingTimeMode || '');
        modifyDOMContent('signer_name', order.signerName || '');
        modifyDOMContent('contact_phone', order.signerPhone || '');
        modifyDOMContent('signer_email', order.signerEmail || '');
        modifyDOMContent('cosigner_name', order.coSignerName || '');
        modifyDOMContent('contact_altphone1_type', order.coSignerPhone || '');
        modifyDOMContent('cosigner_email', order.coSignerEmail || '');
        modifyDOMContent('property_address[address1]', order.propertyAddressStreet1 || '');
        modifyDOMContent('property_address[address2]', order.propertyAddressStreet2 || '');
        modifyDOMContent('property_address[city]', order.propertyAddressCity || '');
        modifyDOMContent('property_address[zone_id]', order.propertyAddressState || '');
        modifyDOMContent('property_address[zipcode]', order.propertyAddressZipcode || '');
        if(hasNickname) {
          modifyDOMContent('signing_same_as_property_address', 0);
          delay(() => modifyDOMContent('signing_address[company]', order.signingAddressCompany || ''), 500);
          delay(() => modifyDOMContent('signing_address[address1]', order.signingAddressStreet1 || ''), 500);
          delay(() => modifyDOMContent('signing_address[address2]', order.signingAddressStreet2 || ''), 500);
          delay(() => modifyDOMContent('signing_address[city]', order.signingAddressCity || ''), 500);
          delay(() => modifyDOMContent('signing_address[zone_id]', order.signingAddressState || ''), 500);
          delay(() => modifyDOMContent('signing_address[zipcode]', order.signingAddressZipcode || ''), 500);
        }
        modifyDOMContent('special_instructions', order.specialInstructions || '');
        modifyDOMContentById('special-instructions-table', '');
        modifyDOMContentById('special-instructions-display-strong', order.specialInstructions || '');

        if(closingTimeMode === 'At') {
          delay(() => modifyDOMContent('closing_time', order.closingTime || ''), 500);
        }
        delay(() => modifyDOMContent('signing_type', order.signingType || ''), 1000);
        
      })
      .catch(error => {
        console.error(error);
      });
      // Prepare the response object with information about the site
      const response: DOMMessageResponse = {};

      sendResponse(response);
  }
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