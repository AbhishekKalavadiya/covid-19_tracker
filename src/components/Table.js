import React from 'react'
import {sortData} from './utils'
import numeral from 'numeral'
import './Table.css'

function Table({ countries }) {

    const sortedCountries = sortData(countries)

    return (
        <div className='table'>   
            {
                sortedCountries.map(({name, cases})=>(
                    <tr>
                        <td>{name}</td>
                        <td><strong>{numeral(cases).format("0,0")}</strong></td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
