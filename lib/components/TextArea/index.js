import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import CustomPropTypes from '../../util/CustomPropTypes'
import classnames from 'classnames'
import shortid from 'shortid'
import themeable from '../../util/themeable'

import { pickProps, omitProps } from '../../util/passthroughProps'

import styles from './styles.css'
import theme from './theme.js'

import FormField from '../FormField'

/**
  A standard textarea field (resizable)

  ```jsx_example
  <TextArea label="Description" resize="vertical" />
  ```

  A textarea field with errors

  ```jsx_example
  <TextArea messages={[{ text: 'Invalid description', type: 'error' }]} label="Description" />
  ```

  A textarea with a screenreader only label

  ```jsx_example
  <TextArea label={
    <ScreenReaderContent>Description</ScreenReaderContent>
    } placeholder="describe something"/>
  ```

  An inline textarea with a fixed width, initial height and maxHeight

  ```jsx_example
  <div style={{display: 'flex', alignItems: 'center'}}>
    <TextArea
      label={<ScreenReaderContent>Label</ScreenReaderContent>}
      isBlock={false}
      width="10em"
      height="10em"
      maxHeight="250px"
    />
    &nbsp;
    <Typography>foo</Typography>
  </div>
  ```

  A 'controlled' TextArea

  ```jsx_example

  class App extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        description: 'Hello World'
      }
    }

    handleChange = (value) => {
      this.setState({
        description: value
      })
    }

    render () {
      return (
        <TextArea
          label="Description"
          value={this.state.description}
          onChange={this.handleChange}
        />
      )
    }
  }

  <App/>
  ```
**/
@themeable(theme, styles)
class TextArea extends Component {
  static propTypes = {
    label: PropTypes.node.isRequired,
    id: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
    * the textarea will expand vertically to fit the height of the content
    */
    autoGrow: PropTypes.bool,
    /**
    * is the textarea resizable (in supported browsers)
    */
    resize: PropTypes.oneOf(['none', 'both', 'horizontal', 'vertical']),
    /**
    * a fixed width for the textarea
    */
    width: PropTypes.string,
    /**
    * a initial height for the textarea (if autoGrow is true it will grow vertically)
    */
    height: PropTypes.string,
    /**
    * when autoGrow is true, the textarea will never grow beyond this value (in pixels)
    */
    maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
    * object with shape: `{
    * text: PropTypes.string,
    * type: PropTypes.oneOf(['error', 'hint', 'success', 'screenreader-only'])
    *   }`
    */
    messages: PropTypes.arrayOf(CustomPropTypes.formFieldMessage),
    isBlock: PropTypes.bool,
    /**
    * Html placeholder text to display when the input has no value. This should be hint text, not a label
    * replacement.
    */
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    /**
    * a function that provides a reference to the actual textarea element
    */
    textareaRef: PropTypes.func,
    /**
    * value to set on initial render
    */
    defaultValue: PropTypes.string,
    /**
    * the selected value (must be accompanied by an `onChange` prop)
    */
    value: CustomPropTypes.controllable(PropTypes.string),
    /**
    * when used with the `value` prop, the component will not control its own state
    */
    onChange: PropTypes.func
  }

  static defaultProps = {
    size: 'medium',
    autoGrow: true,
    resize: 'none',
    isBlock: true,
    messages: [],
    disabled: false,
    textareaRef: function (textarea) {}
  }

  constructor (props) {
    super()

    this._defaultId = 'TextArea__' + shortid.generate()
  }

  componentDidMount () {
    this.autoGrow()
  }

  componentDidUpdate () {
    this.autoGrow()
  }

  autoGrow () {
    if (!this.props.autoGrow || !this.value) {
      return
    }

    let minHeight = this._textarea.scrollHeight
    let maxHeight = this.props.maxHeight

    if (maxHeight && minHeight > (maxHeight = parseInt(maxHeight))) {
      minHeight = maxHeight
    }

    this._textarea.style.minHeight = minHeight + 'px'
  }

  focus () {
    this._textarea.focus()
  }

  handleChange = (event) => {
    const { onChange, value } = this.props

    if (value === undefined) {
      this.setState({ value: event.target.value })
    }

    if (typeof onChange === 'function') {
      onChange(event.target.value)
    }
  }

  get invalid () {
    return this.props.messages && this.props.messages.find((message) => { return message.type === 'error' })
  }

  get id () {
    return this.props.id || this._defaultId
  }

  get focused () {
    return (document.activeElement === ReactDOM.findDOMNode(this._textarea))
  }

  get value () {
    return ReactDOM.findDOMNode(this._textarea).value
  }

  render () {
    const {
      placeholder,
      value,
      defaultValue,
      disabled,
      required,
      width,
      height,
      textareaRef,
      resize,
      size
    } = this.props

    const props = omitProps(this.props, TextArea.propTypes)

    const classes = {
      [styles.textarea]: true,
      [styles[size]]: true
    }

    const style = {
      width,
      resize,
      height
    }

    return (
      <FormField
        {...pickProps(this.props, FormField.propTypes)}
        id={this.id}
      >
        <textarea
          {...props}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          ref={(textarea, ...args) => {
            this._textarea = textarea
            textareaRef.apply(this, [textarea].concat(args))
          }}
          style={style}
          id={this.id}
          required={required}
          aria-required={required}
          aria-invalid={this.invalid ? 'true' : null}
          disabled={disabled}
          aria-disabled={disabled ? 'true' : null}
          className={classnames(classes)}
          onChange={this.handleChange}
        />
      </FormField>
    )
  }
}

export default TextArea
