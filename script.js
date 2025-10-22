const chat = document.getElementById("chat");
const userAvatar = "https://cdn-icons-png.flaticon.com/512/1144/1144760.png";
const botAvatar = "https://cdn-icons-png.flaticon.com/512/4712/4712106.png";

window.onload = function () {
  loadTheme();
  const saved = JSON.parse(localStorage.getItem("chatHistory") || "[]");
  for (let msg of saved) renderMessage(msg.text, msg.sender, false);
};

function addMessage(text, sender) { renderMessage(text, sender, true); }

function renderMessage(text, sender, saveToStorage) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = sender === "user" ? userAvatar : botAvatar;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = text;
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(bubble);
  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
  if (saveToStorage) {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.push({ text, sender });
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }
}

async function handleInput() {
  const inputElem = document.getElementById("userInput");
  const userText = inputElem.value.trim();
  if (!userText) return;
  addMessage(userText, "user");
  inputElem.value = "";
  addMessage("Thinking...", "bot");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });
    const data = await res.json();
    const botReply = data.choices?.[0]?.message?.content || "Sorry, something went wrong.";
    chat.lastChild.remove();
    addMessage(botReply.trim(), "bot");
  } catch (err) {
    chat.lastChild.remove();
    addMessage("Error connecting to API.", "bot");
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}
function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") document.body.classList.add("dark");
    }
