import { IonToast } from "@ionic/react";
import { useState } from "react";

export interface ToastProps {
  showToast: boolean;
  message: string;
  type: string;
  duration: number;
}

const ToastMsg: React.FC<ToastProps> = ({
  showToast,
  message,
  type,
  duration,
}) => {
  console.log(message);
  return (
    <IonToast
      isOpen={showToast}
      message={message}
      duration={duration}
      color={type}
    />
  );
};

export default ToastMsg;
