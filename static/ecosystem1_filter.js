function filter_wrapper(filter_obj,meta_switch){
  var age_from_val = +document.getElementById("FROM").value;
  var age_to_val = +document.getElementById("TO").value;
  var sex_val = document.getElementById("btn_sex").value;
  var nationality_val = document.getElementById("btn_nationality").value;
  var bmi_val = document.getElementById("btn_bmi").value;

  var age_filter = filter_obj.generic_filter("Age",[age_from_val,age_to_val])
  var sex_filter = filter_obj.generic_filter("Sex",sex_val)
  var nationality_filter = filter_obj.generic_filter("Nationality",nationality_val)
  var bmi_filter = filter_obj.generic_filter("BMI_group",bmi_val)
  console.log(age_filter)
  console.log(sex_filter)
  console.log(nationality_filter)
  console.log(bmi_filter)
  test_filter = filter_obj.intersection([age_filter,sex_filter,nationality_filter,bmi_filter]) //age_filter,

  switch (meta_switch) {
    case "Data":
      var filtered_data = filter_obj.filter_data(test_filter)
      return filtered_data
      break;
    case "Meta":
      var filtered_data = filter_obj.filter_metadata(test_filter)
      return filtered_data
      break;
    default:
      var filtered_data = filter_obj.filter_data(test_filter)
      return filtered_data

  }

}

function filter_object(data){
  var returnDictionary = {};
  var metadata = {
    SampleID : [data["metadataOverview"].length],
    Age : [data["metadataOverview"].length],
    Sex	: [data["metadataOverview"].length],
    Nationality	: [data["metadataOverview"].length],
    DNA_extraction_method	: [data["metadataOverview"].length],
    ProjectID	: [data["metadataOverview"].length],
    Diversity	: [data["metadataOverview"].length],
    BMI_group	: [data["metadataOverview"].length],
    SubjectID	: [data["metadataOverview"].length],
    Time_var : [data["metadataOverview"].length]
  }

  for (i = 0; i < data["metadataOverview"].length; i++){

      metadata.SampleID[i] = data["metadataOverview"][i]["SampleID"];
      metadata.Age[i] = +data["metadataOverview"][i]["Age"];
      metadata.Sex[i] = data["metadataOverview"][i]["Sex"];
      metadata.Nationality[i] = data["metadataOverview"][i]["Nationality"];
      metadata.DNA_extraction_method[i] = data["metadataOverview"][i]["DNA_extraction_method"];
      metadata.ProjectID[i] = +data["metadataOverview"][i]["ProjectID"];
      metadata.Diversity[i] = +data["metadataOverview"][i]["Diversity"];
      metadata.BMI_group[i] = data["metadataOverview"][i]["BMI_group"];
      metadata.SubjectID[i] = +data["metadataOverview"][i]["SubjectID"];
      metadata.Time_var[i] = +data["metadataOverview"][i]["Time"];

    }

  returnDictionary["select_category"] = function(selector){
    console.log(metadata[selector])
    }

  returnDictionary["generic_filter"] = function(category,filter_criterion){
    filtered_samples = []
    switch (category) {

      case "Age":
      if(filter_criterion === "all"){
        filtered_samples = metadata.SampleID
      }
      else{
        for (i = 0; i < metadata[category].length; i++){
          if(metadata[category][i] >= filter_criterion[0] && metadata[category][i] <= filter_criterion[1]){
              filtered_samples.push(metadata["SampleID"][i])
            }
          }
        }
        break;

      case "Sex":
      case "Nationality":
      case "BMI_group":
      if(filter_criterion === "all"){
        filtered_samples = metadata.SampleID
      }
      else{
        for (i = 0; i < metadata[category].length; i++){
          if(metadata[category][i] === filter_criterion){
              filtered_samples.push(metadata["SampleID"][i])
            }
          }
        }
        break;
      default:
        console.log("ERROR WRONG CATEGORY")
      }
    return filtered_samples
    }
  returnDictionary["intersection"] = function(id_array){
    var internal_array = id_array
    while(id_array.length > 1){
      internal_array[internal_array.length-2] = internal_array[internal_array.length-1].filter(value => -1 !== internal_array[internal_array.length-2].indexOf(value));
      internal_array.pop()
    }
    return internal_array[0]

  }

  returnDictionary["filter_data"] = function(sample_ids){
    var sample_ids = sample_ids;
    var out_array = data["dataExploration"];
    out_array = out_array.filter(row => sample_ids.includes(row[""]))

    return out_array
    }
  returnDictionary["filter_metadata"] = function(sample_ids){
    var sample_ids = sample_ids;
    var out_array = data["metadataOverview"];
    out_array = out_array.filter(row => sample_ids.includes(row["SampleID"]))

    return out_array
    }
  return returnDictionary
  }
