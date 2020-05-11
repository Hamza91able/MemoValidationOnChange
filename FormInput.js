//CORE COMPONENT
//Donot alter or make changes to this file. This is only for reference



function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../input/Input';
import FieldContainer from '../field-container/FieldContainer';
import WithFieldLabels from '../field-container/WithFieldLabels';
import WithFieldMessages from '../field-container/WithFieldMessages';
import { toggleZoom } from '../../../lib/fields/zoom';
import { pluck } from '../../../lib/prop-utils/prop-utils';

class FormInput extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "getInputHandlers", () => ({
      onBlur: () => {
        const {
          fieldId,
          formId,
          dirty,
          errorMessage,
          blurField
        } = this.props;
        toggleZoom(true);
        blurField({
          fieldId,
          formId,
          siblingFieldIds: [],
          dirty,
          errorMessage
        });
      },
      onFocus: () => {
        const {
          fieldId,
          formId,
          focusField
        } = this.props;
        toggleZoom(false);
        focusField({
          fieldId,
          formId
        });
      },
      onInput: value => {
        const {
          props: {
            fieldId,
            formId,
            changeField,
            onChangeCallback,
            onChange
          }
        } = this;
        changeField({
          fieldId,
          formId,
          value,
          onChangeCallback,
          onChange
        });
      },
      onClear: () => {
        const {
          props: {
            fieldId,
            formId,
            changeField,
            onChangeCallback,
            onChange,
            clearedValue
          }
        } = this;
        changeField({
          fieldId,
          formId,
          value: clearedValue,
          onChangeCallback,
          onChange
        });
      },

      onTouchEnd() {
        toggleZoom(false);
      }

    }));
  }

  render() {
    const {
      el,
      id,
      name,
      value,
      type,
      labelId,
      fieldMessageIds,
      placeholder,
      required,
      maxLength,
      minLength,
      disabled,
      showError,
      className,
      clearable,
      clearLabel,
      onClear,
      clearedValue,
      fieldId,
      ...restProps
    } = this.props; // Don't pass onChange prop to Input to avoid duplicate calls

    const inputProps = pluck(['onChange'], restProps);
    const InputElement = el;
    return React.createElement(InputElement, _extends({
      id: id || fieldId,
      name: name,
      value: value,
      type: type,
      placeholder: placeholder,
      maxLength: maxLength,
      minLength: minLength,
      disabled: disabled,
      required: required,
      invalid: showError,
      inputRef: element => this.inputRef = element,
      labelId: labelId,
      fieldMessageIds: fieldMessageIds,
      className: className,
      clearable: clearable,
      clearedValue: clearedValue,
      clearLabel: clearLabel,
      onClear: onClear
    }, inputProps, this.getInputHandlers()));
  }

}

FormInput.defaultProps = {
  dataType: 'ALL',
  value: '',
  clearedValue: '',
  el: Input,
  type: 'text'
};
FormInput.propTypes = {
  fieldId: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  dataType: PropTypes.string,
  required: PropTypes.bool,
  clearedValue: PropTypes.string,
  clearLabel: PropTypes.string,
  el: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};
export default FieldContainer(WithFieldLabels(WithFieldMessages(FormInput)));
