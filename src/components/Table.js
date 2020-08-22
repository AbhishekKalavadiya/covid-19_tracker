import React from 'react'
import {sortData} from './utils'
import './Table.css'

function Table({ countries }) {

    const sortedCountries = sortData(countries)

    return (
        <div className='table'>   
            {
                sortedCountries.map(({name, cases})=>(
                    <tr>
                        <td>{name}</td>
                        <td><strong>{cases}</strong></td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
