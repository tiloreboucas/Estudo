var GroupedList = function(elemId, titleHeight){
	this.target = document.getElementById(elemId);
	this.group = this.target.querySelector('[data-groupname="despesas"]');

	window.onscroll = function(){
		GroupedList.group.querySelector(".gl_title").classList.remove("active");
		GroupedList.group.querySelector(".gl_title").classList.remove("lock");

		if(GroupedList.group.offsetTop - titleHeight < document.body.scrollTop)
			GroupedList.group.querySelector(".gl_title").classList.add("lock");
		else if((GroupedList.group.offsetTop - window.innerHeight) + titleHeight < document.body.scrollTop)
			GroupedList.group.querySelector(".gl_title").classList.add("active");
	};
};

window.onload = function(){ window.GroupedList = new GroupedList("lista", 52); };