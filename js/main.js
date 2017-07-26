if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      return this.substr(position || 0, searchString.length) === searchString;
  };
}

function initTable(data){
	var target = $("table.simulators tbody");
	var countSelector = $("table.simulators thead .counter");
	var sumSelector = $("table.simulators thead .prices");
	target.empty();
	var sum = 0;
	data.sort(function(a, b) {
		return a.name.localeCompare(b.name); //best way to compare two js string
	});
	$.each(data,function(index, el) {
		sum += parseInt(el["price"]);
		target.append("<tr>\
							<td>"+el["name"]+"</td>\
							<td>"+el["id"]+"</td>\
							<td>$"+parseInt(el["price"]).toLocaleString()+"</td>\
							<td><a href=javascript:removeSimulator('"+el["id"]+"') ><i class='fa fa-trash' aria-hidden='true'></i></a></td>\
						</tr>");
	});
	if(data.length == 0){
		target.append("<tr><td colspan='4' ><i>No simulator found.</i></td></tr>");
	}
	countSelector.html(data.length);
	sumSelector.html("$"+sum.toLocaleString());
}

function removeSimulator(id){
	Data = $.grep(Data, function(e){ 
		 return e.id != id; 
	});
	initTable(Data);
}

function filterSimulators(text){
	var newData = [];
	$.each(Data, function(index, el) {
		if( (el["name"].startsWith(text)) || (el["id"].startsWith(text))	 ){
			newData.push(Data[index]);
		}
	});
	initTable(newData);
}

function checkSimulatorId(id){
	var found = false;
	$.each(Data, function(index, el){
		if(el["id"] === id) 
			found = true;
	});

	return found;
}

function insertSimulator(values){
	var item = {};
	/*cross browser problem solving */
	item.name =  $.grep(values, function(e){ return e.name == "name"; })[0]["value"];
	item.id =  $.grep(values, function(e){ return e.name == "id"; })[0]["value"];
	item.price =  $.grep(values, function(e){ return e.name == "price"; })[0]["value"];

	Data.push(item);
	initTable(Data);
}

(function(){
	initTable(Data);
	$(".removeSimulator").click(function(event) {
		removeSimulator(Data, $(this).data("id"))
	});
	$("#filterSimulators").keyup(function(){
		if(!$(this).val()){
			initTable(Data);
		}else{
			filterSimulators($(this).val())
		}
	});
	 $('#newSimulatorForm').submit(function(event){
	 	var values = $(this).serializeArray();
	 	var warningForId = $("#addSimulatorWarningForID");
		event.preventDefault() ;
		if(checkSimulatorId($.grep(values, function(e){ return e.name == "id"; })[0]["value"]))
		{
			warningForId.show();
		}else{
		 	warningForId.hide();
			insertSimulator(values);
			$("#myModal").modal('hide');
			$("#myModal input[type='text']").val("");
		}
	});
})()