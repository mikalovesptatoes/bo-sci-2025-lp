import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


const firebaseConfig = {
  authDomain: "bo-sci-2025-lp.firebaseapp.com",
  projectId: "bo-sci-2025-lp",
  storageBucket: "bo-sci-2025-lp.firebasestorage.app",
  messagingSenderId: "653385182120",
  appId: "1:653385182120:web:c2da1cfb02b3490ede0b9d",
  measurementId: "G-S4PL5GM7MF",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbwTvaUOL8MSBn__gdnq3lnR6pjKS4UuVoEUWVeyULYaDwqoUqRR_Y5_5FibloH4wMhkgQ/exec";

let view; // ArcGIS の MapView を外からも使えるように
let surveyLayer; // Survey123 レイヤー
let artworks = []; // Survey から生成した作品リスト

let artworkLikes = {};
let currentArtwork = null;
let hasLiked = false;
let likedArtworks = JSON.parse(localStorage.getItem("likedArtworks") || "{}");
let bottomInstruction;
let allowedArea; // 許可範囲ポリゴン
let lastValidCamera = null;

// === ArcGIS Map の初期化 & Survey 読み込み ===
require([
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/geometry/Polygon",
  "esri/geometry/Point",
  "esri/geometry/geometryEngine",
], (WebScene, SceneView, Polygon, Point, geometryEngine) => {
  // WebScene を読み込む
  const scene = new WebScene({
    portalItem: {
      id: "824c34a6b9134c67a8f649d027a08e0c",
    },
  });

  // SceneView を生成（ここではまだ geometry 制限を付けない）
  view = new SceneView({
    container: "mapView",
    map: scene,
    constraints: {
      tilt: {
        max: 80,
        mode: "manual",
      },
    },
  });

  // view が完全に読み込まれてから、残りの処理を行う
  view.when(async () => {
    document.getElementById("mapLoading").classList.add("hide");
    setTimeout(() => {
      document.getElementById("mapLoading").style.display = "none";
    }, 400);

    view.environment = {
      ...view.environment,
      starsEnabled: false,
      atmosphere: {
        quality: "low",
      },
    };

    view.popup.autoOpenEnabled = false;
    view.popup.visible = false;
    view.map.allLayers.forEach((layer) => {
      if ("popupEnabled" in layer) {
        layer.popupEnabled = false;
      }
    });
    window.view = view;
    // ★ 表示を許可する四角形ポリゴン（view.spatialReference を明示）
    allowedArea = new Polygon({
      rings: [
        [
          [139.630968, 35.534775],
          [139.63018738274442, 35.541958799778904],
          [139.64882985540387, 35.54483473916499],
          [139.648881029803, 35.53693998416525],
          [139.630968, 35.534775], // 始点に戻る
        ],
      ],
      spatialReference: view.spatialReference,
    });

    // ★ この範囲の中だけパン・ズームできるようにする（一次防御）
    view.constraints.geometry = allowedArea;

    // 初期カメラ位置
    const initialCamera = {
      position: {
        x: 15544158.741811443,
        y: 4236153.707100175,
        z: 600,
        spatialReference: {
          wkid: 102100, // Web Mercator
          latestWkid: 3857,
        },
      },
      heading: 0,
      tilt: 60,
    };
    await view.goTo(initialCamera);
    lastValidCamera = view.camera.clone();

    const MAX_ZOOM_OUT_SCALE = 25000;

    view.watch("scale", (scale) => {
      // scale は「1:scale」の分母。数字が大きいほど広い範囲が見える（＝縮小）
      if (scale > MAX_ZOOM_OUT_SCALE) {
        view.scale = MAX_ZOOM_OUT_SCALE;
      }
    });

    // ★ カメラが範囲外に出たら直前の位置へ強制的に戻す（二次防御）
    view.watch("camera", (camera) => {
      if (!allowedArea) return;

      const centerPoint = new Point({
        x: camera.position.x,
        y: camera.position.y,
        spatialReference: view.spatialReference,
      });

      const inside = geometryEngine.contains(allowedArea, centerPoint);

      if (inside) {
        // 範囲内：直前の合法位置を更新
        lastValidCamera = camera.clone();
      } else if (lastValidCamera) {
        // 範囲外に出た：即座に前の位置へ戻す（アニメなし）
        view.goTo(lastValidCamera, { animate: false });
      }
    });

    // Survey123 レイヤー取得（★ここで初めて view.map を触る）
    surveyLayer = view.map.allLayers.find(
      (lyr) => lyr.title === "survey" || lyr.id === "survey"
    );

    if (surveyLayer) {
      await loadArtworksFromSurvey();
    } else {
      console.warn("Survey layer not found.");
    }

    // 地図が止まったタイミングでマーカーを再描画
    view.watch("stationary", (v) => {
      if (v && artworks.length) {
        renderMarkers();
      }
    });
  });
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // 最初は下のメッセージを表示、ガイドボタンは隠す
  bottomInstruction = document.querySelector(".bottom-instruction");
  document.getElementById("mapGuideButton").style.display = "none";
  bottomInstruction.classList.remove("show");

  const endButton = document.querySelector(".header-back-button");
  const endPopup = document.getElementById("endPopup");
  const backToTopButton = document.getElementById("backToTopButton");
  const goToWorkshopButton = document.getElementById("goToWorkshopButton");
  const cancelEndButton = document.getElementById("cancelEndButton");
  const endBackdrop = document.querySelector(".end-popup-backdrop");

  function openEndPopup() {
    endPopup.classList.remove("hidden");
  }

  function closeEndPopup() {
    endPopup.classList.add("hidden");
  }

  // 「体験を終わる」クリック → ポップ表示（デフォルトリンクは無効化）
  if (endButton) {
    endButton.addEventListener("click", (e) => {
      e.preventDefault();
      openEndPopup();
    });
  }

  // 「はじめに戻る」 → ルートの index.html へ
  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.location.href = "../index.html"; 
    });
  }

  // 「ワークショップに申し込む」 → Googleフォームへ
  if (goToWorkshopButton) {
    goToWorkshopButton.addEventListener("click", () => {
      window.location.href =
        "https://docs.google.com/forms/d/e/1FAIpQLSeSGh8sGe47gxGbr9ikMCzr5L-RHMObzyRJo4onLc4fnZEitw/viewform?usp=header";
    });
  }

  // 「キャンセル」 or 背景クリック → ポップを閉じる
  if (cancelEndButton) {
    cancelEndButton.addEventListener("click", closeEndPopup);
  }
  if (endBackdrop) {
    endBackdrop.addEventListener("click", closeEndPopup);
  }
});

