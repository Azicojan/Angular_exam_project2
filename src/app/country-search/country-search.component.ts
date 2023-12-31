

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import axios from 'axios';

interface CountryData {
  name: any;
  flags: { [key: string]: string };
  capital: string;
  continents: string;
  population: number;
  currencies: { [code: string]: { name: string, symbol: string } };
  currencyName?: string;
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
  countryName = new FormControl('');
  filteredCountries!: Observable<string[]>;


  countryData: CountryData | null = null;
  currencyName!: string;
  languageName!: string;
  showWarning: boolean = false;
  countries!: any[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Initialize the filtered countries observable
    this.filteredCountries = this.countryName.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCountries(value))
    );

    // Fetch the list of countries and populate the array
    this.fetchCountries();


  }

  searchCountry() {
    const country = this.countryName.value;
    if (country) {
      this.countryData = null; // Clear previous data
      this.showWarning = false; // Hide the warning message

      // Fetch country data by name
      this.http.get<CountryData[]>(`https://restcountries.com/v3.1/name/${country}`)
        .subscribe(
          data => {
            if (data.length > 0) {
              this.countryData = data[0];
              this.retrieveCurrencyName();
              this.retrieveLanguageName();
            } else {
              this.countryData = { notFound: true } as CountryData;
            }
          },
          error => {
            this.countryData = { notFound: true } as CountryData;
          }
        );
    } else {
      this.showWarning = true; // Display the warning message
    }
  }



  fetchCountries() {
    this.http.get<any[]>('https://restcountries.com/v3.1/all')
      .subscribe(countries => {
        this.countries = countries.map(country => country.name.common).sort();
      });
  }


  filterCountries(value: string | null): string[] {
    if (!value) {
      return this.countries;
    }
    const filterValue = value.toLowerCase();
    return this.countries.filter((country: string) =>
      country.toLowerCase().includes(filterValue)
    );
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

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchCountry();
    }
  }


}
