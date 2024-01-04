import React from "react";
import { Box } from "@chakra-ui/react";
import FormTitle from "./FormTitle";
import FormTime from "./FormTime";
import FormMemberName from "./FormMemberName";

const FormDetails = ({
  title,
  setTitle,
  date,
  setDate,
  members,
  setMembers,
  purpose,
  setPurpose,
}) => {
  return (
    <Box>
      <FormTitle inputName="タイトル" content={title} setContent={setTitle} />
      <FormTime inputName="日時" content={date} setContent={setDate} />
      <FormMemberName members={members} setMembers={setMembers} />
      <FormTitle inputName="目的" content={purpose} setContent={setPurpose} />
    </Box>
  );
};

export default FormDetails;
