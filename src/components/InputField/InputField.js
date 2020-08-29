import React from 'react'
import inputFieldStyles from './inputField.module.css'


export default function InputField({ type, value, onChange, placeHolder }) {
  return <input
    className={inputFieldStyles.inputField}  
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeHolder}
  />
}