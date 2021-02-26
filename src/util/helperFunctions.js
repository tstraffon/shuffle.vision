export const compareArrays = (a, b) => {

  // compare lengths - can save a lot of time 
  if (a.length !== b.length){
    return false;
  }

  for (var i = 0, l=a.length; i < l; i++) {
      // Check if we have nested arrays
      if (b[i] instanceof Array && a[i] instanceof Array) {
          // recurse into the nested arrays
          if (!b[i].equals(a[i])){
            return false;       
          }
      }           
      else if (b[i] !== a[i]) { 
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;   
      }     
  }
  return true
}


export const shuffleData = (data, count) => {
  let randomDataSet=[], usedData=[], loopCount;

  if(data.length < 1){
      return [];
  }

  if(data.length < count){
      loopCount = data.length;
  } else {
      loopCount = count;
  }
  
  // loops through data and creates a random array with a length equal to provided count
  for(var i=0; i < loopCount; ){

      if (i === data.length) { break; }

      let randomIndex = getRandomInt(data.length);

      if(!usedData.includes(randomIndex)){
          // console.log('[shuffleData] pushing new phrase', data[randomIndex])
          usedData.push(randomIndex);
          randomDataSet.push(data[randomIndex]);
          i++
      }
      // console.log('[shuffleData] i, loopCount', i, loopCount)
  }
  // console.log('[shuffleData] randomDataSet', {randomDataSet})
  return randomDataSet
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

export const sortObjectsAlphabetically = (array, sortProperty) => {
  array.sort((a, b)=>{
    var textA = a[sortProperty].toUpperCase();
    var textB = b[sortProperty].toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  })
  return array;
}