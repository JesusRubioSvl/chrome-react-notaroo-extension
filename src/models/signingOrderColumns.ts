import { GridColDef } from "@mui/x-data-grid";

export const SigningOrderColumns: GridColDef[] = 
    [
    { field: 'escrowNumber', headerName: 'Escrow Number' },
    { field: 'signerName', headerName: 'Signer Name' },
    { field: 'closingDate', headerName: 'Closing Date' },
    { field: 'closingTime', headerName: 'Closing Time' },
    { field: 'propertyAddressStreet1', headerName: 'Property Address Street 1' },
    { field: 'propertyAddressStreet2', headerName: 'Property Address Street 2' },
    { field: 'propertyAddressCity', headerName: 'Property Address City' },
    { field: 'propertyAddressState', headerName: 'Property Address State' },
    { field: 'propertyAddressZipcode', headerName: 'Property Address Zipcode' },
    { field: 'signingAddressStreet1', headerName: 'Signing Address Street 1' },
    { field: 'signingAddressStreet2', headerName: 'Signing Address Street 2' },
    { field: 'signingAddressCity', headerName: 'Signing Address City' },
    { field: 'signingAddressState', headerName: 'Signing Address State' },
    { field: 'signingAddressZipcode', headerName: 'Signing Address Zipcode' },
    { field: 'signingAddressCompany', headerName: 'Signing Address Company' },
    { field: 'signerPhone', headerName: 'Signer Phone' },
    { field: 'signerEmail', headerName: 'Signer Email' },
    { field: 'signerSpouse', headerName: 'Signer Spouse' },
    { field: 'coSignerName', headerName: 'Co-Signer Name' },
    { field: 'coSignerPhone', headerName: 'Co-Signer Phone' },
    { field: 'coSignerEmail', headerName: 'Co-Signer Email' },
    { field: 'coSignerSpouse', headerName: 'Co-Signer Spouse' },
    { field: 'additionalContacts', headerName: 'Additional Contacts' },
    { field: 'signingType', headerName: 'Signing Type' },
    { field: 'languages', headerName: 'Languages' },
    { field: 'companyId', headerName: 'Company' },
    { field: 'specialInstructions', headerName: 'Special Instructions' }
    
];