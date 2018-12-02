import { Component, OnInit } from '@angular/core';
import { ChartService } from '../chart_service/chart.service';
import { NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ChartPage } from '../../pages/chart/chart';

declare var CIQ: any;

declare var $$$: any;

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  providers: [ChartService],
})

export class ChartComponent implements OnInit {
  ciq: any;
  sampleData: any[];
  chartSeries: any[];

  constructor(
    public coin:ChartPage,
    public http: Http,
    public navParams: NavParams,
    private chartService: ChartService) {
    this.chartSeries = [];
  };

  ngOnInit() {
    this.ciq = new CIQ.ChartEngine({ container: $$$("#chartContainer") });
    this.ciq.setPeriodicityV2(1, 60);
    this.chartService.attachQuoteFeed(this.ciq);
// var symb = {
//   exchDisp: "none",
//   group: "crypto",
//   symbol: "BTC_USD"}
//   console.log("symb","symb");
console.log(this.coin.coin.pair,"coin");

  var symb = { symbol: this.coin.coin.pair.split("_")[0] + "/" + this.coin.coin.pair.split("_")[1], name: "Bitcoin", exchDisp: "AGG" };

   this.ciq.newChart(symb);
    
  }

  // https://angular.io/docs/ts/latest/api/core/index/OnDestroy-class.html
  ngOnDestroy() {
    // This will remove the quoteDriver, styles and
    // eventListeners for this ChartEngine instance.
    this.ciq.destroy();
  }

  getLayout() {
    return this.ciq.layout;
  }

  removeSeries(series) {
    var index = this.chartSeries.indexOf(series, 0);
    if (index > -1) {
      this.chartSeries.splice(index, 1);
    }
    this.ciq.removeSeries(series.display, this.ciq.ciq);
  }

  set(multiplier, span) {
    var params = {
      multiplier: multiplier,
      span: span,
    };
    this.ciq.setSpan(params, function () {
      console.log("span set");
    });
  };
}
