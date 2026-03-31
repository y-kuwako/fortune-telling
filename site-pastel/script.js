/* ========================================
   Love Tarot - Pastel Soft Theme
   ======================================== */

(function () {
  "use strict";

  // ---- Tarot Card Data ----
  var tarotCards = [
    {
      name: "恋人たち",
      nameEn: "The Lovers",
      emoji: "\uD83D\uDC91",
      message:
        "あなたの恋は今、大きな転機を迎えようとしています。二人の間に深い絆が生まれ、心と心が通じ合う特別な時期です。直感を信じて、素直な気持ちを伝えてみてください。",
      advice:
        "相手の目を見て話す時間を大切にしましょう。小さなことでも「ありがとう」を伝えると、二人の距離がぐっと縮まります。",
      feeling:
        "相手はあなたのことをとても大切に思っています。あなたの笑顔を見るたびに、心が温かくなっているようです。",
      luckyDay: "金曜日",
    },
    {
      name: "カップの2",
      nameEn: "Two of Cups",
      emoji: "\uD83C\uDF77",
      message:
        "二人の心が美しく響き合うカードです。お互いを尊重し、認め合える関係が築かれつつあります。この出会いは運命的なもの。大切に育んでいきましょう。",
      advice:
        "相手のペースに合わせることを意識してみてください。焦らず、ゆっくりと信頼関係を深めていくことが大切です。",
      feeling:
        "相手はあなたと一緒にいると安心感を覚えています。あなたの優しさに心を開き始めているところです。",
      luckyDay: "月曜日",
    },
    {
      name: "カップのエース",
      nameEn: "Ace of Cups",
      emoji: "\uD83C\uDF3A",
      message:
        "新しい恋の始まりを告げるカードです。あなたの心に新鮮な愛の感情が芽生えています。その気持ちを大切に、自分らしく恋を楽しんでください。素敵な展開が待っています。",
      advice:
        "自分の気持ちに正直になりましょう。好きという感情を恐れずに受け入れることで、より豊かな恋愛が始まります。",
      feeling:
        "相手はあなたに対して新鮮な興味を抱いています。あなたの存在が相手の日常に彩りを添えているようです。",
      luckyDay: "水曜日",
    },
    {
      name: "女帝",
      nameEn: "The Empress",
      emoji: "\uD83D\uDC51",
      message:
        "豊かな愛情に包まれるカードです。あなたの中にある優しさと包容力が、恋愛運を大きく引き上げています。ありのままの自分でいることが、最高の魅力になります。",
      advice:
        "自分自身を大切にする時間を作りましょう。あなたが満たされていると、周りの人もその輝きに引き寄せられます。",
      feeling:
        "相手はあなたの温かさに心を癒されています。一緒にいると安らぎを感じ、もっと近くにいたいと思っているようです。",
      luckyDay: "火曜日",
    },
    {
      name: "星",
      nameEn: "The Star",
      emoji: "\u2B50",
      message:
        "希望の光が差し込むカードです。今は辛い状況でも、必ず素敵な未来が待っています。あなたの恋は星に導かれ、美しい方向へと進んでいくでしょう。諦めないでください。",
      advice:
        "夜空を見上げてみてください。星の輝きのように、あなたの魅力も静かに、でも確かに輝いています。自信を持ちましょう。",
      feeling:
        "相手はあなたのことを特別な存在だと感じています。あなたの純粋さと真っすぐな心に、希望を感じているようです。",
      luckyDay: "日曜日",
    },
    {
      name: "カップのナイト",
      nameEn: "Knight of Cups",
      emoji: "\uD83E\uDDB9",
      message:
        "ロマンチックな展開が訪れるカードです。あなたの元に素敵な誘いやメッセージが届くかもしれません。恋のチャンスを逃さないよう、アンテナを張っておいてください。",
      advice:
        "いつもより少しだけおしゃれをして出かけてみましょう。予期しない場所で、素敵な出会いや進展があるかもしれません。",
      feeling:
        "相手はあなたに気持ちを伝えたいと思っています。勇気を出してアプローチしようとしているところかもしれません。",
      luckyDay: "木曜日",
    },
    {
      name: "カップの10",
      nameEn: "Ten of Cups",
      emoji: "\uD83C\uDF08",
      message:
        "最高の幸せを示すカードです。あなたの恋は実りの時期を迎えています。お互いの存在が当たり前ではなく、かけがえのないものだと実感できる幸福な時間が流れています。",
      advice:
        "日常の小さな幸せを見つけて、二人で分かち合いましょう。特別なイベントよりも、何気ない日々の共有が絆を深めます。",
      feeling:
        "相手はあなたとの未来を思い描いています。ずっと一緒にいたいという温かな気持ちが、心の中で大きくなっています。",
      luckyDay: "土曜日",
    },
    {
      name: "太陽",
      nameEn: "The Sun",
      emoji: "\uD83C\uDF1E",
      message:
        "明るい光に満ちたカードです。あなたの恋愛は今、太陽のように輝いています。楽しい時間、笑顔、幸福感...すべてが良い方向に向かっています。この輝きを存分に楽しんで。",
      advice:
        "笑顔を忘れずに。あなたの明るさが相手にとって一番の魅力です。二人で楽しめることを積極的に計画してみてください。",
      feeling:
        "相手はあなたといると自然と笑顔になれると感じています。あなたの存在そのものが、相手にとっての太陽です。",
      luckyDay: "日曜日",
    },
    {
      name: "月",
      nameEn: "The Moon",
      emoji: "\uD83C\uDF19",
      message:
        "神秘的で繊細な恋のカードです。今は少し不安を感じることがあるかもしれませんが、それは恋が深まっている証拠。月の光のように、静かに二人の関係を照らしてくれるでしょう。",
      advice:
        "不安なときは一人で抱え込まず、信頼できる人に相談してみてください。また、直感を大切にすると、正しい道が見えてきます。",
      feeling:
        "相手もあなたと同じように、少し不安を感じながらも、あなたのことを想っています。お互いの気持ちを確かめ合うタイミングです。",
      luckyDay: "月曜日",
    },
    {
      name: "運命の輪",
      nameEn: "Wheel of Fortune",
      emoji: "\uD83C\uDFA1",
      message:
        "運命が動き出すカードです。あなたの恋愛に大きな変化の風が吹こうとしています。偶然の再会、思いがけない告白、予想外の展開...。運命の歯車が回り始めました。",
      advice:
        "変化を恐れないでください。今起きていることはすべて、あなたをより良い未来へ導くためのもの。流れに身を任せてみましょう。",
      feeling:
        "相手はあなたとの出会いを運命だと感じ始めています。この縁を大切にしたいという気持ちが芽生えているようです。",
      luckyDay: "木曜日",
    },
  ];

  // ---- Date-seeded random ----
  function getDateSeed() {
    var now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  }

  function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function shuffleWithSeed(arr, seed) {
    var shuffled = arr.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      seed++;
      var j = Math.floor(seededRandom(seed) * (i + 1));
      var tmp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = tmp;
    }
    return shuffled;
  }

  // ---- State ----
  var dateSeed = getDateSeed();
  var shuffledCards = shuffleWithSeed(tarotCards, dateSeed);
  var selectedCard = null;

  // ---- DOM ----
  var cardEls = document.querySelectorAll(".tarot-card");
  var resultSection = document.getElementById("result");
  var instructionSection = document.getElementById("instruction");
  var cardSelectionSection = document.getElementById("card-selection");

  // ---- Assign shuffled cards to the 5 positions ----
  var fiveCards = shuffledCards.slice(0, 5);

  cardEls.forEach(function (el, i) {
    // Set emoji on front face
    el.querySelector(".card-front").textContent = fiveCards[i].emoji;

    el.addEventListener("click", function () {
      if (selectedCard !== null) return;
      selectCard(i, el);
    });
  });

  function selectCard(index, el) {
    selectedCard = fiveCards[index];

    // Flip selected card
    el.classList.add("flipped", "selected");

    // Dim other cards
    cardEls.forEach(function (card, ci) {
      if (ci !== index) {
        card.classList.add("dimmed");
      }
    });

    // Show result after flip animation
    setTimeout(function () {
      showResult(selectedCard);
    }, 800);
  }

  function showResult(card) {
    // Hide instruction
    instructionSection.style.display = "none";

    // Populate result
    document.querySelector(".result-card-emoji").textContent = card.emoji;
    document.querySelector(".result-card-name").textContent = card.name;
    document.querySelector(".result-card-name-en").textContent = card.nameEn;
    document.querySelector(".result-message-text").textContent = card.message;
    document.querySelector(".result-advice-text").textContent = card.advice;
    document.querySelector(".result-feeling-text").textContent = card.feeling;
    document.querySelector(".result-lucky-text").textContent = card.luckyDay;

    // Show result with animations
    resultSection.classList.remove("hidden");

    // Add staggered fade-in to each section
    var sections = resultSection.children;
    for (var i = 0; i < sections.length; i++) {
      sections[i].classList.add("fade-in", "fade-in-delay-" + Math.min(i + 1, 6));
    }

    // Scroll to result
    setTimeout(function () {
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  // ---- Reset ----
  window.resetReading = function () {
    selectedCard = null;

    // Reset result section
    resultSection.classList.add("hidden");
    var sections = resultSection.children;
    for (var i = 0; i < sections.length; i++) {
      sections[i].classList.remove(
        "fade-in",
        "fade-in-delay-1",
        "fade-in-delay-2",
        "fade-in-delay-3",
        "fade-in-delay-4",
        "fade-in-delay-5",
        "fade-in-delay-6"
      );
    }

    // Show instruction
    instructionSection.style.display = "";

    // Re-shuffle with a different seed (add interaction count)
    dateSeed += 7;
    shuffledCards = shuffleWithSeed(tarotCards, dateSeed);
    fiveCards = shuffledCards.slice(0, 5);

    // Reset cards
    cardEls.forEach(function (el, i) {
      el.classList.remove("flipped", "selected", "dimmed");
      el.querySelector(".card-front").textContent = fiveCards[i].emoji;
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- Share Functions ----
  function getShareText() {
    if (!selectedCard) return "";
    return (
      "Love Tarot\u306e\u7d50\u679c\uFF1A" +
      selectedCard.emoji +
      " " +
      selectedCard.name +
      "\n" +
      selectedCard.message +
      "\n\n#LoveTarot #\u604B\u611B\u30BF\u30ED\u30C3\u30C8"
    );
  }

  window.shareX = function () {
    var text = encodeURIComponent(getShareText());
    var url = encodeURIComponent(window.location.href);
    window.open(
      "https://twitter.com/intent/tweet?text=" + text + "&url=" + url,
      "_blank",
      "width=550,height=420"
    );
  };

  window.shareLine = function () {
    var text = encodeURIComponent(getShareText() + "\n" + window.location.href);
    window.open("https://line.me/R/msg/text/?" + text, "_blank");
  };

  window.copyResult = function () {
    var text = getShareText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast("\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F");
      });
    } else {
      // Fallback
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F");
    }
  };

  function showToast(message) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();

    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add("show");
    });

    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 2000);
  }
})();
