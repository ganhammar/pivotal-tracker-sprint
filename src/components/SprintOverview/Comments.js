import React, { PropTypes, Component } from 'react';

import Comment from './Comment';
import TrackerStore from './../../stores/TrackerStore';

class Comments extends Component {
  constructor() {
    super();

    this.state = {
      comments: [],
      memberColorMap: {}
    };
  }

  componentWillMount() {
    this.setState({
      comments: this.props.comments
    });

    const colors = ['#D7866A', '#2079A4', '#A8AFD7', '#25293E', '#BDB1AA',
      '#7087B1', '#3E1A39', '#798F90', '#F9A671', '#3C3433'];
    let memberColorMap = {};
    memberColorMap[TrackerStore.me.id] = '#B1439E';

    this.props.comments.forEach((comment) => {
      if (!memberColorMap[comment.person_id]) {
        memberColorMap[comment.person_id] = colors.splice(0, 1)[0];
      }
    });

    this.setState({ memberColorMap: memberColorMap });
  }

  onCommentCreate(comment) {
    let comments = this.state.comments;

    comments.push(comment);

    this.setState({comments: comments});
    this.props.callback(comments);
  }

  render() {
    let comments = [];

    this.props.comments.forEach((comment) => {
      comments.push(<Comment key={comment.id} comment={comment}
        projectId={this.props.projectId} storyId={this.props.storyId}
        color={this.state.memberColorMap[comment.person_id]} />);
    });

    return (<div>
      {comments}
      <Comment projectId={this.props.projectId} storyId={this.props.storyId}
        createCallback={this.onCommentCreate.bind(this)}
        color={this.state.memberColorMap[TrackerStore.me.id]} />
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
