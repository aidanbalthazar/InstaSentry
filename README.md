<p align="center">
  <img src="extension/icons/512x512.png" alt="InstaSentry Logo" width="140"/>
</p>

<h1 align="center">InstaSentry</h1>

<p align="center">
  <i>Behavioral analysis tool for detecting patterns of automated and coordinated account activity on Instagram</i>
</p>

## Purpose

InstaSentry is an academic cybersecurity project designed to analyze public Instagram account activity for patterns commonly associated with automated, coordinated, or suspicious behavior.

The program supports structured analysis by collecting selected public-facing data, comparing that data against configurable behavioral indicators, and generating an explainable score and report for review.

InstaSentry is not designed to prove whether an account is a bot, identify the person behind an account, or determine the truth of any political or social claim. Its purpose is to support research, education, and analysis of online influence behavior through measurable public signals.

## Problem Context

In recent years, social media platforms have seen a noticeable increase in repetitive, high-engagement comments that promote identical or highly similar political and geopolitical messaging, often unrelated to the original content of a post.

These comments can rapidly accumulate tens of thousands of likes, reaching large audiences and influencing perception, despite many users not verifying the source or examining the profile behind the content. As a result, widely visible opinions may not always reflect genuine, independent public sentiment.

InstaSentry was developed to support the analysis of these patterns by identifying behavioral indicators commonly associated with automated or coordinated account activity. The goal is not to determine truth, assign intent, or promote any political perspective, but rather to provide a structured way to question and evaluate the sources and behaviors behind highly visible content.

By encouraging deeper inspection of account activity and engagement patterns, this tool aims to support awareness, critical thinking, and informed analysis of online information environments.

## Features (v1.0.2)

- **Chrome Side Panel Interface**  
  Lightweight user interface integrated directly into the browser for streamlined interaction.

- **Full Analysis Mode**  
  Analyze a public Instagram post by collecting comments and evaluating associated account activity.

- **Profile-Only Analysis Mode**  
  Perform focused analysis on a single Instagram account without comment collection.

- **Keyword-Based Comment Filtering**  
  Filter collected comments using user-defined keywords to identify relevant or targeted content.

- **Behavioral Scoring System**  
  Assign a structured score based on detected behavioral indicators, where higher scores indicate more likely human activity.

- **Explainable "Why Report"**  
  Generate a detailed report outlining which indicators contributed to the final score.

- **Public Data Collection via Automation**  
  Uses automated browsing to collect publicly available account and comment data for analysis.

- **Downloadable Output Files**  
  Export results including all comments, filtered comments, profile data, and analysis reports.

## Requirements

To run InstaSentry, ensure the following are installed and available:

- **Operating System:** Windows 10 or 11  
- **Google Chrome Browser** (latest version recommended)  
- **Internet Connection** 
- **Instagram Account** (login required; a secondary or non-personal account is recommended)

## Installation Guide

A full installation walkthrough video is available here:

[Watch Installation Tutorial](https://www.youtube.com/watch?v=4UPWplob4xQ)

The written setup instructions below are intended for first-time installation and regular usage of InstaSentry.

---

### First-Time Setup

#### Download Project Contents

1. Download the latest release from the GitHub “Releases” page.

2. Extract the ZIP folder to a convenient location such as your Downloads folder.

---

#### Server & Windows Defender Setup

3. In Windows Search, search for:

   `Virus & Threat Protection`

4. Under “Virus & Threat Protection Settings”, select:

   `Manage Settings`

5. Scroll down to the “Exclusions” section and select:

   `Add or remove exclusions`

6. Select:

   `Add an exclusion`

7. Choose:

   `Folder`

8. Select the main InstaSentry project folder containing both:
   - `server`
   - `extension`

   folders.

Sometimes:
- When the executable is launched, a Windows security prompt may appear.

If prompted:
- Select:
  - `Allow this time`
  OR:
  - `More info` > `Run anyway`

---

#### Extension Installation

9. Open Google Chrome and enter the following into the address bar:

   `chrome://extensions/`

10. Enable `Developer Mode` using the toggle in the top-right corner.

11. Select:

   `Load unpacked`

12. Navigate to:

   `InstaSentry\extension\`

13. Select the entire extension folder.

14. In the top-right corner of Chrome, click the puzzle-piece Extensions icon.

15. Locate the InstaSentry Side-Panel Extension and pin it for easy access.

16. Open the InstaSentry extension.

17. The extension should initially display:
   - `Server Status: Offline`
   - Red status indicator

---

#### Run Server & Use Application

18. Navigate to:

   `InstaSentry\server\`

19. Double-click:

   `InstaSentryServer.exe`

20. Once connected, the extension status indicator should change to:
   - `Server Status: Online`
   - Green status indicator

21. Follow the extension prompts and use the application as intended.

22. When finished:
   - Press `Exit` on the results page
   OR:
   - Press `Kill` to terminate the local server session during or after analysis

23. The status indicator should return to:
   - `Session Terminated`
   - Red status indicator

---

### Quick Startup Guide

After completing the first-time setup, normal usage is as follows:

1. Open the pinned InstaSentry Side-Panel Extension in Chrome

2. Run:

   `InstaSentryServer.exe`

   from:

   `InstaSentry\server\`

3. Wait for the extension to display:
   - `Server Status: Online`

4. Use the application normally and follow the prompts

5. Press `Kill` or `Exit` when finished

## Disclaimers

InstaSentry is an academic and analytical tool designed to identify behavioral patterns in publicly available Instagram data. The results produced by this tool are probabilistic and should not be interpreted as definitive classifications.

- InstaSentry does **not make definitive classifications** of accounts as automated or human; it provides a probabilistic assessment based on observed behavioral patterns.
- InstaSentry does **not** identify the person or entity behind any account.
- InstaSentry does **not** determine the truth, accuracy, or intent of any content.
- InstaSentry does **not** promote or support any political viewpoint or ideology.

All analysis is based solely on observable patterns and configurable indicators within publicly accessible data. Results are intended to support research, education, and critical evaluation—not to make accusations or conclusions about specific users.

Users are responsible for how they interpret and use the output of this tool.

## License

This project is proprietary and is provided for educational and demonstration purposes only.

All rights reserved. No part of this software may be copied, modified, distributed, or used without explicit permission from the author.