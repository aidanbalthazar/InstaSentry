const modeButtons = document.querySelectorAll('.mode-option');
const continueBtn = document.getElementById('continueBtn');
const statusText = document.getElementById('statusText');
const processingContinueBtn = document.getElementById('processingContinueBtn');
const downloadsContinueBtn = document.getElementById('downloadsContinueBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const downloadFilteredBtn = document.getElementById('downloadFilteredBtn');
const profileLoginContinueBtn = document.getElementById('profileLoginContinueBtn');
const profileProcessingContinueBtn = document.getElementById('profileProcessingContinueBtn');

const profileLoginStatusRows = document.querySelectorAll('#pageProfileLogin .status-line');
const profileLoginStatusNote = document.querySelector('#pageProfileLogin .status-note');
const profileUsernameInput = document.getElementById('profileUsername');
const profileSearchContinueBtn = document.getElementById('profileSearchContinueBtn');

const postUrlInput = document.getElementById('postUrl');
const commentCountInput = document.getElementById('commentCount');
const keywordsInput = document.getElementById('keywords');
const fullContinueBtn = document.getElementById('fullContinueBtn');

const resultsDownloadAllBtn = document.getElementById('resultsDownloadAllBtn');
const resultsDownloadFilteredBtn = document.getElementById('resultsDownloadFilteredBtn');
const resultsDownloadProfileBtn = document.getElementById('resultsDownloadProfileBtn');
const resultsDownloadWhyBtn = document.getElementById('resultsDownloadWhyBtn');
const resultsProfileOnlyDataBtn = document.getElementById('resultsProfileOnlyDataBtn');
const resultsProfileOnlyWhyBtn = document.getElementById('resultsProfileOnlyWhyBtn');
const resultUsername = document.getElementById('resultUsername');
const restartBtnFull = document.getElementById('restartBtnFull');
const restartBtnProfile = document.getElementById('restartBtnProfile');
const exitBtnFull = document.getElementById('exitBtnFull');
const exitBtnProfile = document.getElementById('exitBtnProfile');
const pageTerminated = document.getElementById('pageTerminated');

const pageModeSelect = document.getElementById('pageModeSelect');
const pageFullAnalysis = document.getElementById('pageFullAnalysis');
const pageProcessing = document.getElementById('pageProcessing');
const pageDownloads = document.getElementById('pageDownloads');
const pageProfileLogin = document.getElementById('pageProfileLogin');
const pageProfileSearch = document.getElementById('pageProfileSearch');
const pageProfileProcessing = document.getElementById('pageProfileProcessing');
const pageResults = document.getElementById('pageResults');

const fullAnalysisForm = document.getElementById('fullAnalysisForm');
const profileSearchForm = document.getElementById('profileSearchForm');

const formStatusText = document.getElementById('formStatusText');
const downloadsStatusText = document.getElementById('downloadsStatusText');
const profileSearchStatusText = document.getElementById('profileSearchStatusText');
const resultsStatusText = document.getElementById('resultsStatusText');

const gaugeTrack = document.getElementById('gaugeTrack');
const gaugeFill = document.getElementById('gaugeFill');
const fullResultsButtons = document.getElementById('fullResultsButtons');
const profileResultsButtons = document.getElementById('profileResultsButtons');

const finalScore = document.getElementById('finalScore');
const scoreLabel = document.getElementById('scoreLabel');

let selectedMode = 'full';
let backendScore = 0;
let backendUsername = "";
let loginStatusInterval = null;

// ================= SERVER STATUS =================

const serverStatusTexts = document.querySelectorAll('.server-status-text');
const serverStatusDots = document.querySelectorAll('.server-status-dot');
const serverKillButtons = document.querySelectorAll('.server-kill-btn');

let serverOnline = false;
let healthInterval = null;

function setServerStatus(online) {
  serverOnline = online;

  serverStatusTexts.forEach(textEl => {
    textEl.textContent = online ? "Server is online" : "Server is offline";
  });

  serverStatusDots.forEach(dotEl => {
    dotEl.classList.remove("online", "offline");
    dotEl.classList.add(online ? "online" : "offline");
  });

  serverKillButtons.forEach(button => {
    button.disabled = !online;
    button.classList.toggle("disabled-btn", !online);
  });

  if (online) {
    continueBtn.disabled = false;
    continueBtn.classList.remove("disabled-btn");
  } else {
    continueBtn.disabled = true;
    continueBtn.classList.add("disabled-btn");
  }
}

async function killServerFromStatus() {
  if (!serverOnline) {
    return;
  }

  serverKillButtons.forEach(button => {
    button.disabled = true;
    button.classList.add("disabled-btn");
  });

  try {
    await fetch("http://127.0.0.1:5000/shutdown", {
      method: "POST"
    });
  } catch (err) {}

  setServerStatus(false);
  stopHealthPolling();
  showPage(pageTerminated);
}

async function checkServerHealth() {
  try {
    const response = await fetch("http://127.0.0.1:5000/health");

    if (!response.ok) {
      setServerStatus(false);
      return;
    }

    const data = await response.json();

    if (data.status === "ok" && data.app === "instasentry") {
      setServerStatus(true);
    } else {
      setServerStatus(false);
    }
  } catch (err) {
    setServerStatus(false);
  }
}

function startHealthPolling() {
  stopHealthPolling();
  healthInterval = setInterval(checkServerHealth, 2000);
  checkServerHealth();
}

function stopHealthPolling() {
  if (healthInterval !== null) {
    clearInterval(healthInterval);
    healthInterval = null;
  }
}

/* ---------- PAGE CONTROL ---------- */

function showPage(pageToShow) {
  [pageModeSelect, pageFullAnalysis, pageProcessing, pageDownloads, pageProfileLogin, pageProfileSearch, pageProfileProcessing, pageResults, pageTerminated]
    .forEach(page => page.classList.remove('active'));
  pageToShow.classList.add('active');
}

function getScoreLabel(score) {
  if (score <= 25) return 'Very likely automated';
  if (score <= 50) return 'Likely automated';
  if (score <= 70) return 'Uncertain';
  if (score <= 85) return 'Likely human';
  return 'Highly likely human';
}

function showResults() {

  if (resultsStatusText) {
    resultsStatusText.textContent = "";
  }

  finalScore.textContent = backendScore;
  resultUsername.textContent = backendUsername ? `@${backendUsername}` : "@unknown";
  scoreLabel.textContent = getScoreLabel(backendScore);
  updateGauge(backendScore);

  if (selectedMode === 'full') {
    fullResultsButtons.classList.remove('hidden');
    profileResultsButtons.classList.add('hidden');
  } else {
    fullResultsButtons.classList.add('hidden');
    profileResultsButtons.classList.remove('hidden');
  }

  showPage(pageResults);
}

function disableProfileLoginContinue() {
  profileLoginContinueBtn.disabled = true;
  profileLoginContinueBtn.classList.add('disabled-btn');
}

function enableProfileLoginContinue() {
  profileLoginContinueBtn.disabled = false;
  profileLoginContinueBtn.classList.remove('disabled-btn');
}

function stopLoginStatusPolling() {
  if (loginStatusInterval !== null) {
    clearInterval(loginStatusInterval);
    loginStatusInterval = null;
  }
}

function startLoginStatusPolling() {
  stopLoginStatusPolling();

  loginStatusInterval = setInterval(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login-status");
      const data = await response.json();

      if (!data.success) {
        return;
      }

      if (data.logged_in) {
        const profileLoginNote = document.querySelector('#pageProfileLogin .login-note');
        if (profileLoginNote) {
          profileLoginNote.style.display = 'none';
        }

        stopLoginStatusPolling();

        document.querySelectorAll('#pageProfileLogin .status-icon')[1].textContent = "✅";
        profileLoginStatusRows[1].textContent = "Login accepted.";
        profileLoginStatusNote.textContent = "Instagram login confirmed. Continue is now enabled.";

        enableProfileLoginContinue();
      }

    } catch (err) {
      // Keep waiting silently
    }
  }, 500);
}

