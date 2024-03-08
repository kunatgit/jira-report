import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { TypeAnimation } from "react-type-animation";
import DefaultLayout from "../defaultLayout";

const Loading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    width="100%"
    position="fixed"
    flexDirection="column"
    top="0"
    left="0"
    zIndex="9999"
  >
    <Spinner size="xl" color="blue.500" />
    <br></br>
    <Text fontSize='xl'>
      <TypeAnimation
        sequence={["กรุณารอสักครู่ .....", 500, "กรุณารอสักครู่", 500, "กรุณารอสักครู่ .....", 500]}
        cursor={true}
        repeat={Infinity}
      />
    </Text>
  </Box>
);

export default Loading;