function closeSiteGuide() {
  document.getElementById("siteGuide").classList.add("hidden");
  document.getElementById("mapGuideButton").style.display = "flex";
  bottomInstruction.classList.add("show");
}

// Show site guide
function showSiteGuide() {
  document.getElementById("siteGuide").classList.remove("hidden");
  document.getElementById("mapGuideButton").style.display = "none";
  bottomInstruction.classList.remove("show");
}

// Calculate clusters for sprouts
// 3つの作品の「真ん中」に芽を1つだけ出す
function calculateClusters(artworks) {
  // MapView または作品がなければ何もしない
  if (!view || !artworks.length) return [];

  // 各作品のスクリーン座標(%)を計算
  const positions = artworks.map((art) => {
    return getScreenPositionPercent(art.geometry);
  });

  // 3つ（またはN個）の平均位置を取る = 画面上での「真ん中」
  const centerTop =
    positions.reduce((sum, p) => sum + p.top, 0) / positions.length;
  const centerLeft =
    positions.reduce((sum, p) => sum + p.left, 0) / positions.length;

  return [
    {
      position: { top: centerTop, left: centerLeft },
      count: artworks.length, // 3つの作品で1つの芽
    },
  ];
}
// ===============================
// 作品ごとの固定コメント一覧（表形式で編集）
// ===============================
const COMMENT_TABLE = [
  // 【大雨のとき】
  {
    artworkKey: "大雨のとき",
    date: "12月10日",
    author: "たけちゃんまま",
    text: "たくさんの色を使っていて、工夫されている作品だと思いました。"
  },
  {
    artworkKey: "大雨のとき",
    date: "12月9日",
    author: "匿名User",
    text: "美しいです。普段気にしない場所に目が向くのが良いですね。"
  },
  {
    artworkKey: "大雨のとき",
    date: "12月8日",
    author: "匿名User",
    text: "コラージュがとてもわかりやすく、「逃げよう」という強いメッセージが伝わります。"
  },

  // 【逃げる】
  {
    artworkKey: "逃げる",
    date: "12月9日",
    author: "匿名User",
    text: "模様がすごく綺麗で魅力的です！"
  },
  {
    artworkKey: "逃げる",
    date: "12月9日",
    author: "みのわ",
    text: "人の色がだんだんと変化しているのがすごいと思いました。"
  },
  {
    artworkKey: "逃げる",
    date: "12月8日",
    author: "匿名User",
    text: "素敵な絵で、作品に込められた想いがよく伝わってきました。"
  },

  // 【逃げよう】
  {
    artworkKey: "逃げよう",
    date: "12月10日",
    author: "みのわ",
    text: "馴染みのある場所なので、よく考えさせられました。共感します。"
  },
  {
    artworkKey: "逃げよう",
    date: "12月9日",
    author: "サワダ",
    text: "マーブリングの配色にセンスを感じます…！！"
  },
  {
    artworkKey: "逃げよう",
    date: "12月9日",
    author: "匿名User",
    text: "防災グッズはまだ用意できてないので、早めに準備したいと思いました！"
  }
];

