import { Modal } from "react-bootstrap";
import styles from "./Comments.module.css";
import { XLg } from "react-bootstrap-icons";
import PostsPage from "./PostsPage";

export default function Comments({
  user,
  editPost,
  removePost,
  commentsModalVisible,
  commentsModalToggler,
  parentPost,
  numComments,
  incrementNumChildPostsRoot,
  decrementNumChildPostsRoot,
  heartHandlerRoot,
  thumbDownHandlerRoot,
}) {
  return (
    <Modal
      show={commentsModalVisible}
      onHide={commentsModalToggler}
      centered
      fullscreen
    >
      <Modal.Header className="d-flex justify-content-center">
        <div className={styles.modalHeaderContainer}>
          <Modal.Title>Comments</Modal.Title>
          <XLg size={20} role="button" onClick={commentsModalToggler}></XLg>
        </div>
      </Modal.Header>
      <Modal.Body id={`modalBody${parentPost.id}`}>
        {numComments === 0 ? (
          <div className="d-flex justify-content-center">
            <p className="tex">No comments yet</p>
          </div>
        ) : (
          <PostsPage
            key={parentPost.id}
            numComments={numComments}
            parentPost={parentPost}
            defaultUser={user}
            editParentPost={editPost}
            removeParentPost={removePost}
            incrementNumChildPostsRoot={incrementNumChildPostsRoot}
            decrementNumChildPostsRoot={decrementNumChildPostsRoot}
            heartHandlerRoot={heartHandlerRoot}
            thumbDownHandlerRoot={thumbDownHandlerRoot}
          ></PostsPage>
        )}
      </Modal.Body>
    </Modal>
  );
}
