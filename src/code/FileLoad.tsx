import {ChangeEvent, useRef, useState} from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import './FileLoad.css';
import {SigningOrder} from '../models/signingOrder';

interface FileUploadProps {
  onFileLoad: (file: File) => void;
  onClear: () => void;
}

const FileLoad: React.FC<FileUploadProps> = ({ onFileLoad, onClear }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFile(file);
      onFileLoad(file);
      readFile(file);
      // Reset the file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const signingOrders: SigningOrder[] = XLSX.utils.sheet_to_json(worksheet);
        console.log(signingOrders);
        //onFileLoad(signingOrders);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleClearClick = () => {
    setFile(null);
    onClear();
  };

  return (
    <div className="fileload-container">
    <div className='fileload-button'>
    
      <Button 
        component="label"
        role={undefined}
        tabIndex={-1}
        variant="contained" 
        startIcon={<CloudUploadIcon />}
        >
          Load Data
          <input 
            type="file" 
            accept=".xlsx,.xls,.csv,.txt" 
            onChange={handleFileChange} 
            style={{ display: 'none' }}
            ref={fileInputRef}
            />
      </Button> 

      {file && 
      <Button 
        component="label"
        role={undefined}
        tabIndex={-2}
        variant="contained"
        color='error'
        onClick={handleClearClick}
        >
          Clear
          <input 
            style={{ display: 'none' }}/>
      </Button> 
      }
    </div>

    {file && <div>{file && `${file.name}`}</div> }
      
    </div>
  );
  
}

export default FileLoad;
