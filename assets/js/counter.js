// 总数
var jeffjade_firebase = new Firebase("https://nicejade.firebaseIO.com");
jeffjade_firebase.child("sum").on("value", function(data) {
  var current_counter = data.val();
  if($("#counter").length > 0  && current_counter > 1){
     $("#counter").html("&nbsp;本站总热度&nbsp;<font style='color:purple'>"+ current_counter +"</font>&nbsp;(℃)");
  };
});

jeffjade_firebase.child("sum").transaction(function (current_counter) {
  return (current_counter || 0) + 1;
});

// 明细
var current_url = window.location.pathname.replace(new RegExp('\\/|\\.', 'g'),"_");

jeffjade_firebase.child("detail/"+current_url).transaction(function (current_counter) {
  return (current_counter || 0) + 1;
});

// 获取明细，并将明细也展示在页面上
jeffjade_firebase.child("detail/"+current_url).on("value", function(data){
	var detail_counter = data.val();
	if($("#detail_counter").length > 0 && detail_counter > 1){
		$("#detail_counter").html(
			"&nbsp;本页总热度&nbsp;<font style='color:purple'>"+ detail_counter +"</font>&nbsp;(℃)"
		);
	}
});

var n = new Date();
var time = n.getFullYear()+'-'+(n.getMonth()+1)+'-'+n.getDate()+'_'+n.getHours()+':'+n.getMinutes()+':'+n.getSeconds()+' '+n.getMilliseconds();
jeffjade_firebase.child("lastupdatetime").set({ timer: time, url: current_url });
