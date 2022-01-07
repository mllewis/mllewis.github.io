// Ref_complex #26
// Overview: (i) Helper (ii) Parameters (iii) Control Flow

// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// ---------------- PARAMETERS ------------------
// FIRST SAMPLE
//var crit_words = [ "comforter", "banner", "book", "immortality", "poison", "obsession", "theoretical", "style", "therefore", "concept", "procession", "stupid", "sale", "lieutenant", "lotion", "rubber", "preference", "diversity", "risk", "destruction", "criterion", "swarm", "soccer", "cast", "sunshine", "knee", "nine", "come", "ornate", "wedding", "unjust", "help", "reality", "tank", "moral", "impossible", "poet", "know", "voluntary", "paradox", "nerve", "elopement", "social", "throw", "tunnel", "squeak", "value", "beer", "unknown", "gender", "safety", "table", "shout", "quickly", "collection", "save", "biology", "jacket", "hobby", "normal", "eye", "phrase", "now", "code", "hot", "beginning", "board", "carrot", "coil", "portrait", "soon", "greenness", "herdsman", "about", "guilt", "known", "crab", "investigation", "fever", "suggestion", "cool", "mouth", "industry", "dumb", "hamlet", "optimism", "half", "diet", "educator", "gasp", "requirement", "alphabet", "waste", "round", "frail", "racquet", "ache", "beehive", "letter", "hog"] //these were obtained by getting all the MRC words with rankings for all three proxies, and then randomly sampling 100

//second sample
var crit_words = [ "as", "of", "apt", "at", "was", "are", "because", "so", "then", "however", "how", "also", "nor", "than", "thus", "while", "incongruity", "too", "a", "by", "to", "its", "from", "were", "if", "and", "eternal", "only", "aspect", "when", "been", "there", "mediocrity", "an", "which", "although", "oh", "very", "nowhere", "humble", "unhappiness", "who", "be", "but", "meant", "mood", "distinct", "for", "since", "affirmation", "importance", "reckoning", "much", "after", "obedience", "uncertainty", "these", "enlightenment", "chance", "their", "prevalent", "those", "motive", "unbelief", "indifferent", "am", "concert", "sin", "enthusiasm", "all", "reluctant", "belief", "wise", "bother", "came", "not", "might", "extreme", "upset", "drab", "devil", "authentic", "supposition", "being", "off", "luck", "least", "many", "fantasy", "capacity", "spirit", "what", "stifle", "literal", "effort", "eerie", "hasty", "savant", "rule", "pity", "responsive", "smart", "following", "wrath", "make", "first", "welfare", "into", "arrangement", "fast", "approach", "both", "need", "generation", "most", "encounter", "suffix", "used", "idle", "whole", "composure", "magnitude", "fine", "transfer", "observation", "beauty", "keen", "tally", "dear", "mischief", "claim", "surprise", "faster", "think", "disobedient", "earn", "punish", "part", "bland", "finish", "goof", "care", "thwart", "dictation", "public", "surrender", "turn", "centennial", "fashion", "harsh", "expulsion", "ripe", "appearance", "oblique", "aid", "stare", "distortion", "curse", "array", "thaw", "selling", "audit", "can", "trace", "led", "wild", "two", "limelight", "causality", "kill", "view", "heir", "one", "full", "ugly", "bit", "dozen", "sheer", "lean", "age", "leap", "deface", "flee", "up", "side", "course", "raid", "express", "comfort", "grammar", "stride", "liar", "sucker", "swell", "shiny", "sick", "entree", "siege", "nation", "sampler", "clang", "her", "hard", "lure", "glitter", "kink", "permission", "summer", "wail", "live", "jingle", "form", "hero", "bang", "place", "evening", "chuckle", "walk", "state", "stranger", "embrace", "mine", "dreamer", "wash", "placard", "rough", "murder", "brawl", "welt", "fortification", "citizen", "literature", "wrap", "scent", "faint", "duel", "weight", "cowl", "well", "venom", "waltz", "madman", "scale", "gymnastics", "bright", "prop", "gray", "pest", "flash", "sanctuary", "eat", "commode", "oxygen", "dip", "ally", "convention", "loop", "hail", "sore", "foreigner", "sound", "beam", "chief", "walking", "traveller", "team", "pore", "path", "drill", "court", "mural", "arch", "slope", "derelict", "bite", "spray", "keel", "peso", "rash", "brake", "ginger", "crook", "hostage", "parcel", "lubricant", "sunset", "bump", "bloom", "rung", "projectile", "peg", "match", "stump", "back", "tweezer", "creature", "attendant", "material", "cavern", "clover", "slime", "prisoner", "oatmeal", "suds", "rattle", "vein", "store", "light", "dinner", "loot", "kernel", "racket", "hall", "boar", "scooter", "bolt", "lady", "gavel", "kiss", "battle", "dagger", "python", "fang", "bowl", "page", "earth", "cellar", "slush", "sapphire", "canary", "upholstery", "submarine", "sulphur", "drain", "iron", "chlorine", "tablespoon", "telescope", "lip", "lake", "nurse", "child", "shell", "head", "coat", "hose", "trunk", "fur", "weed", "rum", "cattle", "belt", "bucket", "cotton", "horse", "yacht", "house", "fudge", "shawl", "barn", "lamp", "pigeon", "snow", "broom", "cider", "leg", "hen", "belly", "wren", "hay", "mallet", "mouse", "bell", "cheese", "birch", "cauliflower", "gin", "bed", "manure", "pear", "bandage", "beef", "boat", "robin", "cookie", "eel", "cucumber", "ape", "tangerine", "skunk", "rocket", "pineapple", "cement", "steak", "vinegar", "pliers", "beet", "grasshopper", "milk", "tomato"]