// Message 文字列から、どの作品キーかを判定
function getArtworkKeyFromMessage(message) {
  if (!message) return null;

  const normalized = message.replace(/[！!]/g, "").trim();

  if (normalized.includes("大雨のとき")) return "大雨のとき";
  if (normalized.startsWith("逃げる")) return "逃げる";
  if (normalized.startsWith("逃げよう")) return "逃げよう";

  return null;
}

// 作品タイトルに対応する固定コメントを取得
function getFixedCommentsForArtwork(message, fallbackArtworkId) {
  const key = getArtworkKeyFromMessage(message);

  // 対応するキーがなければ、今までのダミーコメントをそのまま使う
  if (!key) {
    return createDummyComments(fallbackArtworkId);
  }

  const rows = COMMENT_TABLE.filter((row) => row.artworkKey === key);

  if (rows.length === 0) {
    return createDummyComments(fallbackArtworkId);
  }

  return rows.map((row) => ({
    author: row.author,
    text: row.text,
    timestamp: row.date, // そのまま「12月10日」などで表示
    likes: 3,            // 固定値。必要ならここも表で管理できる
  }));
}


async function loadArtworksFromSurvey() {
  if (!surveyLayer) return;

  const query = surveyLayer.createQuery();

  query.where = `
    Message IN (
      '逃げる',
      'もしもの時',
      '大雨のとき、二階に避難！危険なら公園へ！',
      '逃げよう！'
    )
  `;

  query.outFields = ["objectid", "Message", "field_25", "Mabling", "collage"];
  query.returnGeometry = true;
  query.returnAttachments = true;

  // ① まず作品本体を取得
  const result = await surveyLayer.queryFeatures(query);

  // ② 添付ファイルを objectId ごとにまとめて取得
  const attachmentInfo = await surveyLayer.queryAttachments({
    objectIds: result.features.map((f) => f.attributes.objectid),
  });

  // ③ 作品データを作成
  artworks = result.features.map((f) => {
    const a = f.attributes;
    const oid = a.objectid;

    let imageUrl = "";
    if (attachmentInfo[oid] && attachmentInfo[oid].length > 0) {
      const att = attachmentInfo[oid][0];
      imageUrl = att.url;
    }

    return {
      id: oid,
      title: a.Message || "(タイトル未入力)",
      author: a.field_25 || "作者不明",
      imageUrl,
      description: "",
      marbling: a.Mabling || "",
      collage: a.collage || "",
      likes: 0,
      geometry: f.geometry,
      comments: getFixedCommentsForArtwork(a.Message, oid),
    };
  });

  // ④ いったん全部 0 で初期化して、すぐマーカー表示
  artworkLikes = {};
  artworks.forEach((a) => (artworkLikes[a.id] = 0));

  // ★ ここでもう表示する → 「待ってる間の無」時間をなくす
  renderMarkers();

  // ⑤ いいね数はバックグラウンドで更新する
  artworks.forEach(async (art) => {
    try {
      const ref = doc(db, "likes", String(art.id));
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        artworkLikes[art.id] = data.count || 0;
        // 人気バッジなどを更新したいので再描画
        renderMarkers();
      }
    } catch (e) {
      console.error("いいねの読み込みに失敗しました", e);
    }
  });
}


function getScreenPositionPercent(geometry) {
  if (!view || !geometry) return { top: -999, left: -999 };

  const screenPt = view.toScreen(geometry);
  const rect = view.container.getBoundingClientRect();

  return {
    left: (screenPt.x / rect.width) * 100,
    top: (screenPt.y / rect.height) * 100,
  };
}

// Render markers
function renderMarkers() {
  const container = document.getElementById("markersContainer");
  if (!container || !view) return;

  container.innerHTML = "";

  if (!artworks.length) return;

  // クラスター（芽マーカー）
  const clusters = calculateClusters(artworks);
  clusters.forEach((cluster) => {
    const sproutEl = createSproutMarker(cluster);
    container.appendChild(sproutEl);
  });

  // 作品マーカー
  artworks.forEach((artwork) => {
    const pos = getScreenPositionPercent(artwork.geometry);
    const markerEl = createArtworkMarker(artwork, pos);
    container.appendChild(markerEl);
  });
}

