import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { pluck } from 'wf-dbd-react-ui/es/lib'
import Form from 'wf-dbd-react-ui/es/Form'
import FormInputHidden from 'wf-dbd-react-ui/es/FormInputHidden'
import { changeField } from 'wf-dbd-react-ui/es/actions'

import AccountDisclosures from '../../../../../common/disclosures/account-disclosures/AccountDisclosures'
import EditPaymentPayeeName from './fields/EditPaymentPayeeName'
import EditPaymentAccount from './fields/EditPaymentAccount'
import EditPaymentSingleAccount from './fields/EditPaymentSingleAccount'
import EditPaymentAccountSelect from './fields/EditPaymentAccountSelect'
import AmountInput from './fields/AmountInput'
import EditPaymentSendOnDate from './fields/EditPaymentSendOnDate'
import Memo from '../../../../../common/payment-card/fields/Memo'
import EditPaymentFormButtons from './fields/EditPaymentFormButtons'
import MessageDisplay from '../../../../../common/message-display/MessageDisplay'
import TermsAndConditionsLink from '../../../../../common/terms-and-conditions-link/TermsAndConditionsLink'
import TermsAndConditionsModal from '../../../../../common/terms-and-conditions-modal/TermsAndConditionsModal'
import { getInitiallySelectedAccountId } from '../../../../../../lib/selectors/selectors'
import { addTermsAcceptedAccount } from '../../../../../../lib/store/terms-and-conditions/actions'

import styles from './EditPaymentForm.less'

class EditPaymentForm extends React.Component {

  constructor(props) {
    super(props)
    const selectedAccount = props.accounts.find(account => account.get('selected')) || props.accounts.first()
    this.state = {
      disclosureIndicators: this.getInitialDisclosureIndicator(selectedAccount),
      termsAndConditionsType: selectedAccount.get('termsType'),
      showTermsAndConditions: false,
      currentAccount: {},
      termsAcceptedOnScreenForAccounts: [],
      termsAcceptedOnScreenForSelectedAccount: false,
      termsRequired: selectedAccount.get('termsRequired')
    }
  }

  getInitialDisclosureIndicator = selectedAccount => selectedAccount.get('disclosureIndicator') ? [selectedAccount.get('disclosureIndicator')] : []

  onAccountSelect = newAccount => {
    const { setCheckboxStatus } = this.props
    const { termsAcceptedOnScreenForAccounts, currentAccount, termsAcceptedOnScreenForSelectedAccount } = this.state

    const newTermsAcceptedOnScreenForSelectedAccount = termsAcceptedOnScreenForAccounts.indexOf(newAccount.id) >= 0
    // update the acceptance status and current account in component state
    if (newAccount.id !== currentAccount.id) {
      this.setState({
        termsAndConditionsType: newAccount.termsType || '',
        termsRequired: newAccount.termsRequired,
        termsAcceptedOnScreenForSelectedAccount: newTermsAcceptedOnScreenForSelectedAccount,
        currentAccount: newAccount
      },
      // update checkboxes once current account is updated in state
      () => {
        if (newTermsAcceptedOnScreenForSelectedAccount !== termsAcceptedOnScreenForSelectedAccount) {
          setCheckboxStatus('termsAccepted', newTermsAcceptedOnScreenForSelectedAccount)
        }
        setCheckboxStatus('defaultAccount', false)
      }
      )
    }
  }

  onToggleTermsAcceptanceOnScreen = termsAccepted => {
    const { termsAcceptedOnScreenForAccounts, currentAccount, termsAcceptedOnScreenForSelectedAccount } = this.state

    if (termsAccepted !== termsAcceptedOnScreenForSelectedAccount) {
      const newTermsAcceptedOnScreenForAccounts = this.persistTermsAndConditionsAcceptanceStatus(currentAccount.id, termsAccepted, termsAcceptedOnScreenForAccounts)
      this.setState({ termsAcceptedOnScreenForSelectedAccount: termsAccepted, termsAcceptedOnScreenForAccounts: newTermsAcceptedOnScreenForAccounts })
    }
  }

  isTermsAndConditionsAcceptedForAccount = (accountId, termsAcceptedOnScreenForAccounts) => (
    termsAcceptedOnScreenForAccounts.indexOf(accountId) >= 0
  )

  persistTermsAndConditionsAcceptanceStatus = (accountId, accepted, termsAcceptedOnScreenForAccounts) => {
    if (this.isTermsAndConditionsAcceptedForAccount(accountId, termsAcceptedOnScreenForAccounts) && !accepted) {
      return termsAcceptedOnScreenForAccounts.filter(id => id !== accountId)
    } else if (!this.isTermsAndConditionsAcceptedForAccount(accountId, termsAcceptedOnScreenForAccounts) && accepted) {
      return termsAcceptedOnScreenForAccounts.concat(accountId)
    } else {
      return termsAcceptedOnScreenForAccounts
    }
  }

  setDisclosureIndicators = selectedDisclosureType => {
    const { disclosureIndicators } = this.state
    const [disclosureType] = disclosureIndicators
    if (disclosureType !== selectedDisclosureType) {
      if (selectedDisclosureType) {
        this.setState({ disclosureIndicators: [selectedDisclosureType] })
      } else {
        this.setState({ disclosureIndicators: [] })
      }
    }
  }

  toggleTermsAndConditions = () => {
    const { showTermsAndConditions } = this.state
    this.setState({ showTermsAndConditions: !showTermsAndConditions })
  }

  transformData = ({ payload }) => {
    let updatedPayload = payload
    if (!payload.termsAccepted) {
      updatedPayload = pluck(['termsAccepted'], updatedPayload)
    }
    if (!payload.defaultAccount) {
      updatedPayload = pluck(['defaultAccount'], updatedPayload)
    }
    return updatedPayload
  }

