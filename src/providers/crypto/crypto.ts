import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDataProvider } from '../auth-data/auth-data';
declare var require: any;

@Injectable()
export class CryptoProvider {
  public globalmarketcap: string;
public mywatchlist: any[] = [];
public trending: any[] = [];
public  arrAllCrypto: any[] = [];
public   isWatchlistEmpty:boolean=true;
public first20crypto: any[] = [];
public tradeLink:string;
  // private readonly base_url: string = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms="
  // private readonly base_url_CONTINUE: string = "&tsyms="
  constructor(public http: HttpClient,public authData:AuthDataProvider) {
    this.getMarketcap();
    this.getlink();
  }

  getAllCrypto(): Promise<any> {
    return new Promise((resolve) => {
      if (this.arrAllCrypto.length < 1) {

      this.http.get("https://afternoon-mountain-15657.herokuapp.com/api/getAllCrypto").toPromise()
        .then((data: any[]) => {
          this.arrAllCrypto=data

          for (let index = 0; index <  this.arrAllCrypto.length; index++) {
  
            if( this.arrAllCrypto[index].likes >this.arrAllCrypto[index].unlikes ){
              
            this.arrAllCrypto[index]["Bullish"]=true;
            this.arrAllCrypto[index]["progreSbar"]=Number(( this.arrAllCrypto[index].likes /(this.arrAllCrypto[index].unlikes+this.arrAllCrypto[index].likes)*100).toFixed(2));
             } else
            this.arrAllCrypto[index]["progreSbar"]=Number(( this.arrAllCrypto[index].unlikes /(this.arrAllCrypto[index].unlikes+this.arrAllCrypto[index].likes)*100).toFixed(2));
            
            var a= parseInt(((index%6 ).toString()))          
            if(a >4)
              this.arrAllCrypto[index].isvip=true;
              
                   
                     }
                     this.getmyWatchList();
                     this.gettrending();
          // let index = 0;
          // for (const key in data) {
          //   if (this.cryptocurrencies[data[key]["fromSymbol"]] != undefined) {
          //     data[key]["name"] = this.cryptocurrencies[data[key]["fromSymbol"]];
          //     data[key]["shortName"] = data[key]["name"].split(" ")[0];
          //     data[key]["state"] = "none";
          //     data[key]["index"] = index;
          //     data[key]["logo"] = "https://cloud-marketing66.herokuapp.com/logo/" + (data[key]["fromSymbol"]);
          //     this.arrAllCrypto.push(data);
          //     index++;
          //   } 
          // }
          resolve(this.arrAllCrypto);

        }) }else{
          resolve(this.arrAllCrypto);

        }
    })
  }


addToWhachList(data){
  this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/addwatchlist",data).toPromise().then((data1)=>{
console.log(data1);

  })
}
deleteToWhachList(data){
  this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/deletewatchlist",data).toPromise().then((data1)=>{
console.log(data1);

  })
}
getmyWatchList(){  
  if(!this.authData.user._id)
  return
  this.mywatchlist=[]
  console.log(this.authData.user);
  
  for (let index = 0; index < this.authData.user.watchlist.length; index++) 
    for (let index2 = 0; index2 < this.arrAllCrypto.length; index2++) 
    if(this.authData.user.watchlist[index].pair == this.arrAllCrypto[index2].pair){
  this.mywatchlist.push(this.arrAllCrypto[index2])
  this.arrAllCrypto[index2]["isWatchlist"]=true;
}
if(this.mywatchlist.length > 0)
this.isWatchlistEmpty =false;
}
gettrending(){
  this.trending=[];
    for (let index = 0; index < this.arrAllCrypto.length; index++) 
    if(this.arrAllCrypto[index].change24 > 10 || this.arrAllCrypto[index].change24 < -10){
  this.trending.push(this.arrAllCrypto[index])
}
}
getMarketcap(){
  this.http.get("http://afternoon-mountain-15657.herokuapp.com/api/getMarketcap").toPromise()
  .then((Marketcap: any )=>{
 this.globalmarketcap=Marketcap.totalMarketcap;

  }).catch(err=>{
    console.error(err);
    
  })
}
updateEditInServer(watchlist){
    
  this.buildOrderAray(watchlist).then((data)=>{
  this.http.post("https://afternoon-mountain-15657.herokuapp.com/api/fixOrderOfWatchList", {_id:this.authData.user._id ,watchlist:data}).toPromise()
  .then((text) => {
  console.log(text);

  }).catch((err)=>{
    console.log(err);

  })
})
}
 buildOrderAray(watchlist){
  return new Promise((resolve, reject) => {
   var orderAray=[]
  for (let index = 0; index <watchlist.length; index++) 
orderAray.push({pair:watchlist[index].pair})
resolve(orderAray)
})
}

getlink(){
  this.http.get("http://afternoon-mountain-15657.herokuapp.com/api/getTradelink").toPromise()
  .then((text:any) => {
    console.log(text);
  this.tradeLink=text.link;
}).catch(err=>{
  console.error(err);
  
})
}
}