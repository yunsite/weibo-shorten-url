(function(){
	ShortenURL = function(c){
		if(!c.appKey) return false;
		
		this.longUrl = $('#longUrl').focus();
		this.shortUrl = $('#shortUrl');
		this.message = $('#message');
		this.convBtn = $('#btn');
		
		this.config = {
				appKey: c.appKey,
				msgTime: c.msgTime || 5000,
				fadeTime: c.fadeTime || 1800,
//				apiUrl: 'http://api.t.sina.com.cn/short_url/',  // 1.0接口，已废除
				apiUrl: 'https://api.weibo.com/2/short_url/',   //2.0接口
				dataType: 'json'
			};
			
		this.bind();
	}
	
	ShortenURL.prototype = {
		bind:function(){
				var _this = this;
				this.convBtn.click(function(){
					ans = _this.prep();
					if(ans) {
						_this.urls = ans.urls;
						_this.method = ans.method;
						_this.urls = _this.filter();
						if(!_this.urls.length) {
							_this.setMsg('请输入正确的网址！');
						} else {
							var url = _this.mkUrl();
							_this.setMsg('请求中...');
							$.ajax({
								url: url,
								dataType: _this.config.dataType,
								success: function(xhr){
										var u = _this.ergo(xhr.urls);
										_this.setUrlValue(u);
										_this.setMsg('转换成功！');
									},
								error: function(){
										_this.setMsg('请输入正确的网址!');
									}
							});
						}
					} else {
						_this.setMsg('请输入欲转换的网站！');
					}
					return false;
				});
			},
		prep:function(){
				var long = this.longUrl.val(),
						short = this.shortUrl.val(),
						url,method;
				if(long!='') {
					url = long.split('\n');
					method = 'shorten';
				} else if(short!='') {
					url = short.split('\n');
					method = 'expand';
				} else {
					return false;
				}
				return {
						urls: url,
						method: method
					}
			},
		filter:function(){
				var u=this.urls,_u=[],s;
				for(var i=0,n=u.length;i<n;i++){
					s=$.trim(u[i]);
					if(this.method=='shorten'){
						if(this.searchStr(['http://t.cn','http://weibo.com'],s) || !/^https?:\/\//i.test(s)) {
							continue;
						}
					} else {
						if(!this.searchStr('http://t.cn/',s)) {
							continue;
						}
					}
					_u.push(s);

				}
				return _u;
			},
		mkUrl:function(){
				var p = ['source='+this.config.appKey],
						key = this.method=='shorten'?'url_long':'url_short',
						u = this.urls;
				for(var i=0,n=u.length,n=n>20?20:n;i<n;i++){
					p.push(key+'='+encodeURIComponent(u[i]));
				}
				return this.config.apiUrl+this.method+'.'+this.config.dataType+'?'+p.join('&');	
			},
		setUrlValue:function(o){
				this.longUrl.val(o.urlLong.join('\n'));
				this.shortUrl.val(o.urlShort.join('\n'));
			},
		ergo:function(o){
				var l=[],s=[];
				for(var i=0,n=o.length;i<n;i++){
					l.push(o[i]['url_long']);
					s.push(o[i]['url_short']);
				}
				return {
						urlLong: l,
						urlShort: s
					};
			},
		setMsg:function(s){
				this.message.html(s);
				this.message.fadeIn();
				var _this = this;
				setTimeout(function(){
						_this.message.fadeOut(_this.config.fadeTime,function(){
							_this.message.empty();
						});
					},_this.config.msgTime);
			},
		searchStr:function(a,s){
				if(typeof a == "string"){
					if(s.indexOf(a)!=-1) {
						return true;
					}
				} else {
					for(var i=0;i<a.length;i++){
						if(s.indexOf(a[i])!=-1) {
							return true;
						}
					}
				}
				return false;
			}
	}
})();

var su = new ShortenURL({
		appKey: '2797567406',
		msgTime: 4000,
		fadeTime: 1800
});