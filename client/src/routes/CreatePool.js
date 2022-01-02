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

const CreatePool = () => {
  let [ generalInfo, setGeneralInfo ] = useState({});
  let [ permissions, setPermissions ] = useState({});
  let [ rules, setRules ] = useState({});
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  const { nextStep, prevStep, reset, activeStep } = useSteps({ initialStep: 0 });
  
  const forms = [ 
    useForm({ mode: "onBlur", resolver: yupResolver(GeneralInfoSchema),
      defaultValues: {
        name: "test123test123test123test123test123test123testasds",
        description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.sldfmsklfskfmsldf;msamfs;iowefma;fsldfmsklfskfmsldf;msamfs;iowefma;fsldfmsklfskfmsldf;msamfs;iowefma;fsldfmsklfskfmsldf;msamfs;iowefma;fsldfmsklfskfmsldf;msamfs;iowefma;fsldfmsklfskfmsldf;msamfs;iowefma;fsldfmsklfskfmsldf;msamfs;iowefma;f",
        goal: 200,
      },
    }),
    useForm({ mode: "onBlur", resolver: yupResolver(PermissionsSchema),
      defaultValues: {
        owners: [{ name: "My Wallet", address: state.walletAddress }],
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
  
  const onClickNextStep = () => {
    if (activeStep < forms.length) {
      forms[activeStep].handleSubmit(nextStep)();
    } else {
      submitPool();
    }
  }
  
  const submitPool = () => {
    console.log("submitted");
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