  render() {
    const { paymentDetails, accounts, editPaymentPayee, failureMessage, cancelSuccessMessage, termsAcceptedAccounts,
      addTermsAcceptedAccount, onTermsAndConditionsDecline, initialSelectedAccountId, potentialDuplicatePayment } = this.props
    const { currentAccount, disclosureIndicators, showTermsAndConditions, termsAndConditionsType, termsRequired, termsAcceptedOnScreenForSelectedAccount } = this.state
    const displaySaveAccount = accounts.size > 1 && currentAccount && (initialSelectedAccountId !== currentAccount.id)
    const selectedAccount = accounts.find(account => account.get('selected'))
    return (
      <Form formId="editPaymentForm" action="/billpay/pendingpayment/save" transform={this.transformData}>
        <div className={styles.editPaymentFormFields}>
          {failureMessage && <MessageDisplay messages={failureMessage} focusOnMount={true} />}
          {cancelSuccessMessage && <MessageDisplay messages={cancelSuccessMessage} />}
          <EditPaymentPayeeName nickName={paymentDetails.get('nickName')} paymentType={paymentDetails.get('paymentType')} />
          <EditPaymentAccount displaySaveAccount={displaySaveAccount}>
            {(accounts && selectedAccount && accounts.size === 1) ?
              <EditPaymentSingleAccount account={accounts.first()} /> :
              <EditPaymentAccountSelect
                accountsList={accounts}
                termsAcceptedAccounts={termsAcceptedAccounts}
                setDisclosureIndicators={this.setDisclosureIndicators}
                addTermsAcceptedAccount={addTermsAcceptedAccount}
                setTermsAndConditionsLink={this.onAccountSelect}
                onTermsAndConditionsDecline={onTermsAndConditionsDecline}
              />
            }
          </EditPaymentAccount>
          <AmountInput amount={paymentDetails.get('amount')} />
          <EditPaymentSendOnDate payee={editPaymentPayee} sendOnDate={paymentDetails.get('sendOnDate')} />
          // perform validation when user enters memo field below. As user types, we need to check the length of characters user enters
          // if length of characters is greater than 32, we need to display a text showing how many characters more user had typed
          // for e.g. if user enters 40 characters, we need to put a message below stating "you have typed 8 characters more"
          // Also as user deletes extra characters, the message should update automatically stating 
          // "you have typed 5 characters more"/ "you have typed 2 characters more"
          
          <Memo fieldId="memo" defaultMemo={paymentDetails.get('memo')} />
          <FormInputHidden fieldId="F" initialValue="J" />
          <FormInputHidden fieldId="id" initialValue={paymentDetails.get('id')} />
          <FormInputHidden fieldId="payeeId" initialValue={paymentDetails.get('payeeId')} />
          <FormInputHidden fieldId="termsRequired" initialValue="Y" />
          <FormInputHidden fieldId="skipPotentialDuplicateCheck" initialValue={potentialDuplicatePayment ? true : ''} />
        </div>
        <TermsAndConditionsLink
          termsAccepted={termsAcceptedOnScreenForSelectedAccount}
          termsAndConditionsType={termsAndConditionsType}
          termsRequired={termsRequired}
          onTermsAndConditionsLinkClick={this.toggleTermsAndConditions}
          onToggleTermsAcceptanceOnScreen={this.onToggleTermsAcceptanceOnScreen}
        />
        <div>
          <EditPaymentFormButtons paymentDetails={paymentDetails} />
        </div>
        {disclosureIndicators.length > 0 && (
          <div className={styles.disclosuresContainer}>
            <AccountDisclosures disclosureIndicators={disclosureIndicators} />
          </div>
        )
        }
        <TermsAndConditionsModal
          isOpen={showTermsAndConditions}
          termType={termsAndConditionsType}
          withActionButtons={false}
          onClose={this.toggleTermsAndConditions}
        />
      </Form>
    )
  }
}

EditPaymentForm.propTypes = {
  paymentDetails: PropTypes.object,
  accounts: PropTypes.object,
  editPaymentPayee: PropTypes.object,
  failureMessage: PropTypes.object,
  payees: PropTypes.object,
  cancelSuccessMessage: PropTypes.object,
  termsAcceptedAccounts: PropTypes.object,
  addTermsAcceptedAccount: PropTypes.func,
  onTermsAndConditionsDecline: PropTypes.func,
  setCheckboxStatus: PropTypes.func,
  initialSelectedAccountId: PropTypes.string
}

const mapStateToProps = state => ({
  paymentDetails: state.app.editPayment.enterDetails.paymentDetails,
  accounts: state.app.editPayment.enterDetails.accounts,
  initialSelectedAccountId: getInitiallySelectedAccountId(state),
  editPaymentPayee: state.app.editPayment.enterDetails.payee,
  failureMessage: state.app.editPayment.enterDetails.failureMessage,
  cancelSuccessMessage: state.app.hub.successMessage,
  payees: state.app.payees.payees,
  termsAcceptedAccounts: state.app.termsAndConditions.termsAcceptedAccounts,
  potentialDuplicatePayment: state.app.editPayment.enterDetails.potentialDuplicatePayment,
})

const mapDispatchToProps = dispatch => ({
  addTermsAcceptedAccount: accountId => dispatch(addTermsAcceptedAccount(accountId)),
  onTermsAndConditionsDecline: accountId => { dispatch(changeField({ formId: 'editPaymentForm', fieldId: 'paymentAccountId', value: accountId })) },
  setCheckboxStatus: (fieldId, status) => { dispatch(changeField({ formId: 'editPaymentForm', fieldId: fieldId, value: status })) }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditPaymentForm)
