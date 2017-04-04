import React, { PropTypes, Component } from 'react';
import ReactMarkdown from 'react-markdown';

class DescriptionEdit extends Component {
  constructor() {
    super();

    this.state = {
      description: '',
      origDescription: '',
      isEditingDescription: false
    };
  }

  componentWillMount() {
    this.setState({
      description: this.props.description,
      origDescription: this.props.description
    });
  }

  onToggle() {
    this.setState({ isEditingDescription: !this.state.isEditingDescription });
  }

  onDone() {
    this.setState({
      isEditingDescription: false,
      origDescription: this.state.description
    });
  }

  onChange(event) {
    this.setState({description: event.target.value});
    this.props.callback(event.target.value);
  }

  onCancel() {
    this.setState({
      isEditingDescription: false,
      description: this.state.origDescription
    });
    this.props.callback(this.state.origDescription);
  }

  onKeyDown(event) {
    if (event.key === 'Escape') {
      this.onCancel();
    }
  }

  render() {
    let description;

    if (this.state.isEditingDescription) {
      description = (<div>
          <textarea name="description" value={this.state.description}
            onKeyDown={this.onKeyDown.bind(this)}
            onChange={this.onChange.bind(this)} />
          <span onClick={this.onCancel.bind(this)}>Cancel</span>
          <span onClick={this.onDone.bind(this)}>Done</span>
        </div>);
    } else {
      description = (<div onClick={this.onToggle.bind(this)}>
          <ReactMarkdown source={this.state.description || ''} />
        </div>);
    }

    return description;
  }
}

DescriptionEdit.propTypes = {
  description: PropTypes.string,
  callback: PropTypes.func.isRequired
};

export default DescriptionEdit;
