import { CountryModel } from "./country-model";

export class Profile {
    email:string;
    password?:string;
    country?:string;
    dial_code?:string;
    first_name?:string;
    last_name?:string;
    phone_number?:string;
    _id?:string;
    provider?:string;
    verify_code?:string;
    is_phone_number_verified?:boolean = false;
    platform?:string;    
    notificationId?:string;
    date?:string;
    countryData: CountryModel = new CountryModel();
    watchlist:any[];
    likes:any[];
    unlikes:any[];
    state:string;
}