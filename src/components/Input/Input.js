import React from 'react'
import './Input.scss';


const Input = ({ type, value, onChange, placeHolder }) => (
  <input   
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeHolder}
  />
)


export default Input
