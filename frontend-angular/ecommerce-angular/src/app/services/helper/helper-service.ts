import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../../common/country/country';
import { State } from '../../common/state/state';

@Service()
export class HelperService {

    private httpClient = inject(HttpClient);
    private countryUrl = "http://localhost:8080/api/countries";
    private stateUrl = "http://localhost:8080/api/states";

    // credit card years and months
  creditCardMonths = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" }
  ];
    getCreditCardMonths(startMonth: number) : Observable<{value : number, name : string}[]>{
        const months = this.creditCardMonths.filter(month => month.value >= startMonth);
        return of(months);
    }

    getCreditCardYears() : Observable<number[]>{
        let years: number[] = [];
        // build an array for the year drop down list

        const startYear: number = new Date().getFullYear();
        const endYear: number = startYear + 10;

        for(let year=startYear; year<=endYear; year++){
            years.push(year);
        }

        // wrap the object as an observable
        return of(years);
    }

    // get the list of countries
    getCountryList() : Observable<Country[]>{
       return this.httpClient.get<Country[]>(this.countryUrl);

    }

    // get the state list for a specific country code
    getStatesList(countryCode: string) : Observable<State[]>{
        const searchStateUrl = `${this.stateUrl}?countryCode=${countryCode}`;
        return this.httpClient.get<State[]>(searchStateUrl);
        
    }


}
