import DynamicForm from "components/form";
import React from "react";
import { searchFormParam } from "pages/views/ai/config";
import { submitType } from "libs/types/formField";
import { useParamsContext } from "../../../../libs/context/paramsProvider";
interface searchType {
  id: string;
}
export default function SearchJsx() {
  const { setParams } = useParamsContext();
  const onConfirm = (...args: submitType<searchType>) => {
    const [value, suc, error] = args;
    console.log(value);
    setParams<searchType>(value);
  };
  return (
    <DynamicForm
      saveText={"搜索"}
      layout={"inline"}
      onSubmit={onConfirm}
      fields={searchFormParam}
    />
  );
}