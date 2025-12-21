export default function pingRender() {
  let feedback = "No feedback..";
  fetch("https://colys-blindate.onrender.com")
    .then((response) => {
      if (response.status === 200) {
        feedback = "up";
      } else if (response.status === 404) {
        feedback = "Can't reach the Room server!";
      } else {
        feedback = "down";
      }
    })
    .catch((error) => (feedback = error));
  return feedback;
}
