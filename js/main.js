// import { createWlcMessage } from "./connect4.js"
let ownUser
let allUsers = []
let userColorOne = Math.floor(Math.random(300) * 300)
let userColorTwo = Math.floor(Math.random(300) * 300)

function showUser(userName) {
  let userEl = document.createElement("div")
  userEl.innerHTML = `<img src="https://api.adorable.io/avatars/128/anas.png"
  class = "mdl-list__item-avatar"/>
  <span class="title-name">${userName}</span>`
  userEl.style.display = "flex"
  userEl.style.alignItems = "center"
  let userHeader = document.getElementById("header-right")
  userHeader.append(userEl)
  ownUser = userName
  allUsers.push(ownUser)
}

function initChat(websocket) {
  websocket.addEventListener("open", () => {
    // Send an "init" event according to who is connecting.
    const params = new URLSearchParams(window.location.search)
    let userName = prompt("Enter your user name")
    console.log(userName)
    let event = { type: "init", users: userName }

    if (params.has("join")) {
      // Second player joins an existing game.
      event.join = params.get("join")
      //else {
      // First player starts a new game.
    }

    showUser(userName)
    websocket.send(JSON.stringify(event))
  })
}

function showMessage(message) {
  window.setTimeout(() => window.alert(message), 50)
}

function playMsgSound() {
  var soundFile = document.createElement("audio")
  soundFile.preload = "auto"

  //Load the sound file (using a source element for expandability)
  var src = document.createElement("source")
  src.src = "./js/Message-tone.mp3"
  soundFile.appendChild(src)

  //Load the audio tag
  //It auto plays as a fallback
  soundFile.load()
  soundFile.volume = 0.2
  soundFile.play()
}

function showContact(users) {
  console.log(ownUser)
  let contactList = document.getElementById("mdl-list")
  contactList.innerHTML = ""
  console.log(users)
  users.map(user => {
    if (user.toLowerCase() !== ownUser.toLowerCase()) {
      let userEl = document.createElement("li")
      userEl.className = "logged-in-contact"
      userEl.innerHTML = `<img src="https://api.adorable.io/avatars/128/anas.png"
  class = "mdl-list__item-avatar"/>
  <span class="title-name">${user}</span>`
      userEl.style.display = "flex"
      userEl.style.alignItems = "center"
      userEl.style.marginBottom = "0.8rem"
      contactList.append(userEl)
    }
  })
}

function receiveMsgs(websocket) {
  websocket.addEventListener("message", ({ data }) => {
    const event = JSON.parse(data)
    console.log(event)
    if (event.type == "init") {
      // Update the UI with initial msg and join link
      const initElement = document.createElement("div")
      initElement.className = "init-msg"
      initElement.innerHTML = `<p style="margin-top:1.5rem;">${event.msg}</p>
        <a href="http://127.0.0.1:5500/?join=${event.join}">Send chat-id to a friend: localhost:8000/?join=${event.join}</p>`
      document.getElementById("chat-msgs").append(initElement)
    } else if (event.type == "msg") {
      // Update the UI with the msg.
      const chatElement = document.createElement("div")
      chatElement.className = "chat-msg"
      if (event.msg.includes(">")) {
        let userPrefixText = event.msg.slice(0, event.msg.indexOf(">") + 1)
        let msgBody = event.msg.slice(
          event.msg.indexOf(">") + 1,
          event.msg.length
        )
        document.getElementById("chat-msgs").append(chatElement)
        chatElement.innerHTML =
          `<span style="color:${event.userColor}; font-weight:bold">
        ${userPrefixText}</span>` + `<span>${msgBody}</span>`
      } else {
        chatElement.innerHTML = event.msg
        chatElement.style.fontStyle = "italic"
        document.getElementById("chat-msgs").append(chatElement)
      }

      console.log(event.users)
      if (event.msg == "User has logged in") {
        event.users.length > 1
          ? (allUsers = event.users)
          : allUsers.push(event.users)
        showContact(allUsers)
      }
      playMsgSound()
    } else if (event.type == "error") {
      showMessage(event.message)
    } else {
      throw new Error(`Unsupported event type: ${event.type}.`)
    }
  })
}

function sendMsg(websocket) {
  // // Don't send moves for a spectator watching a game.
  // const params = new URLSearchParams(window.location.search)
  // if (params.has("watch")) {
  //   return
  // }
  let msg = document.getElementById("messagefield").value
  const event = {
    type: "msg",
    msg: `${ownUser} > ` + msg,
    userColor: `rgb(${userColorOne},20,${userColorTwo})`,
  }
  websocket.send(JSON.stringify(event))
}

window.addEventListener("DOMContentLoaded", () => {
  // Open the WebSocket connection and register event handlers.
  // OBS! Important to choose a different port
  const websocket = new WebSocket("ws://localhost:8005/")
  const sendButton = document.getElementById("send-icon")
  sendButton.addEventListener("click", e => {
    e.preventDefault()
    sendMsg(websocket)
  })
  initChat(websocket)
  receiveMsgs(websocket)
})
