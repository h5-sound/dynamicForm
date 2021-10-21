import React from "react";
import { FieldType } from "libs/types/formField";
import {
  NumberField,
  TextAreaField,
  InputField,
  CheckboxField,
  CheckboxGroupField,
  ComplexFields,
  SelectFields,
} from "components/dynamic-form/fields";
import { Form } from "antd";
import get from "lodash/get";

const FieldTypeComponent = {
  number: NumberField,
  textarea: TextAreaField,
  text: InputField,
  checkbox: CheckboxField,
  checkboxGroup: CheckboxGroupField,
  complex: ComplexFields,
  select: SelectFields,
};

const dynamicFormFields = (fields: Array<FieldType>) => {
  return fields.map(
    (
      {
        name,
        type,
        extraProps,
        prefixIcon,
        suffixIcon,
        calIsVisible = () => true,
        calIsDisabled = () => false,
        ...rest
      }: FieldType,
      idx: number
    ) => {
      const FormItem = Form.Item;
      const formItemProps: { [k: string]: unknown } = {
        type,
        valuePropName: type === "checkbox" ? "checked" : "value",
        ...rest,
      };

      const isNeedName = formItemProps.noStyle
        ? {}
        : {
            name: name || idx,
          };

      const FieldComponent = get(FieldTypeComponent, type, InputField);
      return (
        <Form.Item shouldUpdate key={(name || idx).toString()} noStyle>
          {({ getFieldValue }) =>
            calIsVisible(getFieldValue) ? (
              <>
                {prefixIcon}
                <FormItem {...formItemProps} {...isNeedName}>
                  <FieldComponent
                    {...extraProps}
                    disabled={calIsDisabled(getFieldValue)}
                  />
                </FormItem>
                {suffixIcon}
              </>
            ) : null
          }
        </Form.Item>
      );
    }
  );
};

export default dynamicFormFields;
