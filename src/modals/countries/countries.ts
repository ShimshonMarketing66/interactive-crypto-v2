import { Component } from "@angular/core";
import { IonicPage, NavParams, ViewController } from "ionic-angular";
import { HttpClient } from "@angular/common/http";

@IonicPage({
    name: "countries"
})
@Component({
    selector: 'page-countries',
    templateUrl: 'countries.html',
})

export class Countries {
    timezonelist:  any[];
    timezonelistTMP:  any[];
    countriesTMP: any[];
    myInput: string;
    countriesFilePath: string = './assets/lot of data/countries.json';
    countries: any[]
    a : string
    b:string
    type:string;
    constructor(params: NavParams, public view: ViewController, public http: HttpClient) {
        this.type=params.get("type");
        if (params.get("type") == "country") {
            this.a = "name"
            this.b = "dial_code"
        }else if (params.get("type") == "dial_code") {
            this.a = "dial_code"; 
            this.b = "name"
        }
        if(this.type != "timezone"){
        this.http.get(this.countriesFilePath)
            .toPromise()
            .then((response) => {
                this.countries = response["countries"]
                this.countriesTMP = response["countries"]
            })
        }
        else{
            console.log("a");
            
            this.http.get('./assets/lot of data/timezone.json')
            .toPromise()
            .then((response) => {
                console.log(response);
                console.log(response["timezone"]);
                
               this.timezonelist=response["timezone"];
               this.timezonelistTMP=response["timezone"];

               
            })
        }
    }

    closeModal() {
        this.view.dismiss()
    }

    chooseCountry(i) {
        this.view.dismiss(this.countries[i])
    }

    getItems(ev: any) {
        let val = ev.target.value;
        if (val == undefined) {
            this.countries = this.countriesTMP
            return
        }
        console.log(val);
        console.log(this.countriesTMP);
        
        
        console.log(this.a);
        
        this.countries = this.countriesTMP.filter((item) => {
            return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }
    chooseTime(time){
        console.log( Object.keys(time)[0]);
        
        this.view.dismiss( Object.keys(time)[0])

    }
    getItemsTime(ev: any) {
        let val = ev.target.value;
        if (val == undefined) {
            this.timezonelist = this.timezonelistTMP
            return
        }
    
        
        this.timezonelist = this.timezonelistTMP.filter((item) => {
            item=Object.keys(item)[0]

            return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }
}