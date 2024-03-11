import {
  Avatar,
  Box,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Slide,
  Text,
  VStack,
} from "@chakra-ui/react";

function DefaultLayout({ body }) {
  return (
    <Box backgroundColor="blue.50">
      <Container
        maxW="2xl"
        height="100vh"
        // padding={{ base: "5", sm: "5", md: "10" }}
        backgroundColor={'white'} 
      >
        {body}
      </Container>
      <Slide direction='bottom' in={true} style={{ zIndex: 1 }}>
        <Box
          p='8px'
          color='black'
          bg='blue.500'
        >
          <Center>
            <Text fontSize={'sm'} color={'white'}>
              สอบถามการใช้งานเพิ่มเติม : IT-Partner@thailife.com
            </Text>
          </Center>
        </Box>
      </Slide>
    </Box>
  );
}

export default DefaultLayout;
