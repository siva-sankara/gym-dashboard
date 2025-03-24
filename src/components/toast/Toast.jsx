import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const successSound = new Audio(require('./notificationOne.wav'));

export const showToast = ({
  type = 'success',
  message,
  playSound = true,
  duration = 3000,
  position = "top-right"
}) => {
  const toastConfig = {
    position,
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    onOpen: () => playSound && successSound.play()
  };

  switch (type) {
    case 'success':
      toast.success(message, toastConfig);
      break;
    case 'error':
      toast.error(message, toastConfig);
      break;
    case 'info':
      toast.info(message, toastConfig);
      break;
    case 'warning':
      toast.warning(message, toastConfig);
      break;
    default:
      toast(message, toastConfig);
  }
};