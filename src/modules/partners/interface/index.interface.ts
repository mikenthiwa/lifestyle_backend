export interface Partner {
  name: string;
  phoneNumber: string;
  email: string;
  logo: string;
  facebook: string;
  instagram: string;
  twitter: string;
  admin: Array<string>;
}

export interface PartnerUpdate {
  name?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  admin?: Array<string>;
}
