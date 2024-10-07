import { delay } from 'lodash';
import { DOMMessage, DOMMessageResponse } from '../types';
import { mapSigningType } from '../code/signingTypeMapper';

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
        } 
        else if (element instanceof HTMLTextAreaElement) {
          element.value = String(newContent);
          resolve();
        }
        else if (element instanceof HTMLSelectElement) {
          const options = element.options;
          let optionFound = false;

          for (let i = 0; i < options.length; i++) {
            if (options[i].text.includes(String(newContent))) {
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
          element.style.display = 'block';
        }
        else if (element instanceof HTMLAnchorElement) {
          element.dispatchEvent(new Event('click', { bubbles: true }));
          resolve();
        }
        if (newContent !== '' && newContent !== undefined) {
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

const modifyDOMContentByClass = (selector: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const element = document.getElementsByClassName(selector);
      if (element) {
        if (element && element instanceof HTMLCollection) {
          for (let i = 0; i < element.length; i++) {
            const e = element[i];
            if(e instanceof HTMLAnchorElement) {
              e.dispatchEvent(new Event('click', { bubbles: true }));
            } else if(e instanceof HTMLDivElement) {
              e.style.display = 'block';
            }
          }
          resolve();
        }
      }
      else {
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
    const hasNickname = order.signingAddressCompany !== '' && order.signingAddressCompany !== undefined;
    const closingTimeMode = order.closingTime === undefined ? 'TBD' : 'At';
    

    modifyDOMContent('company_id', order.companyId)
      .then(() => {

        modifyDOMContentByClass('add-spouse-btn');
        modifyDOMContentById('show-additional-contact-info-btn', '');

        modifyDOMContent('escrow_number', order.escrowNumber || '');
        modifyDOMContent('closing_date', order.closingDate || '');
        modifyDOMContent('closing_time_mode', closingTimeMode || '');

        modifyDOMContent('signer_name', order.signerName || '');
        modifyDOMContent('contact_phone', order.signerPhone || '');
        modifyDOMContent('signer_email', order.signerEmail || '');
        modifyDOMContent('signer_spouse_name', order.signerSpouse || '');

        modifyDOMContent('cosigner_name', order.coSignerName || '');
        modifyDOMContent('contact_altphone1_type', order.coSignerPhone || '');
        modifyDOMContent('cosigner_email', order.coSignerEmail || '');
        modifyDOMContent('cosigner_spouse_name', order.coSignerSpouse || '');
        modifyDOMContent('contact_info', order.additionalContacts || '');

        modifyDOMContent('property_address[address1]', order.propertyAddressStreet1 || '');
        modifyDOMContent('property_address[address2]', order.propertyAddressStreet2 || '');
        modifyDOMContent('property_address[city]', order.propertyAddressCity || '');
        modifyDOMContent('property_address[zone_id]', order.propertyAddressState || '');
        modifyDOMContent('property_address[zipcode]', order.propertyAddressZipcode || '');

        if(!hasNickname) {
          modifyDOMContent('signing_same_as_property_address', 1);
        }
        else{
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

        modifyDOMContent('language', order.languages || '');
        modifyDOMContentById('language-table', '');
        modifyDOMContentById('language-display', order.languages || '');

        if(closingTimeMode === 'At') {
          delay(() => modifyDOMContent('closing_time', order.closingTime || ''), 500);
        }
        delay(() => modifyDOMContent('signing_type', order.signingType ), 1000);
        
      })
      .catch(error => {
        console.error(error);
      });
  }
  // Prepare the response object with information about the site
  const response: DOMMessageResponse = {
    title: document.title
  };

  sendResponse(response);
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
injectScript('./static/js/rescheduleScript.js', 'body');
 
/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);