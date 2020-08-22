import React, {useState, useEffect} from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core'
import './App.css';

function App() {

	const [countries, setCountries] = useState([])
	const [country, setCountry] = useState('worldwide')

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then(response => response.json())
				.then(data => {
					const countries = data.map(country => ({
						name: country.country,
						value: country.countryInfo.iso2
					}))
				setCountries(countries)
				})
		}
		getCountriesData()
	}, [])

	return (
		<div className="app">
			<div className='app__header'>
				<h1>COVID-19 TRACKER</h1>

				<FormControl className='app__dropdown'>
					<Select 
						onChange={e => setCountry(e.target.value)}
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

			{/* Info Boxes */}

			{/* Table */}
			{/* Graph */}

			{/* Map */}
		
		</div>
	);
}

export default App;
