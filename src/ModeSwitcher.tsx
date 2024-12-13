import React from "react";

interface ModeSwitcherProps {
  isAutomatic: boolean;
  setIsAutomatic: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  isAutomatic,
  setIsAutomatic,
}) => {
  const handleClick = () => setIsAutomatic(!isAutomatic);

  return (
    <div className='mode-switcher'>
      <button
        onClick={handleClick}
        className='mode-button'
      >
        {isAutomatic ? "Автоматический режим" : "Ручной режим"}
      </button>
    </div>
  );
};

export default ModeSwitcher;
