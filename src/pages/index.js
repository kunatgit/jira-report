import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Checkbox,
  Collapse,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import DefaultLayout from "@/components/defaultLayout";
import { DownloadIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { TypeAnimation } from "react-type-animation";
import axios from "axios";

function MyApp() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState(true);
  const toast = useToast()
  const myBoxRef = useRef(null);
  const [apiPass, setAPIPass] = useState(false);
  const [verify, setVerify] = useState(false);
  const [isStartDate, setIsStartDate] = useState(false);
  const [isEndDate, setIsEndDate] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [dataShow, setDataShow] = useState({
    data: [],
    file: "",
    sumAll: 0
  });

  // const [host, setHost] = useState("https://tlidigitalgroup.atlassian.net");
  // const [apiToken, setApiToken] = useState("ATATT3xFfGF0XBDIrxQLUdGelZGSDU2ESxkTGNsyhZ0jF7jRxIqkwVYwuHCS5iwIz6PfNtdlnYnGsINg-mPCuadZ-FcVEVW9JSr7ZgNjEzWIWSknpq0s80-U63FdfmrKgBzTsYfUKP31BPUYYIizewwVIB4V9zC8a-gdLZhJGAa8FAHqxkARKFo=6F46AFAF");
  // const [emailJira, setEmailJira] = useState("kunat.kam@thailife.com");
  // const [startDate, setStartDate] = useState("2024-02-01");
  // const [endDate, setEndDate] = useState("2024-02-29");

  // function apiNotPass() {
  //   setAPIPass(false)
  //   // setStartDate("")
  //   setIsStartDate(false)
  //   // setEndDate("")
  //   setIsEndDate(false)
  // }

  const [host, setHost] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [emailJira, setEmailJira] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remember, setRemember] = useState(false);

  function apiNotPass() {
    setAPIPass(false)
    setStartDate("")
    setIsStartDate(false)
    setEndDate("")
    setIsEndDate(false)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    var storedData = localStorage.getItem('jira_personal_info');
    storedData = JSON.parse(storedData)
    if(storedData && storedData.host && storedData.apiToken && storedData.emailJira){
      setHost(storedData.host)
      setApiToken(storedData.apiToken)
      setEmailJira(storedData.emailJira)
      setRemember(true)
    }
    console.log("==>",storedData)


    return () => clearTimeout(timeout);
    
  }, []);

  useEffect(() => {
    console.log("host = ", host)
    console.log("apiToken = ", apiToken)
    console.log("emailJira = ", emailJira)

    apiNotPass()
  }, [host, apiToken, emailJira]);

  const scroll = () => {
    if (myBoxRef.current) {
      myBoxRef.current.scrollIntoView({
        behavior: 'smooth', // หรือ 'auto' หากต้องการให้มีการเลื่อนอย่างทันที
        block: 'start', // หรือ 'end' หากต้องการให้ Box ปรากฏที่ด้านบนหรือด้านล่างของหน้าจอ
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scroll();
    }, 300); 
  }, [apiNotPass]);

  useEffect(() => {
    var check = !checkDateFormat(startDate)
    setIsStartDate(check)
  }, [startDate]);

  useEffect(() => {
    var check = !checkDateFormat(endDate)
    setIsEndDate(check)
  }, [endDate]);

  const checkDateFormat = (dateString) => {
    if (dateString == "") {
      return true;
    }

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }

    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const dateObject = new Date(year, month - 1, day);
    return (
      dateObject.getFullYear() === year && dateObject.getMonth() === month - 1 && dateObject.getDate() === day
    );
  };

  const checkAPI = async () => {
    setVerify(true)
    console.log("======== Check API ========")
    console.log("host : ", host)
    // console.log("apiToken : ", apiToken)
    console.log("emailJira : ", emailJira)
    localStorage.removeItem('jira_personal_info')
    if(remember){
      var saveObj = {host:host,apiToken:apiToken,emailJira}
      localStorage.setItem("jira_personal_info",JSON.stringify(saveObj))
    }

    if (host && apiToken && emailJira) {
      await axios.post("/api/verify", {
        host: host,
        apiToken: apiToken,
        emailJira: emailJira,
      }).then(response => {
        const data = response.data
        console.log("call myself data : ", data)
        setAPIPass(true)
        if (data.data) {
          toast({
            title: 'Verify api success 😏️',
            description: "Hi !! " + emailJira,
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Verify api fail  😭',
            description: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง",
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }).catch(error => {
        console.log("error call verify : ", error)
        var errorMesage = "กรุณาตรวจสอบข้อมูลให้ถูกต้อง";
        if (error.response && error.response.data && error.response.data.message) {
          errorMesage = error.response.data.message
        }
        toast({
          title: 'Verify api fail  😭',
          description: errorMesage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      });
    } else {
      toast({
        title: 'Fail 😠',
        description: "กรุณากรอกข้อมูลให้ครบถ้วน !!!",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    console.log("===========================")
    setVerify(false)
  };

  const handleSubmit = async () => {
    setIsLoadData(true);

    console.log("Submitted:", {
      startDate,
      endDate,
      emailJira,
      apiToken,
      host,
    });

    if (host && apiToken && emailJira && startDate && endDate && !isStartDate && !isEndDate) {
      await axios.post("/api/data", {
        host: host,
        apiToken: apiToken,
        emailJira: emailJira,
        startDate: startDate,
        endDate: endDate
      }).then(response => {
        const data = response.data
        console.log("call data data : ", data)
        setDataShow(data)
        onOpen()
      }).catch(error => {
        console.log("error call verify : ", error)
        var errorMesage = "มีปัญหาหลังบ้าน กรุณาติดต่อแอดมิน";
        if (error.response && error.response.data && error.response.data.message) {
          errorMesage = error.response.data.message
        }
        toast({
          title: 'Verify api fail  😭',
          description: errorMesage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      });
    } else {
      toast({
        title: 'Fail 😠',
        description: "กรุณากรอกข้อมูลให้ครบถ้วน และ ถูกต้อง !!!",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }

    setIsLoadData(false);
  };

  const downLoadReport = async () => {
    var file = dataShow.file
    if (file) {
      const blob = new Blob([Buffer.from(file, 'base64')], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = emailJira + "_" + startDate + "_to_" + endDate + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  function findTime(timmstring) {
    var time = parseInt(timmstring);
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = time % 60;
    return hours + "ชม. " + minutes + "น. " + seconds + "วินาที"
  }

  function yyyymmddToddmmyyy(d) {
    var date = new Date(d);
    var dateShow = date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear();
    return dateShow
  }

  return (
    <>
      <DefaultLayout
        body={
          loading ? (
            <Loading />
          ) : (
            <Box>
              <VStack spacing={4} align="stretch" pl={4} pr={4} pt={4} pb={12}>
                <Center>
                  <Text fontSize="3xl" color="blue.500">
                    <TypeAnimation
                      sequence={["Jira Report", 500, "", 500]}
                      cursor={true}
                      repeat={Infinity}
                    />
                  </Text>
                </Center>
                <FormControl>
                  <FormLabel>Host <span style={{ color: 'red', marginLeft: '2px' }}>*</span></FormLabel>
                  <Input
                    type="text"
                    placeholder="Ex. https://tlidigitalgroup.atlassian.net/"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>API Token <span style={{ color: 'red', marginLeft: '2px' }}>*</span></FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter API token."
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                  />
                  <FormHelperText id="host-helper-text" pl={"2"}>
                    Create api token :{" "}
                    <Link
                      href="https://id.atlassian.com/manage-profile/security/api-tokens"
                      isExternal
                    >
                      https://id.atlassian.com/manage-profile/security/api-tokens
                    </Link>
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Jira Email <span style={{ color: 'red', marginLeft: '2px' }}>*</span></FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter jira email."
                    value={emailJira}
                    onChange={(e) => setEmailJira(e.target.value.toLowerCase())}
                  />
                </FormControl>

                <Checkbox
                  isChecked={remember}
                  onChange={(e) => setRemember(!remember)}
                >
                  จดจำข้อมูล
                </Checkbox>

                <Button colorScheme="blue" onClick={checkAPI} isLoading={verify}>
                  API Checking
                </Button>

                <Collapse in={apiPass}>
                  <Box w="100%" ref={myBoxRef}>
                    <VStack>
                      <FormControl isInvalid={isStartDate}>
                        <FormLabel>วันที่เริ่มต้น <span style={{ color: 'red', marginLeft: '2px' }}>*</span></FormLabel>
                        <Input
                          type="text"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          placeholder='Enter date with format yyyy-mm-dd'
                        />
                        <FormErrorMessage>Date is require format yyyy-mm-dd</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={isEndDate}>
                        <FormLabel>วันที่สิ้นสุด <span style={{ color: 'red', marginLeft: '2px' }}>*</span>   </FormLabel>
                        <Input
                          type="text"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          placeholder='Enter date with format yyyy-mm-dd'
                        />
                        <FormErrorMessage>Date is require format yyyy-mm-dd.</FormErrorMessage>
                      </FormControl>

                      <Button
                        colorScheme="blue"
                        mt={4}
                        onClick={handleSubmit}
                        w="100%"
                        isLoading={isLoadData}
                      >
                        Get Information
                      </Button>

                    </VStack>
                  </Box>
                </Collapse>
              </VStack>
            </Box>
          )
        }
      />
      <Modal onClose={onClose} size={'4xl'} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Stack direction={{ base: 'column', md: 'row' }} justifyContent={'space-between'}>
              <Text textAlign={'center'}>ข้อมูล : {emailJira} </Text>
              {/* <HStack justifyContent={'flex-start'} >
                <Button rightIcon={<DownloadIcon />} size={'sm'} w='100%' onClick={downLoadReport}>
                  Report
                </Button>
              </HStack> */}
            </Stack>
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Box>
              <VStack spacing={5} align={'flex-start'}>
                <VStack align={'flex-start'}>
                  <Text>
                    ข้อมูลตั้งแต่ วันที่ {yyyymmddToddmmyyy(startDate)} ถึง {yyyymmddToddmmyyy(endDate)}
                  </Text>
                  <HStack>
                    <Text as='b'>
                      จำนวนวันทั้งหมด 
                    </Text>
                    <Text as='b' color={'red'}>
                      ( 1 วัน = 7.5 ชม. )
                    </Text>
                    <Text>
                      :
                    </Text>
                    <Text>
                      {dataShow['data'] && dataShow['data'].length >= 0 ? dataShow['data'].length : "0"} วัน
                    </Text>
                  </HStack>
                  <HStack>
                    <Text as='b'>
                      เวลารวมทั้งหมด :
                    </Text>
                    <Text>
                      {findTime(dataShow['sumAll'])}
                    </Text>
                  </HStack>
                </VStack>
                <Accordion allowToggle w='100%'>
                  {
                    dataShow['data'].map((item, index) => {
                      var date = yyyymmddToddmmyyy(item["date"]);
                      var datas = item["datas"];
                      var useTime = item["useTime"];
                      var useTimeShow = findTime(useTime);
                      return (
                        <AccordionItem key={"dataShow" + index}>
                          <h2>
                            <AccordionButton _expanded={{ bg: 'blue.500', color: 'white' }} _hover={{ bg: 'blue.500', color: 'white' }}>
                              <Box as="span" flex='1' textAlign='left'>
                                <Text>{"วันที่ " + date}</Text>
                              </Box>
                              <Box as="span" flex='1' textAlign='right' mr={'2'}>
                                <Tag size={'md'} variant='solid' colorScheme={(useTime >= 27000 ? "green" : "red")}>
                                  {"เวลา" + (useTime >= 27000 ? "ครบ" : "ไม่ครบ")}
                                </Tag>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            <VStack align={'flex-start'}>
                              <HStack>
                                <Text as='b'>เวลาในการทำงาน :</Text>
                                <Text color={(useTime >= 27000 ? "green" : "red")}>{(useTime >= 27000 ? "ครบ" : "ไม่ครบ")}</Text>
                              </HStack>
                              <HStack>
                                <Text as='b'>เวลาทำงาน :</Text>
                                <Text>{useTimeShow}</Text>
                              </HStack>
                              <Text as='b'>รายละเอียดภายในวัน :</Text>
                              <Box
                                w='100%'
                                p='3'
                                border={'1px solid'}
                                borderColor={'gray.300'}
                                borderRadius={'5'}
                                bg='#e9e9e9'
                              >
                                <Box border={'1px solid'} borderColor={'black.200'} mb='2'></Box>
                                {
                                  datas.map((data, idx) => {
                                    var titleInDatas = datas[idx]["title"]
                                    return (
                                      <Box key={"dataShow_" + index + "_datas_" + idx}>
                                        <Stack direction={{ base: 'column', md: 'row' }}>
                                          <Text as='b'>
                                            [{(parseInt(idx) + 1)}] Link :
                                          </Text>
                                          <Link isExternal
                                            href={host + "/browse/" + datas[idx]["subTaskID"] + "?focusedWorklogId=" + datas[idx]["workLogID"]}
                                          >
                                            {host}/browse/{datas[idx]["subTaskID"]}?focusedWorklogId={datas[idx]["workLogID"]}
                                          </Link>
                                        </Stack>
                                        <HStack>
                                          <Text as='b'>
                                            เวลาที่เริ่มทำ :
                                          </Text>
                                          <Text>
                                            {datas[idx]["timeStart"]}
                                          </Text>
                                        </HStack>
                                        <HStack>
                                          <Text as='b'>
                                            เวลาที่ใช้ :
                                          </Text>
                                          <Text>
                                            {datas[idx]["useTime"]}
                                          </Text>
                                        </HStack>
                                        <Text as='b'>
                                          Worklog message :
                                        </Text>
                                        <Box pl={{ base: '0', md: '5' }}>
                                          {titleInDatas.split('\n').map((line, inc) => {
                                            return (
                                              <Box key={"title__" + inc}>
                                                {`${line}`}
                                              </Box>
                                            )
                                          })}
                                        </Box>
                                        <Box border={'1px solid'} borderColor={'black.200'} mt='2' mb='2'></Box>
                                      </Box>
                                    )
                                  })
                                }
                              </Box>
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      )
                    })
                  }
                </Accordion>
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} color={'white'}>ปิด</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MyApp;
