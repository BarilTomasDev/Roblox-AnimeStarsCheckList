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
  let unsubscribeSnapshot = null;
  let lastPushedAt = 0;

  const GOOGLE_ICON_SVG =
    '<svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">' +
    '<path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>' +
    '<path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>' +
    '<path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>' +
    '<path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/>' +
    "</svg>";

  function setStatus(text, state) {
    const el = document.getElementById("syncStatus");
    if (!el) return;
    el.textContent = text;
    if (state) el.setAttribute("data-state", state);
    else el.removeAttribute("data-state");
  }

  function renderSignedOut() {
    if (!authArea) return;
    authArea.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "google-signin-btn";
    btn.id = "signInBtn";
    btn.title = "Saves your progress automatically and syncs it across devices";
    btn.innerHTML = GOOGLE_ICON_SVG + "<span>Sign in with Google</span>";
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

    const label = user.displayName || user.email || "Signed in";

    const avatar = document.createElement("div");
    avatar.className = "account-avatar";
    avatar.textContent = label.trim().charAt(0).toUpperCase() || "?";

    const name = document.createElement("div");
    name.className = "account-name";
    name.textContent = label;

    const status = document.createElement("div");
    status.id = "syncStatus";
    status.className = "account-status";
    status.title = "Your progress is saved to your Google account and kept in sync across devices";
    status.textContent = "Progress saved";

    const info = document.createElement("div");
    info.className = "account-info";
    info.appendChild(name);
    info.appendChild(status);

    const signOutBtn = document.createElement("button");
    signOutBtn.className = "account-signout-btn";
    signOutBtn.title = "Sign out";
    signOutBtn.textContent = "⏻";
    signOutBtn.addEventListener("click", () => auth.signOut());

    const card = document.createElement("div");
    card.className = "account-card";
    card.appendChild(avatar);
    card.appendChild(info);
    card.appendChild(signOutBtn);

    authArea.appendChild(card);
  }

  function pushToCloud(stateToPush) {
    if (!currentUser) return;
    setStatus("Saving...", "pending");
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      const updatedAt = Date.now();
      lastPushedAt = updatedAt;
      db.collection("users")
        .doc(currentUser.uid)
        .set({ state: stateToPush, updatedAt })
        .then(() => setStatus("Progress saved"))
        .catch((err) => {
          console.error("Cloud sync failed:", err);
          setStatus("Save failed", "error");
        });
    }, 800);
  }

  window.onStateSaved = pushToCloud;

  auth.onAuthStateChanged((user) => {
    currentUser = user;

    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }

    if (!user) {
      window.onStateSaved = null;
      renderSignedOut();
      return;
    }

    renderSignedIn(user);
    setStatus("Loading...", "pending");
    window.onStateSaved = pushToCloud;

    let firstSnapshot = true;
    unsubscribeSnapshot = db
      .collection("users")
      .doc(user.uid)
      .onSnapshot(
        (doc) => {
          if (firstSnapshot) {
            firstSnapshot = false;
            if (doc.exists && doc.data().state) {
              replaceState(doc.data().state);
            } else {
              pushToCloud(state);
            }
            setStatus("Progress saved");
            return;
          }

          const data = doc.data();
          if (!data || data.updatedAt === lastPushedAt) return;
          replaceState(data.state || {});
          setStatus("Progress saved");
        },
        (err) => {
          console.error("Cloud sync failed:", err);
          setStatus("Save failed", "error");
        }
      );
  });
})();
