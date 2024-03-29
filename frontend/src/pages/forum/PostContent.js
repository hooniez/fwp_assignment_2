import { Row, Col } from "react-bootstrap";
import styles from "./PostContent.module.css";
import deletedUserIcon from "./delete-user.png";
import convertTime from "../../util/convertTime";
import {
  PencilFill,
  TrashFill,
  ArrowReturnRight,
  Chat,
  Heart,
  HandThumbsDown,
  HandThumbsDownFill,
  HeartFill,
} from "react-bootstrap-icons";
import PostForm from "./PostForm";
import { useNavigate } from "react-router-dom";
import {
  createVisitEntry,
  findUser,
  getAllFollowers,
  getAllFollowing,
} from "../../data/repository";

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
  incrementNumChildPostsRoot,
  addComment,
  numCommentsRoot,
  onProfile,
  profileUser,
  hearterIds,
  thumbDownerIds,
  heartHandler,
  thumbDownHandler,
  heartHandlerRoot,
  thumbDownHandlerRoot,
  rootPost,
}) {
  let navigate = useNavigate();
  // If the user who posted a post has been deleted, show deletedUserIcon.
  const avatarSrc = post.user.isDeleted ? deletedUserIcon : post.user.avatarSrc;

  // If the user who posted a post has been deleted, show nothing.
  const posterEmail = post.user.isDeleted ? "" : `${post.user.email}`;

  const visitProfile = async () => {
    // If user is not the same as post.user, create a visit entry
    if (user.data.email !== post.user.email) {
      await createVisitEntry(user.data.email, post.user.email);
    }
    navigate(`/profiles/${posterEmail}`, {
      state: {
        user: await findUser(posterEmail),
        justLoggedIn: false,
        following: await getAllFollowing(post.user.id),
        followers: await getAllFollowers(post.user.id),
      },
    });
  };

  return (
    <>
      <div className="d-flex">
        <div>
          <img
            src={avatarSrc}
            className={`${styles.avatar}`}
            alt="Avatar"
            onClick={visitProfile}
            role="button"
          ></img>
        </div>

        <div className={`${styles.contentContainer} flex-grow-1`}>
          <div className="d-flex justify-content-between pb-1">
            <div>
              {onProfile ? (
                <span className={styles.name}>
                  {profileUser.id === user.data.id
                    ? `${user.data.firstName} ${user.data.lastName}`
                    : `${profileUser.firstName} ${profileUser.lastName}`}
                </span>
              ) : (
                <span className={styles.name}>
                  {post.user.isDeleted
                    ? "Deleted User"
                    : `${post.user.firstName} ${post.user.lastName}`}
                </span>
              )}

              {!post.user.isDeleted && (
                <>
                  <span>&nbsp;&#183;&nbsp;</span>
                  <span
                    className={styles.greyedOutText}
                  >{`${posterEmail}`}</span>
                </>
              )}

              <span>&nbsp;&#183;&nbsp;</span>
              <span className={styles.greyedOutText}>
                {convertTime(post.datePosted)}
              </span>
            </div>

            {post.postedBy === user?.data.id && !isReplying && (
              <div>
                <PencilFill
                  title={`pencil${post.id}`}
                  color="royalblue"
                  role="button"
                  onClick={editModalToggler}
                  className={`${styles.iconMargin} ${styles.icons}`}
                ></PencilFill>
                <TrashFill
                  title={`trash${post.id}`}
                  color="royalblue"
                  role="button"
                  onClick={deleteModalToggler}
                  className={`${styles.iconMargin} ${styles.icons}`}
                ></TrashFill>
              </div>
            )}
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: post.isDeletedByAdmin
                ? "[**** This post has been deleted by the admin ***]"
                : post.text,
            }}
          />
          {post.imgSrc && (
            <div className={styles.uploadedImageContainer}>
              {isReplying ? (
                <img
                  src={post.imgSrc}
                  className={styles.uploadedImage}
                  alt="post"
                />
              ) : (
                <img
                  src={post.imgSrc}
                  className={styles.uploadedImage}
                  role="button"
                  onClick={imgToggleHandler}
                  alt="post"
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
            <Row className="mt-3">
              <Col xs={3}>
                <ArrowReturnRight
                  title={`arrow${post.id}`}
                  data-test-icon={`arrow${post.id}`}
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
                    data-test-icon={`chat${post.id}`}
                    className={`${styles.iconMargin} ${styles.icons}`}
                    color="slategrey"
                  />
                  <span
                    data-test-span={`numComments${post.id}`}
                    className={styles.greyedOutText}
                  >
                    {numCommentsRoot == null ? numComments : numCommentsRoot}
                  </span>
                </div>
              </Col>
              <Col xs={3}>
                <div
                  className="d-inline-block"
                  onClick={
                    rootPost
                      ? () => {
                          heartHandlerRoot();
                          heartHandler();
                        }
                      : heartHandler
                  }
                  role="button"
                  data-test-button={`heartButton${post.id}`}
                >
                  {hearterIds.has(user?.data.id) ? (
                    <>
                      <HeartFill
                        color="red"
                        className={`${styles.iconMargin} ${styles.icons}`}
                        data-test-icon={`heartFill${post.id}`}
                      ></HeartFill>
                      <span
                        className={styles.greyedOutText}
                        data-test-span={`heartFill${post.id}`}
                      >
                        {hearterIds.size}
                      </span>
                    </>
                  ) : (
                    <>
                      <Heart
                        className={`${styles.iconMargin} ${styles.icons}`}
                        data-test-icon={`heart${post.id}`}
                      ></Heart>
                      <span
                        className={styles.greyedOutText}
                        data-test-span={`heart${post.id}`}
                      >
                        {hearterIds.size}
                      </span>
                    </>
                  )}
                </div>
              </Col>
              <Col xs={3}>
                <div
                  className="d-inline-block"
                  onClick={
                    rootPost
                      ? () => {
                          thumbDownHandlerRoot();
                          thumbDownHandler();
                        }
                      : thumbDownHandler
                  }
                  role="button"
                  data-test-button={`thumbDownButton${post.id}`}
                >
                  {thumbDownerIds.has(user?.data.id) ? (
                    <>
                      <HandThumbsDownFill
                        color="grey"
                        className={`${styles.iconMargin} ${styles.icons}`}
                        role="button"
                        data-test-icon={`thumbDownFill${post.id}`}
                      ></HandThumbsDownFill>
                      <span
                        className={styles.greyedOutText}
                        data-test-span={`thumbDownFill${post.id}`}
                      >
                        {thumbDownerIds.size}
                      </span>
                    </>
                  ) : (
                    <>
                      <HandThumbsDown
                        className={`${styles.iconMargin} ${styles.icons}`}
                        role="button"
                        data-test-icon={`thumbDown${post.id}`}
                      ></HandThumbsDown>
                      <span
                        className={styles.greyedOutText}
                        data-test-span={`thumbDown${post.id}`}
                      >
                        {thumbDownerIds.size}
                      </span>
                    </>
                  )}
                </div>
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
            addComment={addComment}
            forComments={true}
            parentPostId={post.id}
            replyTo={post.user.email}
            post={null}
            incrementNumChildPosts={incrementNumChildPosts}
            incrementNumChildPostsRoot={incrementNumChildPostsRoot}
            replyModalToggelr={replyModalToggler}
          />
        </>
      )}
    </>
  );
}
