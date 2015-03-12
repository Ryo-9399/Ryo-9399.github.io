
** 大切なお知らせ　ライブラリの名前について **
　現在、本ライブラリには、まだ正式な名前が決定されておらず、検討中の
ままとなっております。本ライブラリの名前について、なにかアイデアが
ござましたら、ぜひご一報ください。



目次（検索機能等でご活用ください）
	●概要
	●パッケージ内容
	●起動方法
	●仮想パッドのスタイル変更方法（NEW）
	●ブックマークレットについて
	●音声再生機能について（重要）
	●更新履歴
	●連絡先・注意事項


●概要
　この度は、「JS版まさおコンストラクション」（JSまさお）をダウンロード
いただき、ありがとうございます。
　本ライブラリは福田直人氏の制作した「まさおコンストラクション」を、
挙動をそのままに、かつWebブラウザ上で動作するように、JavaScriptを用いて
移植したものです。また、原作と挙動を完全互換にすることにより、
自動系・裏技系も再現できるようにしました。

※本ライブラリはHTML5のAPIを使用しておりますので、古いブラウザでは
　動作しません。最新のブラウザでご使用ください。


●パッケージ内容
!ReadMe.txt
	本ファイルです。
MasaoJSS使用法まとめ.html
	MasaoJSSの使用法をまとめたHTMLドキュメントです。
ソースコンバータ.html
	原作の、paramタグで構成されたステージデータを、JS版ソースに変換します
ブックマークレット.html
	既存のまさおアプレットをJS版に変換するブックマークレットを記述しています。
Samples/
	福田直人氏制作のサンプルステージをJS版に変換したHTMLファイル等があるフォルダです。
Samples/_サンプルリスト.html
	Samplesフォルダ内のサンプルのリストを表示します。
Outputs/CanvasMasao.js
	JS版まさおの本体です。


●起動方法
・JSまさお本体のJSファイルを読み込む。（ヘッダ内に記述するのが望ましい）
※この例は、JSファイルが同じディレクトリに存在する場合の記述です。
	<script type="text/javascript" src="CanvasMasao.js"></script>
・この下にスクリプト<script type="text/javascript">～</script>を
記述し、中身を次のようにする。
	・属性id="myid"を持つアプレットをJS版に置換したい場合
		CanvasMasao.Game.replace( "myid" );
	・ページ内の全てのまさおアプレットを置換したい場合
		CanvasMasao.Game.replaceAll();
	・パラメータをスクリプトで記述して構築したい場合
		new CanvasMasao.Game( パラメータオブジェクト );
	・属性id="myid"を持つ要素の中に構築したい場合
		new CanvasMasao.Game( パラメータオブジェクト, "myid" );
ここで、パラメータオブジェクトは、パラメータのnameをキーとし、
valueを値とする連想配列です。

使用例１：特定IDを持つアプレットの置換
	<script …>
		CanvasMasao.Game.replace("applet1_id");
	</script>
	…
	<applet code="MasaoConstruction.class" id="applet1_id" …>
		<param name=… value=…> …
	</applet>

使用例２：ページ内の全てのまさおアプレットの置換
code属性に"MasaoConstruction"または"MasaoKani"（大文字・小文字の区別なし）
を含むもの、そしてアプレットに該当するObject要素が置換対象です。
	<script …>
		CanvasMasao.Game.replaceAll();
	</script>
	…
	<applet code="MasaoConstruction.class" …>
	… </applet>
	<applet code="MasaoConstruction.class" …>
	… </applet>
	<applet code="MasaoConstruction.class" …>
	… </applet> …

使用例３：パラメータを渡して構築（実行した位置に構築される）
	<script …>
		new CanvasMasao.Game({
			"time_max": "500",
			"map0-0": "..........",
			…
		});
	</script>

使用例４：パラメータを渡して、特定IDを持つ要素の中へ構築
	<script …>
		new CanvasMasao.Game({
			…
		}, "masao_div");
	</script>
	…
	<div id="masao_div"></div>

＊replace()の第２引数、replaceAll()の第１引数、及び
コンストラクタCanvasMasao.Gameの第３引数にオブジェクトを追加すると、
まさおの起動オプションを指定できます。
以下に示す名前をキーとする連想配列を渡すと、それらが適用されます。
・width, height
	ゲーム画面の幅と高さ
	意図的に表示範囲を制限したステージの再現が可能となります。
