        // User will enter the message in this field. However donot change anything for FormInput. (Line no. 32 below)
        // It is a common component in our Project and should not be touched. 
        // Ensure onChange is handled and validation is taken care of without touching FormInput component shown below.
        // I will also attach the FormInput file to this project just for reference.

import React from 'react'
import PropTypes from 'prop-types'

import FormField from 'wf-dbd-react-ui/es/FormField'
import FormFieldLabel from 'wf-dbd-react-ui/es/FormFieldLabel'
import FormFieldErrors from 'wf-dbd-react-ui/es/FormFieldErrors'
import Translatable from 'wf-dbd-react-ui/es/Translatable'
import Block from 'wf-dbd-react-ui/es/Block'
import withStrings from 'wf-dbd-react-ui/es/withStrings'

import { getMemoLabel } from '../../../../lib/utils/manage-payee-util'
import FormInput from '../../with-dirty-check/FormInput'

import styles from './Memo.less'

const Memo = ({ fieldId, defaultMemo, memo, isConfirm, getString }) => {
  const memoLabel = getMemoLabel()
  return !isConfirm ? (
    <Block className={styles.memo}>
      <FormField fieldId={fieldId}>
        <FormFieldLabel>
          <strong>
            <Translatable id={memoLabel} />
          </strong>
        </FormFieldLabel>
       
        <FormInput
          className={styles.input}
          initialValue={defaultMemo}
          type="text"
          maxLength="32"
          placeholder={getString('memoPlaceholder')}
          deleteOnUnmount={true}
        />
        <FormFieldErrors />
      </FormField>
    </Block>
  ) : (
    <React.Fragment>
      <Translatable id={memoLabel} />
      <Block>
        <strong>{memo}</strong>
      </Block>
    </React.Fragment>
  )
}

Memo.defaultProps = {
  isConfirm: false
}

Memo.propTypes = {
  fieldId: PropTypes.string,
  defaultMemo: PropTypes.string,
  isConfirm: PropTypes.bool,
  memo: PropTypes.string
}

export default withStrings(Memo)
