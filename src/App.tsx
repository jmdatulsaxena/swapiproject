import * as Axios from 'axios';
import * as dateFormat from 'dateformat';
import * as React from 'react';
import { ListGroup, ListGroupItem, Table } from 'react-bootstrap'
import './App.css';


import logo from './logo.svg';

const styleLeftAlign: React.CSSProperties = { textAlign: "left" }

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
    const value = this.characterToFilms.get(this.state.selectedEntry);
    const description = !value ? undefined : value.map((url) => {
      const filmData = this.filmUrlToFilmData.get(url);
      
      let dateStr = '';
      if (filmData && filmData.releaseDate) {
        dateStr = dateFormat(new Date(filmData.releaseDate), 'dddd, mmmm dS, yyyy');
      }
      return (
        <tr key={url}>
          <td style={styleLeftAlign}>{filmData ? filmData.title : ""}</td>
          <td style={styleLeftAlign}>{filmData ? dateStr : ""}</td>
        </tr>
      )
    });
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to StarWars</h1>
        </header>
        <div>
          <div>
            <ListGroup>
              {allEntries}
            </ListGroup>
          </div>
          <Table striped={true} bordered={true} condensed={true} hover={true}>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Released Date</th>
              </tr>
            </thead>
            <tbody>
              {description}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }

  private mapEntry = (entry: string): JSX.Element => {
    return <ListGroupItem key={entry} onClick={this.selectItem.bind(this, entry)}>{entry}</ListGroupItem>
  }

  private selectItem = (entry: string) => {
    this.setState({ selectedEntry: entry })
  }

}

export default App;
