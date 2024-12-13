import React from "react";

interface TimeControlProps {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}

const TimeControl: React.FC<TimeControlProps> = ({ time, setTime }) => {
  const increaseTime = () => setTime((prev) => prev + 1);
  const decreaseTime = () => setTime((prev) => Math.max(prev - 1, 0));

  return (
    <div className='section control'>
      <h2>Время</h2>
      <div className='row'>
        <span>Время:</span>
        <span>{time}м</span>
        <button onClick={increaseTime}>+</button>
        <button onClick={decreaseTime}>-</button>
      </div>
    </div>
  );
};

export default TimeControl;
