
const form = document.getElementById("questionForm");
const questionInput = document.getElementById("question");
const askBtn = document.getElementById("askBtn");
const answer = document.getElementById("answer");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questionInput.value.trim();

    if (!question) {
        message.textContent = "Please enter a question.";
        return;
    }

    askBtn.disabled = true;
    message.textContent = "Thinking... Please wait.";
    answer.textContent = "";

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to get an answer.");
        }

        answer.textContent = data.answer || "No answer was returned.";
        message.textContent = "";

    } catch (error) {
        message.textContent =
            error.message || "Something went wrong. Please try again.";
    } finally {
        askBtn.disabled = false;
    }
});
