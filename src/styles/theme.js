// styles/theme.js

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  // ปรับแต่ง theme ตรงนี้ (ถ้าต้องการ)
  fonts: {
    // กำหนด font ที่นี่
    body: 'Kanit, sans-serif',
    heading: 'Kanit, sans-serif',
  },
  components: {
    // กำหนดค่า default color ของ components ที่นี่
    Button: {
      baseStyle: {
        color: 'white',
      },
      variants: {
        // กำหนดค่า color สำหรับ variants ต่างๆ ที่นี่
        solid: {
          color: 'white',
          bg: 'blue.500',
          _hover: {
            bg: 'blue.600',
          },
        },
        outline:{
          color: 'blue.500',
          bg: 'white',
          borderColor: 'blue.500',
          _hover: {
            bg: 'blue.50',
          },
        }
      },
    },
    Input: {
      baseStyle: {
        borderColor: 'blue.500',
      },
    },
    Link: {
      baseStyle: {
        color: 'blue.500',
      },
    },
    // กำหนดค่า default color ของ components อื่นๆ ที่นี่
  },
});

export default theme;
