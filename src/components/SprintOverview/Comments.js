import React, { PropTypes, Component } from 'react';

import Comment from './Comment';

class Comments extends Component {
  constructor() {
    super();

    this.state = {
      comments: []
    };
  }

  componentWillMount() {
    this.setState({
      comments: this.props.comments
    });
  }

  onCommentCreate(comment) {

  }

  render() {
    let comments = [];

    this.props.comments.forEach((comment) => {
      comments.push(<Comment key={comment.id} comment={comment}
        projectId={this.props.projectId} storyId={this.props.storyId}
        createCallback={this.onCommentCreate.bind(this)} />);
    })

    return (<div>
      {comments}
    </div>);
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired,
  storyId: PropTypes.number.isRequired,
  callback: PropTypes.func.isRequired
};

export default Comments;