・highscoreCallback
	ハイスコア更新時に実行するコールバック関数
	コールバック関数の第１引数にハイスコアが格納されます。
・userJSCallback
	MasaoJSSを使用するときに使用する関数（コールバック関数userJS）
	使用法は付属ドキュメント「_MasaoJSS使用法まとめ.html」をご参照ください。

使用例５：ハイスコアイベントリスナを指定する（特定アプレット置換型）
	<script …>
		function handleHighscoreEvent(score)
		{
			// 送信する処理などをこの関数内に記述
			document.f.score.value = score;
		}
		CanvasMasao.Game.replace("applet1_id", {
			highscoreCallback : handleHighscoreEvent
		});
	</script>
	…
	<applet code="MasaoConstruction.class" id="applet1_id" …>
		<param name=… value=…> …
	</applet>
	…
	<form name="f" method="post">
		名前：<input type="text" name="name">
		得点：<input type="text" name="score" value="0" readonly>
		<input type="submit" value="送信">
	</form>

使用例６：ハイスコアイベントリスナを指定する（全アプレット置換型）
※全アプレットのイベントを取得するので非推奨（１つだけなら問題ない）
	<script …>
		function handleHighscoreEvent(score){ … }
		CanvasMasao.Game.replaceAll({
			highscoreCallback : handleHighscoreEvent
		});
	</script>
	…
	<applet code="MasaoConstruction.class" …>
	… </applet>
	<applet code="MasaoConstruction.class" …>
	… </applet>
	<applet code="MasaoConstruction.class" …>
	… </applet> …

使用例７：ハイスコアイベントリスナを指定する（構築型）
※特定IDを持つ要素の中へ構築したい場合は、第２引数にnullではなくIDを指定してください。
	<script …>
		function handleHighscoreEvent(score){ … }
		new CanvasMasao.Game({
			"time_max": "500",
			"map0-0": "..........",
			…
		}, null, {
			highscoreCallback : handleHighscoreEvent
		});
	</script>

使用例８：ハイスコアイベントリスナを無名関数にする
外部からの攻撃に少し強くなります。
	<script …>
		…(…
		{
			highscoreCallback : function (score){ … }
		});
	</script>

使用例８応用：ハイスコアイベントリスナにクロージャを使用する
外部からの攻撃にかなり強くなります。
	<script type="text/javascript">
		…(…
		{
			highscoreCallback : (function (){
				var score = 0;
				window.addEventListener("load",
					function (){
						document.f.addEventListener("submit",
							function (e){
								e.stopImmediatePropagation();
								document.f.score.value = score;
							}
						);
					}
				);
				return function (s){
					score = s;
					document.f.score_display.value = s;
				};
			})()
		});
	</script>
	…
	<form name="f" method="post">
		名前：<input type="text" name="name">
		得点：<input type="text" name="score_display" value="0" readonly>
		<input type="hidden" name="score" value="0">
		<input type="submit" value="送信">
	</form>

使用例９：ゲーム画面のサイズを変更する
	<script …>
		…(…
		{
			width : 128, height : 96
		});
	</script>

今まで「CanvasMasao.Game」と入力することが面倒だったため、それを「JSMasao」に
置き換えることができます。（「CanvasMasao.Game」は従来通り動作します）

使用例１改：
	<script …>
		JSMasao.replace("applet1_id");
	</script>
	…
	<applet code="MasaoConstruction.class" id="applet1_id" …>
		<param name=… value=…> …
	</applet>

使用例３改：
	<script …>
		new JSMasao({
			"time_max": "500",
			"map0-0": "..........",
			…
		});
	</script>


●仮想パッドのスタイル変更方法（NEW）
仮想パッドのボタン配置、スタイル、広告の回避オプションを変更できるように
なりました。仕様は以下の通りです。

