(function () {
  const isConfigured =
    typeof FIREBASE_CONFIG !== "undefined" &&
    FIREBASE_CONFIG.apiKey &&
    !FIREBASE_CONFIG.apiKey.startsWith("YOUR_");

  const authArea = document.getElementById("authArea");

  if (!isConfigured) {
    if (authArea) authArea.remove();
    console.info(
      "Cloud sync disabled: fill in firebase-config.js to enable Google sign-in + sync."
    );
    return;
  }

  firebase.initializeApp(FIREBASE_CONFIG);
  const auth = firebase.auth();
  const db = firebase.firestore();

  let currentUser = null;
  let pushTimer = null;

  function setStatus(text) {
    const el = document.getElementById("syncStatus");
    if (el) el.textContent = text;
  }

  function renderSignedOut() {
    if (!authArea) return;
    authArea.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.id = "signInBtn";
    btn.textContent = "Sign in with Google";
    btn.addEventListener("click", () => {
      auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch((err) => {
        console.error("Sign-in failed:", err);
        alert("Sign-in failed: " + err.message);
      });
    });
    authArea.appendChild(btn);
  }

  function renderSignedIn(user) {
    if (!authArea) return;
    authArea.innerHTML = "";

    const status = document.createElement("span");
    status.id = "syncStatus";
    status.className = "sync-status";
    status.textContent = "Synced";

    const name = document.createElement("span");
    name.className = "auth-name";
    name.textContent = user.displayName || user.email || "Signed in";

    const signOutBtn = document.createElement("button");
    signOutBtn.className = "btn";
    signOutBtn.textContent = "Sign out";
    signOutBtn.addEventListener("click", () => auth.signOut());

    authArea.appendChild(status);
    authArea.appendChild(name);
    authArea.appendChild(signOutBtn);
  }

  function pushToCloud(stateToPush) {
    if (!currentUser) return;
    setStatus("Syncing...");
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      db.collection("users")
        .doc(currentUser.uid)
        .set({ state: stateToPush, updatedAt: Date.now() })
        .then(() => setStatus("Synced"))
        .catch((err) => {
          console.error("Cloud sync failed:", err);
          setStatus("Sync failed");
        });
    }, 800);
  }

  window.onStateSaved = pushToCloud;

  auth.onAuthStateChanged((user) => {
    currentUser = user;

    if (!user) {
      window.onStateSaved = null;
      renderSignedOut();
      return;
    }

    renderSignedIn(user);
    setStatus("Loading...");

    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().state) {
          replaceState(doc.data().state);
        } else {
          pushToCloud(state);
        }
        setStatus("Synced");
        window.onStateSaved = pushToCloud;
      })
      .catch((err) => {
        console.error("Failed to load cloud data:", err);
        setStatus("Sync failed");
      });
  });
})();
