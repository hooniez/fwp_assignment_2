import { useContext, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import PostsContext from "../../contexts/PostsContext";
import { getReactions } from "../../data/repository";
import ReactionChart from "../../fragments/ReactionChart";

export default function AnalyticsModalPosts({
  isGraphicModalVisible,
  toggleGraphicModalVisible,
  post,
  postIdx,
}) {
  const { dispatchPosts } = useContext(PostsContext);

  useEffect(() => {
    const loadReactions = async () => {
      // currentReactions: [{reaction: 1}, {reaction: 1}, {reaction: -1}]
      const currentReactions = await getReactions(post.id);
      // reactions: [1, 1, -1]
      const reactions = currentReactions.map((el) => el.reaction);
      let res = [0, 0];
      // Count the number of likes and dislikes: from the example above,
      // res == [2, 1] after forEach.
      reactions.forEach((el) => {
        if (el === 1) {
          res[0] += 1;
        } else {
          res[1] += 1;
        }
      });

      dispatchPosts({
        type: "SET_REACTION_FOR_POST_BY_IDX",
        payload: { idx: postIdx, reactions: res },
      });
    };

    loadReactions();
  }, [dispatchPosts, post?.id, postIdx]);

  return (
    <Modal
      size="md"
      show={isGraphicModalVisible}
      onHide={() => {
        toggleGraphicModalVisible(postIdx);
      }}
      centered
    >
      <ModalHeader closeButton>
        <ModalTitle>Visual Analytics</ModalTitle>
      </ModalHeader>
      <ModalBody>
        {post != null && <ReactionChart postIdx={postIdx} />}
      </ModalBody>
    </Modal>
  );
}
