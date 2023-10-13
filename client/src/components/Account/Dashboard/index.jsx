import { Flex, Heading, Progress, Text, Textarea } from "@chakra-ui/react";

const UserProfile = ({ user }) => {
    return <Flex w="100%" borderRadius="md"></Flex>;
};

const Dashboard = ({ loading, user }) => {
    return (
        <Flex
            position="relative"
            bg="whiteAlpha.900"
            h="100%"
            flexDir="column"
            justify="flex-start"
            px={4}
        >
            <Heading>Dashboard</Heading>
            <Text color="blackAlpha.700" fontSize={16}>
                All your contributions in one place
            </Text>
            {!loading ? (
                <UserProfile user={user} />
            ) : (
                <Progress
                    position="absolute"
                    bottom={0}
                    w="100%"
                    h={1}
                    isIndeterminate
                    colorScheme="green"
                />
            )}
        </Flex>
    );
};

export default Dashboard;
