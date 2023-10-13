import { Flex } from "@chakra-ui/react";
import Logo from './Logo'

export default function Navbar(){
    return (
        <Flex h="60px" justify="center" align="center" borderBottomRadius="lg" borderBottom="5px solid green" bg="whiteAlpha.900">
            <Logo/>
        </Flex>
    )
}
