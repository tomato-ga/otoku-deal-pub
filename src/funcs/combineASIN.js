export const combineDataByAsin = (filteredData) => {
    const combinedData = {};
  
    filteredData.forEach((item) => {
  
      const asin = item.asin;
  
      if (!combinedData[asin]) {
        combinedData[asin] = {
          productInfo: {},
        };
      }
  
      if (item.type === "商品情報") {
        combinedData[asin].productInfo = item;
      }
  
    });
  
    // console.log(combinedData)
    return combinedData;
  };

