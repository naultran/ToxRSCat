

// remove duplicates
export function removeDuplicateRows(outputMatrix) {
    const deduplicatedMatrix = [];
    const deduplicatedRows = new Set();
  
    for (const row of outputMatrix) {
      const rowStr = JSON.stringify(row);
      if (!deduplicatedRows.has(rowStr)) {
        deduplicatedRows.add(rowStr);
        deduplicatedMatrix.push(row);
      }
    }
  
    return deduplicatedMatrix;
}

export function removeDuplicatesAndCollapse(outputMatrix, uniqueColumn) {
    const deduplicatedMatrix = [];
    const deduplicatedRows = new Set();
  
    for (const row of outputMatrix) {
      const rowStr = JSON.stringify(row);
      if (!deduplicatedRows.has(rowStr)) {
        deduplicatedRows.add(rowStr);
        deduplicatedMatrix.push(row);
      }
    }
  
    const uniqueIndex = deduplicatedMatrix[0].indexOf(uniqueColumn);
    const row_number = deduplicatedMatrix.length;
    const column_number = deduplicatedMatrix[0].length;
    for (let m = 1; m < row_number; m++){
        const submitter_id = deduplicatedMatrix[m][uniqueIndex];
        for(let n = uniqueIndex+1; n < column_number; n++){
            let value = deduplicatedMatrix[m][n];
            for(let i = m+1; i < row_number; i++){
                if(deduplicatedMatrix[i][uniqueIndex] === submitter_id && deduplicatedMatrix[i][n] !== value){
                    value = value + ',' + deduplicatedMatrix[i][n];
                }
            }
            for(let j=m; j < row_number; j++){
                if(deduplicatedMatrix[j][uniqueIndex] === submitter_id){
                    deduplicatedMatrix[j][n] = value;
                }
            }
        }
    }
    const finalMatrix = [];
    const finalMatrix_row = new Set();
  
    for (const row of deduplicatedMatrix) {
      const rowStr = JSON.stringify(row);
      if (!finalMatrix_row.has(rowStr)) {
        finalMatrix_row.add(rowStr);
        finalMatrix.push(row);
      }
    }
    return finalMatrix;
}
  
  

//remove duplicate rows and collapse for data files
/*
export function removeDuplicatesAndCollapse(outputMatrix, uniqueColumn) {
    const uniqueRows = {};
  
    for (let i = 1; i < outputMatrix.length; i++) {
      const row = outputMatrix[i];
      const key = row[outputMatrix[0].indexOf(uniqueColumn)];
  
      if (uniqueRows.hasOwnProperty(key)) {
        for (let j = 1; j < row.length; j++) {
          const column = outputMatrix[0][j];
          const value = row[j];
  
          if (!uniqueRows[key][column].includes(value)) {
            uniqueRows[key][column].push(value);
          }
        }
      } else {
        uniqueRows[key] = {};
  
        for (let j = 1; j < row.length; j++) {
          const column = outputMatrix[0][j];
          const value = row[j];
  
          uniqueRows[key][column] = [value];
        }
      }
    }
  
    const finalMatrix = [outputMatrix[0]];
  
    for (const key in uniqueRows) {
      const row = [key];
  
      for (let j = 1; j < outputMatrix[0].length; j++) {
        const column = outputMatrix[0][j];
        const values = uniqueRows[key][column];
  
        if (values.length > 1) {
          row.push(values.join(","));
        } else {
          row.push(values[0]);
        }
      }
  
      finalMatrix.push(row);
    }
  
    return finalMatrix;
  }
*/