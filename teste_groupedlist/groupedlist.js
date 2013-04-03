var GroupedList = function(elemId){
	this.target = document.getElementById(elemId);
	this.group = this.target.querySelector('[data-groupname="despesas"]');
	this.title = this.target.querySelector('.gl_title');
	this.header = document.querySelector('.cf_header');
	this.headerStyle = window.getComputedStyle(this.header);
	
	this.header.mt = parseInt(this.headerStyle.getPropertyValue('margin-top')) * -1;

	window.onscroll = function(){
		for (var i = 0; i < document.querySelectorAll('.gl_title').length; i++) {
			document.querySelectorAll('.gl_title')[i].classList.remove('active');
			document.querySelectorAll('.gl_title')[i].classList.remove('lock');
		};

		if(GroupedList.group.offsetTop - GroupedList.title.offsetHeight < (document.body.scrollTop + GroupedList.title.offsetTop) - GroupedList.header.mt) {
			for (var i = 0; i < document.querySelectorAll('.gl_title').length; i++) { document.querySelectorAll('.gl_title')[i].classList.add('lock'); };
		} else if((GroupedList.group.offsetTop - window.innerHeight) + GroupedList.title.offsetHeight < (document.body.scrollTop - GroupedList.header.mt) - 70) {
			for (var i = 0; i < document.querySelectorAll('.gl_title').length; i++) { document.querySelectorAll('.gl_title')[i].classList.add('active'); };
		}
	};
};

window.onload = function(){ window.GroupedList = new GroupedList('lista'); };