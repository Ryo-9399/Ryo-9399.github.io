(function(){
	
	/*
	buttons[i]の中身
	.vertices : 頂点オブジェクトの配列
		buttons[i].vertices[j]の中身
		.x : X座標
		.y : Y座標
		.box : 表示用div要素
			buttons[i].vertices[j].box要素の中身
			・X座標入力input要素
			・Y座標入力input要素
			・頂点削除ボタン
	.char : 表示する文字列
	.code : 入力される文字コード
	.box : 表示用div要素
		buttons[i]#box要素の中身
		・.vertices[j]#boxの中身
		・頂点追加ボタン
		・ボタン削除ボタン
	
	setter : 頂点編集div要素
		setter要素の中身
		・buttons[i].boxの中身
		・ボタン追加ボタン
	
	preview : プレビューcanvas
	*/
	
	var COLORS = ["back", "button", "active", "text", "border"];
	
	var buttons = [];
	var setter = document.getElementById("setter");
	var can = document.getElementById("can");
	var output = document.getElementById("output_code");
	
	var style = {
		rate : 0.4,
		back : "rgba(0, 0, 0, 0)",
		button : "rgba(128, 128, 128, 0.5)",
		active : "rgba(0, 0, 0, 0.5)",
		text : "black",
		border : "black",
	};
	var avoidAD = false;
	
	var colorElements = {};
	
	var t = [];
	
	can.addEventListener("mousemove", onmousemove);
	
	var ctx = can.getContext("2d");
	ctx.font = "24px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.lineWidth = 2;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	
	document.getElementById("btn_badd").addEventListener("click", addButton);
	
	document.getElementById("btn_output_code").addEventListener("click", outputCode);
	
	for(var i = 0; i < COLORS.length; i++)
	{
		colorElements[COLORS[i]] = {
			r : document.getElementById("style_" + COLORS[i] + "_r_n"),
			g : document.getElementById("style_" + COLORS[i] + "_g_n"),
			b : document.getElementById("style_" + COLORS[i] + "_b_n"),
			a : document.getElementById("style_" + COLORS[i] + "_a_n"),
			disp : document.getElementById("style_" + COLORS[i])
		};
		document.getElementById("style_" + COLORS[i] + "_r")
			.addEventListener("change", onchangeColor.bind(null, COLORS[i], "red"));
		document.getElementById("style_" + COLORS[i] + "_g")
			.addEventListener("change", onchangeColor.bind(null, COLORS[i], "green"));
		document.getElementById("style_" + COLORS[i] + "_b")
			.addEventListener("change", onchangeColor.bind(null, COLORS[i], "blue"));
		document.getElementById("style_" + COLORS[i] + "_a")
			.addEventListener("change", onchangeColor.bind(null, COLORS[i], "alpha"));
		colorElements[COLORS[i]].red = document.getElementById("style_" + COLORS[i] + "_r").value;
		colorElements[COLORS[i]].green = document.getElementById("style_" + COLORS[i] + "_g").value;
		colorElements[COLORS[i]].blue = document.getElementById("style_" + COLORS[i] + "_b").value;
		colorElements[COLORS[i]].alpha = document.getElementById("style_" + COLORS[i] + "_a").value;
	}
	updateColor();
	
	// ボタン追加ボタンクリックイベント
	function addButton()
	{
		// デフォルト値
		var def = [[0, 0], [0, 80], [80, 80], [80, 0]];
		var obj = { char: "ラベル", code: 0, vertices: [], pushed: false };
		var v, dv, e, t, r, d, table, tr, td;
		var i;
		obj.box = document.createElement("div");
		obj.box.style.border = "dashed gray 2px";
		obj.box.style.margin = "2px";
		obj.box.style.padding = "2px";
		obj.box.appendChild(table = document.createElement("table"));
		table.appendChild(tr = document.createElement("tr"));
		tr.appendChild(td = document.createElement("td"));
		td.style.textAlign = "left";
		e = document.createElement("input");
		e.type = "checkbox";
		e.addEventListener("click", onchangeButtonState.bind(null, obj, e));
		td.appendChild(e);
		td.appendChild(document.createTextNode("ボタンを押す"));
		td.appendChild(document.createElement("br"));
		td.appendChild(document.createTextNode("ボタンの文字："));
		e = document.createElement("input");
		e.type = "text";
		e.value = obj.char;
		e.addEventListener("blur", onchangeChar.bind(null, obj, e));
		td.appendChild(e);
		td.appendChild(document.createTextNode("　キーコード："));
		e = document.createElement("input");
		e.type = "number";
		e.value = obj.code;
		e.addEventListener("blur", onchangeKeyCode.bind(null, obj, e));
		td.appendChild(e);
		obj.vbox = document.createElement("div");
		for(i = 0; i < 4; i++) // ４個の頂点
		{
			v = { x: def[i][0], y: def[i][1] };
			dv = document.createElement("div");
			dv.style.marginBottom = "1px";
			dv.appendChild(document.createTextNode("X座標："));
			e = document.createElement("input");
			e.type = "number";
			e.value = v.x;
			e.style.textAlign = "right";
			e.addEventListener("blur", onchangeCoord.bind(null, v, 0, e));
			v.ex = e;
			dv.appendChild(e);
			dv.appendChild(document.createTextNode("　Y座標："));
			e = document.createElement("input");
			e.type = "number";
			e.value = v.y;
			e.style.textAlign = "right";
			e.addEventListener("blur", onchangeCoord.bind(null, v, 1, e));
			v.ey = e;
			dv.appendChild(e);
			e = document.createElement("input");
			e.type = "button";
			e.value = "頂点を削除";
			e.addEventListener("click", removeVertex.bind(null, obj, v));
			dv.appendChild(e);
			v.box = dv;
			obj.vertices.push(v);
			obj.vbox.appendChild(dv);
		}
		td.appendChild(obj.vbox);
		e = document.createElement("input");
		e.type = "button";
		e.value = "頂点を追加";
		e.addEventListener("click", addVertex.bind(null, obj));
		td.appendChild(e);
		td.appendChild(document.createTextNode("　"));
		e = document.createElement("input");
		e.type = "button";
		e.value = "ボタン削除";
		e.addEventListener("click", removeButton.bind(null, obj));
		td.appendChild(e);
		tr.appendChild(td = document.createElement("td"));
		// 平行移動ボタンテーブル構築
		td.appendChild(t = document.createElement("table"));
		t.style.float = "right";
		t.appendChild(r = document.createElement("tr"));
		r.appendChild(d = document.createElement("td"));
		d.colSpan = 2;  d.rowSpan = 2;
		r.appendChild(d = document.createElement("td"));
		d.appendChild(e = document.createElement("input"));
		e.type = "button";
		e.value = "↑50";
		e.addEventListener("click", onclickTranslate.bind(null, obj, 0, -50));
		r.appendChild(d = document.createElement("td"));
		d.colSpan = 2;  d.rowSpan = 2;
		t.appendChild(r = document.createElement("tr"));
		r.appendChild(d = document.createElement("td"));
		d.appendChild(e = document.createElement("input"));
		e.type = "button";
		e.value = "↑10";
		e.addEventListener("click", onclickTranslate.bind(null, obj, 0, -10));
		t.appendChild(r = document.createElement("tr"));
		r.appendChild(d = document.createElement("td"));
		d.appendChild(e = document.createElement("input"));
		e.type = "button";
		e.value = "←50";
		e.addEventListener("click", onclickTranslate.bind(null, obj, -50, 0));
		r.appendChild(d = document.createElement("td"));
		d.appendChild(e = document.createElement("input"));
		e.type = "button";
		e.value = "←10";
		e.addEventListener("click", onclickTranslate.bind(null, obj, -10, 0));
		r.appendChild(d = document.createElement("td"));
		d.appendChild(document.createTextNode("平行移動"));
		r.appendChild(d = document.createElement("td"));
		d.appendChild(e = document.createElement("input"));
		e.type = "button";
		e.value = "10→";
		e.addEventListener("click", onclickTranslate.bind(null, obj, 10, 0));
		r.appendChild(d = document.createElement("td"));
		d.appendChild(e = document.createElement("input"));
		e.type = "button";
		e.value = "50→";
		e.addEventListener("click", onclickTranslate.bind(null, obj, 50, 0));
		t.appendChild(r = document.createElement("tr"));
		r.appendChild(d = document.createElement("td"));
		d.colSpan = 2;  d.rowSpan = 2;
		r.appendChild(d = document.createElement("td"));
		d.appendChild(e = document.createElement("input"));
		e.type = "button";
		e.value = "↓10";
		e.addEventListener("click", onclickTranslate.bind(null, obj, 0, 10));
		r.appendChild(d = document.createElement("td"));
		d.colSpan = 2;  d.rowSpan = 2;
		t.appendChild(r = document.createElement("tr"));
		r.appendChild(d = document.createElement("td"));
		d.appendChild(e = document.createElement("input"));
		e.type = "button";
		e.value = "↓50";
		e.addEventListener("click", onclickTranslate.bind(null, obj, 0, 50));
		// 平行移動ボタンテーブル構築 終わり
		setter.appendChild(obj.box);
		buttons.push(obj);
		update();
	}
	
	// ボタン削除ボタンクリックイベント
	function removeButton(b)
	{
		setter.removeChild(b.box);
		var m = buttons.length - 1;
		var i;
		for(i = 0; i < m; i++) // 探索する
		{
			if(buttons[i] === b) break;
		}
		for( ; i < m; i++) // 削除して詰める
		{
			buttons[i] = buttons[i + 1];
		}
		buttons.pop();
		update();
	}
	
	// 頂点追加ボタンクリックイベント（bindして使う）
	function addVertex(b)
	{
		var v, dv, e;
		v = {
			x: b.vertices.length > 0 ? b.vertices[b.vertices.length-1].x : 0,
			y: b.vertices.length > 0 ? b.vertices[b.vertices.length-1].y : 0
		};
		dv = document.createElement("div");
		dv.style.marginBottom = "1px";
		dv.appendChild(document.createTextNode("X座標："));
		e = document.createElement("input");
		e.type = "number";
		e.value = v.x;
		e.style.textAlign = "right";
		e.addEventListener("blur", onchangeCoord.bind(null, v, 0, e));
		dv.appendChild(e);
		dv.appendChild(document.createTextNode("　Y座標："));
		e = document.createElement("input");
		e.type = "number";
		e.value = v.y;
		e.style.textAlign = "right";
		e.addEventListener("blur", onchangeCoord.bind(null, v, 1, e));
		dv.appendChild(e);
		e = document.createElement("input");
		e.type = "button";
		e.value = "頂点を削除";
		e.addEventListener("click", removeVertex.bind(null, b, v));
		dv.appendChild(e);
		v.box = dv;
		b.vertices.push(v);
		b.vbox.appendChild(dv);
		update();
	}
	
	// 頂点削除ボタンクリックイベント（bindして使う）
	function removeVertex(b, v)
	{
		b.vbox.removeChild(v.box);
		var m = buttons.length - 1;
		var n = b.vertices.length - 1;
		var i, j;
		for(i = 0; i < m; i++)
		{
			if(buttons[i] === b) break;
		}
		for(j = 0; j < n; j++)
		{
			if(buttons[i].vertices[j] === v) break;
		}
		for( ; j < n; j++)
		{
			buttons[i].vertices[j] = buttons[i].vertices[j + 1];
		}
		buttons[i].vertices.pop();
		update();
	}
	
	// 座標入力監視イベント（bindして使う）
	function onchangeCoord(v, d, e)
	{
		var n = parseFloat(e.value);
		if(isNaN(n)) return;
		if(d == 0) v.x = n;
		else if(d == 1) v.y = n;
		update();
	}
	
	// ラベル入力監視イベント（bindして使う）
	function onchangeChar(b, e)
	{
		b.char = e.value;
		update();
	}
	
	// キーコード入力監視イベント（bindして使う）
	function onchangeKeyCode(b, e)
	{
		var n = parseInt(e.value);
		if(isNaN(n)) return;
		b.code = n;
		update();
	}
	
	// 押/離変更イベント（bindして使う）
	function onchangeButtonState(b, e)
	{
		b.pushed = e.checked;
		update();
	}
	
	// 平行移動イベント（bind）
	function onclickTranslate(b, x, y)
	{
		var i, l = b.vertices.length;
		for(i = 0; i < l; i++)
		{
			b.vertices[i].x += x;
			b.vertices[i].y += y;
			b.vertices[i].ex.value = b.vertices[i].x;
			b.vertices[i].ey.value = b.vertices[i].y;
		}
		update();
	}
	
	// カラー変更監視イベント（bindして使う）
	function onchangeColor(id, nid, e)
	{
		colorElements[id][nid] = e.target.value;
		updateColor();
	}
	
	function updateColor()
	{
		for(var i = 0; i < COLORS.length; i++)
		{
			colorElements[COLORS[i]].r.innerHTML = colorElements[COLORS[i]].red;
			colorElements[COLORS[i]].g.innerHTML = colorElements[COLORS[i]].green;
			colorElements[COLORS[i]].b.innerHTML = colorElements[COLORS[i]].blue;
			colorElements[COLORS[i]].a.innerHTML = colorElements[COLORS[i]].alpha;
			colorElements[COLORS[i]].disp.style.backgroundColor =
				"rgba(" + colorElements[COLORS[i]].red + ", " + colorElements[COLORS[i]].green + ", " +
				colorElements[COLORS[i]].blue + ", " + colorElements[COLORS[i]].alpha + ")";
			style[COLORS[i]] = colorElements[COLORS[i]].disp.style.backgroundColor;
		}
		update();
	}
	
	// ソースコード書き出しボタン
	function outputCode()
	{
		var i, j, m, n;
		var b, out, s_coords = "", s_chars = "", s_codes = "", s_style = "";
		for(i = 0, m = buttons.length; i < m; i++)
		{
			// 座標
			if(s_coords) s_coords += ",\n";
			s_coords += "\t\t[";
			b = "";
			for(j = 0, n = buttons[i].vertices.length; j < n; j++)
			{
				if(b) b += ", ";
				b += buttons[i].vertices[j].x;
				b += ", ";
				b += buttons[i].vertices[j].y;
			}
			s_coords += b;
			s_coords += "]";
			// ラベル
			if(s_chars) s_chars += ", ";
			s_chars += "\"" + buttons[i].char + "\"";
			// キーコード
			if(s_codes) s_codes += ", ";
			s_codes += buttons[i].code;
		}
		out = "CanvasMasao.Game.pad = {\n"+
			"\tcoords : [\n"+
			s_coords +
			"\n\t],\n\tchars : ["+
			s_chars +
			"],\n\tcodes : ["+
			s_codes +
			"],\n\tstyle : {\n"+
			"\t\trate : " + style.rate + "\",\n"+
			"\t\tback : \"" + style.back + "\",\n"+
			"\t\tbutton : \"" + style.button + "\",\n"+
			"\t\tactive : \"" + style.active + "\",\n"+
			"\t\ttext : \"" + style.text + "\",\n"+
			"\t\tborder : \"" + style.border + "\"\n"+
			"\t},\n"+
			"\tavoidAD : false\n};\n";
		output.value = out;
	}
	
	// プレビュー表示
	function update()
	{
		var i, j, v;
		ctx.clearRect(0, 0, 500, 200);
		ctx.fillStyle = style.back;
		ctx.fillRect(0, 0, 500, 200);
		ctx.fillStyle = style.button;
		for(i = 0; i < buttons.length; i++)
		{
			ctx.beginPath();
			v = buttons[i].vertices;
			if(v.length == 0) continue;
			ctx.moveTo(v[0].x, v[0].y);
			for(j = 1; j < v.length; j++)
			{
				ctx.lineTo(v[j].x, v[j].y);
			}
			ctx.closePath();
			ctx.fill();
		}
		ctx.fillStyle = style.active;
		for(i = 0; i < buttons.length; i++)
		{
			if(buttons[i].pushed)
			{
				ctx.beginPath();
				v = buttons[i].vertices;
				if(v.length == 0) continue;
				ctx.moveTo(v[0].x, v[0].y);
				for(j = 1; j < v.length; j++)
				{
					ctx.lineTo(v[j].x, v[j].y);
				}
				ctx.closePath();
				ctx.fill();
			}
		}
		ctx.beginPath();
		for(i = 0; i < buttons.length; i++)
		{
			v = buttons[i].vertices;
			if(v.length == 0) continue;
			ctx.moveTo(v[0].x, v[0].y);
			for(j = 1; j < v.length; j++)
			{
				ctx.lineTo(v[j].x, v[j].y);
			}
			ctx.closePath();
		}
		ctx.strokeStyle = style.border;
		ctx.stroke();
		ctx.fillStyle = style.text;
		for(i = 0; i < buttons.length; i++)
		{
			if(buttons[i].vertices.length > 0)
				v = measureCenterOfGravity(buttons[i].vertices);
			else
				v = [0, 0];
			ctx.fillText(buttons[i].char, v[0], v[1]);
		}
	}
	
	// 頂点の配列から重心を求める
	function measureCenterOfGravity(p)
	{
		/*
		(x1, y1) : 基本頂点の座標
		(x2, y2) : 古い頂点の座標
		(x3, y3) : 次の頂点の座標
		(gx, gy) : 現時点の重心の座標
		s : 現時点での多角形の面積（質量と比例する）
		(gx2, gy2) : 新しい三角形の重心
		s2 : 新しい三角形の面積（質量と比例する）
		*/
		var i, n = p.length;
		var x1, y1, x2, y2, x3, y3;
		var gx, gy, s, gx2, gy2, s2;
		x1 = p[0].x;  y1 = p[0].y;
		gx = x1;  gy = y1;
		if(n == 1)
		{
			return [gx, gy];
		}
		x2 = p[1].x;  y2 = p[1].y;
		gx = (gx+x2) / 2;  gy = (gy+y2) / 2;
		if(n == 2)
		{
			return [gx, gx];
		}
		x3 = p[2].x;  y3 = p[2].y;
		s = Math.abs((x2-x1)*(y3-y1) - (y2-y1)*(x3-x1)) / 2;
		gx = (x1+x2+x3) / 3;  gy = (y1+y2+y3) / 3;
		for(i = 3; i < n; i++) // ４頂点以上からこのループに入る
		{
			x2 = x3;  y2 = y3;
			x3 = p[i].x;  y3 = p[i].y;
			s2 = Math.abs((x2-x1)*(y3-y1) - (y2-y1)*(x3-x1)) / 2;
			gx2 = (x1+x2+x3) / 3;  gy2 = (y1+y2+y3) / 3;
			gx = (s*gx + s2*gx2) / (s+s2);
			gy = (s*gy + s2*gy2) / (s+s2);
			s = s2;
		}
		return [gx, gy];
	}
})();

