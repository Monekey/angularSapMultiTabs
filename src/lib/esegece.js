/*
 * *************************************************************************
 * sgcWebSocket component
 * 
 * written by eSeGeCe copyright ?2013 Email : info@esegece.com Web :
 * http://www.esegece.com
 * *************************************************************************
 */

function sgcws() {
	if (arguments.length == 0) {
		return
	}
	if (arguments.length == 1) {
		if (typeof arguments[0] == "object") {
			arguments[0]["subprotocol"] = "esegece.com";
			sgcWebSocket.call(this, arguments)
		} else {
			if (typeof arguments[0] == "string") {
				arguments[1] = "esegece.com";
				sgcWebSocket.call(this, arguments[0], arguments[1])
			}
		}
	} else {
		if (arguments.length == 2) {
			if (typeof arguments[0] == "object") {
				arguments[0]["subprotocol"] = arguments[1] + ".esegece.com";
				sgcWebSocket.call(this, arguments)
			} else {
				if (typeof arguments[0] == "string") {
					arguments[1] = arguments[1] + ".esegece.com";
					sgcWebSocket.call(this, arguments[0], arguments[1])
				}
			}
		}
	}
	var g = this.send;
	this.send = function(l, n, k, m) {
		if (arguments.length == 1) {
			arguments[0] = '{"jsonrpc":"2.0", "method":"sgc@message", "params":{"message":"'
					+ l + '"}, "id":"' + GUID() + '"}'
		} else {
			if (arguments.length == 2) {
				arguments[0] = '{"jsonrpc":"2.0", "method":"' + n
						+ '", "params":{"message":"' + l + '"}, "id":"'
						+ GUID() + '"}'
			} else {
				if ((m !== "") && (m !== undefined)) {
					arguments[0] = '{"jsonrpc":"2.0", "method":"' + n
							+ '", "params":{"channel":"' + k + '", "message":"'
							+ l + '"}, "id":"' + m + '"}'
				} else {
					arguments[0] = '{"jsonrpc":"2.0", "method":"' + n
							+ '", "params":{"channel":"' + k + '", "message":"'
							+ l + '"}}'
				}
			}
		}
		g.apply(this, arguments)
	};
	this.broadcast = function() {
		if (arguments.length == 1) {
			this.send(arguments[0], "sgc@broadcast", "")
		} else {
			if (arguments.length == 2) {
				this.send(arguments[0], "sgc@broadcast", arguments[1])
			}
		}
	};
	this.publish = function() {
		this.send(arguments[0], "sgc@publish", arguments[1])
	};
	this.subscribe = function(k) {
		this.send("", "sgc@subscribe", k, GUID())
	};
	this.unsubscribe = function(k) {
		this.send("", "sgc@unsubscribe", k, GUID())
	};
	this.rpc = function(m, l, k) {
		arguments[0] = '{"jsonrpc":"2.0", "method":"' + l + '", "params":' + k
				+ ', "id":"' + m + '"}';
		g.apply(this, arguments)
	};
	this.notify = function(l, k) {
		arguments[0] = '{"jsonrpc":"2.0", "method":"' + l + '", "params":' + k
				+ '"}';
		g.apply(this, arguments)
	};
	this.request = function(k) {
		arguments[0] = '{"jsonrpc":"2.0", "method":"' + k + '"}';
		g.apply(this, arguments)
	};
	this.getsession = function() {
		this.request("sgc@session")
	};
	this.starttransaction = function(k) {
		if (k == undefined) {
			k = ""
		}
		this.send("", "sgc@transaction", k, "")
	};
	this.commit = function(k) {
		if (k == undefined) {
			k = ""
		}
		this.send("", "sgc@commit", k, "")
	};
	this.rollback = function(k) {
		if (k == undefined) {
			k = ""
		}
		this.send("", "sgc@rollback", k, "")
	};
	var c = new event("onsgcmessage");
	var h = new event("onsgcevent");
	var d = new event("onsgcsubscribe");
	var f = new event("onsgcunsubscribe");
	var j = new event("onsgcrpcresult");
	var b = new event("onsgcrpcerror");
	var i = new event("onsgcacknowledgment");
	var a = new event("onsgcsession");
	this.on("message", function(l) {
				var k = l.message;
				obj = JSON.parse(k);
				if (obj.result !== undefined) {
					if (obj.result.method == "sgc@subscribe") {
						d.fire({
									name : "onsgcsubscribe",
									channel : obj.result.channel
								})
					} else {
						if (obj.result.method == "sgc@unsubscribe") {
							f.fire({
										name : "onsgcunsubscribe",
										channel : obj.result.channel
									})
						} else {
							if (obj.result.method == "sgc@event") {
								h.fire({
											name : "onsgcevent",
											channel : obj.result.channel,
											message : obj.result.message
										})
							} else {
								if (obj.result.method == "sgc@session") {
									a.fire({
												name : "onsgcsession",
												guid : obj.result.message
											})
								} else {
									if (obj.result.method == "sgc@message") {
										c.fire({
													name : "onsgcmessage",
													message : obj.result.message
												})
									} else {
										if (obj.result.method == "sgc@acknowledgment") {
											i.fire({
														name : "onsgcacknowledgment",
														id : obj.id
													})
										} else {
											j.fire({
														name : "onsgcrpcresult",
														result : obj.result,
														id : obj.id
													})
										}
									}
								}
							}
						}
					}
				} else {
					if (obj.error !== undefined) {
						b.fire({
									name : "onsgcrpcerror",
									code : obj.error.code,
									message : obj.error.message,
									data : obj.error.data
								})
					}
				}
			});
	var e = this.on;
	this.on = function(k, l) {
		if (k == "sgcmessage") {
			c.subscribe(l)
		} else {
			if (k == "sgcevent") {
				h.subscribe(l)
			} else {
				if (k == "sgcsession") {
					a.subscribe(l)
				} else {
					if (k == "sgcsubscribe") {
						d.subscribe(l)
					} else {
						if (k == "sgcunsubscribe") {
							f.subscribe(l)
						} else {
							if (k == "sgcacknowledgment") {
								i.subscribe(l)
							} else {
								if (k == "sgcrpcresult") {
									j.subscribe(l)
								} else {
									if (k == "sgcrpcerror") {
										b.subscribe(l)
									} else {
										e.apply(this, arguments)
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
sgcws.prototype = new sgcWebSocket();
sgcws.prototype.constructor = sgcws;