オブジェクト名：JSMasao.pad（またはCanvasMasao.Game.pad）
オブジェクトのメンバ：
	・coords（配列の配列）
		ボタンの頂点座標の配列を格納する配列。
		中身を配列にして、各頂点のX座標、Y座標を交互に代入する。
		ただし、X座標の最小は0、最大は500、Y座標の最小は0、最大は200。
		例：coords[0]の初期値は[410, 30, 490, 30, 490, 170, 410, 170]なので
		各頂点の座標は(410, 30), (490, 30), (490, 170), (410, 170)となる。
		○初期値：
		[
			[410,  30, 490,  30, 490, 170, 410, 170],
			[320,  30, 400,  30, 400, 170, 320, 170],
			[250,  30, 290,  30, 290,  70, 250,  70],
			[200,  30, 240,  30, 240,  70, 200,  70],
			[  5,  60,  87,  60,  87, 140,   5, 140],
			[175,  60,  93,  60,  93, 140, 175, 140],
			[ 30,   5,  30,  80, 150,  80, 150,   5],
			[ 30, 195,  30, 120, 150, 120, 150, 195]
		]
	・chars（文字列の配列）
		ボタンのラベルに表示する文字列。
		ボタンの重心にあたる座標に、その文字列を表示する。
		○初期値：["X", "Z", "T", "P", "←", "→", "↑", "↓"]
	・codes（整数の配列）
		ボタンを押したときにゲームへ入力されるキーコードの配列。
		例えば、キー"Z"は90、キー"A"は65。
		○初期値：[88, 90, 84, 80, 37, 39, 38, 40]
	・style（オブジェクト）
		仮想パッド全体のスタイルを定義したオブジェクト。
		・style.rate（数値）
			パッドの幅に対する高さの比率。
			○初期値：0.4
		・style.back
			仮想パッド全体の背景色。
			○初期値："rgba(0, 0, 0, 0)"
		・style.button
			押されていないボタンの背景色。
			○初期値："rgba(128, 128, 128, 0.5)"
		・style.active
			押されているボタンの背景色。
			押されていないボタンの上に重ねて塗りつぶされる。
			○初期値："rgba(0, 0, 0, 0.5)"
		・style.text
			ボタンのラベルの文字色。
			○初期値："black"
		・style.border
			ボタンの境界線の色。
			○初期値："black"
	・avoidAD（真偽値）
		広告の誤タップを防ぐ目的で導入。
		trueを代入すると、下からいくらかずらしてパッドを表示する。
		○初期値：false
備考：
	・このオブジェクトの中身を変更することで、仮想パッドのスタイルを
	変更できます。
	・配列coords、chars、codesの添字は、0を始点としたボタンの
	インデックスに対応しています。
	例えば、0番目のボタンの座標などの情報はcoords[0]、chars[0]、codes[0]に
	格納します。
	また、coords、chars、codesの要素数を増やすと、ボタンの数を増やすことも
	できます。例えば、初期のボタンに加え、新しく"C"キーを"Z"と"X"の上に
	追加するならば、このようにスクリプトへ記述します。
		JSMasao.pad.coords.push([320, 5, 490, 5, 490, 25, 320, 25]);
		JSMasao.pad.chars.push("C");
		JSMasao.pad.codes.push(67);
	・styleで指定できる色は、CSSで指定できる色と同じです。
	・JSMasao.pad（またはCanvasMasao.Game.pad）へ直接オブジェクトを代入して
	スタイルを一括指定することもできます。その際、未定義の部分があると
	バグが発生しますのでご注意ください。


●ブックマークレットについて
既存のまさおアプレットをJS版に変換することができます。
リンクをブックマークして、まさおのページで使用すると、JS版に置き換えることができます。
最新版（バージョン２）でないと動作しないので注意してください。
（使用する際にインターネットに接続して外部JSファイルを参照するので、
　インターネットに接続しないと動作しないので注意してください）


●音声再生機能について（重要）
　現在、様々なブラウザで音声を再生することができますが、ブラウザごとの
対応がまちまちなので、filename_se_○○（効果音ファイルの指定）と
filename_fx_bgm_○○（BGMファイルの指定）の拡張子は無視され、
代わりに次の３形式の音声ファイルを読み込もうとします。
	・Wave形式（*.wav）
	・MP3形式（*.mp3）
	・Ogg Vorbis形式（*.ogg）
