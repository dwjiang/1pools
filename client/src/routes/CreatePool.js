import axios from "axios";
import React, { useState, useEffect } from "react";
import { AlertDescription, Button, Flex, Link, Stack, Text } from "@chakra-ui/react";
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

const CreatePool = () => {
  let [ generalInfo, setGeneralInfo ] = useState({});
  let [ permissions, setPermissions ] = useState({});
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
        console.log(hash);
        console.log(state);
        
        // const provider = new Web3.providers.WebsocketProvider("wss://ws.s0.b.hmny.io");
        // const web3 = new Web3(provider);
        // 
        // const contract = new web3.eth.Contract(PoolFactoryABI, "0xb3d89017fe2e5db724f01adf3d6b0258248903d7");
        // contract.methods.createPool(["0x47201e624852e53f20adacec3053ef400a6db819"], 1, hash).send({
        //   from: state.walletConnector.address
        // });
        // contract.events.poolAddress({ fromBlock: 0, toBlock: "latest" }, (err, res) => {
        //   console.log(err);
        //   console.log(res);
        // });
        
        // TODO
        console.log(PoolFactoryABI);
        const contract = await state.harmony.client.contracts.createContract(PoolFactoryABI, "0xb3d89017fe2e5db724f01adf3d6b0258248903d7");
        const attachedContract = await state.walletConnector.attachToContract(contract);
        console.log(attachedContract);
        // console.log(await attachedContract.methods.getInstantiationCount("one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry").call())
        const result = await attachedContract.methods.createPool(["one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry", "one1u8gppk3j7yrgeac36fgvqrg3cd9qn5rqcxfhzr"], 1, hash).send({
          from: state.walletConnector.address
        }).on("receipt", receipt => {
          console.log(receipt);
        });
        
        // attachedContract.events.poolAddress().on("data", event => {
        //   console.log(event);
        // });
        
        // attachedContract.events.poolAddress({ fromBlock: 0, toBlock: "latest" }, (err, res) => {
        //   console.log(err);
        //   console.log(res);
        // });
        
        
        // console.log(result);
        // 
        // const poolContract = await state.harmony.client.contracts.createContract(PoolsABI, result);
        // const attachedPoolContract = await state.walletConnector.attachToContract(poolContract);
        // console.log(attachedPoolContract);
        // const resultPool = await attachedPoolContract.methods.getNumOwners().call();
        // console.log(resultPool);
        
        
        // console.log(factoryInstance);
        // factoryInstance.wallet.signTransaction = async (txn) => {
        //   txn.from = state.walletAddress;
        //   return await state.walletConnector.signTransaction(txn);
        // };
        // const result = await factoryInstance.methods.createPool(["one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry", "one1u8gppk3j7yrgeac36fgvqrg3cd9qn5rqcxfhzr"], 1, hash).call();
        // console.log(result);
        // console.log(await factoryInstance.methods.getInstantiations("one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry").call())
        // 
        // const poolsInstance = state.harmony.client.contracts.createContract(PoolsABI, "one1nsue0xkv0qwh7zrl093t7ngtuml3sfpy8leqqc");
        // poolsInstance.wallet.signTransaction = async (txn) => {
        //   txn.from = state.walletAddress;
        //   return await state.walletConnector.signTransaction(txn);
        // };
        // console.log(poolsInstance)
        // console.log(await poolsInstance.methods.getNumOwners().call());
      }).catch(error => {
        console.log(error);
      });
    }
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
          onClick={prevStep} isDisabled={activeStep === 0}>
          Prev
        </Button>
        <Button mr={4} size="sm" variant="ghost" 
          onClick={onClickNextStep} isDisabled={validateNextStep()}>
          { activeStep >= forms.length ? "Submit" : "Next" }
        </Button>
      </Flex>
    </Stack>
  );
};

export default CreatePool;
