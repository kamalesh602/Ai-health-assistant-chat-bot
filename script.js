const WEBHOOK_URL =
  "https://naveen21.app.n8n.cloud/webhook/c4577dd0-e5ee-475f-8b4b-ee01a9125e87/chat";

// Persistent session
const sessionId =
  localStorage.getItem("sessionId") ||
  (() => {
    const id = "sess_" + Math.random().toString(36).slice(2);
    localStorage.setItem("sessionId", id);
    return id;
  })();

function addMessage(text, type) {
  const chatBox = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user-msg");
  input.value = "";

  // typing indicator
  addMessage("Typing...", "bot-msg");
  const typingEl = document.querySelector(".bot-msg:last-child");

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatInput: message,
        sessionId: sessionId
      })
    });

    const text = await res.text();
    const data = JSON.parse(text);
    typingEl.innerText = data.output || "No response";

  } catch (err) {
    typingEl.innerText = "Server error. Try again.";
  }
}
