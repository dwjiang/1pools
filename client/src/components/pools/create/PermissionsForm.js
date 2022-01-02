import React, { useState, useEffect } from "react";
import { 
  Alert, Box, Button, ButtonGroup, FormControl, FormErrorMessage, FormHelperText, 
  FormLabel, HStack, IconButton, Input, InputGroup, InputRightAddon, InputRightElement, NumberInputField, 
  NumberInput, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, Select, 
  Spacer, Stack, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Text, Textarea, useToast 
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useFieldArray } from "react-hook-form";
import { useTrackedState, useSetState } from "store";
import * as Constants from "constants/Constants"; 
import * as Utils from "utils/Utils"; 

const PermissionsForm = ({ form }) => {
  const toast = useToast();
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ name: "owners", control });
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
    
  const addNewOwner = () => {
    append({ name: `Owner ${fields.length}`, address: "" });
  }
  
  const removeOwner = (index) => {
    if (index !== 0) {
      remove(index);
    } else {
      toast({
        title: "Cannot remove yourself as an owner",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }
  
  const clearAllOwners = () => {
    for (let i = 1; i < fields.length; i++) {
      remove(1);
    }
  }
      
  return (
    <Stack spacing="1rem" marginTop="2rem">
      <HStack spacing="1rem">
        <FormLabel>Owners of Your Pool <span style={{color:"#E53E3E"}}>*</span></FormLabel>
        <Spacer/>
        <Button leftIcon={<AddIcon/>} size="md"
          onClick={addNewOwner}>Add New Owner</Button>
        <Button size="md" leftIcon={<DeleteIcon/>} isDisabled={fields.length <= 1}
          onClick={clearAllOwners}>Clear All Owners</Button>
      </HStack>
      <Box border="1px solid" borderRadius="md">
        <Table variant="striped">
          <TableCaption>
            Every owner will have equal voting rights in this pool. 
            All owners can post updates and call for proposals for transactions. You don't have to be an owner to contribute funds to a pool.
            <br/><strong>Owners cannot be changed after submitting pool.</strong>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Owner Name</Th>
              <Th>Owner Harmony One Wallet Address</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            { fields.map((owner, index) => (
                <Tr key={`owner_${index}`}>
                  <Td>
                    <FormControl isRequired isInvalid={errors?.owners?.[index]?.name?.message} 
                      errortext={errors?.owners?.[index]?.name?.message}>
                      <Input defaultValue={owner.name} placeholder="Required (Maximum 50 Characters)"
                        name={`owners.${index}.name`} { ...register(`owners.${index}.name`) }/>
                      <FormErrorMessage>{errors?.owners?.[index]?.name?.message}</FormErrorMessage>
                    </FormControl>
                  </Td>
                  <Td>
                    <FormControl isRequired isInvalid={errors?.owners?.[index]?.address?.message} 
                      errortext={errors?.owners?.[index]?.address?.message}>
                      <Input isDisabled={index === 0} defaultValue={owner.address} placeholder="Required"
                        name={`owners.${index}.address`} { ...register(`owners.${index}.address`) } />
                      <FormErrorMessage>{errors?.owners?.[index]?.address?.message}</FormErrorMessage>
                    </FormControl>
                  </Td>
                  <Td>
                    <IconButton onClick={()=>(removeOwner(index))}
                      icon={<DeleteIcon/>}/>
                  </Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </Box>
      <FormControl isRequired isInvalid={errors?.ownersForProposal?.message}>
        <FormLabel>Minimum Number of Owners to Pass a Proposal</FormLabel>
        <InputGroup min={1} max={fields.length} maxW={64}>
          <Input { ...register("ownersForProposal") }/>
          <InputRightAddon children={
            <Text>out of {fields.length} owner(s)</Text>
          }/>
        </InputGroup>
        <FormErrorMessage>{errors?.ownersForProposal?.message}</FormErrorMessage>
      </FormControl>
    </Stack>
  );
};

export default PermissionsForm;
