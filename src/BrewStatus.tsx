import React from "react";

interface BrewStatusProps {
  status: string;
}

const BrewStatus: React.FC<BrewStatusProps> = ({ status }) => {
  return (
    <div className='section status'>
      <h2>Статус варки</h2>
      <p>{status}</p>
    </div>
  );
};

export default BrewStatus;
