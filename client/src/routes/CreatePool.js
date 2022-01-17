import axios from "axios";
import React, { useState, useEffect } from "react";
import { AlertDescription, Box, Button, Center, Flex, Link, Stack, Text, useToast } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useTrackedState, useSetState } from "store";
import GeneralInfoForm from "components/pools/create/GeneralInfoForm";
import PermissionsForm from "components/pools/create/PermissionsForm";
import ReviewForm from "components/pools/create/ReviewForm";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import GeneralInfoSchema from "validations/schemas/GeneralInfoSchema";
import PermissionsSchema from "validations/schemas/PermissionsSchema";
import yup from "validations/validations";
import * as Constants from "constants/Constants";
import PoolFactoryABI from "abi/PoolFactory";
import { useNavigate } from "react-router-dom";
import { Unit } from "@harmony-js/utils";

const CreatePool = () => {
  const toast = useToast();
  const navigate = useNavigate();
  let [ generalInfo, setGeneralInfo ] = useState({});
  let [ permissions, setPermissions ] = useState({});
  let [ loading, setLoading ] = useState(false);
  let [ rules, setRules ] = useState({});
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  const { nextStep, prevStep, reset, activeStep } = useSteps({ initialStep: 0 });
  
  const forms = [ 
    useForm({ mode: "onBlur", resolver: yupResolver(GeneralInfoSchema) }),
    useForm({ mode: "onBlur", resolver: yupResolver(PermissionsSchema),
      defaultValues: {
        owners: [{ address: state.walletAddress }],
        ownersForProposal: 1,
      },
    })
  ];
  
  let data = {};
  forms.forEach(form => {
    const { getValues } = form;
    data = { ...data, ...getValues() };
  });

  const { fields, update } = useFieldArray({ name: "owners", control: forms[1].control });
  useEffect(() => {
    if (fields.length > 0) {
      update(0, { name: "My Wallet", address: state.walletAddress });
    }
  }, [state]);
  
  const validateNextStep = () => {
    return activeStep < forms.length && Object.keys(forms[activeStep].formState.errors).length !== 0;
  }
  
  const onClickNextStep = async () => {
    if (activeStep < forms.length) {
      forms[activeStep].handleSubmit(nextStep)();
    } else {
      await axios.post(`${Constants.SERVER_URL_API}/files/metadata`, 
        JSON.stringify({ ...forms[0].getValues() }), {
          headers: {
            "Content-Type": "application/json"
          }
        }
      ).then(response => {
        if (response.status !== 200)
          throw new Error();
        return response.data.hash;
      }).then(async (hash) => {
        setLoading(true);
        
        const ttl = parseInt(forms[0].getValues().end);
        const addresses = forms[1].getValues().owners.map(owner => owner.address);
        const ownersForProposal = parseInt(forms[1].getValues().ownersForProposal);

        const contract = await state.harmony.client.contracts.createContract(PoolFactoryABI, Constants.POOLS_FACTORY_ADDRESS);
        const attachedContract = await state.walletConnector.attachToContract(contract);
        console.log(state);
        const result = await attachedContract.methods.createPool(addresses, ownersForProposal, hash, ttl).send({
          from: state.walletConnector.address,
          gasPrice: state.harmony.gasPrice * 30,
          gasLimit: state.harmony.gasLimit,
        }).on("receipt", async (receipt) => {
          const link = `${Constants.EXPLORER_POP_URL_BASE}/${receipt.transactionHash}`;
          try {
            console.log(receipt);
            const poolAddress = state.harmony.client.crypto.toBech32(await contract.methods.getPool(state.walletConnector.address).call());
            if (poolAddress === "one1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquzw7vz")
              throw new Error();
            toast({
              title: "Successfully created your pool.",
              description: (
                <Link isExternal href={link}>
                  <Text as="u">Click here to view your transaction.</Text>
                  <ExternalLinkIcon size="xs"/>
                </Link>
              ),
              status: "success",
              isClosable: true,
              position: "bottom-right",
              duration: null,
            });
            navigate(`../pools/${poolAddress}`);
          } catch (error) {
            toast({
              title: "Error creating pool.",
              description: (
                <Link isExternal href={link}>
                  <Text as="u">Click here to view your transaction.</Text>
                  <ExternalLinkIcon size="xs"/>
                </Link>
              ),
              status: "error",
              isClosable: true,
              position: "bottom-right",
              duration: null,
            });
            setLoading(false);
          }
        });
      }).catch(error => {
        console.log(error);
        toast({
          title: "Error creating pool. Please refresh the page and try again.",
          status: "error",
          isClosable: true,
          position: "bottom-right",
        });
        setLoading(false);
      });
    }
  }
  
  if (!state.walletAddress) {
    return (
      <Center h="90%">
        <Text fontSize="lg">Connect into your {" "}
          <Link fontSize="lg" href={Constants.HARMONY_CHROME_STORE_URL} isExternal textDecoration="underline">
            Harmony Chrome Extension Wallet
          </Link> to create a pool.
        </Text>
      </Center>
    );
  }
  
  return (
    <Stack flexDir="column" spacing="2rem">
      <Text fontSize="xl"><strong>Create a New Pool</strong></Text>
      <Steps activeStep={activeStep}>
        <Step label="Set General Information">
          <GeneralInfoForm data={generalInfo} updateData={setGeneralInfo} form={forms[0]}/>
        </Step>
        <Step label="Add Owners">
          <PermissionsForm data={permissions} updateData={setPermissions} form={forms[1]}/>
        </Step>
        <Step label="Review and Submit Pool">
          <ReviewForm data={data}/>
        </Step>
      </Steps>
      <Flex width="100%" justify="flex-end">
        <Button mr={4} size="sm" variant="ghost" 
          onClick={prevStep} isDisabled={activeStep === 0 || loading}>
          Prev
        </Button>
        <Button mr={4} size="sm" variant="ghost" isLoading={loading} loadingText="Submitting"
          onClick={onClickNextStep} isDisabled={validateNextStep()}>
          { activeStep >= forms.length ? "Submit" : "Next" }
        </Button>
      </Flex>
    </Stack>
  );
};

export default CreatePool;
