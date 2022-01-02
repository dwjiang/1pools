import { Button, ButtonGroup, FormControl, FormErrorMessage, FormHelperText, 
  FormLabel, HStack, Input, InputGroup, InputRightAddon, NumberInput, Select, Stack, Textarea } from "@chakra-ui/react";
import * as Constants from "constants/Constants"; 
import * as Utils from "utils/Utils"; 

const GeneralInfoForm = ({ form }) => {
  const { register, formState: { errors } } = form;
  return (
    <Stack spacing="1rem" marginTop="2rem">
      <FormControl isRequired isInvalid={errors?.name?.message} errortext={errors?.name?.message}>
        <FormLabel>Pool's Name</FormLabel>
        <Input { ...register("name") } placeholder="Required (Maximum 50 Characters)"/>
        <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={errors?.description?.message} errortext={errors?.description?.message}>
        <FormLabel>Describe Your Pool</FormLabel>
        <Textarea minHeight="10rem" { ...register("description") } placeholder="Required (Maximum 2000 Characters)"/>
        <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
      </FormControl>
      <HStack spacing="1rem" align="flex-start">
        <FormControl isRequired isInvalid={errors?.goal?.message} errortext={errors?.goal?.message}>
          <FormLabel>Goal Amount ($ONE)</FormLabel>
          <InputGroup>
            <Input { ...register("goal") } placeholder="Required (Maximum 15 Characters)"/>
            <InputRightAddon children="$ONE"/>
          </InputGroup>
          <FormErrorMessage>{errors?.goal?.message}</FormErrorMessage>
          <FormHelperText>This is the goal amount in $ONE for the pool. People can still contribute to the pool even after the goal is reached.</FormHelperText>
        </FormControl>
        <FormControl isInvalid={errors?.end?.message} errortext={errors?.end?.message}>
          <FormLabel>Pool End Date</FormLabel>
          <Input type="date" { ...register("end") }/>
          <FormErrorMessage>{errors?.end?.message}</FormErrorMessage>
          <FormHelperText>This is the pool will end on your specified date at 23:59 UTC time. People can still contribute to the pool even after the pool end date.</FormHelperText>
        </FormControl>
      </HStack>
    </Stack>
  );
};

export default GeneralInfoForm;