// Create sprout marker
function createSproutMarker(cluster) {
  const sprout = document.createElement("div");
  sprout.className = "sprout-marker";
  sprout.style.top = `${cluster.position.top}%`;
  sprout.style.left = `${cluster.position.left}%`;

  sprout.innerHTML = `
    <div>
      <div class="sprout-glow"></div>
      <div class="sprout-plant">
        <div class="sprout-stem"></div>
        <div class="sprout-leaves">
          <div class="sprout-leaf sprout-leaf-left"></div>
          <div class="sprout-leaf sprout-leaf-right"></div>
        </div>
        <div class="sprout-flower">
          ${[0, 72, 144, 216, 288]
            .map(
              (rotation, i) => `
            <div class="flower-petal" style="transform: rotate(${rotation}deg) translateY(-8px); animation-delay: ${
                0.8 + i * 0.1
              }s;"></div>
          `
            )
            .join("")}
          <div class="flower-center"></div>
        </div>
      </div>
      <div class="sprout-sparkle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      </div>
      <div class="sprout-badge">
        ${cluster.count}つの作品によって共助の芽が育っています！
      </div>
    </div>
  `;

  sprout.onclick = () => handleSproutClick(cluster, sprout);
  return sprout;
}

// 芽をクリックしたときの演出
let sproutInfoTimer = null;

function handleSproutClick(cluster, sproutElement) {
  // 作品カードを非表示に（このまま戻さない）
  const markers = document.querySelectorAll(".artwork-marker");
  markers.forEach((m) => m.classList.add("hidden-artwork"));

  // 既存の魔法オーバーレイがあれば削除
  const oldOverlay = document.querySelector(".sprout-magic-overlay");
  if (oldOverlay) oldOverlay.remove();

  // 全画面オーバーレイを作成
  const overlay = document.createElement("div");
  overlay.className = "sprout-magic-overlay";
  document.body.appendChild(overlay);

  // 芽の画面上の中心座標を取得
  const rect = sproutElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // 画面対角線長（どの方向にも飛ばせるように少し大きめ）
  const maxDist = Math.hypot(window.innerWidth, window.innerHeight) * 1.6;

  // 粒を生成
  const count = 140; // ← 80 くらいから増量
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "sprout-glitter";

    // 発射角度と距離
    const angle = Math.random() * Math.PI * 2;
    const distance = maxDist * (0.4 + Math.random() * 0.6);

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    // 初期位置（芽の中心）
    p.style.left = `${centerX}px`;
    p.style.top = `${centerY}px`;
    p.style.setProperty("--dx", `${dx}px`);
    p.style.setProperty("--dy", `${dy}px`);

    overlay.appendChild(p);
  }

  // 芽の説明ポップを表示
  const info = document.getElementById("sproutInfo");
  const infoText = document.getElementById("sproutInfoText");
  if (info && infoText) {
    infoText.innerHTML = `作品の種類が増えると、<br>共助の芽が育ちます！`;
    info.classList.add("show");

    if (sproutInfoTimer) clearTimeout(sproutInfoTimer);
    sproutInfoTimer = setTimeout(() => {
      info.classList.remove("show");
    }, 4000);
  }

  // きらきらは一定時間後にオーバーレイごと消す（作品カードは復活させない）
  setTimeout(() => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }, 1200);
}

// Create artwork marker
function createArtworkMarker(artwork, position) {
  const marker = document.createElement("div");
  const isPopular = artworkLikes[artwork.id] > 35;

  marker.className = `artwork-marker ${isPopular ? "popular" : ""}`;
  marker.style.top = `${position.top}%`;
  marker.style.left = `${position.left}%`;
  marker.onclick = () => openModal(artwork);

  marker.innerHTML = `
    <div class="marker-container">
      <div class="marker-image-wrapper">
        <img src="${artwork.imageUrl}" alt="${
    artwork.title
  }" class="marker-image">
      </div>
      <div class="marker-overlay">
        <p class="marker-title">${artwork.title}</p>
        <p class="marker-author">${artwork.author}</p>
        <p class="marker-description">${artwork.description}</p>
      </div>
      <div class="marker-likes">
        <svg viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>${artworkLikes[artwork.id]}</span>
      </div>
      ${isPopular ? '<div class="marker-popular-badge">✨人気</div>' : ""}
    </div>
    <div class="marker-tap-hint">タップ！</div>
  `;

  return marker;
}

