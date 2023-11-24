import { Outlet } from "react-router-dom";
import BottomNav from "../common/BottomNav";
import { Grid, GridItem } from "@chakra-ui/react";
import Navbar from "../common/Navbar";

export default function HomeLayout() {
    return (
        <Grid h="100vh" templateRows="60px 1fr 56px" >
        <Navbar/>
            <GridItem h="100%" w="100%" overflow="hidden">
                <Outlet />
            </GridItem>
            <GridItem pos="absolute" bottom={0} w="100%">
                <BottomNav />
            </GridItem>
        </Grid>
    );
}
