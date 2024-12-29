import React from "react";
import useStore from "./store/store";
import PauseControls from "./PauseControls";
import Pause from "./Pause";
import ProcessControls from "./ProcessControls";

const PauseManagement: React.FC = () => {
  const isAutomatic = useStore((state) => state.isAutomatic);
  const pauses = useStore((state) => state.pauses);

  if (!isAutomatic) {
    return null;
  }

  return (
    <div className="section pauses">
      <PauseControls />
      <div className="pause-list">
        {pauses.map((pause, index) => (
          <Pause key={index} index={index} />
        ))}
        {/* Управление процессом */}
        <ProcessControls />
      </div>
    </div>
  );
};

export default PauseManagement;
