import { 
  Alert, Box, Button, ButtonGroup, FormControl, FormErrorMessage, FormHelperText, 
  FormLabel, HStack, IconButton, Input, InputGroup, InputRightAddon, InputRightElement, NumberInputField, 
  NumberInput, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, Select, 
  Spacer, Stack, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Text, Textarea, useToast 
} from "@chakra-ui/react";
import * as Constants from "constants/Constants"; 
import * as Utils from "utils/Utils"; 
import "components/pools/create/CreatePool.module.css";

const ReviewForm = ({ data }) => {
  return (
    <Stack spacing="1rem" marginTop="2rem">
      <FormLabel>Review Information</FormLabel>
      <Box border="1px solid" borderRadius="md">
        <Table>
          <Thead>
            <Tr>
              <Th colSpan={2}>General Information</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Pool Name</Td>
              <Td>{data.name}</Td>
            </Tr>
            <Tr>
              <Td>Description</Td>
              <Td>{data.description}</Td>
            </Tr>
            <Tr>
              <Td>Goal Amount</Td>
              <Td>{data.goal}</Td>
            </Tr>
            <Tr>
              <Td>Pool End Date</Td>
              <Td>{data.end ? data.end : "N/A"}</Td>
            </Tr>
            <Tr>
              <Td>Minimum Owners for Proposal</Td>
              <Td>{data.ownersForProposal} out of {data.owners.length} owner(s)</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Box border="1px solid" borderRadius="md">
        <Table>
          <Thead>
            <Tr>
              <Th>Owner Harmony One Wallet Address</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              data.owners.map((owner, index) => (
                <Tr key={`owner_${index}`}>
                  <Td>{owner.address}</Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </Box>
    </Stack>
  );
};

export default ReviewForm;
