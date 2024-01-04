import React from "react";
import { RadioGroup, Radio, VStack, Text } from "@chakra-ui/react";

const CustomRadioGroup = ({ value, onChange }) => {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <VStack spacing={2} alignItems="left">
        <Radio value="any">話題別の要約</Radio>
        <Radio value="all">話題別の要約 + 標準要約</Radio>
      </VStack>
    </RadioGroup>
  );
};

export default CustomRadioGroup;
