import FormFieldLabel from 'wf-dbd-react-ui/es/FormFieldLabel'
import FormFieldErrors from 'wf-dbd-react-ui/es/FormFieldErrors'
import MockStoreProvider from 'wf-dbd-react-ui/es/MockStoreProvider'
import { getString } from 'wf-dbd-react-ui/es/lib'

import Memo from '../Memo'
import FormInput from '../../../with-dirty-check/FormInput'

jest.mock('wf-dbd-react-ui/es/lib', () => ({
  getString: jest.fn().mockImplementation(() => 'Optional'),
  globals: jest.fn().mockImplementation(() => ({
    billpayBusinessUser: true
  }))
}))

describe('Memo Component', () => {
  let wrapper
  const coreState = {
    strings: {
      'optional': 'Optional'
    }
  }

  describe('when rendering', () => {

    beforeEach(() => {
      wrapper = mount(
        <MockStoreProvider digitalCoreState={coreState}>
          <Memo.WrappedComponent fieldId={'ImRequired'} getString={getString} defaultMemo="memo" />
        </MockStoreProvider>
      )
    })

    it('renders FormInput component', () => {
      expect(wrapper.find(FormInput)).toHaveLength(1)
      expect(wrapper.find(FormInput).prop('initialValue')).toBe('memo')
      expect(wrapper.find(FormInput).prop('placeholder')).toBe('Optional')
    })

    it('renders FormFieldLabel component', () => {
      expect(wrapper.find(FormFieldLabel)).toHaveLength(1)
    })

    it('renders FormFieldErrors component', () => {
      expect(wrapper.find(FormFieldErrors)).toHaveLength(1)
    })
  })
})
