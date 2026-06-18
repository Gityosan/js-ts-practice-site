import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <Box as="nav" bg="blue.600" px={6} py={3} shadow="sm">
      <Flex align="center" gap={3}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Heading size="md" color="white" fontFamily="mono">
            JS/TS 練習
          </Heading>
        </Link>
        <Text color="blue.200" fontSize="sm" fontFamily="mono">
          コードはこわくない
        </Text>
      </Flex>
    </Box>
  );
}