function disableProfileSearchContinue() {
  profileSearchContinueBtn.disabled = true;
  profileSearchContinueBtn.classList.add('disabled-btn');
}

function enableProfileSearchContinue() {
  profileSearchContinueBtn.disabled = false;
  profileSearchContinueBtn.classList.remove('disabled-btn');
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

function updateGauge(score) {
  const clampedScore = Math.max(0, Math.min(99, score));
  const percent = clampedScore / 99;
  const startAngle = 270;
  const endAngle = 90;
  const totalSweep = 180;
  const fillEndAngle = startAngle + (totalSweep * percent);

  gaugeTrack.setAttribute('d', describeArc(110, 110, 74, startAngle, endAngle));

  if (percent <= 0.001) {
    gaugeFill.setAttribute('d', '');
    return;
  }

  const safeFillEnd = Math.min(fillEndAngle, 449.999);
  gaugeFill.setAttribute('d', describeArc(110, 110, 74, startAngle, safeFillEnd));
}

function updateProcessingUI(steps) {
  const rows = document.querySelectorAll('#pageProfileProcessing .status-row');

  steps.forEach((step, index) => {
    if (!rows[index]) {
      return;
    }

    const icon = rows[index].querySelector('.status-icon');
    const line = rows[index].querySelector('.status-line');

    if (!icon || !line) {
      return;
    }

    line.textContent = step.name;

    if (step.status === "pending") {
      icon.textContent = "⏳";
      rows[index].classList.remove('done');
      rows[index].classList.add('working');
    } else if (step.status === "in_progress") {
      icon.textContent = "⏳";
      rows[index].classList.remove('done');
      rows[index].classList.add('working');
    } else if (step.status === "complete") {
      icon.textContent = "✅";
      rows[index].classList.remove('working');
      rows[index].classList.add('done');
    } else if (step.status === "failed") {
      icon.textContent = "❌";
      rows[index].classList.remove('done');
      rows[index].classList.remove('working');
    }
  });
}

function resetProcessingUI() {
  const rows = document.querySelectorAll('#pageProfileProcessing .status-row');

  rows.forEach(row => {
    const icon = row.querySelector('.status-icon');

    if (icon) {
      icon.textContent = "⏳";
    }

    row.classList.remove('done');
    row.classList.remove('working');
  });
}

function disableFullContinue() {
  fullContinueBtn.disabled = true;
  fullContinueBtn.classList.add('disabled-btn');
}

function enableFullContinue() {
  fullContinueBtn.disabled = false;
  fullContinueBtn.classList.remove('disabled-btn');
}

function validateFullAnalysisFields() {
  const postUrl = postUrlInput.value.trim();
  const commentCount = commentCountInput.value.trim();
  const keywords = keywordsInput.value.trim();

  disableFullContinue();

  if (fullValidationTimer !== null) {
    clearTimeout(fullValidationTimer);
  }

  if (postUrl === "") {
    formStatusText.textContent = "Enter a valid Instagram post URL.";
    return;
  }

  if (commentCount === "" || !/^\d+$/.test(commentCount)) {
    formStatusText.textContent = "Enter a whole number between 1 and 1000.";
    return;
  }

  const commentNumber = parseInt(commentCount, 10);

  if (commentNumber < 1 || commentNumber > 1000) {
    formStatusText.textContent = "Comment count must be between 1 and 1000.";
    return;
  }

  const validKeywords = keywords
    .split(",")
    .map(k => k.trim())
    .filter(k => k.length >= 2);

  if (validKeywords.length === 0) {
    formStatusText.textContent = "Enter at least one keyword with 2 or more characters.";
    return;
  }

  formStatusText.textContent = "Checking inputs...";

  fullValidationTimer = setTimeout(() => {
    if (!postUrl.includes("instagram.com")) {
      formStatusText.textContent = "Enter a valid Instagram post URL.";
      disableFullContinue();
      return;
    }

    formStatusText.textContent = "Inputs accepted. Continue is ready.";
    enableFullContinue();
  }, 500);
}

function stopFullLoginStatusPolling() {
  if (fullLoginStatusInterval !== null) {
    clearInterval(fullLoginStatusInterval);
    fullLoginStatusInterval = null;
  }
}

function startFullLoginStatusPolling() {
  stopFullLoginStatusPolling();

  fullLoginStatusInterval = setInterval(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login-status");
      const data = await response.json();

      if (!data.success) {
        return;
      }

      if (data.logged_in) {

        const processingLoginNote = document.querySelector('#pageProcessing .login-note');
        if (processingLoginNote) {
          processingLoginNote.style.display = 'none';
        }

        stopFullLoginStatusPolling();

        const processingRows = document.querySelectorAll('#pageProcessing .status-row .status-icon');
        const processingLines = document.querySelectorAll('#pageProcessing .status-row .status-line');
        const processingNote = document.querySelector('#pageProcessing .status-note');

        if (processingRows.length >= 1 && processingLines.length >= 1) {
          processingRows[0].textContent = "✅";
          processingLines[0].textContent = "Login accepted.";
        }

        if (processingNote) {
          processingNote.textContent = "Instagram login confirmed. Starting post analysis...";
        }

        processingContinueBtn.disabled = true;
        processingContinueBtn.classList.add('disabled-btn');

        setTimeout(() => {
          runFullAnalysisAfterLogin();
        }, 300);
      }

    } catch (err) {
      // keep waiting silently
    }
  }, 500);
}

