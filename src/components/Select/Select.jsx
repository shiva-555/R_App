import React, { useState, useEffect, useRef } from 'react';
import './Select.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import onClickOutside from "react-onclickoutside";



function checked(selectedOptions, option) {
    return selectedOptions.some((selected) => selected.value === option.value);
}

const Select = ({ options, setSelectedColumns, selectedColumns }) => {
    // const [selectedOptions, setSelectedOptions] = useState([]);
    const ref = useRef()
    const [toggleDropdown, setToggleDropdown] = useState(false);

    useEffect(() => {
        const checkIfClickedOutside = e => {
          // If the menu is open and the clicked target is not within the menu,
          // then close the menu
          if (toggleDropdown && ref.current && !ref.current.contains(e.target)) {
            setToggleDropdown(false)
          }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
          }
        }, [toggleDropdown]);   

    function handleChange(e) {
        setSelectedColumns((prev) => {
            let index = prev.findIndex((el) => {
                return el.value === e.target.value
            });
            if (index >= 0) {
                let arr = [...prev];
                arr.splice(index, 1);
                return arr;
            } else {
                let arr = [...prev, options.filter((option) => option.value === e.target.value)[0]];
                return arr;
            }
        });
    }

    return (
        <div className='container' ref={ref}>
            <div className='container__dropdownBlock' >
                <div className='container__dropdown' >
                    <div className='conatiner__dropdownLeft'>
                        <p>
                            {/* {selectedColumns.length > 1 ? selectedColumns.map((selected) => selected.label + ',') : 'Filter Columns'} */}
                            {selectedColumns.length < 1 ? 'Filter Columns' : selectedColumns.length > 1 ? ' Column ' + selectedColumns.length + '+' : selectedColumns.map((selected) => selected.label + ', ')}
                        </p>
                        <ul style={{ padding: selectedColumns.length > 0 ? '1%' : ''}}>
                            {selectedColumns.map((selected, i) =>
                                <p key={i}>
                                    {selected.label}
                                </p>
                            )}
                        </ul>
                    </div>

                    <div className='conatiner__dropdownRight'>
                        <ExpandMoreIcon className='container__icon' onClick={(e) => setToggleDropdown(!toggleDropdown)}/>
                    </div>
                    <div className='container__dropdownMiddle'>
                        {
                            toggleDropdown &&
                            <div className='container__list'>
                                {options.map((option, i) =>
                                    <div className='container__listItem' key={i}>
                                        <div className='Container__checkBox'>
                                            <input className='container__listInput' id={option.label} type='checkbox' defaultChecked={checked(selectedColumns, option)} value={option.value} onChange={(e) => handleChange(e)} />
                                        </div>
                                        <div className='Container__listlabel'>
                                            <label htmlFor={option.label}>{option.label}</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
};


export default Select;
