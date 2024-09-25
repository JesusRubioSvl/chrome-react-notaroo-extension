import {useState, useEffect} from 'react';
import './App.css';
import { DOMMessage, DOMMessageResponse } from './types';
import FileLoad from './code/FileLoad';
import {SigningOrder} from './models/signingOrder';
import FileDisplay from './code/FileDisplay';

function App() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [orders, setOrders] = useState<Array<SigningOrder>>([]);
  const [insertOrder, setInsertOrder] = useState<SigningOrder | null>(null);
  const [canLoadValues, setCanLoadValues] = useState<boolean>(false);
  const [tabTitle, setTabTitle] = useState<string>('');

  useEffect(() => {
    // Get the tab title when the component mounts
    console.log('Tab title:', tabTitle);
    if (tabTitle === 'Scheduling :: SigningOrder.com') {
      setCanLoadValues(true);
    } else {
      setCanLoadValues(false);
    }
    
  }, [tabTitle]);

  const handleFileLoad = (loadedFileName: string, signingOrders: Array<SigningOrder>) => {
    setFileName(loadedFileName);
    setOrders(signingOrders);
    // Store the name in chrome.storage
    if(chrome.storage && chrome.storage.local){
      chrome.storage.local.set({ fileName: loadedFileName }, () => {
        console.log('File name saved to chrome.storage as:', loadedFileName);
      });
      chrome.storage.local.set({ orders: JSON.stringify(signingOrders) }, () => {
        console.log('Orders saved to chrome.storage - ', signingOrders.length);
      });
    }

    const appContainer = document.querySelector('.App');
    if (appContainer) {
      appContainer.classList.remove('normal-height');
    }
  };

  const handleClear = () => {
    setFileName(null);
    setOrders([]);
    console.log('File cleared');
    // Clear the file name from chrome.storage
    if(chrome.storage && chrome.storage.local){
      chrome.storage.local.remove('fileName', () => {
        console.log('File name removed from chrome.storage');
      });
      chrome.storage.local.remove('orders', () => {
        console.log('Orders removed from chrome.storage');
      });
    }

    const appContainer = document.querySelector('.App');
    if (appContainer) {
      appContainer.classList.add('normal-height');
    }
  };

  const handleInsert = (signingOrder: SigningOrder, signingOrders: Array<SigningOrder>) => {
    setInsertOrder(signingOrder);
    setOrders(signingOrders);
    chrome.storage.local.set({ orders: JSON.stringify(signingOrders) }, () => {
      console.log('Orders saved to chrome.storage - ', signingOrders.length);
    });
  };

  useEffect(() => {
    // Retrieve the file name from chrome.storage when the popup is opened
    if(chrome.storage){
      chrome.storage.local.get('fileName', (result) => {
        if (result.fileName) {
          console.log('File name retrieved from chrome.storage:', result.fileName);
          setFileName(result.fileName);
        }
      });
      chrome.storage.local.get('orders', (result) => {
        if (result.orders) {
          console.log('Orders retrieved from chrome.storage');
          const parsedOrders: SigningOrder[] = JSON.parse(result.orders)
          setOrders(parsedOrders);
        }
      });
    }
  }, []);

  useEffect(() => {
    /*
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        { type: 'GET_DOM', order: insertOrder } as DOMMessage,
        (response: DOMMessageResponse) => {
          setTabTitle(response.title);
        });
    });
  }, [insertOrder]);


  return (
    <div className="App">
      <h1>Notaroo Data Loader</h1>

      <FileLoad 
      onFileLoad={handleFileLoad} 
      onClear={handleClear}
      fileName={fileName}
      orders={orders} />

      <div className="file-display-container">
        <FileDisplay
          orders={orders}
          handleInsert={handleInsert}
          canLoadValues={canLoadValues}
        />
      </div>
    </div>
  );
}

export default App;