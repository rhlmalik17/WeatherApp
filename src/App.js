import React from 'react';
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class App extends React.Component {
  constructor()
  {
    super();
    this.state={
      isShowing: false,
      searchValue: '',
      cityNotFound: false,
      placeholder: 'Enter City Name...',
      showDetails: false,
      Data: {

      },
      commentValue: '',
      count: 0,
      comments: []

    }
    this.ShowDialogue = this.ShowDialogue.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange=(e)=>{
    this.setState({searchValue: e.target.value , cityNotFound: false , showDetails: false, isShowing: false , placeholder: 'Enter City Name...'});
  }
  WeatherDetails = () =>{
    if(this.state.showDetails){
      var d = new Date().getDay();
      var day='';
      var obj = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
      switch(d)
      {
        case 1:
        day='Mon';
        break;

        case 2:
        day='Tue';
        break;

        case 3:
        day='Wed';
        break;

        case 4:
        day='Thu';
        break;

        case 5:
        day='Fri';
        break;

        case 6:
        day='Sat';
        break;

        case 7:
        day='Sun';
        break;

        default:
        break;
      }
      var date = '0'+obj.getDate();
      var deg = this.state.Data.main.temp - 273.15;
      var sunrise = new Date(this.state.Data.sys.sunrise * 1000);
      var sunset = new Date(this.state.Data.sys.sunset * 1000);
      return (
        <div className={'weatherBox'}>
          <div className={'temperature'}>
              <div className={'cityName'}>
                <span className="innerText">{this.state.Data.name+', '+
                this.state.Data.sys.country+', '
                + day +' '+monthNames[obj.getMonth()]+' '
                +date.slice(-2)+' '+obj.getFullYear()
                }</span>
              </div>
              <div className={'temperatureDetails'}>
                <span className="degreesInCelcius">{deg.toFixed(1)+'°C '
                }</span>
                <img className={'weatherIcon'} src={'http://openweathermap.org/img/wn/'+this.state.Data.weather[0].icon+'@2x.png'} alt={''}/>
              </div>
          </div>
          <div className={'otherDetails'}>
            <div>
              <p className="key">Weather: <span className="value">
              {this.state.Data.weather[0].main}</span></p>
              <p className="key">Wind: <span className="value">
                { (this.state.Data.wind.speed*3.6).toFixed(1)+' km/hr' }
              </span></p>
            </div>

            <div>
              <p className="key">Humidity: <span className="value">
                {this.state.Data.main.humidity+'%'}
              </span></p>
              <p className="key">Pressure: <span className="value">
                {this.state.Data.main.pressure+'pa'}
              </span></p>
            </div>

            <div>
              <p className="key">Max Temp: <span className="value">
                {Math.floor((this.state.Data.main.temp_max - 273.15))+'°C'}
              </span></p>
              <p className="key">Min Temp: <span className="value">
              {Math.floor((this.state.Data.main.temp_min - 273.15))+'°C'}
              </span></p>
            </div>

            <div>
              <p className="key">Sunrise: <span className="value">
                {('0'+sunrise.getHours()).slice(-2)+':'+sunrise.getMinutes()+':'+sunrise.getSeconds()}
              </span></p>
             <p className="key">Sunset: <span className="value">
                {('0'+sunset.getHours()).slice(-2)+':'+sunset.getMinutes()+':'+('0'+sunset.getSeconds()).slice(-2)}
             </span></p>
            </div>
          </div>
        </div>
      );
    }
    return <div></div>
  }
  getComment= (e)=>{
    this.setState({ commentValue: e.target.value });
  }
  addComment= () =>{
    if(this.state.commentValue)
    {
      var oldCount= this.state.count;
      this.state.comments[this.state.count]=this.state.commentValue;
      this.setState({ count:  ++oldCount, commentValue: ''});
    }
    else {
      alert('This Field Cannot be Empty')
    }
  }
  CommentBox = () =>{
    if(this.state.showDetails)
    {
      return (
        <div className={'commentBox'}>
        <div style={{ marginTop: '10px' }}>
        <textarea rows="4" cols="105" placeholder="Enter you comment here..." className="commentInput" value={this.state.commentValue} onChange={this.getComment}>
        </textarea>
        <button className="Comment" onClick={()=> this.addComment()}>Comment</button>
        </div>
        <div className={'commentCount'}>
          <p className={'classText'}>Comments ({this.state.count})</p>
          <div className={'myComments'}>
            {
              this.state.comments.map((t)=>{
                return (
                  <div className={'orientation'}>
                    <img className={'icon'} src={require('./user-solid.svg')} alt={'None'} />
                    <p>{t}</p>
                  </div>
                );
              })
            }
          </div>
        </div>
        </div>
      );
    }
    return <div></div>
  }

  ShowDialogue = () =>
  {
    if(this.state.isShowing)
    {
     fetch('https://api.openweathermap.org/data/2.5/weather?q='+this.state.searchValue+'&appid=572c4e1cb0454e46e83941169222835d')
      .then((response)=>{
        if (!response.ok) {
           throw Error(response.statusText);
       }
        return response.json();
      })
      .then((data)=>{
        if(data.message!=='city not found')
        {
            this.setState({ isShowing : false, placeholder: data.name, searchValue: '', showDetails: true, Data: data});
        }
      })
      .catch((error)=>{
        this.setState({ cityNotFound: true , showDetails: false });
      })
      ;
      return (
        <div className={'searchBox'}>
          <span className={'searchText'}>{ (this.state.cityNotFound) ? 'City Name not found' : 'Searching City name...'}</span>
        </div>
      );
    }
    else {
      return <div></div>
    }
  }
  render()
  {
    return (
      <div>
        {/*Header*/}
        <div className={'parentHeader'}>
        <div className={'strip'} />
          <div className={'header'}>
            <span className={'textStyling'}>Weather App</span>
          </div>
        </div>
        {/*Search*/}
        <div className={'searchBar'}>
          <input type="text" className={'cityInput'} onChange={this.handleChange} value={this.state.searchValue} placeholder={this.state.placeholder}/>
          <button value="Search" name="Search" onClick={()=> this.setState({ isShowing: true, showDetails: false })} className={'citySearch'}>Search</button>
        </div>
        <this.ShowDialogue />
        <div className={'MainBody'}>
          <this.WeatherDetails />
          <this.CommentBox />
        </div>
      </div>
    )
  }
}

// https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=YOUR_API_KEY
// <div className={'orientation'}>
//   <img className={'icon'} src={require('./user-solid.svg')} alt={'None'} />
//   <p>Weather is nice</p>
// </div>
