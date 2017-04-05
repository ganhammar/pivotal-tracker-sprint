import React, { PropTypes, Component } from 'react';

import GetMember from './../../utils/GetMember';

class Comments extends Component {
  render() {
    let comments = [];

    for (let i = 0; i < this.props.comments.length; i++) {
      let comment = this.props.comments[i];
      let member = GetMember(comment.person_id) || {};
      member = member.name || 'Unknown';

      comments.push(<div key={comment.id}>
          <div>{member}</div>
          <div>{comment.text}</div>
        </div>);
    }

    return (<div>
      {comments}
    </div>);
  }
}

Comments.propTypes = {
  comments: PropTypes.object,
  projectId: PropTypes.number.isRequired
};

export default Comments;
