let view; // ArcGIS の MapView を外からも使えるように
let surveyLayer; // Survey123 レイヤー
let artworks = []; // Survey から生成した作品リスト

let artworkLikes = {};
let currentArtwork = null;
let hasLiked = false;

// === ArcGIS Map の初期化 & Survey 読み込み ===
require(["esri/WebMap", "esri/views/MapView", "esri/geometry/Circle"], (
  WebMap,
  MapView,
  Circle
) => {
  const tsunashimaCenter = {
    longitude: 139.6348,
    latitude: 35.5369,
  };

  // Web マップ（mapID）を読み込む
  const map = new WebMap({
    portalItem: {
      id: "70429b65f4b14047a6564766ed6b7334",
    },
  });

  // View を作成
  view = new MapView({
    container: "mapView",
    map,
    center: [tsunashimaCenter.longitude, tsunashimaCenter.latitude],
    zoom: 12,
    constraints: {
      minScale: 10000,
      maxZoom: 18,
      rotationEnabled: false,
    },
  });

  const allowedCircle = new Circle({
    center: [tsunashimaCenter.longitude, tsunashimaCenter.latitude],
    radius: 10000,
    radiusUnit: "meters",
  });

  view.when(() => {
    view.constraints.geometry = allowedCircle;

    // Web マップ内から Survey レイヤーを探す（名前 "survey" 想定）
    surveyLayer = view.map.allLayers.find(
      (lyr) => lyr.title === "survey" || lyr.id === "survey"
    );

    // 見つかったら Survey から作品データを読み込む
    if (surveyLayer) {
      loadArtworksFromSurvey();
    } else {
      console.warn("Survey layer not found.");
    }

    // 地図をパン・ズームしたあとにマーカー位置を更新
    view.watch("stationary", (v) => {
      if (v && artworks.length) {
        renderMarkers();
      }
    });
  });
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("mapGuideButton").style.display = "none";
});

function closeSiteGuide() {
  document.getElementById("siteGuide").classList.add("hidden");
  document.getElementById("mapGuideButton").style.display = "flex";
}

// Show site guide
function showSiteGuide() {
  document.getElementById("siteGuide").classList.remove("hidden");
  document.getElementById("mapGuideButton").style.display = "none";
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

async function loadArtworksFromSurvey() {
  if (!surveyLayer) return;

  const query = surveyLayer.createQuery();

  query.where = `
    Message IN (
      '逃げる',
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

  artworks = result.features.map((f) => {
    const a = f.attributes;
    const oid = a.objectid;

    // ③ 添付ファイルURLを安全に取り出す
    let imageUrl = "";
    if (attachmentInfo[oid] && attachmentInfo[oid].length > 0) {
      const att = attachmentInfo[oid][0];
      // att.url はトークン付きなど、完全なURLになっている
      imageUrl = att.url;
    }

    // ④ 説明文
    const descriptions = [];
    if (a.Mabling) descriptions.push(a.Mabling);
    if (a.collage) descriptions.push(a.collage);

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
      comments: [],
    };
  });

  artworkLikes = {};
  artworks.forEach((a) => (artworkLikes[a.id] = a.likes));

  renderMarkers();
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
    infoText.textContent = `このあたりには、${cluster.count}つの防災アート作品が咲いています。芽を目印に、どんな作品があるか想像してみよう！`;
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
    buttonText.textContent = "いいね済み！";
    icon.style.fill = "white";
  } else {
    button.classList.remove("liked");
    button.disabled = false;
    buttonText.textContent = "いいね！";
    icon.style.fill = "none";
  }

  likeCount.textContent = `${
    artworkLikes[currentArtwork.id]
  }人がいいねしています`;
}

// Handle like
function handleLike() {
  if (hasLiked || !currentArtwork) return;

  hasLiked = true;
  artworkLikes[currentArtwork.id]++;
  updateLikeButton();
  createHeartExplosion();
  renderMarkers(); // Update markers with new like count
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