// Open modal
function openModal(artwork) {
  currentArtwork = artwork;
  hasLiked = false;

  const modal = document.getElementById("artworkModal");
  document.getElementById("modalImage").src = artwork.imageUrl;
  document.getElementById("modalTitle").textContent = artwork.title;
  document.getElementById(
    "modalAuthor"
  ).textContent = `作者：${artwork.author}`;

  // ★ 説明欄を「マーブリング」「コラージュ」に分けて表示
  const descEl = document.getElementById("modalDescription");
  const marblingText = artwork.marbling || "";
  const collageText = artwork.collage || "";

  if (marblingText || collageText) {
    descEl.innerHTML = `
      <div class="description-block">
        <p class="description-label">マーブリングで表現したこと：</p> 
        <p class="description-text">${marblingText || "（記入なし）"}</p>
      </div>
      <div class="description-block">
        <p class="description-label">コラージュで表現したこと：</p> 
        <p class="description-text">${collageText || "（記入なし）"}</p>
      </div>
    `;
  } else {
    // marbling/collage がまだ無い場合は、従来の description をそのまま表示
    descEl.textContent = artwork.description || "";
  }
  hasLiked = !!likedArtworks[artwork.id];
  updateLikeButton();
  renderComments(artwork.comments);

  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

// Close modal
function closeModal() {
  const modal = document.getElementById("artworkModal");
  modal.classList.remove("show");
  document.body.style.overflow = "";
  currentArtwork = null;
  hasLiked = false;
}

// Update like button
function updateLikeButton() {
  const button = document.getElementById("likeButton");
  const buttonText = document.getElementById("likeButtonText");
  const likeCount = document.getElementById("likeCount");
  const icon = button.querySelector(".like-icon");

  if (hasLiked) {
    button.classList.add("liked");
    button.disabled = true;
    buttonText.textContent = "作者の想いを受け取りました！";
    icon.style.fill = "white";
  } else {
    button.classList.remove("liked");
    button.disabled = false;
    buttonText.textContent = "想いを受け取る！";
    icon.style.fill = "none";
  }

  likeCount.textContent = `地域で${
    artworkLikes[currentArtwork.id]
  }人が共感しています`;
}

// Handle like
async function handleLike() {
  if (hasLiked || !currentArtwork) return;
  likedArtworks[currentArtwork.id] = true;
  localStorage.setItem("likedArtworks", JSON.stringify(likedArtworks));

  hasLiked = true;

  const id = String(currentArtwork.id);

  artworkLikes[currentArtwork.id] = (artworkLikes[currentArtwork.id] || 0) + 1;

  updateLikeButton();
  const btn = document.getElementById("likeButton");
  btn.classList.add("liked-animate");
  setTimeout(() => btn.classList.remove("liked-animate"), 600);
  createHeartExplosion();
  renderMarkers();

  try {
    const response = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId: id }), 
    });
    
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.error || "GAS処理失敗");
    }
  } catch (e) {
    console.error("いいねの保存に失敗しました (GAS)", e);
    // エラー時はUIのカウントを元に戻す
    artworkLikes[currentArtwork.id] -= 1; 
    updateLikeButton();
  }
}

// Create heart explosion
function createHeartExplosion() {
  const container = document.getElementById("heartExplosion");
  container.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-particle";

    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;

    heart.style.setProperty("--x", `${x}px`);
    heart.style.setProperty("--y", `${y}px`);

    heart.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;

    // Apply animation with individual direction
    heart.style.animation = `heartFly 0.8s ease-out forwards`;
    heart.style.transform = `translate(${x}px, ${y}px)`;

    container.appendChild(heart);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 1000);
}

// Render comments
function renderComments(comments) {
  const commentsList = document.getElementById("commentsList");
  const commentCount = document.getElementById("commentCount");

  commentCount.textContent = `(${comments.length})`;

  commentsList.innerHTML = comments
    .map(
      (comment) => `
    <div class="comment-item">
      <div class="comment-header">
        <p class="comment-author">${comment.author}</p>
        <span class="comment-timestamp">${comment.timestamp}</span>
      </div>
      <p class="comment-text">${comment.text}</p>
      <div class="comment-likes">
        <svg viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>${comment.likes}</span>
      </div>
    </div>
  `
    )
    .join("");
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  const modal = document.getElementById("artworkModal");
  if (e.target === modal) {
    closeModal();
  }
});

window.closeSiteGuide = closeSiteGuide;
window.showSiteGuide = showSiteGuide;
window.handleLike = handleLike;
window.closeModal = closeModal;
