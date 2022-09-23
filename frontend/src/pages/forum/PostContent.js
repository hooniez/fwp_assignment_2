import { Card, Row, Col } from "react-bootstrap";
import styles from "./PostContent.module.css";
import deletedUserIcon from "./delete-user.png";
import convertTime from "../../util/convertTime";
import {
  PencilFill,
  TrashFill,
  ArrowReturnRight,
  Chat,
  Heart,
  Megaphone,
} from "react-bootstrap-icons";
import PostForm from "./PostForm";
import { useLocation } from "react-router-dom";

export default function PostContent({
  post,
  user,
  editModalToggler,
  deleteModalToggler,
  imgToggleHandler,
  commentsModalToggler,
  numComments,
  replyModalToggler,
  isReplying,
  incrementNumChildPosts,
}) {
  // const location = useLocation();
  // If the user who posted a post has been deleted, show deletedUserIcon.
  const avatarSrc = post.user.isDeleted ? deletedUserIcon : post.user.avatarSrc;

  // If the user who posted a post has been deleted, show Delted User.
  const posterName = post.user.isDeleted
    ? "Deleted User"
    : `${post.user.firstName} ${post.user.lastName}`;

  return (
    <>
      <div className="d-flex">
        {isReplying ? (
          <div>
            <img
              src={avatarSrc}
              className={`${styles.avatar}`}
              alt="Avatar"
            ></img>
          </div>
        ) : (
          <div>
            <img
              src={avatarSrc}
              className={`${styles.avatar}`}
              alt="Avatar"
            ></img>
          </div>
        )}

        <div className={`${styles.contentContainer} flex-grow-1`}>
          <div className="d-flex justify-content-between pb-1">
            <div>
              <span className={styles.name}>{posterName}</span>
              <span>&nbsp;&#183;&nbsp;</span>
              <span className={styles.greyedOutText}>{`${post.postedBy}`}</span>
              <span>&nbsp;&#183;&nbsp;</span>
              <span className={styles.greyedOutText}>
                {convertTime(post.datePosted)}
              </span>
            </div>

            {post.postedBy === user.data.email && !isReplying && (
              <div>
                <PencilFill
                  color="royalblue"
                  role="button"
                  onClick={editModalToggler}
                  className={`${styles.iconMargin} ${styles.icons}`}
                ></PencilFill>
                <TrashFill
                  color="royalblue"
                  role="button"
                  onClick={deleteModalToggler}
                  className={`${styles.iconMargin} ${styles.icons}`}
                ></TrashFill>
              </div>
            )}
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.text }} />
          {post.imgSrc && (
            <div className={styles.uploadedImageContainer}>
              {isReplying ? (
                <img src={post.imgSrc} className={styles.uploadedImage} />
              ) : (
                <img
                  src={post.imgSrc}
                  className={styles.uploadedImage}
                  role="button"
                  onClick={imgToggleHandler}
                />
              )}
            </div>
          )}

          {/* <Col xs={{ span: 1 }} className="position-relative"> */}
          {/* <div
                      className={styles.uploadedImageContainer}
                      
                    > */}
          {/* </div> */}
          {/* </Col> */}
          {!isReplying && (
            <Row>
              <Col xs={3}>
                <ArrowReturnRight
                  role="button"
                  onClick={replyModalToggler}
                ></ArrowReturnRight>
              </Col>
              <Col xs={3}>
                {/* <Link to="/modal" state={{background: location}}
                  className="d-inline-block"
                  onClick={commentsModalToggler}
                  role="button">
                
                  <Chat
                    className={`${styles.iconMargin} ${styles.icons}`}
                    color="slategrey"
                  />
                  <span className={styles.greyedOutText}>{numComments}</span>
                </Link> */}
                <div
                  className="d-inline-block"
                  onClick={commentsModalToggler}
                  role="button"
                >
                  <Chat
                    className={`${styles.iconMargin} ${styles.icons}`}
                    color="slategrey"
                  />
                  <span className={styles.greyedOutText}>{numComments}</span>
                </div>
              </Col>
              <Col xs={3}>
                <div
                  className="d-inline-block"
                  onClick={commentsModalToggler}
                  role="button"
                >
                  <Heart
                    className={`${styles.iconMargin} ${styles.icons}`}
                  ></Heart>
                  <span className={styles.greyedOutText}>{numComments}</span>
                </div>
              </Col>
              <Col xs={3}>
                <Megaphone role="button"></Megaphone>
              </Col>
            </Row>
          )}
        </div>
      </div>
      {isReplying && (
        <>
          <hr></hr>
          <PostForm
            key={post.id}
            user={user}
            // className={styles.commentForm}
            // addComment={addComment}
            // deleteComment={deleteComment}
            // postId={commentId}
            forComments={true}
            parentPostId={post.id}
            replyTo={post.postedBy}
            post={null}
            incrementNumChildPosts={incrementNumChildPosts}
            replyModalToggelr={replyModalToggler}
          />
        </>
      )}
    </>
  );
}