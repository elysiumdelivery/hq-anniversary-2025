const MESSAGES_CSV = "../data/guestbook.csv";

function getCSVData(filename, callback = undefined) {
  Papa.parse(filename, {
    download: true,
    //To treat the first row as column titles
    header: true,
    complete: (result) => {
      if (callback) {
        callback(result.data);
      }
    },
  });
}

function renderMessages(message_data) {
  let messageContainer = document.getElementById("guestbook-messages");
  for (var i = 0; i < message_data.length; i++) {
    let message = message_data[i];
    let messageNode = document.createElement("li");
    messageNode.classList.add("guestbook-message");
    let messageFromDiv = document.createElement("div");
    let messageUserHeader = document.createElement("div");
    let messageUserInfo = document.createElement("div");
    let messageUserMessage = document.createElement("p");
    let messageUserUpload = document.createElement("img");
    let messageReviewStars = document.createElement("div");
    let messageReviewIcon = document.createElement("div");
    
    messageReviewIcon.classList.add("guestbook-icon");
    messageReviewStars.classList.add("guestbook-stars");

    messageFromDiv.classList.add("guestbook-user");

    messageUserHeader.innerText = message["Name"];
    messageUserMessage.innerText = message["Message"];

    for (var j = 0; j < 5; j++) {
      let messageReviewStar = document.createElement("div");
      messageReviewStars.appendChild(messageReviewStar);
    }

    messageFromDiv.appendChild(messageReviewIcon);
    messageFromDiv.appendChild(messageUserHeader);
    messageFromDiv.appendChild(messageUserInfo);
    messageNode.appendChild(messageReviewStars);
    messageNode.appendChild(messageFromDiv);
    messageNode.appendChild(messageUserMessage);
    if (message["Filename"]) {
      messageUserUpload.classList.add("guestbook-img");
      messageUserUpload.src = `/image-resize/full/guestbook/${message["Filename"]}`
      messageUserUpload.alt = `User-uploaded image by ${message["Name"]}`
      messageNode.appendChild(messageUserUpload);
    }

    messageContainer.appendChild(messageNode);
  }
}

async function main() {
    getCSVData(MESSAGES_CSV, renderMessages);
}

main();