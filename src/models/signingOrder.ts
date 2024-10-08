export interface SigningOrder {
    companyId: string;
    escrowNumber: string;
    signingType: string;
    closingDate: string;
    closingTime: string;
    signerName: string;
    signerPhone: string;
    signerEmail: string;
    signerSpouse: string;
    coSignerName: string;
    coSignerPhone: string;
    coSignerEmail: string;
    coSignerSpouse: string;
    additionalContacts: string;
    propertyAddressStreet1: string;
    propertyAddressStreet2: string;
    propertyAddressCity: string;
    propertyAddressState: string;
    propertyAddressZipcode: string;
    signingAddressStreet1: string;
    signingAddressStreet2: string;
    signingAddressCity: string;
    signingAddressState: string;
    signingAddressZipcode: string;
    signingAddressCompany: string;
    specialInstructions: string;
    languages: string;
    hasBeenImported: boolean;

}