# BioinfOMICS Lab website

Source code of the website of the BioinfOMICS Lab, China Medical University, Taiwan.
中國醫藥大學 BioinfOMICS Lab 網站的原始碼。

- Built with [Astro](https://astro.build/) as a static site.
- Published with GitHub Pages; every push to `main` rebuilds and redeploys the site.
- Preview: https://bioinfomics.github.io/lab-website/

The rest of this page is the maintenance guide for lab members, written in Chinese.

---

## 維護指南

網站的**內容寫在資料檔，版面寫在頁面檔**，建置時合成網頁。更新內容只要改資料檔，不必碰版面。

### 更新內容

所有內容都在 `src/data/`。

| 想改什麼 | 改哪個檔 | 補充 |
|---|---|---|
| 論文 | `src/data/publications.json` | 見「新增一篇論文」 |
| 成員 | `src/data/people.json` | 照片放 `src/assets/people/` |
| 工具與資料庫 | `src/data/tools.json` | 見「工具有新版本」 |
| 實驗室簡介、研究領域 | `src/data/research.json` | 圖放 `src/assets/research/` |
| 信箱、電話、地址 | `src/data/site.json` | |
| 首頁與 Join Us 的照片 | `src/data/photos.json` | 照片放 `src/assets/lab/` |

頁面上的人數、篇數、工具數都是從資料檔算出來的，不用手改。

#### 新增一篇論文

在 `src/data/publications.json` 加一筆：

```json
{
  "authors": "Lin WJ, Wang YD, Lai YL*, Cheng WC*",
  "title": "論文標題，結尾的句點照寫.",
  "journal": "Nucleic Acids Res.",
  "details": "2026 Jan 5;54(D1):D100-D108.",
  "url": "https://..."
}
```

放在哪一區：

- `selected`（Selected publications）：新的放最上面。加上 `"featured": true` 的會出現在首頁，順序和這份清單相同。
- `other`（Other publications）：依年份分組，新的年份放最上面。新的一年要先加一組
  `{ "year": "2026", "items": [ ... ] }`。
- `books`（Book & chapter）。

作者名單裡實驗室主持人的名字會自動變粗體。要比對的寫法設定在 `src/data/site.json` 的 `nameInCitations`。

#### 新增或異動成員

1. 照片放進 `src/assets/people/`。直式半身照，寬度 560 像素以上最好，`jpg` 或 `png` 都可以。
   這個 repository 是公開的，照片放進來之前請先清掉檔案內含的拍攝資訊。
2. 在 `src/data/people.json` 對應的群組加一筆：

```json
{
  "name": "Firstname Lastname",
  "nameZh": "中文姓名",
  "role": "Ph.D. student",
  "photo": "FLastname.jpg",
  "position": "Attending Physician, ...",
  "education": ["Ph.D., ...", "B.S., ..."],
  "interests": ["Bioinformatics", "Cancer genomics"]
}
```

`name` 與 `role` 必填，其餘可以不寫：

| 欄位 | 沒寫的時候 |
|---|---|
| `nameZh`、`position` | 那一行不顯示 |
| `inLab`（在本實驗室的身份，例如 `Former Ph.D. student in the lab`） | 那一行不顯示 |
| `photo` | 顯示姓名縮寫的色塊 |
| `education`、`interests` | 那一行不顯示 |

有兩句話不會自動更新，人員異動時要一起改，都在 `people.json`：
各群組的 `note`（標題旁的說明），以及最上面的 `summary`（首頁介紹成員的那一句）。

#### 工具有新版本

在 `src/data/tools.json` 該工具的 `releases` 最上面加一筆：

```json
{ "year": 2026, "label": "DriverDB v5", "journal": "Nucleic Acids Res.", "paper": "https://..." }
```

時間軸、首頁卡片上的版本、Tools 頁的「Latest」都會跟著更新。
`label` 結尾寫成 `v5` 這種形式，版本號才會被認出來。

#### 研究領域的說明與圖

`src/data/research.json` 每個領域有 `description`（補充說明）、`figure`（圖檔檔名，放在 `src/assets/research/`）、
`figureAlt`（圖的文字描述）。三個都留空字串就不顯示。

### 在自己電腦上預覽

需要 Node.js 22.23.4 以上。第一次先安裝：

```bash
npm install
```

之後每次預覽：

```bash
npm run dev
```

瀏覽器開 http://localhost:4321 。存檔後畫面會自動更新。
預覽裡的虛線框是「這裡還缺內容」的提醒，發布出去的網站不會有。

### 發布

發布前先檢查：

```bash
npm run build
```

資料檔有問題（漏欄位、欄位名打錯、網址不完整、照片檔名對不上）時，這個指令會停下來，並指出是哪個檔的哪一筆。

沒有錯誤訊息，就把改好的檔案推送到 `main`。GitHub 會自動建置並發布，約一分鐘後網站更新。
進度與結果看 [Actions 分頁](https://github.com/BioinfOMICS/lab-website/actions)；
出現紅色的叉，代表這一次沒有發布成功，網站會停在上一版。

### 檔案在哪裡

```text
src/
  data/          內容：*.json 是資料，index.ts 負責載入與檢查
  pages/         各個頁面
  components/    共用元件：頁首、頁尾、logo、成員卡片、論文條目……
  layouts/       每一頁共用的外框
  lib/           小工具：站內連結、照片查找、數字轉英文字
  styles/        global.css：全站顏色與字型都定義在這裡
  assets/        照片（建置時會自動縮圖、轉檔）
public/          原樣複製到網站的檔案（網站圖示）
.github/         自動發布的設定
```

想改顏色或字型：只改 `src/styles/global.css` 最上面的 `:root` 那一段，全站會一起變。
