import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Components
import PostList from '../../components/PostList';
import PostCreateWidget from '../../components/PostCreateWidget/PostCreateWidget';
import CommentCreateWidget from '../../components/CommentCreateWidget/CommentCreateWidget';
import CommentEditWidget from '../../components/CommentEditWidget/CommentEditWidget';

// Import Actions
import { addPostRequest, fetchPosts, deletePostRequest, addCommentRequest, editCommentRequest, deleteCommentRequest } from '../../PostActions';

// Import Togglers Actions
import { toggleAddPost, toggleAddComment, toggleEditComment } from '../../../App/AppActions';

// Import Selectors
import { getShowAddPost, getShowAddComment, getShowEditComment } from '../../../App/AppReducer';
import { getPosts } from '../../PostReducer';

class PostListPage extends Component {
  state = {
    postId: null,
    commentId: null,
  };
  componentDidMount() {
    this.props.dispatch(fetchPosts());
  }

  handleDeletePost = post => {
    if (confirm('Do you want to delete this post')) {// eslint-disable-line
      this.props.dispatch(deletePostRequest(post));
    }
  };

  handleAddPost = (name, title, content) => {
    this.props.dispatch(toggleAddPost());
    this.props.dispatch(addPostRequest({ name, title, content }));
  };

  handleAddComment = (...args) => {
    if (!Array.isArray(...args)) {
      this.setState({ postId: args[0] });
      this.props.dispatch(toggleAddComment());
    }
    if (args.length > 1) {
      const [postId, name, text] = args;
      this.props.dispatch(addCommentRequest(postId, { name, text }));
    }
  };

  handleEditComment = (...args) => {
    if (!Array.isArray(...args)) {
      const { postID, commentID } = args[0];
      this.setState({ postId: postID, commentId: commentID });
      this.props.dispatch(toggleEditComment());
    }
    if (args.length > 1) {
      const [postId, name, text] = args;
      const { commentId } = this.state;
      this.props.dispatch(editCommentRequest(postId, { commentId, name, text }));
    }
  };

  handleDeleteComment = postIDAndCommentIDObj => {
    if (confirm('Do you want to delete this comment')) {// eslint-disable-line
      this.props.dispatch(deleteCommentRequest(postIDAndCommentIDObj));
    }
  };

  render() {
    const { postId } = this.state;
    const { showAddPost, posts, showAddComment, showEditComment } = this.props;
    return (
      <div>
        <PostCreateWidget
          addPost={this.handleAddPost}
          showAddPost={showAddPost}
        />
        <CommentCreateWidget
          addComment={this.handleAddComment}
          showAddComment={showAddComment}
          postId={postId}
        />
        <CommentEditWidget
          editComment={this.handleEditComment}
          showEditComment={showEditComment}
          postId={postId}
        />
        <PostList
          handleDeletePost={this.handleDeletePost}
          posts={posts}
          handleCreateComment={this.handleAddComment}
          handleEditComment={this.handleEditComment}
          handleDeleteComment={this.handleDeleteComment}
          showAddComment={showAddComment}
          showEditComment={showEditComment}
        />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
PostListPage.need = [() => { return fetchPosts(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    showAddPost: getShowAddPost(state),
    posts: getPosts(state),
    showAddComment: getShowAddComment(state),
    showEditComment: getShowEditComment(state),
  };
}

PostListPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  })).isRequired,
  showAddPost: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  showAddComment: PropTypes.bool.isRequired,
  showEditComment: PropTypes.bool.isRequired,
};

PostListPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(PostListPage);
