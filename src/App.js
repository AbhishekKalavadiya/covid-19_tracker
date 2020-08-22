import React, {useState, useEffect} from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core'
import Map from './components/Map'
import InfoBox from './components/InfoBox'
import {Card, CardContent} from '@material-ui/core'
import Table from './components/Table'
import LineGraph from './components/LineGraph'
import './App.css';

function App() {

	const [countries, setCountries] = useState([])
	const [country, setCountry] = useState('worldwide')
	const [countryInfo, setCountryInfo] = useState({})

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
					console.log(data)
				setCountries(countries)
				})
		}
		getCountriesData()
	}, [])

	// console.log(countries)

	const onCountryChange = async(e) => {
		const countryCode = e.target.value

		const url = countryCode === 'worldwide' 
			? 'https://disease.sh/v3/covid-19/all'
			: `https://disease.sh/v3/covid-19/countries/${countryCode}`

		await fetch(url)
			.then(response => response.json())
			.then(data => {
				
				setCountry(countryCode)
				setCountryInfo(data)
		})
		
	}
	console.log("info >>>>", countryInfo )


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
							<MenuItem value={country}>Worldwide</MenuItem>
							{
								countries.map(country => (
									<MenuItem value={country.value}>{country.name}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				
				</div>
				<div className="app__stats">
					<InfoBox title={"Active Cases"} cases={countryInfo.todayCases} total={countryInfo.cases}/>
					<InfoBox title={"Recovered"} cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
					<InfoBox title={"Deaths"} cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
				</div>

				{/* Map */}
				<Map />
			</div>

			<Card className='app__right'>
				<CardContent>
					<h3>Live cases bby countries</h3>
					<Table countries={countries}/>
					<h3>world wide graph</h3>
					<LineGraph />
				</CardContent>
			</Card>				

		</div>
	);
}

export default App;
