import React from 'react'

const withDirtyCheck = Component => {
  class Wrapped extends React.Component {
    onChange = payload => {
      console.log('Dirty check')
      this.props.onChangeCallback && this.props.onChangeCallback(payload)
      return [payload.updates]
    }
    render() {
      return <Component {...this.props} onChangeCallback={this.onChange} />
    }
  }

  return Wrapped
}

export default withDirtyCheck
