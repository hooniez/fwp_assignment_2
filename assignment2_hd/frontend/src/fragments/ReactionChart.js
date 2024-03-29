import { useContext } from "react";
import PostsContext from "../contexts/PostsContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Container } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReactionChart({ postIdx }) {
  const { posts } = useContext(PostsContext);
  const data = {
    labels: ["Like", "Dislike"],
    datasets: [
      {
        label: "# of Likes and Dislikes",
        data: posts[postIdx].reactions,
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Container>
      <div>
        <h2 className="text-center">Reaction Metrics</h2>
        <Pie data={data} />
      </div>
    </Container>
  );
}