crit_words = shuffle(crit_words)
crit_words = crit_words.slice(0,30)
crit_words.splice(15,0,'4+3 = ?')
crit_words.unshift("motherboard")
crit_words.unshift("ball")

var current_trial = 1
 
// ---------------- CONTROL FLOW ------------------
showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
  
    end: function () {
        showSlide("finished");
        setTimeout(function () {

            turk.submit(experiment);
        }, 1500); //function() - anonymous function
    },

  // MAIN DISPLAY FUNCTION
    inst: function(){
        showSlide("complex_instructions")
    },
  	next: function() {
  		
    	showSlide("stage");
        
        if (current_trial == 18) {
            var question_html = "<p class='block-text'> What is the answer to this problem?  </p> <br>"
            var scale_html = " <span class='answers'> one <input type='radio' name='q' value='1' />	<input type='radio' name='q' value='2'/> <input type='radio' name='q'  value='3' />	<input type='radio' name='q'  value='4' />	<input type='radio' name='q'  value='5' />	 <input type='radio' name='q'  value='6' />	<input type='radio' name='q'  value='7' />	seven </span>"
        } else {    
	       var question_html = "<p class='block-text'> How complex is the meaning of this word?  </p> <br>"
           var scale_html = "<span class='answers'>  simple  <input type='radio' name='q' value='1' />	<input type='radio' name='q' value='2'/> <input type='radio' name='q'  value='3' />	<input type='radio' name='q'  value='4' />	<input type='radio' name='q'  value='5' />	 <input type='radio' name='q'  value='6' />	 <input type='radio' name='q'  value='7' />	complex </span>"
        }
        $("#question").html(question_html) 
        $("#scale").html(scale_html) 

        var word_html = '<p style="font-size:30px;text-align:center; font-weight:bold" >' + crit_words[current_trial - 1] + '</p>'
	    $("#word").html(word_html) 
        
        $("#counter").html(current_trial + ' / ' + 33) 
       
	    var message_html = '<table cellspacing="2" align="center"><tr> <td id="messagesum"></td></tr></table>'
	    $("#message").html(message_html) 
  },

  // SELECT FUNCTION (called in stage slide)
    select: function () {
		if ($('input[name="q"]:checked').val()){ //  is a radio button checked?
                // save data
                eval('experiment.word_'+ current_trial + '="' + crit_words[current_trial -1] + '"' )
                eval('experiment.value_'+ current_trial + '=' + $('input[name="q"]:checked').val())

                if (current_trial < 33){
                    current_trial = current_trial + 1

                    $("#word").html("");
                    $("#stage").hide();

                    $('input[name=q]').attr('checked',false) //clear radio buttons
                    
                    experiment.next()
                } else {
                    showSlide("check")
                }

		} else {
			$("#messagesum").html('<font color="red">Please answer the question. </font>');
		}
    },
    
    // called in check slide
    check_finished: function () {
    	if (document.getElementById('about').value.length < 1) {
			$("#checkMessage").html('<font color="red">Please make sure you have answered all the questions!</font>');
		} else {
			experiment.about = document.getElementById("about").value;
			experiment.comment = document.getElementById("comments").value;
	
			experiment.end();
		}	
    }
}