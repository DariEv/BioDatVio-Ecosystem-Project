/* Project ecosystem 1 by Daria Evseeva, Eduardo Vela, Nicolas Brich, Sarah Ertel, Constantin Holzapfel 21.1.19 */

function generate_bool_array(html_string){
  var split_string = html_string.split(";")
  var bool_array = Array(1000).fill(false)
  bool_array[0] = true

  split_string.forEach(function(elem){
    if (elem === "all"){
      bool_array = Array(1000).fill(true)
    }
    else if (elem.indexOf('-') > -1)
      {
        var range = elem.split("-")
        for(var i = +range[0]; i <= +range[1]; i++){
          bool_array[i] = true;
        }
      }
    else {
      bool_array[+elem] = true
    }
  }

  )
  return bool_array
}

function filter_from_object(obj, bool_array){
  var obj_keys = Object.keys(obj);
  var out_obj = {}

  obj_keys =  obj_keys.filter(function(elem, idx){

    return bool_array[idx]
  })
  obj_keys.forEach(function(elem){
    out_obj[elem] = obj[elem];
  })
  //console.log(out_obj)
  return out_obj
}

function filter_wrapper(filter_obj,meta_switch){
  var age_from_val = +document.getElementById("FROM").value;
  var age_to_val = +document.getElementById("TO").value;
  var sex_val = document.getElementById("btn_sex").value;
  var nationality_val = document.getElementById("btn_nationality").value;
  var bmi_val = document.getElementById("btn_bmi").value;

  var sort_val = document.getElementById("btn_sortby").value;

  var keep_cols = document.getElementById("COLS").value;

  var age_filter = filter_obj.generic_filter("Age",[age_from_val,age_to_val])
  var sex_filter = filter_obj.generic_filter("Sex",sex_val)
  var nationality_filter = filter_obj.generic_filter("Nationality",nationality_val)
  var bmi_filter = filter_obj.generic_filter("BMI_group",bmi_val)
  //console.log(age_filter)
  //console.log(sex_filter)
  //console.log(nationality_filter)
  //console.log(bmi_filter)
  var filtered_objects = filter_obj.intersection([age_filter,sex_filter,nationality_filter,bmi_filter])

  //console.log("filtered:", filtered_objects);

  filtered_objects = filtered_objects.sort(sort_by(sort_val))

  var bool_array = generate_bool_array(keep_cols)

  var filter_sampleIDs = []
  filtered_objects.forEach(function(elem){
    filter_sampleIDs.push(elem.SampleID)
  })

  switch (meta_switch) {
    case "Data":
      var filtered_data = filter_obj.filter_data(filter_sampleIDs,bool_array)
      return filtered_data
      break;
    case "Meta":
      var filtered_data = filter_obj.filter_metadata(filter_sampleIDs)
      return filtered_data
      break;
    case "pcoa":
      var filtered_data = filter_obj.filter_data(filter_sampleIDs)
      return filtered_data
      break;
    default:
      var filtered_data = filter_obj.filter_data(filter_sampleIDs)
      return filtered_data

  }

}
function sort_by(sort_criterion){
  return function(x,y){
    return (x[sort_criterion] < y[sort_criterion]) ? -1 : (x[sort_criterion] > y[sort_criterion]) ? 1 : 0;
  }
}

function filter_object(data){
  var returnDictionary = {};

  returnDictionary["select_category"] = function(selector){
    console.log(data["metadataOverview"][selector])
    }

  returnDictionary["generic_filter"] = function(category,filter_criterion){
    filtered_samples = []
    switch (category) {

      case "Age":
      if(filter_criterion === "all"){
        filtered_samples = data["metadataOverview"]
      }
      else{
        for (i = 0; i < data["metadataOverview"].length; i++){
          if(data["metadataOverview"][i][category] >= filter_criterion[0] && data["metadataOverview"][i][category] <= filter_criterion[1]){
              filtered_samples.push(data["metadataOverview"][i])
            }
          }
        }
        break;

      case "Sex":
      case "Nationality":
      case "BMI_group":
      if(filter_criterion === "all"){
        filtered_samples = data["metadataOverview"]
      }
      else{
        for (i = 0; i < data["metadataOverview"].length; i++){
          if(data["metadataOverview"][i][category] === filter_criterion){
              filtered_samples.push(data["metadataOverview"][i])
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
    while(internal_array.length > 1){
      internal_array[internal_array.length-2] = internal_array[internal_array.length-1].filter(
        a => internal_array[internal_array.length-2].some( b => a.SampleID === b.SampleID ) );
      internal_array.pop()
    }
    return internal_array[0]

  }

  returnDictionary["filter_data"] = function(sample_ids,bool_arr){
    var sample_ids = sample_ids;
    var data_internal = data["dataExploration"];
    var out_array = []
    //out_array = out_array.filter(row => sample_ids.includes(row[""]))

    sample_ids.forEach(function(elem){
      for(var i = 0; i < data_internal.length; i++){
        if(data_internal[i][""] === elem){
          out_array.push(filter_from_object(data_internal[i], bool_arr))
          break;
        }
      }
    })

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



function pcoa_filter_object(data){
  var returnDictionary = {};

  console.log("Test",data["dataExploration"])

  returnDictionary["generic_filter"] = function(category,filter_criterion){
    filtered_samples = []
    switch (category) {

      case "Age":
      if(filter_criterion === "all"){
        filtered_samples = data["metadataOverview"]
      }
      else{
        for (i = 0; i < data["metadataOverview"].length; i++){
          if(data["metadataOverview"][i][category] >= filter_criterion[0] && data["metadataOverview"][i][category] <= filter_criterion[1]){
              filtered_samples.push(data["metadataOverview"][i])
            }
          }
        }
        break;

      case "Sex":
      case "Nationality":
      case "BMI_group":
      if(filter_criterion === "all"){
        filtered_samples = data["metadataOverview"]
      }
      else{
        for (i = 0; i < data["metadataOverview"].length; i++){
          if(data["metadataOverview"][i][category] === filter_criterion){
              filtered_samples.push(data["metadataOverview"][i])
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
    while(internal_array.length > 1){
      internal_array[internal_array.length-2] = internal_array[internal_array.length-1].filter(
        a => internal_array[internal_array.length-2].some( b => a.SampleID === b.SampleID ) );
      internal_array.pop()
    }
    return internal_array[0]

  }

  returnDictionary["filter_data"] = function(sample_ids){
    var sample_ids = sample_ids;
    var data_internal = data["dataExploration"];
    var object_internal = {"dataExploration":data["dataExploration"],
                          "PCsPercentage":data["PCsPercentage"],
                          "metadataOverview":data["metadataOverview"]};
    var out_obj = {}
    //out_array = out_array.filter(row => sample_ids.includes(row[""]))

    sample_ids.forEach(function(elem){
      out_obj[elem] = data_internal[elem]
        }
      )
    object_internal["dataExploration"] = out_obj
    return object_internal
    }
  returnDictionary["filter_metadata"] = function(sample_ids){
    var sample_ids = sample_ids;
    var out_array = data["metadataOverview"];
    out_array = out_array.filter(row => sample_ids.includes(row["SampleID"]))

    return out_array
    }
  return returnDictionary
  }
