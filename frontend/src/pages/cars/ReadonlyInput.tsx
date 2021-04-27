import React from "react";
import "./cars.css";

interface Props {
  id: string;
  label: string;
  content: string;
}

const ReadonlyInput = ({ id, label, content }: Props) => {
  return (
    <div>
      <label htmlFor='label'>{label}</label>
      <div className='car-readonly-input-content' id='id'>
        {content}
      </div>
    </div>
  );
};

export default ReadonlyInput;
