import React from "react";

interface PowerControlProps {
  power: number;
  setPower: React.Dispatch<React.SetStateAction<number>>;
}

const PowerControl: React.FC<PowerControlProps> = ({ power, setPower }) => {
  const increasePower = () => setPower((prev) => Math.min(prev + 1, 100));
  const decreasePower = () => setPower((prev) => Math.max(prev - 1, 0));

  return (
    <div className='section control'>
      <h2>Мощность</h2>
      <div className='row'>
        <span>Мощность:</span>
        <span>{power}%</span>
        <button onClick={increasePower}>+</button>
        <button onClick={decreasePower}>-</button>
      </div>
    </div>
  );
};

export default PowerControl;
