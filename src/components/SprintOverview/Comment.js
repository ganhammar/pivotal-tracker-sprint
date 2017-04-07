import React, { PropTypes, Component } from 'react';

import CommentApi from './../../api/CommentApi';
import GetMember from './../../utils/GetMember';

class Comment extends Component {
  constructor() {
    super();

    this.state = {
      text: '',
      memberName: ''
    };
  }

  componentWillMount() {
    const comment = this.props.comment;
    const member = GetMember(comment.person_id) || {};
    const memberName = member.name || (comment.id ? 'Unknown' : '');

    this.setState({
      text: comment.text || '',
      memberName: memberName
    });
  }

  render() {
    return (<div>
      <div>{this.state.memberName}</div>
      <div>{this.state.text}</div>
    </div>);
  }
}

Comment.propTypes = {
  comment: PropTypes.object,
  createCallback: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
  storyId: PropTypes.number.isRequired,
};

export default Comment;
