// Ref_complex 37 -- SELF-PACED COMPLEXITY STUDY WITH GEONS
// Overview: 
//      (1) Helper
//      (2) Parameters and Stimulus Setup 
//      (3) Control Flow


// ---------------- 1. HELPER ------------------
// show slide function
function showSlide(id) {
    $(".slide").hide(); //jquery - all elements with class of slide - hide
    $("#"+id).show(); //jquery - element with given id - show
}

// shuffle function
function shuffle (a) { 
    var o = [];
    for ( var i=0; i < a.length; i++) { o[i] = a[i]; }
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), 
	 x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function test_yes () {      
    answer = '"y"'
    if (ratingImagesNum.indexOf(testPics[num_test]) > -1) {
        answer_eval = '"H"'
        num_correct = num_correct + 1
    } else {
        answer_eval = '"FA"'
    }

    experiment.test_check()
}

function test_no () {    
    answer= '"n"'
        if (ratingImagesNum.indexOf(testPics[num_test]) > -1) {
            answer_eval = '"M"'
        } else {
            answer_eval = '"CR"'
            num_correct = num_correct + 1
        }
    
    experiment.test_check()
}
    

// ---------------- 2. STIMULUS SETUP ------------------
// Stimulus variables
var trainPics = 22 //critical + baseline
// 32
var totalPics = 40
var num_test


var objs = []
for (i = 0; i< 5; i++){
    for (j = 0; j< 8; j++){
       num  = i + 1
        index = j + 1
        objs.push("obj" + num + "-" + index )
        objs.push("obj" + num + "-" + index )
    }
}
var objs_s = shuffle(objs)

// get set of random images for particular subject for training
var ratingImagesNum = objs_s.slice(0,20)

// add baseline pictures
ratingImagesNum.unshift("obj41", "obj42")

var testPicsA = [];
testPics = shuffle(objs)

// ---------------- 3. CONTROL FLOW ------------------
// preload images
var images = new Array() // By creating image object and setting source, images preload
for (i=0;i<40;i++) {
    images[i] = new Image()
    images[i].src = "images/" + objs[i] + ".png"
}
images[i] = new Image()
images[i].src = "images/obj41.png"
images[i] = new Image()
images[i].src = "images/obj42.png"

// initialize experimental variables
var num_ratings = 0
var num_test = 0
var answer
var answer_eval
var num_correct = 0

// START experiment
showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
	
    // TRAINING PICTURES
    training: function() {	
    	if (num_ratings == trainPics) {
            showSlide("test_inst")        
        } else {
            // Allow experiment to start if it's a turk worker OR if it's a test run
            if (window.self == window.top | turk.workerId.length > 0) {
                rating_image_html = '<img src="images/' + ratingImagesNum[num_ratings] + '.png" alt="' + ratingImagesNum[num_ratings] + '.png" id="objImage"/>';
                $("#ratingimage").html(rating_image_html) 
                                
                $("#counter").html(num_ratings+1 + ' / ' + trainPics) 
                
                experiment.getRT()
                
                if (num_ratings == 0 ) {
                  showSlide("train");
                }     
            }
        }
    },
    
    getRT: function(){
        var startTime = (new Date()).getTime()
        $(document).keydown(function(event) {
            var keyCode = event.which
            if (keyCode == 32) {
                $(document).unbind("keydown")
                var endTime = (new Date()).getTime()
                var rt = endTime-startTime
    
                eval('experiment.train_image_' + num_ratings + "=" +  "'" + ratingImagesNum[num_ratings] +  "'")
                eval('experiment.train_rt_' + num_ratings + "=" + rt)
                num_ratings = num_ratings + 1
                experiment.training()
            }
        })
    },
    
    //TESTING PICTURES
    testing: function(){

        var directions_html = '<p class="block-text""> Have you seen this object before?'
        $("#directions").html(directions_html) 

        // build objects table and radio buttons
       // rating_image_html = '<img src="refComplex processed objects2/obj_' + testPics[num_test] +'_p2.jpg" alt="' +  testPics[num_test] + '" id="objImage2"/>';
       rating_image_html = '<img src="images/' + testPics[num_test] + '.png" alt="' + testPics[num_test] + '.png" id="objImage"/>';
        $("#testingimage").html(rating_image_html) 
        
        $("#counter_test").html(num_test+1 + ' / ' + totalPics) 
        
        showSlide("test")

    },
    
    test_check: function(){
            
        // save data
        eval('experiment.test_image_' + num_test + ' = ' + "'" + testPics[num_test] + "'" )
        eval('experiment.test_answer_' + num_test +' = ' + answer)     
        eval('experiment.test_answerEval_' + num_test + ' = ' + answer_eval)

        // clear the image and buttons
        $("#testingimages").html("");
        $("#message").html("");
        $("#counter_test").html("");
        $("#test").hide();
        
        num_test = num_test + 1
        
        if (num_test == totalPics){
            showSlide("check");	
            $("#score").html('<font size="6"><i> You got ' + num_correct + ' out of ' + totalPics + ' correct.</i> </font>');
        } else {
            experiment.testing()
        }
	},
    
    // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS
    check_finished: function() {
		if (document.getElementById('about').value.length < 1) {
			$("#checkMessage").html('<font color="red">Please make sure you have answered all the questions!</font>');

		} else {
            experiment.correct = num_correct            
			experiment.about = document.getElementById("about").value;
			experiment.comment = document.getElementById("comments").value;
			experiment.train = ratingImagesNum
			experiment.end();
		}
    },

    // END FUNCTION 
    end: function () {
        showSlide("finished");
        setTimeout(function () {
            turk.submit(experiment);
        }, 500) 
    }
}