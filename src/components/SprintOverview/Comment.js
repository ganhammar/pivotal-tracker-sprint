import React, { PropTypes, Component } from 'react';
import Moment from 'moment';

import CommentApi from './../../api/CommentApi';
import GetMember from './../../utils/GetMember';
import TrackerStore from './../../stores/TrackerStore';

class Comment extends Component {
  constructor() {
    super();

    this.state = {
      text: '',
      memberName: '',
      initials: '',
      at: '',
      isCreate: false
    };
  }

  componentWillMount() {
    const comment = this.props.comment || {};
    const member = GetMember(comment.person_id) || {};
    const memberName = member.name || (comment.id ? 'Unknown' : '');
    const initials = member.initials || (comment.id ? '??' : TrackerStore.me.initials);
    const at = comment.id ? Moment(comment.updated_at).format('LLLL') : '';

    this.setState({
      text: comment.text || '',
      memberName: memberName,
      initials: initials,
      at: at,
      isCreate: comment.id ? false : true
    });
  }

  onCreateClick() {
    const body = {
      text: this.state.text
    };

    CommentApi.post(this.props.projectId, this.props.storyId, body)
      .then((result) => {
        this.props.createCallback(result);

        this.setState({
          text: ''
        });
      });
  }

  onChange(event) {
    this.setState({text: event.target.value});
  }

  render() {
    let text;
    let className;
    let at;

    if (this.state.isCreate) {
      text = (<div>
          <textarea value={this.state.text}
            onChange={this.onChange.bind(this)} />
          <button className="button positive right"
            onClick={this.onCreateClick.bind(this)}>Add</button>
        </div>);
      className = 'me';
    } else {
      text = this.state.text || <i>No text content.</i>;
      className = TrackerStore.me.id === this.props.comment.person_id
        ? 'me' : '';
      at = <span className="comment__text__at">{this.state.at}</span>;
    }

    return (<div className={`comment ${className}`}>
      <div className="comment__initials" style={{ backgroundColor: this.props.color }}>
        {this.state.initials}
      </div>
      <div className="comment__text standardform">
        {text}
        {at}
      </div>
    </div>);
  }
}

Comment.propTypes = {
  comment: PropTypes.object,
  createCallback: PropTypes.func,
  projectId: PropTypes.number.isRequired,
  storyId: PropTypes.number.isRequired,
  color: PropTypes.string
};

export default Comment;
