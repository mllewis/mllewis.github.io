// ref_complex 35
// quintile novel object experiment

// ---------------- 1. HELPER ------------------
// random function
function random(a,b) {
    if (typeof b == "undefined") {
	a = a || 2;
	return Math.floor(Math.random()*a);
    } else {
	return Math.floor(Math.random()*(b-a+1)) + a;
    }
}

// shuffle function
function shuffle (a) { 
    var o = [];
    for ( var i=0; i < a.length; i++) { o[i] = a[i]; }
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), 
	 x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// show slide function
function showSlide(id) {
    $(".slide").hide(); //jquery - all elements with class of slide - hide
    $("#"+id).show(); //jquery - element with given id - show
}


// ---------------- 2. STIMULUS SETUP ------------------
// -- Objects--
// get conditions
var objConds = ["1-1", "1-2", "1-3", "1-4", "1-5", "2-2", "2-3", "2-4", "2-5", "3-3", "3-4", "3-5", "4-4", "4-5", "5-5"]
objConds = shuffle(objConds)

// quintiles based on complicated norms
var q_one =  [54, 57, 19, 28, 3,  59, 20, 46, 44, 13, 15, 29]
var q_two =  [22, 6,  17, 5,  34, 2,  55, 9,  4,  49, 37, 10]
var q_three = [12, 50, 7,  8,  48, 16, 1, 39, 40, 56, 24, 60]
var q_four = [26, 18, 11, 47, 42, 30, 23, 31, 51, 58, 41, 45]
var q_five = [32, 43, 33, 25, 21, 52, 14, 53, 27, 36, 38, 35]
    
q_one =  shuffle(q_one)
q_two =  shuffle(q_two)
q_three = shuffle(q_three)
q_four = shuffle(q_four)
q_five = shuffle(q_five)

var q_objs = new Array()
q_objs[0] = q_one
q_objs[1] = q_two
q_objs[2] = q_three
q_objs[3] = q_four
q_objs[4] = q_five

// -- Words--
var langConds = shuffle(["short", "short", "short", "short", "long", "long", "long", "long"])
var shortWords = ["bugorn", "ratum", "lopus", "wugnum", "torun", "gronan", "ralex", "vatrus"]
var longWords =  [ "tupabugorn", "gaburatum", "fepolopus", "pakuwugnum", "mipatorun", "kibagronan", "tiburalex", "binivatrus"]
var li = shuffle([0,1,2,3,4,5,6,7]) // necessary so you don't get both short and long version of word

// global variables to keep track of
var trial = 0
var count = 0
var word
var langCond
var objCond
var critical_simple
var critical_complex
var critical_objects
var critical_objects_s

// ---------------- 3. CONTROL FLOW ------------------
// PRE-LOAD IMAGES
//load all the images (because it's easier, though not optimal)
// preload images
var images = new Array() // By creating image object and setting source, images preload
for (i=0;i<61;i++) {
    images[i] = new Image()
    var num = i+1
    images[i].src = "images/obj_" + num + "_p2.jpg"   
}

showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {

    // MAIN TEST FUNCTION
   test: function() {
        if (window.self == window.top | turk.workerId.length > 0) {

            showSlide("testSlide");	
            
            // set up trial variables
            // word
            if (langConds[trial] == "short"){
                langCond = "short"
                word = shortWords[li[trial]]
            } else if (langConds[trial] == "long"){
                langCond = "long"
                word = longWords[li[trial]]
            }
            
            // objects
            objCond = objConds[trial]
            var objCond_i = objCond.split("-")
            critical_simple = q_objs[objCond_i[0]-1][count] 
            if (objCond_i[0] == objCond_i[1]){ 
                critical_complex  = q_objs[objCond_i[1]-1][count + 1]
                count = count + 2
            } else {
                critical_complex  = q_objs[objCond_i[1]-1][count]
                count = count + 1
            }
            critical_objects = [critical_simple, critical_complex]
            critical_objects_s = shuffle(critical_objects)
     
            // Instructions
            var label_html = '<p class="block-text"">  Imagine you just heard someone say <b>' + word + '</b>.'
            label_html += ' Which object do you think <b>' + word + '</b> refers to?'
            label_html += ' Choose an object by clicking the button below it.</p>'
            $("#labelInst").html(label_html) 
                
            // Create the object table
            var objects_html = '<table cellspacing="40" align="center"><tr>'
    
            for (i=0;i<2;i++){
                objects_html += '<td align="center"><img  src= "images/obj_' + critical_objects_s[i] + '_p2.jpg" " alt="fail" id="objImage"/><br></td>'
            }
            objects_html += '</tr><tr>'
            for (i=0;i<2;i++){
              objects_html += '<td align="center"><input type="radio" name ="thing" style="height:20px; width:20px" id="item_'+i+'"  /><br></td>'
            }
            objects_html += '</tr></table>'
            $("#objects").html(objects_html) 
            
             $("#counter").html(trial + 1 + ' / ' + 8) 
            
            // Response message
            var message_html = '<table cellspacing="2" align="center"><tr> <td id="messagesum"></td></tr></table>'
            $("#message").html(message_html) 
        }
    },
    
    // SELECT FUNCTION (called in test slide)
    select: function () {

		answer = 'NA'
        answer_value = 'NA'
		if (document.getElementById('item_0').checked || document.getElementById('item_1').checked){ //  validates bets
			var left
			var right
            var side
			
			if (document.getElementById('item_0').checked) {
				 left = 1
			} else if(document.getElementById('item_1').checked) {
				 right = 1
			}
			
            // case where not shuffled
			if (critical_objects[0] == critical_objects_s [0]){
				if (left == 1) {
					answer = critical_simple
                    answer_value = "simple"
                    side = 'left'
				} else if (right == 1) {
					answer = critical_complex
                    answer_value = "complex"
                    side = 'right'
				}
			
            // case where shuffled
			} else {
				if (left == 1) {
					answer = critical_complex
                    answer_value = "complex"
                    side = 'left'

				} else if (right == 1) {
					answer = critical_simple
                    answer_value = "simple"
                    side = 'right'
				}
			}

            // record trial and response data
			eval("experiment.response_" + trial +  "='" + answer + "'")
            eval("experiment.responseValue_" + trial +  "='" + answer_value + "'")
            eval("experiment.responseSide_" + trial + "='" + side + "'")
            eval("experiment.langCondition_" + trial + "='" + langCond+ "'")
            eval("experiment.objCondition_" + trial + "='"  + objCond + "'")
            eval("experiment.word_" + trial + "='"  + word + "'")
            eval("experiment.criticalSimple_" + trial + "='" + critical_simple + "'")
            eval("experiment.criticalComplicated_" + trial + "='"  + critical_complex + "'")

            trial = trial + 1

	        
            if (trial < 8) {
                experiment.test()
            } else { 
			     showSlide("check")
            }

		} else {
			$("#messagesum").html('<font color="red">Please select an object!</font>');
		}
    },


   // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS
    check_finished: function() {
		if (document.getElementById('about').value.length < 1) {
			$("#checkMessage").html('<font color="red">' + 
					   'Please make sure you have answered all the questions!</font>');
		} else {
			experiment.about = document.getElementById("about").value;
			experiment.comment = document.getElementById("comments").value;
			experiment.end();
		}
    },

    // END FUNCTION 
    end: function () {
        showSlide("finished");
        setTimeout(function () {
            turk.submit(experiment);
        }, 
        500); 
    }
}