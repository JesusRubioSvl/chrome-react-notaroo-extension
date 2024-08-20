import {ChangeEvent, useEffect, useRef, useState} from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import './FileLoad.css';
import {SigningOrder} from '../models/signingOrder';

interface FileUploadProps {
  onFileLoad: (loadedFileName: string, signingOrders: Array<SigningOrder>) => void;
  onClear: () => void;
  fileName: string | null;
  orders: Array<SigningOrder>;
}

const FileLoad: React.FC<FileUploadProps> = (props: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(props.fileName);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFileName(file.name);
      readFile(file).then((orders) => {
        props.onFileLoad(file.name, orders);
        // Reset the file input value
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
    }
  };

  useEffect(() => {
    setFileName(props.fileName);
  }, [props.fileName]);

  const readFile = (file: File): Promise<SigningOrder[] | never[]> => {
    const reader = new FileReader();
    let signingOrders: SigningOrder[] = [];
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        signingOrders = XLSX.utils.sheet_to_json(worksheet);
        
      }
    };
    reader.readAsBinaryString(file);
    return new Promise<SigningOrder[] | never[]>((resolve) => {
      reader.onloadend = () => {
        resolve(signingOrders);
      };
    });
  };

  const handleClearClick = () => {
    props.onClear();
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

      {fileName && 
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

    {fileName && <div>{`${fileName}`}</div> }
      
    </div>
  );
  
}

export default FileLoad;
