import {useState, useEffect} from 'react';
import './App.css';
import { DOMMessage, DOMMessageResponse } from './types';
import FileLoad from './code/FileLoad';

function App() {
  const [title, setTitle] = useState('');
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileLoad = (loadedFile: File) => {
    setFile(loadedFile);
    console.log('File received in App:', loadedFile.name);
    // Store the name in chrome.storage
    if(chrome.storage && chrome.storage.local){
      chrome.storage.local.set({ fileName: loadedFile.name }, () => {
        console.log('File content saved to chrome.storage');
      });
    }
  };

  const handleClear = () => {
    setFile(null);
    setFileName(null);
    console.log('File cleared');
    // Clear the file name from chrome.storage
    if(chrome.storage && chrome.storage.local){
      chrome.storage.local.remove('fileName', () => {
        console.log('File name removed from chrome.storage');
      });
    }
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
        { type: 'GET_DOM' } as DOMMessage,
        (response: DOMMessageResponse) => {
          setTitle(response.title);
          setHeadlines(response.headlines);
        });
    });
  }, []);

  return (
    <div className="App">
      <h1>SEO Extension built with React!</h1>

      <FileLoad 
      onFileLoad={handleFileLoad} 
      onClear={handleClear} />

      <ul className="SEOForm">
        <li className="SEOValidation">
          <div className="SEOValidationField">
            <span className="SEOValidationFieldTitle">Title</span>
            <span className={`SEOValidationFieldStatus ${title.length < 30 || title.length > 65 ? 'Error' : 'Ok'}`}>
              {title.length} Characters
            </span>
          </div>
          <div className="SEOVAlidationFieldValue">
            {title}
          </div>
        </li>

        <li className="SEOValidation">
          <div className="SEOValidationField">
            <span className="SEOValidationFieldTitle">Main Heading</span>
            <span className={`SEOValidationFieldStatus ${headlines.length !== 1 ? 'Error' : 'Ok'}`}>
              {headlines.length}
            </span>
          </div>
          <div className="SEOVAlidationFieldValue">
            <ul>
              {headlines.map((headline, index) => (<li key={index}>{headline}</li>))}
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default App;