async function terminateSession() {
  if (resultsStatusText) {
    resultsStatusText.textContent = "Terminating session...";
  }

  try {
    await fetch("http://127.0.0.1:5000/shutdown", {
      method: "POST"
    });
  } catch (err) {}

  showPage(pageTerminated);
}

async function runFullAnalysisAfterLogin() {
  processingContinueBtn.disabled = true;
  processingContinueBtn.classList.add('disabled-btn');

  const processingRows = document.querySelectorAll('#pageProcessing .status-row .status-icon');
  const processingLines = document.querySelectorAll('#pageProcessing .status-row .status-line');
  const processingNote = document.querySelector('#pageProcessing .status-note');

  if (processingRows.length >= 4 && processingLines.length >= 4) {
    processingRows[1].textContent = "⏳";
    processingRows[2].textContent = "⏳";
    processingRows[3].textContent = "⏳";

    processingLines[1].textContent = "Collecting comments...";
    processingLines[2].textContent = "Filtering keywords...";
    processingLines[3].textContent = "Preparing files...";
  }

  if (processingNote) {
    processingNote.textContent = "Please wait while InstaSentry completes this step.";
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/full-analysis/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        post_url: pendingPostUrl,
        comment_limit: parseInt(pendingCommentCount),
        keywords: pendingKeywords.split(",").map(k => k.trim())
      })
    });

    const data = await response.json();

    if (!data.success) {
      formStatusText.textContent = data.message || "Full analysis failed.";
      return;
    }

    if (processingRows.length >= 4 && processingLines.length >= 4) {
      processingRows[1].textContent = "✅";
      processingRows[2].textContent = "✅";
      processingRows[3].textContent = "✅";

      processingLines[1].textContent = "Comments collected.";
      processingLines[2].textContent = "Keywords filtered.";
      processingLines[3].textContent = "Files prepared.";
    }

