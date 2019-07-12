# ExPing-t ![](https://github.com/yorimoi/ExPing-t/blob/master/icons/ExPing-t48.png)
![under_development](https://img.shields.io/badge/-%e9%96%8b%e7%99%ba%e4%b8%ad-important.svg)  

[Ping-t](https://ping-t.com/)のGoogleChrome拡張機能です.  
chromeウェブストアでの配布はしておりません  
サイトの利用規約および著作権法等に違反しないよう自己責任でご利用ください.  
特に, ダウンロードしたコンテンツの私的使用の範囲を超えた無断使用などの行為を行わないよう十分注意してください.  
動作確認はLPIC304で行ってます  

## 実装済み
* 背景色,文字色,文字の太さ の変更  
* 画像表示  
* 問題間共有のメモ機能  
* HTMLの保存  
* Historyの色分け  
* `[戻る]` `[次へ]`ボタンを画面上部にも  
* `[追記]`ボタン押下時, 設定した書式[<sup>[1]</sup>](#note-1)をメモに追記  
* 経過時間表示  
* 時計  

## TODO (実装予定)
* キッチンタイマー(時間指定), ストップウォッチ(自動)  
* オプション画面で各ボタンの表示有無を細かく指定  
* HTMLの保存時, 正解ボタン押下前や模擬試験時にも正解を表示  
* ~~オプション画面での画像保存の動作修正~~  
* URLのアクセス制御  
* 中央寄せ(検討中)  
* 書式に'%02d'とかの桁数指定  

## Usage
`git clone https://github.com/yorimoi/ExPing-t.git` or Download ZIP  
Chromeの拡張機能画面でデベロッパーモードを `on`  
`パッケージ化されていない拡張機能を読み込む` からフォルダをまるごと指定  

## Note
<a name="note-1"></a>
1. 書式一覧

    | 指定子 |   説明   |
    | :----: | :------- |
    |   %n   | 問題番号 |
    |   %i   | 問題ID   |
    |   %Y   | 年       |
    |   %M   | 月       |
    |   %D   | 日       |
    |   %w   | 曜日     |
    |   %H   | 時(24)   |
    |   %h   | 時(12)   |
    |   %m   | 分       |
    |   %s   | 秒       |
    |   %%   | %        |
