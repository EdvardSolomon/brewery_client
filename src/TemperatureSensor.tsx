import React from "react";

interface TemperatureSensorProps {
  label: string;
  temperature: string;
  address: string;
}

const TemperatureSensor: React.FC<TemperatureSensorProps> = ({
  label,
  temperature,
  address,
}) => {
  return (
    <div className='row'>
      <span>{label}:</span>
      <span>{`${temperature} °C`}</span>
      {address && <span className='sensor-address'>{`(${address})`}</span>}
    </div>
  );
};

export default TemperatureSensor;
