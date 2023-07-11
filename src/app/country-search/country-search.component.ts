



import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface CountryData {
  name: any;
  flags: { [key: string]: string };
  capital: string;
  continents: string;
  population: number;
  currencies: { [code: string]: { name: string, symbol: string } };
  currencyName?: string; // Updated property name
  languages: { [code: string]: string };
  languageName?: string;
  notFound?: boolean;
}

@Component({
  selector: 'app-country-search',
  templateUrl: './country-search.component.html',
  styleUrls: ['./country-search.component.css']
})
export class CountrySearchComponent {
  countryName!: string;
  countryData: CountryData | null = null;
  currencyName!: string; // Updated property name
  languageName!: string;
  showWarning: boolean = false; // Added flag

  constructor(private http: HttpClient) { }

  searchCountry() {

    if (!this.countryName) {
      this.showWarning = true;
      return;
    }
    this.showWarning = false; // Reset the flag


    this.countryData = null; // Clear previous data
    this.http.get<CountryData[]>(`https://restcountries.com/v3.1/name/${this.countryName}`)
      .subscribe(data => {
        if (data.length > 0) {
          this.countryData = data[0];
          console.log(this.countryData);
          this.retrieveCurrencyName();
          this.retrieveLanguageName();
        } else {
          this.countryData = { notFound: true } as CountryData;
        }
      },
      error => {
        this.countryData = {notFound: true} as CountryData;
      });
  }

  private retrieveCurrencyName() {
    const currencyCodes = Object.keys(this.countryData?.currencies || {});
    if (currencyCodes.length > 0) {
      const currencies = currencyCodes.map(code => {
        const currency = this.countryData?.currencies?.[code];
        return `${currency?.name} (${currency?.symbol})`;
      });
      this.currencyName = currencies.join(', ');
    }
  }


  private retrieveLanguageName() {
    const languageCodes = Object.keys(this.countryData?.languages || {});
    if (languageCodes.length > 0) {
      const languages = languageCodes.map(code => this.countryData?.languages?.[code]);
      this.languageName = languages.join(', ');
    }
  }



}

