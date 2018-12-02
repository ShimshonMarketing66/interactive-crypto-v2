import { NgModule } from '@angular/core';
import { CurrencySymbolPipe } from './currency-symbol/currency-symbol';
import { RmPointPipe } from './rm-point/rm-point';
import { TofixePipe } from './tofixe/tofixe';
import { ToFixeNumberPipe } from './to-fixe-number/to-fixe-number';
import { KeyPipe } from './key/key';
import { SplitPipe } from './split/split';
import { TosymbolPipe } from './tosymbol/tosymbol';

@NgModule({
	declarations: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe,ToFixeNumberPipe,
    KeyPipe,
    SplitPipe,
    TosymbolPipe],
	imports: [],
	exports: [CurrencySymbolPipe,
    RmPointPipe,TofixePipe,ToFixeNumberPipe,
    KeyPipe,
    SplitPipe,
    TosymbolPipe]
})
export class PipesModule {}
