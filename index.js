
import data from './static/data.json' assert {type: 'json'};

let candidatesData = JSON.parse(localStorage.getItem("candidatesData"));

let list = document.getElementById("candidates-list");

let template = Handlebars.compile(document.getElementById("candidates-list-template").innerHTML);


if (candidatesData == null) {
    localStorage.setItem("candidatesData", JSON.stringify(data))
    candidatesData = data;
    list.innerHTML = template(data);
}
else {
    list.innerHTML = template(candidatesData)
}

$(document).ready(function () {

    let requestedPerson = "";
    let skillCount = 0;
    let achievementCount = 0;
    let experienceCount = 0;
    let educationCount = 0;
    let certificateCount = 0;
    let countVals = {
        "experience": 0,
        "achievement": 0,
        "education": 0,
        "certificate": 0,
    }
    let candyFormTempCompiled = Handlebars.compile($("#candy-form-template").html());

    let formSubmitBtn = $("#newCandySub");
    formSubmitBtn.before(candyFormTempCompiled({"capitalized": "Experiences", lowercase: "experience"}));
    formSubmitBtn.before(candyFormTempCompiled({"capitalized": "Achievements", lowercase: "achievement"}));
    formSubmitBtn.before(candyFormTempCompiled({"capitalized": "Education", lowercase: "education"}));
    formSubmitBtn.before(candyFormTempCompiled({"capitalized": "Certificates", lowercase: "certificate"}));

    // Click Event management
    $("#resumeBtn").on("click", () => {
        $("input[name='templateBtns']").prop("checked", false);
        $('.resume-template').css("display","none");
        $('#getPDF').css("display","none");
        let requestedId = $("input[type='radio'][name='chosen-one']:checked").val();
        if (requestedId==undefined){
            $("#noCandyChosen").css("display", "block");
        }
        else{
            $("#noCandyChosen").css("display", "none");

            for (let i = 0; i<candidatesData.candidates.length; i++){
                if (candidatesData.candidates[i].id==requestedId){
                    requestedPerson = candidatesData.candidates[i];
                    break;
                }
            }
            // let detailsTemplate = Handlebars.compile($("#requested-content").html());
            // $('#details').html(detailsTemplate(requestedPerson));
            $('#download-resume').removeClass("unactive").addClass('active').siblings().removeClass('active').addClass("unactive");
        };
    })

    $("#candidateBtn").on("click", () => {
        $('#candidate-form').removeClass("unactive").addClass('active').siblings().removeClass('active').addClass("unactive");
        $('.resume-template').css("display","none");
        $('#getPDF').css("display","none");
    })

    $("#newSkill").on("click", ()=>{
        $("#skills>div").append(`<input type="text" id="skill${++skillCount}" class="multipleInput skills-input" name="skill${skillCount}">`)
        $(`#skill${skillCount}`).focus();
        if (skillCount==7){
            $("#newSkill").remove();
        }
        return false;
    })

    $(".addBtn").on("click", function(){
        let what = this.id.slice(4);
        $(this).before(`<input type="text" id=${what}${++(countVals[what])}" class="multipleInput" name=${what}${countVals[what]}">`);
        $(this).prev().focus();
        if (countVals[what]==4){
            $(this).remove();
        }
        return false;
    })

    $("#candidate-form form").on("submit", () => {
        let formData = Array.from(document.querySelectorAll("#candidate-form input")).reduce((acc, input)=> ({...acc, [input.id]:input.value}), {});
        
        // Grouping data of skills, experience, achivements and education
        let skillArr = [];
        let experiencesArr = [];
        let achievementsArr = [];
        let educationArr = [];
        let certificateArr = [];
        for (let record in formData){
            if (record.slice(0,5)=='skill'){
                skillArr.push(formData[record]);
                delete formData[record];
            }
            else if (record.slice(0,6)=='experi'){
                experiencesArr.push(formData[record]);
                delete formData[record];
            }
            else if (record.slice(0,6)=='achiev'){
                achievementsArr.push(formData[record]);
                delete formData[record];
            }
            else if (record.slice(0,6)=='educat'){
                educationArr.push(formData[record]);
                delete formData[record];
            }
            else if (record.slice(0,6)=='certif'){
                certificateArr.push(formData[record]);
                delete formData[record];
            };
        }
        formData['skills'] = skillArr;
        formData['experiences'] = experiencesArr;
        formData['achievements'] = achievementsArr;
        formData['certificates'] = certificateArr;
        formData['education'] = educationArr;

        console.log(formData);

        candidatesData.candidates.push({"id": candidatesData.candidates.length+1, ...formData});
        localStorage.setItem("candidatesData", JSON.stringify(candidatesData));

    })


    $("input[name='templateBtns']").on("click", function(){
        $('.resume-template').css("display","flex");
        let chosenTemplale = this.value;
        let compiledChosenTemplale = Handlebars.compile($("#"+chosenTemplale+"template").html());
        $('#finalResume').html(compiledChosenTemplale(requestedPerson))
        $('#getPDF').css('display','block');

    })

    $("#getPDF").on('click', function getPDF() {
        $('#top-section').css("display", "none");
        $('#download-resume').css("display", "none");
        $('#getPDF').css("display", "none");
        $('.logo').css("display", "none");
        window.print();
        $('#top-section').css("display", "flex");
        $('#download-resume').css("display", "block");
        $('#getPDF').css("display", "block");        
        $('.logo').css("display", "block");

    })

});
