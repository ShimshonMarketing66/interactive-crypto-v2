

declare var CIQ : any;

declare var quotefeedSimulator : any;

export class ChartService{

  constructor(){
    console.log("ChartService->constructor");
    // To implement your own quotefeed and see other methods of data loading, check out our tutorial: http://documentation.chartiq.com/tutorial-Data%20Loading.html
    CIQ.QuoteFeed.MyFeed=function (url) {
      this.url = url;    
    };
    console.log(quotefeedSimulator)
    // Inherit from the base feed
    CIQ.QuoteFeed.MyFeed.ciqInheritsFrom(CIQ.QuoteFeed);
  }

  attachQuoteFeed(chart): void {
    console.log("ChartService->attachQuoteFeed");
    
    chart.attachQuoteFeed(quotefeedSimulator, { refreshInterval: 1 })
  }
}
