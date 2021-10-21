import { Form, Button, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { FieldType, submitType } from "libs/types/formField";
import dynamicFormFields from "./dynamicFormFields";
import { FormProps } from "antd/lib/form/Form";
import _ from "lodash";

interface Props extends FormProps {
  saveText?: string;
  initialValues?: { [v: string]: unknown };
  onSubmit: (...args: submitType) => void;
  fields: Array<FieldType>;
}

const DynamicForm = ({
  saveText,
  layout = "horizontal",
  wrapperCol = {},
  labelCol = {},
  initialValues,
  onSubmit,
  fields: defaultFields,
}: Props) => {
  const [form] = Form.useForm();
  const [fields, setFormFields] = useState<Array<FieldType>>([]);
  const [loading, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setFormFields(defaultFields);
  }, [defaultFields]);

  const onFinish = useCallback(
    (values) => {
      setIsSubmitting(true);
      onSubmit(
        values,
        (msg) => {
          const { setFieldsValue, getFieldsValue } = form;
          setIsSubmitting(false);
          setFieldsValue(getFieldsValue()); // reset form touched state
          if (msg) message.success(msg);
        },
        () => {
          setIsSubmitting(false);
        }
      );
    },
    [form, onSubmit]
  );

  const onFinishFailed = useCallback(
    ({ errorFields }) => {
      form.scrollToField(errorFields[0].name);
    },
    [form]
  );

  function computedFields(
    fieldsArray: Array<FieldType>,
    showParams: Array<string>,
    hiddenParams: Array<string>
  ) {
    return fieldsArray.filter((item: FieldType) => {
      return (
        (!_.isEmpty(showParams) && showParams.includes(item.name.toString())) ||
        (!_.isEmpty(hiddenParams) &&
          !hiddenParams.includes(item.name.toString())) ||
        (_.isEmpty(showParams) && _.isEmpty(hiddenParams))
      );
    });
  }

  function onValuesChange() {
    const [value] = [].slice.call(arguments, 0, 1);

    resetFieldsConfig(value);
  }

  function resetFieldsConfig(value: { [v: string]: unknown }) {
    const key = _.keys(value)[0];
    const idx = _.findIndex(fields, function (o) {
      return o.name === key;
    });

    // empty 位空 说明没有计算项
    const empty = _.get(fields[idx], `extraProps.config`, {});
    if (_.isEmpty(empty)) return;

    const visibleArray = _.get(
      fields[idx],
      `extraProps.config.${value[key]}.visible`,
      []
    );
    const hiddenArray = _.get(
      fields[idx],
      `extraProps.config.${value[key]}.hidden`,
      []
    );

    // 计算获取新的配置项
    const prevArray = computedFields(defaultFields, visibleArray, hiddenArray);
    setFormFields(prevArray);
  }

  return (
    <Form
      {...{
        layout,
        form,
        onFinish,
        onFinishFailed,
        initialValues,
        wrapperCol,
        labelCol,
      }}
      name="basic"
      onValuesChange={onValuesChange}
    >
      {dynamicFormFields(fields)}
      <Form.Item label=" " colon={false}>
        <>
          {saveText && (
            <Button loading={loading} type="primary" htmlType="submit">
              {saveText}
            </Button>
          )}
        </>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;
