// Ref_complex 30 -- SELF-PACED COMPLEXITY STUDY
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
var trainPics = 32 //critical + baseline
// 32
var totalPics = 60
var num_test

// get set of random images for particular subject for training
var ratingImagesNum = []
while(ratingImagesNum.length < (trainPics - 2)){
  var randomnumber=Math.ceil(Math.random()*totalPics)
  var found=false;
  for(var i=0;i<ratingImagesNum.length;i++){
    if(ratingImagesNum[i]==randomnumber){found=true;break}
  }
  if(!found)ratingImagesNum[ratingImagesNum.length]=randomnumber;
}

// add baseline pictures
ratingImagesNum.unshift(61, 62)

var testPicsA = [];
for (var i = 1; i != (totalPics + 1); ++i) testPicsA.push(i)
testPics = shuffle(testPicsA)

// ---------------- 3. CONTROL FLOW ------------------
// preload images
var images = new Array() // By creating image object and setting source, images preload
for (i=0;i<totalPics+3;i++) {
    images[i] = new Image()
    var num = i+1
    images[i].src = "refComplex processed objects2/obj_" + num + "_p2.jpg"   
}

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
                rating_image_html = '<img src="refComplex processed objects2/obj_' + ratingImagesNum[num_ratings] 
                rating_image_html += '_p2.jpg" alt="' + ratingImagesNum[num_ratings] + '" id="objImage"/>';
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
                
                eval('experiment.train_image_' + num_ratings + "=" + ratingImagesNum[num_ratings])
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
        rating_image_html = '<img src="refComplex processed objects2/obj_' + testPics[num_test] +'_p2.jpg" alt="' +  testPics[num_test] + '" id="objImage2"/>';
        $("#testingimage").html(rating_image_html) 
        
        $("#counter_test").html(num_test+1 + ' / ' + totalPics) 
        
        showSlide("test")

    },
    
    test_check: function(){
            
        // save data
        eval('experiment.test_image_' + num_test + ' = ' + testPics[num_test])
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