if (processingNote) {
  processingNote.textContent = "Processing complete. Continue is now enabled.";
}

processingContinueBtn.disabled = false;
processingContinueBtn.classList.remove('disabled-btn');

  } catch (err) {
    formStatusText.textContent = "Error connecting to backend.";
  }
}

function downloadAllComments() {
  chrome.downloads.download({
    url: "http://127.0.0.1:5000/download/all_comments",
    saveAs: false
  }, (downloadId) => {
    if (chrome.runtime.lastError) {
      console.error("Download failed:", chrome.runtime.lastError.message);
      alert("Failed to download all comments.");
    } else {
      console.log("All comments download started. Download ID:", downloadId);
      downloadsStatusText.textContent = "All comments download started.";
      if (resultsStatusText) {
        resultsStatusText.textContent = "All comments download started.";
      }
    }
  });
}

async function downloadFilteredComments() {
  try {
    const response = await fetch("http://127.0.0.1:5000/download/filtered_comments");

    if (!response.ok) {
      const data = await response.json();
      const message = data.message || "No filtered comments file available.";
      downloadsStatusText.textContent = message;
      if (resultsStatusText) {
        resultsStatusText.textContent = message;
      }
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: "filtered_comments.txt",
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        const message = chrome.runtime.lastError.message || "Failed to download filtered comments.";
        downloadsStatusText.textContent = message;
        if (resultsStatusText) {
          resultsStatusText.textContent = message;
        }
      } else {
        downloadsStatusText.textContent = "Filtered comments download started.";
        if (resultsStatusText) {
          resultsStatusText.textContent = "Filtered comments download started.";
        }
      }

      setTimeout(() => URL.revokeObjectURL(url), 3000);
    });

  } catch (err) {
    downloadsStatusText.textContent = "Error connecting to backend.";
    if (resultsStatusText) {
      resultsStatusText.textContent = "Error connecting to backend.";
    }
  }
}

