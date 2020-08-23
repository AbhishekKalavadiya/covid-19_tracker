import React, {useState, useEffect} from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core'
import Map from './components/Map'
import InfoBox from './components/InfoBox'
import {Card, CardContent} from '@material-ui/core'
import Table from './components/Table'
import LineGraph from './components/LineGraph'
import { prettyPrintStat } from './components/utils'
import "leaflet/dist/leaflet.css";
import './App.css';

function App() {

	const [countries, setCountries] = useState([])
	const [country, setCountry] = useState('worldwide')
	const [countryInfo, setCountryInfo] = useState({})
	const [mapCountries, setMapCountries] = useState([]);
	const [mapCenter,setMapCenter] = useState({lat: 20.5937, lng: 78.9629})
	const [mapZoom, setMapZoom] = useState(3)
	const [casesType, setCasesType] = useState('cases')

	useEffect(()=>{
		fetch("https://disease.sh/v3/covid-19/all")
			.then(response => response.json())
			.then(data => {
				setCountryInfo(data)
			}) 
	}, [])

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then(response => response.json())
				.then(data => {
					const countries = data.map(country => ({
						name: country.country,
						value: country.countryInfo.iso2,
						cases: country.cases
					}))
				setCountries(countries)
				setMapCountries(data);
				})
		}
		getCountriesData()
	}, [])


	const onCountryChange = async(e) => {
		const countryCode = e.target.value

		const url = (countryCode === 'worldwide' )
			? (<div>
				{await fetch("https://disease.sh/v3/covid-19/all")
					.then(response => response.json())
					.then(data => {
						setCountryInfo(data)
						setCountry('worldwide')
						setMapCenter({lat: 20.5937, lng: 78.9629})
					})}
				</div>)

			: (<div>{await fetch(`https://disease.sh/v3/covid-19/countries/${countryCode}`)
						.then(response => response.json())
						.then(data => {
							setCountry(countryCode)
							setCountryInfo(data)
							setMapCenter([data.countryInfo.lat, data.countryInfo.long])
					})}
				</div>)	
	}

	return (
		<div className="app">

			<div className='app__left'>
				<div className='app__header'>
					<h1>COVID-19 TRACKER</h1>

					<FormControl className='app__dropdown'>
						<Select 
							onChange={onCountryChange}
							value={country}
							variant='outlined'
						>
							<MenuItem value='worldwide'>Worldwide</MenuItem>
							{
								countries.map(country => (
									<MenuItem value={country.value}>{country.name}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				
				</div>
				<div className="app__stats">

					<InfoBox 
						isBlue
						active={casesType==='cases'}
						onClick={e => setCasesType('cases')}
						title={"Active Cases"} 
						cases={prettyPrintStat(countryInfo.todayCases)} 
						total={prettyPrintStat(countryInfo.cases)}/>

					<InfoBox
						active={casesType==='recovered'}
						onClick={e => setCasesType('recovered')} 
						title={"Recovered"} 
						cases={prettyPrintStat(countryInfo.todayRecovered)} 
						total={prettyPrintStat(countryInfo.recovered)}/>

					<InfoBox
						isRed
						active={casesType==='deaths'}
						onClick={e => setCasesType('deaths')}	 
						title={"Deaths"} 
						cases={prettyPrintStat(countryInfo.todayDeaths)} 
						total={prettyPrintStat(countryInfo.deaths)}/>

				</div>

				{/* Map */}
				<Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
			</div>

			<Card className='app__right'>
				<CardContent>
					<h3>Live cases bby countries</h3>
					<Table countries={countries}/>
					<br /><hr/><br/>
					<h3 className='app__graphTitle'>Worldwide New {casesType}</h3>
					<LineGraph casesType={casesType}/>
				</CardContent>
			</Card>				

		</div>
	);
}

export default App;
