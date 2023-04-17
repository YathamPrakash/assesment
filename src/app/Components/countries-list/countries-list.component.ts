import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.css']
})
export class CountriesListComponent implements OnInit {
    currentYear=new Date().getFullYear()
  countryInfo: any;
  countryLanguages: any;
  countryCurrency: any;
  isLoading = true
  Countries: any = [];
  sortedCountries: any = [];
  lastIndex: any
  search = "";
  DisplayedCountries: any = [];
  pageSize = 25; // The number of items to show per page
  currentPage = 0; // The current page number
  isShowSearchbtn = false;
  constructor(private http: HttpClient) { }

  ngOnInit() {

    console.log(this.countryInfo, "fgfghj,k.")
    this._doGetCountries();
  }
  _doOpenModal(country: any) {
    $('#myModal').modal('show');
    console.log(country,"country")
    this.countryInfo = country;
    console.log(country.currencies, "currencies")
    console.log(country.languages, "languages")
    this.countryLanguages = Object.keys(country.languages).map(key => country.languages[key]);
    console.log(this.countryLanguages, "this.countryLanguages")
    this.countryCurrency = Object.entries(country.currencies).map(([key, value]) => ({ code: key, value }));
    console.log(this.countryCurrency[0].value.name, "this.countryCurrency");
 
  }

 

  _doCloseModal() {
    $('#myModal').modal('hide');
  }

  _doDetectSearch() {
    if (this.search == "") {
      this.isShowSearchbtn = false;
      this._doGetCountries();
    }
    else {
      this.isShowSearchbtn = true;

    }
    console.log(this.search, "search")
  }

  _doGetCountries() {
    this.isLoading = true
    this.http.get(' https://restcountries.com/v3.1/all').subscribe(
      (response: any) => {
        this.Countries = response;
        // Sort the array of objects based on the "name" parameter
        this.sortedCountries = this.Countries.sort((a: { name: { common: string; }; }, b: { name: { common: any; }; }) => a.name.common.localeCompare(b.name.common));
        this._doGetCurrentPageData()
      },
      (error) => {
        console.error(error);
      }
    );
  }

  _doGetCurrentPageData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.lastIndex = endIndex
    console.log(this.lastIndex, this.sortedCountries.length, "indexes")

    this.DisplayedCountries = this.sortedCountries.slice(startIndex, endIndex);
    this.isLoading = false;
    console.log(this.DisplayedCountries, "DisplayedCountries")

  }
  previousPage() {
    if (this.currentPage >= 1) {
      this.currentPage--;
      this._doGetCurrentPageData()
    }
  }


  nextPage() {
    const lastPage = Math.ceil(this.Countries.length / this.pageSize);
    if (this.currentPage < lastPage) {
      this.currentPage++;
      this._doGetCurrentPageData();
    }
  }

  _doSearch() {
    this.http.get(`https://restcountries.com/v3.1/name/${this.search}`).subscribe(
      (response: any) => {
        console.log(response, "responseeee")
        this.Countries = response;
        // Sort the array of objects based on the "name" parameter
        this.sortedCountries = this.Countries.sort((a: { name: { common: string; }; }, b: { name: { common: any; }; }) => a.name.common.localeCompare(b.name.common));
        this._doGetCurrentPageData()
      },
      (error) => {
        console.log(JSON.stringify(error.statusText), "error");
        alert(JSON.stringify((error.statusText) + `,  please search with country name`))
      }
    );
  }

}

