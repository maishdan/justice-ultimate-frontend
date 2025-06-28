document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openChat");
  const closeBtn = document.getElementById("closeChat");
  const chatContainer = document.getElementById("chatContainer") || document.body.appendChild(document.createElement('div'));

  if (!chatContainer.innerHTML.includes("chatHeader")) {
    fetch("justice-chat.html")
      .then(res => res.text())
      .then(html => {
        chatContainer.innerHTML = html;
        chatContainer.id = "chatContainer";
        document.body.appendChild(chatContainer);
      });
  }

  openBtn.addEventListener("click", () => {
    chatContainer.style.display = "flex";
    document.getElementById("chatBody").innerHTML += `
      <div class="message bot">Hello Justice Vincent, I'm interested in your services.</div>`;
  });

  closeBtn?.addEventListener("click", () => {
    chatContainer.style.display = "none";
  });

  document.getElementById("sendMessage")?.addEventListener("click", () => {
    const input = document.getElementById("messageInput");
    const chatBody = document.getElementById("chatBody");
    if (input?.value.trim()) {
      chatBody.innerHTML += `<div class='message user'>${input.value}</div>`;
      input.value = "";
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  });
});