function downloadPublicProfileData() {
  chrome.downloads.download({
    url: "http://127.0.0.1:5000/download/profile_data",
    saveAs: false
  }, (downloadId) => {
    if (chrome.runtime.lastError) {
      console.error("Download failed:", chrome.runtime.lastError.message);
      alert("Failed to download public profile data.");
    } else {
      console.log("Public profile data download started. Download ID:", downloadId);
      if (resultsStatusText) {
        resultsStatusText.textContent = "Public profile data download started.";
      }
    }
  });
}

function downloadWhyReport() {
  chrome.downloads.download({
    url: "http://127.0.0.1:5000/download/why_report",
    saveAs: false
  }, (downloadId) => {
    if (chrome.runtime.lastError) {
      console.error("Download failed:", chrome.runtime.lastError.message);
      alert("Failed to download why report.");
    } else {
      console.log("Why report download started. Download ID:", downloadId);
      if (resultsStatusText) {
        resultsStatusText.textContent = "Why report download started.";
      }
    }
  });
}

if (resultsDownloadWhyBtn) {
  resultsDownloadWhyBtn.addEventListener("click", downloadWhyReport);
}

if (resultsProfileOnlyWhyBtn) {
  resultsProfileOnlyWhyBtn.addEventListener("click", downloadWhyReport);
}

/* ---------- MODE SELECT ---------- */

modeButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedMode = button.dataset.mode;
    modeButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
  });
});

/* ---------- FULL ANALYSIS ---------- */

let pendingPostUrl = "";
let pendingCommentCount = "";
let pendingKeywords = "";
let fullLoginStatusInterval = null;
let fullValidationTimer = null;
let usernameValidationTimer = null;

fullAnalysisForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (fullContinueBtn.disabled) {
    return;
  }

  pendingPostUrl = postUrlInput.value.trim();
  pendingCommentCount = commentCountInput.value.trim();
  pendingKeywords = keywordsInput.value.trim();

  processingContinueBtn.disabled = true;
  processingContinueBtn.classList.add('disabled-btn');

  const processingRows = document.querySelectorAll('#pageProcessing .status-row .status-icon');
  const processingLines = document.querySelectorAll('#pageProcessing .status-row .status-line');
  const processingNote = document.querySelector('#pageProcessing .status-note');

  if (processingRows.length >= 4 && processingLines.length >= 4) {
    processingRows[0].textContent = "⏳";
    processingRows[1].textContent = "⏳";
    processingRows[2].textContent = "⏳";
    processingRows[3].textContent = "⏳";

    processingLines[0].textContent = "Waiting for login...";
    processingLines[1].textContent = "Collecting comments...";
    processingLines[2].textContent = "Filtering keywords...";
    processingLines[3].textContent = "Preparing files...";
  }

  if (processingNote) {
    processingNote.textContent = "Continue will unlock after login is confirmed.";
  }

  showPage(pageProcessing);

  try {
    const response = await fetch("http://127.0.0.1:5000/start-login", {
      method: "POST"
    });

    const data = await response.json();

    if (!data.success) {
      formStatusText.textContent = data.message || "Failed to start Instagram login.";
      return;
    }

    const loginNote = document.querySelector('#pageProcessing .login-note');
    if (loginNote) {
      loginNote.style.display = 'block';
    }

    startFullLoginStatusPolling();

  } catch (err) {
    formStatusText.textContent = "Error connecting to backend.";
  }
});

