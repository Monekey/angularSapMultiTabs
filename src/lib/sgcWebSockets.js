/*
 * *************************************************************************
 * sgcWebSocket component
 * 
 * written by eSeGeCe copyright ?2013 Email : info@esegece.com Web :
 * http://www.esegece.com
 * *************************************************************************
 */
function GUID() {
	var a = function() {
		return Math.floor(Math.random() * 65536).toString(16)
	};
	return (a() + a() + a() + a() + a() + a() + a() + a())
}
function event(a) {
	this.name = a;
	this.eventAction = null;
	this.subscribe = function(b) {
		this.eventAction = b
	};
	this.fire = function(c, b) {
		if (this.eventAction != null) {
			this.eventAction(c, b)
		}
	}
}
function sgcWebSocket() {
	if (arguments.length == 0) {
		return
	}
	if ("WebSocket" in window) {
		if (typeof arguments[0] == "object") {
			this.host = arguments[0]["host"];
			this.subprotocol = arguments[0]["subprotocol"];
			this.user = arguments[0]["user"];
			this.password = arguments[0]["password"]
		} else {
			if (typeof arguments[0] == "string") {
				this.host = arguments[0];
				if (arguments.length == 2) {
					this.subprotocol = arguments[1]
				}
			} else {
				return
			}
		}
		var a = new event("onopen");
		var b = new event("onclose");
		var e = new event("onmessage");
		var c = new event("onstream");
		var d = new event("onerror");
		this.open = function() {
			if ((this.host !== "") && (this.user !== "")
					&& (this.user !== undefined)) {
				if (this.password == undefined) {
					this.password == ""
				}
				if ((this.subprotocol !== "")
						&& (this.subprotocol !== undefined)) {
					this.websocket = new WebSocket(this.host
									+ "/sgc/auth/basic/" + this.user + "/"
									+ this.password, this.subprotocol)
				} else {
					this.websocket = new WebSocket(this.host
							+ "/sgc/auth/basic/" + this.user + "/"
							+ this.password)
				}
			} else {
				if ((this.host !== "") && (this.subprotocol !== "")
						&& (this.subprotocol !== undefined)) {
					this.websocket = new WebSocket(this.host, this.subprotocol)
				} else {
					if (this.host !== "") {
						this.websocket = new WebSocket(this.host)
					}
				}
			}
			this.websocket.onopen = function() {
				a.fire({
							name : "onopen",
							message : ""
						})
			};
			this.websocket.onmessage = function(f) {
				if (f.data instanceof Blob) {
					c.fire({
								name : "onstream",
								stream : f.data
							})
				} else {
					e.fire({
								name : "onmessage",
								message : f.data
							})
				}
			};
			this.websocket.onclose = function(f) {
				b.fire({
							name : "onclose",
							message : "",
							code : f.code,
							reason : f.reason,
							clean : f.wasClean
						})
			};
			this.websocket.onerror = function(f) {
				d.fire({
							name : "onerror",
							message : f.data
						})
			}
		};
		if (this.websocket == undefined) {
			this.open()
		}
		this.send = function(f) {
			this.websocket.send(f)
		};
		this.close = function() {
			this.websocket.close()
		};
		this.state = function() {
			switch (this.websocket.readyState) {
				case this.websocket.CONNECTING :
					return "connecting";
					break;
				case this.websocket.OPEN :
					return "open";
					break;
				case this.websocket.CLOSING :
					return "closing";
					break;
				case this.websocket.CLOSED :
					return "closed";
					break;
				default :
					return "undefined";
					break
			}
		};
		this.on = function(f, g) {
			if (f == "open") {
				a.subscribe(g)
			} else {
				if (f == "close") {
					b.subscribe(g)
				} else {
					if (f == "message") {
						e.subscribe(g)
					} else {
						if (f == "stream") {
							c.subscribe(g)
						} else {
							if (f == "error") {
								d.subscribe(g)
							}
						}
					}
				}
			}
		}
	} else {
		alert("WebSockets not supported by your Browser.")
	}
};