# Work Time Logger is 何

[README English](./README.md)

[![VanillaJS](https://img.shields.io/badge/Framework-VanillaJS-blue.svg)](http://vanilla-js.com/)
[![License](https://img.shields.io/github/license/hidao80/WorkTimeLogger)](/LICENSE)
![GitHub Stars](https://img.shields.io/github/stars/hidao80/WorkTimeLogger?style=social)
![GitHub Watchers](https://img.shields.io/github/watchers/hidao80/WorkTimeLogger?style=social)

ボタンを押した時刻とボタンのラベルの組み（ログと呼びます）をプレーンテキストでlocalStorage（ブラウザ内の保存場所）に記録し、Markdownで集計をクリップボードにコピーできるWebツールです。

## 使い方

1. 「項目名を入力」テキストボックスに作業名を入力します。
2. 「追加」ボタンを押して、項目リストに作業ボタンを表示させます。
3. 必要な作業の種類だけ追加を繰り返します。
4. 作業開始のタイミングで当該作業ボタンを押します。
  localStorageにボタン押下時のログが記録され、画面に追記されます。
5. ログは直接入力できます。1文字編集するごとにブラウザへ自動保存されます。

### 注意

- 重複する作業ボタンは登録できません。

## 特殊な操作

1. ×アイコンを押すと作業ボタンを削除します。
2. 「Markdownで集計をコピー」ボタンを押してログをMarkdown形式でクリップボードにコピーします。
3. 「ログを削除」ボタンを押すと、画面に表示されているログとlocalStorage内のログが削除されます。
4. 項目の先頭を「#」にすると、集計をコピーしたとき実働計に含まれません。

## 困った時は

本リポジトリのIssuesまでお気軽にご連絡ください。

## ライセンス

MIT