　プログラム側では上から順にブラウザの対応状況を判断し、
対応していればそのファイルを読み込みます。なので、サーバ側では
同じ内容で形式の異なる音声ファイル（*.wav、*.mp3、*.ogg）を全て
用意しておくことを推奨します。
	例：Wave、Ogg形式に非対応、MP3形式に対応したブラウザでは、
	　MP3形式を読み込みます。
	例２：上記の形式全てに対応したブラウザでは、Wave形式を読み込み、
	　MP3、Ogg形式のファイルは無視されます。
	例３：Ogg形式のみに対応したブラウザで、指定の音声ファイルがサーバ上に
	　存在しない、または読み込めない場合、その音声は鳴らなくなります。
　しかし、どうしても３形式全てを用意することが不可能な場合は、
audio_se_switch_○○（効果音）あるいはaudio_bgm_switch_○○（BGM）の
パラメータの値を"2"にすると、その形式のファイルを読み込まない
ようにします。（○○にはwave、mp3、oggが入る）
また、拡張子は必ず「*.wav」「*.mp3」「*.ogg」にしてください。
	例４：３形式全てに対応したブラウザでWave形式のBGMを使いたくない場合は
	　name="audio_bgm_switch_wave" value="2"を追加する。
	例５：拡張子が「*.wave」のファイルはWave形式であるが、プログラム側では
	　「*.wav」を読み込もうとするため、「*.wave」は読み込まれず、音が
	　鳴らなくなる。
　ただし、BGMをWave形式にするとファイル容量が大きくなり、サーバへの負担が
大きくなるので、audio_bgm_switch_waveのデフォルト値は"2"となっています。

※モバイル端末では、（一部の環境を除き）同時に１つの音しか再生できないため、
　BGMが正常に再生されません。


●更新履歴
v0.05.5（現在バージョン）
	setPatternImageの第１引数が8の場合、正しく動作しない不具合を修正
	setBossHPメソッドを実装
v0.05.4
	モバイル端末における、仮想パッドのスタイルを変更できるように
	（ボタン配置、色変更、広告回避）
	新しい起動方法の追加「JSMasao」
	MasaoJSSのsetYukaColorメソッドが、最初に作成した床オブジェクトにしか適用されないバグを修正
v0.05.3
	ランキングフォーム等の文字入力にて、Z、X、スペースなどの文字を入力できなくなる不具合を修正
	Samples/ハイスコア変化テスト.htmlのプログラムを「使用例８応用」のものに変更
v0.05.2
	画面をクリックしてもゲームが始まらない現象を解消
	CanvasMasao.Game.replaceAllメソッドでの置換対象に、Object要素とMasaoKaniを追加
	Canvasの幅と高さを変えられるように変更
	構築型でID指定省略時（使用例３）に、終了タグが書き込まれていない不具合を修正
v0.05.1
	まさお拡張クラス使用時、多くのメソッドでエラーが発生する不具合を修正
v0.05
	MasaoJSSに対応
v0.04
	ハイスコアイベントを使用可能にした
v0.03
	ファイルを１つにまとめ、ファイルサイズを減量
	ページ内の、他のJavaScriptプログラムとの衝突を回避
	ページ内複数まさおの実現
**ここから起動方法が変更された**
v0.02.1
	旧ソース（paramタグを使用したソース）を、ほぼそのまま使用できるように
v0.02
	音声を、Audio要素を使用して実装
	一部のアスレチックを使用すると表示が乱れる不具合を修正
v0.01.1
	細かい修正
v0.01
	モバイル端末で操作できるように、画面の最下部に仮想パッドを表示できるように
v0.00.1
	サンプルステージの文字コードの問題を修正
v0
	初リリース


●連絡先・注意事項
　バグ報告やご意見、ご要望は、下記メール、またはTwitterまで連絡をお願いします。
E-mail: ryo19950926@gmail.com
Twitterアカウント: @ryo4429399
Twitterハッシュタグ（開発状況などの情報）: #JSまさお開発

　また、GitHubにソースを公開しておりますので、開発に
ご協力いただける方を募集しています。
https://github.com/Ryo-9399/mc_canvas

　このプログラムは、あくまでも福田直人氏の「まさおコンストラクション」の
Javaプログラムを解析し、JavaScript用に変換しただけのものです。したがって、
プログラムの著作権は福田直人氏が保有します。
　このプログラムを使用して発生したいかなる損害に関しては、当方は一切の
責任を負いません。あらかじめご了承ください。
