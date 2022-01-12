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
    useForm({ mode: "onBlur", resolver: yupResolver(GeneralInfoSchema),
      defaultValues: {
        name: "Secret Birthday Present for Jordan (Bike)",
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultricies leo integer malesuada nunc vel risus. Odio ut sem nulla pharetra diam sit amet nisl suscipit. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Facilisi nullam vehicula ipsum a arcu cursus. Et molestie ac feugiat sed lectus. Non pulvinar neque laoreet suspendisse interdum consectetur libero id. Nisl nisi scelerisque eu ultrices vitae auctor. Turpis tincidunt id aliquet risus feugiat in ante. Fringilla phasellus faucibus scelerisque eleifend. Ornare arcu odio ut sem nulla pharetra diam. Volutpat sed cras ornare arcu.

In metus vulputate eu scelerisque. Nunc sed augue lacus viverra vitae congue eu consequat. Pretium viverra suspendisse potenti nullam. Congue nisi vitae suscipit tellus mauris. Massa tempor nec feugiat nisl pretium. Sit amet massa vitae tortor condimentum lacinia quis vel. Neque volutpat ac tincidunt vitae semper quis. Senectus et netus et malesuada fames ac. Cursus euismod quis viverra nibh cras pulvinar. Dolor morbi non arcu risus quis varius quam. Tempor id eu nisl nunc mi ipsum. Ut venenatis tellus in metus vulputate eu scelerisque. Magna etiam tempor orci eu lobortis. Vitae purus faucibus ornare suspendisse sed nisi lacus sed.

Bibendum neque egestas congue quisque egestas diam in. Diam phasellus vestibulum lorem sed. Facilisi cras fermentum odio eu. Massa sed elementum tempus egestas sed sed risus pretium. Laoreet id donec ultrices tincidunt. At augue eget arcu dictum varius. Et pharetra pharetra massa massa ultricies mi quis. Sollicitudin ac orci phasellus egestas tellus rutrum. Odio euismod lacinia at quis risus sed vulputate odio ut. Velit euismod in pellentesque massa placerat. Bibendum ut tristique et egestas quis ipsum suspendisse. Sed sed risus pretium quam vulputate dignissim suspendisse. Tortor pretium viverra suspendisse potenti. Amet mattis vulputate enim nulla aliquet porttitor lacus. Fringilla est ullamcorper eget nulla. Aliquam purus sit amet luctus venenatis lectus. Lorem dolor sed viverra ipsum nunc aliquet bibendum enim facilisis. Eget aliquet nibh praesent tristique magna sit. Elit sed vulputate mi sit amet mauris commodo quis. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien.`,
        goal: 200,
        end: 5,
      },
    }),
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
        const result = await attachedContract.methods.createPool(addresses, ownersForProposal, hash, ttl).send({
          from: state.walletConnector.address
        }).on("receipt", async (receipt) => {
          const link = `${Constants.EXPLORER_POP_URL_BASE}/${receipt.transactionHash}`;
          try {
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
