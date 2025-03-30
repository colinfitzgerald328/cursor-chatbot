import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Define consistent color tokens
const colors = {
  brand: {
    50: "#f5e9ff",
    100: "#dac1ff",
    200: "#c098ff",
    300: "#a56eff",
    400: "#8a45ff",
    500: "#712cf9",
    600: "#5a23c8",
    700: "#421a96",
    800: "#2c1165",
    900: "#170833",
  },
  claude: {
    primary: "#712cf9",
    secondary: "#8a45ff",
  },
};

// Define consistent spacing, typography, and other design tokens
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

// Define consistent component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: "medium",
      borderRadius: "md",
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorMode === "dark" ? "purple.500" : "purple.500",
        color: "white",
        _hover: {
          bg: props.colorMode === "dark" ? "purple.600" : "purple.400",
        },
      }),
    },
  },
  Input: {
    variants: {
      outline: (props: any) => ({
        field: {
          borderRadius: "md",
          borderColor: props.colorMode === "dark" ? "gray.600" : "gray.300",
          _hover: {
            borderColor: props.colorMode === "dark" ? "gray.500" : "gray.400",
          },
          _focus: {
            borderColor: "purple.400",
            boxShadow: `0 0 0 1px ${props.colorMode === "dark" ? "purple.400" : "purple.400"}`,
          },
        },
      }),
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: "semibold",
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  components,
  fonts: {
    heading:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
        color: props.colorMode === "dark" ? "white" : "gray.800",
        transitionProperty: "background-color",
        transitionDuration: "normal",
      },
      "*:focus": {
        boxShadow: "outline",
        outline: "none",
      },
    }),
  },
});

export default theme;