/* ---------- PROFILE ONLY ---------- */

profileSearchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (profileSearchContinueBtn.disabled) {
    return;
  }

  const username = profileUsernameInput.value.trim();

  profileSearchStatusText.textContent = "Processing...";

  profileProcessingContinueBtn.disabled = true;
  profileProcessingContinueBtn.classList.add('disabled-btn');

  resetProcessingUI();
  startProgressPolling();
  showPage(pageProfileProcessing);

  try {
    const response = await fetch("http://127.0.0.1:5000/profile-analysis/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        analysis_mode: selectedMode
      })
    });

    const data = await response.json();

    const finalProgress = await fetch("http://127.0.0.1:5000/profile-progress");
    const finalData = await finalProgress.json();

    updateProcessingUI(finalData.steps);

    stopProgressPolling();

    if (!data.success) {
      if (resultsStatusText) {
        resultsStatusText.textContent = data.message || "Profile analysis failed.";
      }
      return;
    }

    backendScore = data.final_score;
    backendUsername = username;

    profileProcessingContinueBtn.disabled = false;
    profileProcessingContinueBtn.classList.remove('disabled-btn');

  } catch (err) {
    stopProgressPolling();
    if (resultsStatusText) {
      resultsStatusText.textContent = "Error connecting to backend.";
    }
  }
});

/* ---------- BUTTON NAV ---------- */

continueBtn.addEventListener('click', async () => {
  if (!serverOnline) {
    statusText.textContent = "Server is offline. Start the application first.";
    return;
  }

  if (selectedMode === 'full') {
    showPage(pageFullAnalysis);
    return;
  }

  showPage(pageProfileLogin);

  profileLoginStatusRows[0].textContent = "Instagram login required before searching a profile.";
  profileLoginStatusRows[1].textContent = "Opening Instagram login...";
  profileLoginStatusNote.textContent = "Please complete login in the Chrome window that opened.";

  disableProfileLoginContinue();

  try {
    const response = await fetch("http://127.0.0.1:5000/start-login", {
      method: "POST"
    });

    const data = await response.json();

    if (!data.success) {
      profileLoginStatusRows[1].textContent = "Login window failed to open.";
      profileLoginStatusNote.textContent = data.message || "Failed to start Instagram login.";
      return;
    }

    const profileLoginNote = document.querySelector('#pageProfileLogin .login-note');
    if (profileLoginNote) {
      profileLoginNote.style.display = 'block';
    }

    profileLoginStatusRows[1].textContent = "Waiting for login...";
    profileLoginStatusNote.textContent = "Continue will unlock after login is confirmed.";

    startLoginStatusPolling();

  } catch (err) {
    profileLoginStatusRows[1].textContent = "Error starting login.";
    profileLoginStatusNote.textContent = "Error connecting to backend.";
  }
});

processingContinueBtn.addEventListener('click', () => {
  if (processingContinueBtn.disabled) {
    return;
  }

  const processingLines = document.querySelectorAll('#pageProcessing .status-line');

  if (processingLines.length >= 4 && processingLines[1].textContent === "Comments collected.") {
    showPage(pageDownloads);
    return;
  }

  runFullAnalysisAfterLogin();
});

profileProcessingContinueBtn.addEventListener('click', () => {
  if (profileProcessingContinueBtn.disabled) {
    return;
  }

  showResults();
});

downloadsContinueBtn.addEventListener('click', () => {
  showPage(pageProfileSearch);
});

restartBtnFull.addEventListener('click', () => {
  postUrlInput.value = "";
  commentCountInput.value = "";
  keywordsInput.value = "";
  profileUsernameInput.value = "";

  backendUsername = "";
  backendScore = 0;

  formStatusText.textContent = "";
  profileSearchStatusText.textContent = "";
  if (resultsStatusText) {
    resultsStatusText.textContent = "";
  }
  downloadsStatusText.textContent = "";

  disableFullContinue();
  disableProfileSearchContinue();
  disableProfileLoginContinue();

  stopLoginStatusPolling();
  stopFullLoginStatusPolling();
  stopProgressPolling();

  showPage(pageModeSelect);
});

