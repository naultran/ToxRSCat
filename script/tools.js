
// delay
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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

//remove deplicate rows and collapse for data files
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
  