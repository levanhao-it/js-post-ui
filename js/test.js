const key = ['QualityNotUse', 'QualityUsed', 'ProductName', 'PRODUCTID'];
function mergeArray(objList) {
  if (!Array.isArray(objList) || objList.length === 0) return [];

  let objResult = {};
  let array = [];
  for (let i = 0; i < objList.length - 1; i++) {
    const obj = objList[i];
    if (obj.PRODUCTID === objList[i + 1].PRODUCTID) {
      objResult = {
        QualityNotUse: obj.QualityNotUse + objList[i + 1].QualityNotUse,
        QualityUsed: obj.QualityUsed + objList[i + 1].QualityUsed,
        ProductName: obj.ProductName,
        PRODUCTID: obj.PRODUCTID,
      };
      array.push(objResult);
    }
  }
  return array;
}
const array = [
  { QualityNotUse: 0, QualityUsed: 1, ProductName: 'name1', PRODUCTID: '1' },
  { QualityNotUse: 1, QualityUsed: 0, ProductName: 'name1', PRODUCTID: '1' },
  { QualityNotUse: 1, QualityUsed: 0, ProductName: 'name2', PRODUCTID: '2' },
  { QualityNotUse: 0, QualityUsed: 1, ProductName: 'name2', PRODUCTID: '2' },
];
console.log(mergeArray(array));
