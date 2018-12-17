import * as Axios from 'axios';
import * as React from 'react';
import './App.css';


import logo from './logo.svg';

const ulBlockStyle: React.CSSProperties = { listStyleType: "none" }

const mainBlockStyle: React.CSSProperties = { width: "100%", backgroundColor: "red" }

const leftBlockStyles: React.CSSProperties = {
  backgroundColor: "pink", float: "left", width: "200px"
}

const rightBlockStyles: React.CSSProperties = {
  backgroundColor: "yellow", marginLeft: "200px"
}

interface IAppState {
  selectedEntry: string,
  newData: boolean
}

interface IFilmData {
  title: string,
  releaseDate: string
}

class App extends React.Component<any, IAppState>{

  private characters: string[] = [];
  // private details: Map<string, string[]>;
  private personData: any;
  private filmsData: any;
  private characterToFilms: Map<string, string[]>;
  private filmUrlToFilmData: Map<string, IFilmData>

  constructor(props: any) {
    super(props);
    this.loadData();
    this.characterToFilms = new Map<string, string[]>()
    this.filmUrlToFilmData = new Map<string, IFilmData>()
    this.state = {
      newData: false,
      selectedEntry: this.characters.length > 0 ? this.characters[0] : "",

    }
  }

  public loadData() {
    Axios.default.get("https://swapi.co/api/people/")
      .then((response) => {
        this.personData = response.data.results;
        this.personData.map((obj: any) => {
          this.characterToFilms.set(obj.name, obj.films)
        })
        this.characters = Array.from(this.characterToFilms.keys())
        this.setState(
          { newData: !this.state.newData }
        )
      })
    Axios.default.get("https://swapi.co/api/films/")
      .then((response) => {
        this.filmsData = response.data.results;
        this.filmsData.map((obj: any) => {
          this.filmUrlToFilmData.set(obj.url, { title: obj.title, releaseDate: obj.release_date })
        })
        this.setState(
          { newData: !this.state.newData }
        )
      })
  }

  public render() {
    const allEntries = this.characters.map(this.mapEntry);
    // tslint:disable:no-console 
    // console.log(this.details);
    const value = this.characterToFilms.get(this.state.selectedEntry);
    const description = !value ? undefined : value.map((url) => {
      const filmData = this.filmUrlToFilmData.get(url);
      return (
        <div key={url}>
          <span>{filmData ? filmData.title : ""}</span>
          <span>{filmData ? filmData.releaseDate : ""}</span>
        </div>
      )
    });
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div style={mainBlockStyle}>
          <div style={leftBlockStyles}>
            <ul style={ulBlockStyle}>
              {allEntries}
            </ul>

          </div>
          <div style={rightBlockStyles}>
            {description}
          </div>
        </div>

      </div>
    );
  }

  private mapEntry = (entry: string): JSX.Element => {
    return <li key={entry}><button onClick={this.selectItem.bind(this, entry)}>{entry}</button></li>
  }

  private selectItem = (entry: string) => {
    this.setState({ selectedEntry: entry })
  }

}

export default App;
