var IndexedList = function(elemId){
	this.target = document.getElementById(elemId);
	this.groups = this.target.querySelectorAll(".il_group");
	this.titles = this.target.querySelectorAll(".il_title");

	this.searchActiveItem = function(){
		for(var i = 0; i < IndexedList.groups.length; i++) {
			if((IndexedList.groups[i].offsetTop < document.body.scrollTop) && (IndexedList.groups[i].offsetTop + IndexedList.groups[i].offsetHeight > document.body.scrollTop))
				IndexedList.titles[i].classList.add("active");
			else 
				IndexedList.titles[i].classList.remove("active");
		}
	};

	window.onscroll = function(){ IndexedList.searchActiveItem(); };
};

window.onload = function(){
	window.IndexedList = new IndexedList("lista");
	console.log(IndexedList);
};
