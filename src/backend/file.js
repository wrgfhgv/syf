
function cluster(num , random) {
  let a = [
    [18.27	,50.48	,9.99	,78.74],
    [22.22	,60.77	,11.70	,94.70],
    [17.16	,45.09	,10.32	,72.56],
    [17.38	,48.45	,8.95	,74.78],
    [20.41	,56.86	,11.40	,88.67],
    [15.80	,41.34	,10.18	,67.32],
    [18.65	,52.80	,9.44	,80.89],
    [20.84	,59.99	,11.61	,92.44],
    [16.17	,49.18	,8.27	,73.62],
    [15.47	,42.56	,9.17	,67.20],
    [16.41	,50.33	,9.22	,75.96],
    [17.68	,41.51	,8.87	,68.06],
    [17.86	,52.02	,10.10	,79.98],
    [12.06	,26.66	,8.00	,46.72],
    [21.93	,61.04	,11.81	,94.78],
    [14.31	,39.54	,8.39	,62.24],
    [16.33	,36.94	,7.40	,60.67],
    [19.75	,52.16	,9.02	,80.93],
    [12.80	,34.92	,9.24	,56.96],
    [22.51	,59.31	,10.65	,92.47]
    ]
    
    let newArr = []
    for(let i = 0 ; i < 20 ; i++){
      newArr.push(Math.sqrt((a[i][0] ** 2 + a[i][1] ** 2 + a[i][2] ** 2 + a[i][3] ** 2)))
      a[i].push(Math.sqrt((a[i][0] ** 2 + a[i][1] ** 2 + a[i][2] ** 2 + a[i][3] ** 2)))
      a[i].push(i + 1)
    }



  let arr = []
  let minNum = 1000
  let minIndex = -1
  let sum = 0
  let originData = []

  // 取前num个数据作为聚类初始数据
  // for(let i = 0 ; i < num ; i++){
  //   arr.push([newArr[i] , newArr[i]])
  // }

  // 随机取num个数据作为聚类初始数据
  for(let i = 0 ; i < num ; i++){
    arr.push([newArr[random[i]] , newArr[random[i]]])
    originData[i] = parseFloat(newArr[random[i]]).toFixed(4)
    // let a
    // newArr[random] = a
    // a = newArr[i]
    // newArr[i] = newArr[random]
  }
  newArr =  newArr.filter(v => !(originData.includes(parseFloat(v).toFixed(4))))

  for(let j = 0 ; j < 20 - num ; j++){ //剩余未聚类的项 随机初始数据
  // for(let j = num ; j < 20 ; j++){ //剩余未聚类的项 固定前num个初始数据
    for(let k = 0 ; k < num ; k++){ //跟每一类比较
      if(Math.abs(newArr[j] - arr[k][0]) < minNum){
        minNum = Math.abs(newArr[j] - arr[k][0])
        minIndex = k
      }
    }
    arr[minIndex].push(newArr[j])
    for(let l = 0 ; l < num ; l++){ //替换聚类的平均值
      for(let m = 1 ; m < arr[l].length ; m++){ //计算平均值
        sum += arr[l][m]
      }
      arr[l][0] = sum / (arr[l].length - 1)
      sum = 0
    }
    minIndex = -1
    minNum = 1000
  }

  // 平方差
  let result = []
  for(let i = 0 ; i < arr.length ; i++) {
    result.push(0)
    for(let j = 1 ; j <  arr[i].length ; j++){
      result[i] += (arr[i][j] - arr[i][0]) ** 2
    }
    result[i] = Math.sqrt(result[i]) / (arr[i].length - 1)
  }

  return arr.map((item , index) => {
    return {
      name: `聚类${index + 1}`,
      value: item.length - 1,
      aver: `平均值：${item[0].toFixed(4)}`,
      biaozhuncha: `标准差：${result.reduce((pre , next) => pre + next)}`,
      originData: originData[index],
      item: item.map(i => {
        return a.find(a => a[4] === i)
      })
      
    }
  })
}

export default cluster
// let get
// let result
// for(let o = 2 ; o < 20 ; o++) {
  // get = cluster(o)
//   // console.log(o,get);  //聚类情况
//   result = []
// for(let i = 0 ; i < get.length ; i++) {
//   result.push(0)
//   for(let j = 1 ; j <  get[i].length ; j++){
//     result[i] += (get[i][j] - get[i][0]) ** 2
//   }
//   result[i] = Math.sqrt(result[i]) / (get[i].length - 1)
// }
// console.log('聚类个数：',o,'标准差：' + result.reduce((pre , next) => pre + next))
// }
