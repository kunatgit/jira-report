// components/CustomToast.js

import { useToast } from "@chakra-ui/react";

const CustomToast = ({ title, description, status, duration = 3000 }) => {
  const toast = useToast();

  const showToast = () => {
    toast({
      title: title,
      description: description,
      status: status, // "success", "error", "warning", "info"
      duration: duration,
      isClosable: true,
    });
  };

  return (
    <button onClick={showToast}>
      Show {status} Toast
    </button>
  );
};

export default CustomToast;
