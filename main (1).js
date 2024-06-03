import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAep6KK-ZCpAx8C9ckXIkmuzugXohe9jfs",
  authDomain: "bank-project-for-summer.firebaseapp.com",
  databaseURL: "https://bank-project-for-summer-default-rtdb.firebaseio.com",
  projectId: "bank-project-for-summer",
  storageBucket: "bank-project-for-summer.appspot.com",
  messagingSenderId: "1079399174128",
  appId: "1:1079399174128:web:42f67a309e9193268d5735"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let selectedPlanet = localStorage.getItem('selectedPlanet');
const path = ref(db, 'planets/' + selectedPlanet);
const dataCountainer = document.getElementById("dataCountainer");
const loadingAnimation = dataCountainer.innerHTML;

async function searchUserByUsername(username) {
  try {
    const planetSnapshot = await get(ref(db, 'planets/' + selectedPlanet));
    if (planetSnapshot.exists()) {
      const planetData = planetSnapshot.val();
      for (const memberId in planetData) {
        if (planetData[memberId].username === username) {
          return {
            [memberId]: planetData[memberId]
          };
        }
      }
      return null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error searching for user:", error);
    return null;
  }
}

const usernameSearchInput = document.getElementById("usernameSearchInput");
const searchButton = document.getElementById("searchButton");
const errorElm = document.getElementById('errorElm');

searchButton.addEventListener('click', () => {
  let usernameSearchValue = usernameSearchInput.value.trim();
  const arabicPattern = /^[\u0600-\u06FF\u0750-\u077F]+$/;

  if (usernameSearchValue === ""){
    errorElm.textContent = "أدخل اللقب أولا!";
    errorElm.style.display = "block";
    usernameSearchInput.classList.add('invalid');
    dataCountainer.innerHTML = loadingAnimation;
  } else if (!arabicPattern.test(usernameSearchValue)) {
    errorElm.textContent = "الرجاء إدخال اللقب باللغة العربية فقط";
    errorElm.style.display = "block";
    usernameSearchInput.classList.add('invalid');
    dataCountainer.innerHTML = loadingAnimation;
  } else {
    const loadingElement = document.getElementById("loadingElement");
    if (loadingElement){
      loadingElement.textContent = "جاري التحميل..."
    }
    
    errorElm.style.display = "none";
    usernameSearchInput.classList.remove('invalid');
    searchUserByUsername(usernameSearchValue)
      .then((user) => {
        if (user) {
          dataCountainer.innerHTML = "";
          
          const usernameElement = document.createElement("p");
          const rankElement = document.createElement("p");
          const balanceElement = document.createElement("p");
          const copyButton = document.createElement("button");
          
          const memberId = Object.keys(user)[0];
          const userData = user[memberId];
          
          usernameElement.textContent = "اللقب: " + userData.username;
          rankElement.textContent = "الرتبة: " + userData.rank;
          balanceElement.textContent = "الرصيد: " + userData.balance;
          copyButton.textContent = "نسخ";
          
          dataCountainer.appendChild(usernameElement);
          dataCountainer.appendChild(rankElement);
          dataCountainer.appendChild(balanceElement);
          dataCountainer.appendChild(copyButton);
          
          copyButton.addEventListener('click', () => {
            const textToShare = `لقبي: ${userData.username}، رتبتي: ${userData.rank} و رصيدي: ${userData.balance}`;
            navigator.clipboard.writeText(textToShare).then(
              copyButton.textContent = "تم النسخ"
              )
              setTimeout(() => {
                copyButton.textContent = "نسخ"
              }, 1100)
          })
          
        } else {
          errorElm.style.display = "block";
          errorElm.textContent = "لا يوجد عضو بهذا اللقب!";
          dataCountainer.innerHTML = loadingAnimation;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