restartBtnProfile.addEventListener('click', () => {
  postUrlInput.value = "";
  commentCountInput.value = "";
  keywordsInput.value = "";
  profileUsernameInput.value = "";

  backendUsername = "";
  backendScore = 0;

  formStatusText.textContent = "";
  profileSearchStatusText.textContent = "";
  if (resultsStatusText) {
    resultsStatusText.textContent = "";
  }
  downloadsStatusText.textContent = "";

  disableFullContinue();
  disableProfileSearchContinue();
  disableProfileLoginContinue();

  stopLoginStatusPolling();
  stopFullLoginStatusPolling();
  stopProgressPolling();

  showPage(pageModeSelect);
});

if (downloadAllBtn) {
  downloadAllBtn.addEventListener("click", downloadAllComments);
}

if (downloadFilteredBtn) {
  downloadFilteredBtn.addEventListener("click", downloadFilteredComments);
}

if (resultsDownloadAllBtn) {
  resultsDownloadAllBtn.addEventListener("click", downloadAllComments);
}

if (resultsDownloadFilteredBtn) {
  resultsDownloadFilteredBtn.addEventListener("click", downloadFilteredComments);
}

if (resultsDownloadProfileBtn) {
  resultsDownloadProfileBtn.addEventListener("click", downloadPublicProfileData);
}

if (resultsProfileOnlyDataBtn) {
  resultsProfileOnlyDataBtn.addEventListener("click", downloadPublicProfileData);
}

if (exitBtnFull) {
  exitBtnFull.addEventListener('click', terminateSession);
}

if (exitBtnProfile) {
  exitBtnProfile.addEventListener('click', terminateSession);
}

serverKillButtons.forEach(button => {
  button.addEventListener('click', killServerFromStatus);
});

/* ---------- LOGIN STATUS CHECK ---------- */

profileLoginContinueBtn.addEventListener('click', () => {
  // DO NOTHING if button is disabled
  if (profileLoginContinueBtn.disabled) {
    return;
  }

  // Only runs when login is already confirmed
  showPage(pageProfileSearch);
});

/* ---------- USERNAME VALIDATION CHECK ---------- */

postUrlInput.addEventListener('input', validateFullAnalysisFields);
commentCountInput.addEventListener('input', validateFullAnalysisFields);
keywordsInput.addEventListener('input', validateFullAnalysisFields);

profileUsernameInput.addEventListener('input', () => {
  const username = profileUsernameInput.value.trim();

  disableProfileSearchContinue();

  if (usernameValidationTimer !== null) {
    clearTimeout(usernameValidationTimer);
  }

  if (username === "") {
    profileSearchStatusText.textContent = "Enter a username to continue.";
    return;
  }

  profileSearchStatusText.textContent = "Checking username...";

  usernameValidationTimer = setTimeout(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/validate-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username })
      });

      const data = await response.json();

      if (!data.success || !data.valid) {
        profileSearchStatusText.textContent = data.message || "Username not found. Please try again.";
        disableProfileSearchContinue();
        return;
      }

      profileSearchStatusText.textContent = data.message || "Username accepted.";
      enableProfileSearchContinue();

    } catch (err) {
      profileSearchStatusText.textContent = "Error connecting to backend.";
      disableProfileSearchContinue();
    }
  }, 500);
});

/* ---------- POLLING FUNCTION ---------- */

let progressInterval = null;

function startProgressPolling() {
  stopProgressPolling();

  progressInterval = setInterval(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/profile-progress");
      const data = await response.json();

      updateProcessingUI(data.steps);

    } catch (err) {
      console.log("Progress polling error");
    }
  }, 1000);
}

function stopProgressPolling() {
  if (progressInterval !== null) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

disableProfileSearchContinue();
disableFullContinue();

processingContinueBtn.disabled = true;
processingContinueBtn.classList.add('disabled-btn');

profileProcessingContinueBtn.disabled = true;
profileProcessingContinueBtn.classList.add('disabled-btn');

// FORCE OFFLINE STATE ON LOAD
setServerStatus(false);

// THEN START POLLING
startHealthPolling();