# What is Work Time Logger?

[README 日本語版](./README_ja.md)

[![VanillaJS](https://img.shields.io/badge/Framework-VanillaJS-blue.svg)](http://vanilla-js.com/)
[![License](https://img.shields.io/github/license/hidao80/WorkTimeLogger)](/LICENSE)
![GitHub Stars](https://img.shields.io/github/stars/hidao80/WorkTimeLogger?style=social)
![GitHub Watchers](https://img.shields.io/github/watchers/hidao80/WorkTimeLogger?style=social)

A web tool that records the time when a button is pressed and the combination of the button's label (called a log) in plain text to localStorage (a storage location in the browser), and allows you to copy the summary to the clipboard in Markdown.

## How to use
1. Enter a working name in the "Enter item name" text box.
2. Press the "Add item" button to display the work button in the item list.
3. Repeat adding as many work types as necessary.
4. Press the appropriate work button at the time of starting the work.
A log of button presses is recorded in localStorage and appended to the screen.

## Caution
- Duplicate work buttons cannot be registered.

## Special Operation
1. Pressing the x icon deletes the work button.
2. Pressing the "Copy the tally in Markdown" button copies the log to the clipboard in Markdown format.
3. Pressing the "Delete Logs" button deletes the log displayed on the screen and the log in localStorage.
4. If you set the beginning of the item to "#", it will not be included in the actual working total when the tally is copied.

## If you have any problems
Please feel free to contact Issues in this repository.

Translated with www.DeepL.com/Translator (free version)
