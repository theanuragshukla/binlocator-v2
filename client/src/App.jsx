import { HashRouter } from "react-router-dom";
import Router from "./Router";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
function App() {
    return (
        <ChakraProvider theme={extendTheme({})}>
            <HashRouter>
                <Router />
            </HashRouter>
        </ChakraProvider>
    );
}

export default App;
