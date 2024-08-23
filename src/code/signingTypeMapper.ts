export function mapSigningType(signingType: string) {
    switch (signingType) {
        case 'HUD Partial Claim':
            return '*HUD Partial Claim - $87.00';

        case 'HUD Partial Claim w/1 witness':
            return '*HUD Partial Claim w/1 witness - $127.00';

        case 'HUD Partial Claim w/2 witnesses':
            return '*HUD Partial Claim w/2 witnesses - $167.00';

        case 'Loan Mod. And HUD Partial Claim':
            return '*Loan Mod. and HUD Partial Claim - $107.00';

        case 'Loan Mod. And HUD Partial Claim w/1 witness':
            return '*Loan Mod. and HUD Partial Claim w/1 witness - $147.00';

        case 'Loan Mod. And HUD Partial Claim w/2 witnesses':
            return '*Loan Mod. and HUD Partial Claim w/2 witnesses - $187.00';

        case 'Loan Modification Agreement':
            return '*Loan Modification Agreement - $87.00';
            
        default:
            return '';
    }
}