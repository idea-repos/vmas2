import * as React from 'react';


type InputProps = {
    name: string;
    label : string;
    type : string;
    value? : number | string;
    placeHolder? : string;
    error? : string | null;
    ref? : any;
    required?:boolean
    onChange? : (e:React.ChangeEvent<HTMLInputElement>) => void;

};


function Input({name, label, value, type, onChange, placeHolder, error, ref, required} : InputProps) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input 
                className="form-control" 
                type={type}
                id={name}
                ref={ref}
                name={name}
                placeholder={placeHolder}
                onChange={onChange}
                value={value}
                required={required}
            />
            {error && <div className="alert alert-danger my-1">{error}</div>}
        </div>
    );
};

export default Input;