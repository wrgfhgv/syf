<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="市场需求预测" name="1">
        <div style="display: grid; grid-template-columns: 48vw 48vw; margin-left: 50px">
          <div>
            <div>广告支出与产品销售的关系曲线</div>
            <div id="main" style="width: 600px; height: 400px; "></div>
            <el-card style="min-height: 100px; width: 500px; margin-left: 50px">
              <div slot="header" class="clearfix">
                <div>分析结果</div>
              </div>
            </el-card>
          </div>
          <div style="margin-top: 60px; margin-left: 100px">
            <div style="font-size: 14px; margin-top: 20px">模型公式：{{threeData}}</div>
            <div style="margin-top: 20px; margin-bottom: 20px">拟合效果</div>
            <div style="display: flex">
              <el-select v-model="queryObj" style="width: 150px; margin-right: 10px">
              <el-option value='价格'></el-option>
              <el-option value='广告支出'></el-option>
              <el-option value='汽车产量'></el-option>
            </el-select>
            <el-input 
              v-model="yQuery"
              clearable
              style="display: inline-block; width: 150px;"
              >
            </el-input>
            <div style="margin-top: 10px; margin-left:5px">%</div>
            </div>
            <el-button type="primary"  @click.native='calc' style="margin-top: 20px; width: 310px">计算</el-button>

            <br>

            <span style="display: inline-block; width: 154px">{{queryObj}}应达到：</span>

            <el-input 
              v-model="xQuery"
              placeholder='销售量' 
              style="width: 155px; margin-top: 20px" 
              disabled
              >
            </el-input>
          </div>
        </div>
        

      </el-tab-pane>
      <el-tab-pane label="广告媒体选择预测" name="2">
        <div class="advertise">
          <el-card>
            <div slot="header" class="clearfix">
              <div>广告优化分配方案</div>
            </div>
            <div>解释---------------------</div>
            <div>解释---------------------</div>
            <div>解释---------------------</div>
            <div>解释---------------------</div>
            <div>解释---------------------</div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="企业客户定位决策支持系统" name="3">
        <div style="display: grid; grid-template-columns: 800px 1fr; margin-bottom: 10px">
          <div>
            <div id="pie" style="width: 800px; height: 400px;"></div>
            <div style="margin-left: 280px">
              <span>聚类数：</span>
              <el-input style="width: 150px" v-model="clusterNum"></el-input>
              <br>
              <el-button type="primary" style="margin-top: 20px; width: 214px" @click.native='changeCluster'>随机聚类</el-button>
            </div>
          </div>
          <el-card>
            分析
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
import cluster from '../backend/file'

export default {
  data() {
    return {
      xAxis: '年份',
      xData : [],
      yData : [],
      data: [],
      list: [],
      xQuery: '',
      yQuery: '',
      threeData: '',
      queryObj: '价格',

      activeName: '1',

      clusterNum: 3,
      random: [],
      flag: true
    }
  },
  
  async mounted() {
    await this.getData()
    await this.drawLine()
    this.drawPie()
  },
  computed: {
    changeObj() {
      if(this.queryObj === '价格') return 0
      else if(this.queryObj === '广告支出') return 1
      else if(this.queryObj === '汽车产量') return 2
    },
    result() {
      if(!this.flag) return cluster(this.clusterNum , this.random)

      //更改聚类原始数据的位置，random为一个二十个数据的数组，内容为不重复的序号
      for(let i = 0 ; i < 20 ; i++){
        this.random[i] = Math.floor(Math.random() * (20 - i))
      }
      this.flag = false
      return cluster(this.clusterNum , this.random)
    },
    biaozhuncha() {
      return this.result[0].biaozhuncha
    }
  },
  methods: {
    // able() {
    //   if(this.xQuery !== ''){
    //     this.yFlag = true
    //   }else{
    //     this.yFlag = false
    //   }
    //   if(this.yQuery !== ''){
    //     this.xFlag = true
    //   }else{
    //     this.xFlag = false
    //   }
    // },
    async getData() {
      await axios.get('http://127.0.0.1:8090/getAccount')
        .then(data => {
          this.data = data.data
          this.xData = this.data[0]
          this.yData = this.data[1]
          for(let i = 0 ; i < 10 ; i++){
            this.list.push([this.xData[i] - 2000 , this.yData[i]])
          }
        })
      await axios.get('http://127.0.0.1:8090/model')
        .then(data => {
          this.threeData = `y = ${parseFloat(data.data[0]).toFixed(4)}${parseFloat(data.data[1]).toFixed(4)}X1+${parseFloat(data.data[2]).toFixed(4)}X2+${parseFloat(data.data[3]).toFixed(4)}X3`
        })

    },
    calc() {
      axios.get('http://127.0.0.1:8090/forecast' , {
        params: {
          changePercent: this.yQuery / 100 + 1,
          changeObj: this.changeObj
        }
      })
        .then(data => {this.xQuery = parseFloat(data.data).toFixed(4)})
    },
    changeFlag() {
      this.$emit('changeFlag')
    },
    changeAxis(name) {
      this.list = []

      this.xAxis = name
      this.yData = this.data[1]
      if(name === '年份'){
        this.xData = this.data[0]
        for(let i = 0 ; i < 10 ; i++){
          this.list.push([this.xData[i] - 2000, this.yData[i]])
        }
      }else if(name === '价格'){
        this.xData = this.data[2]
        for(let i = 0 ; i < 10 ; i++){
          this.list.push([this.xData[i] , this.yData[i]])
        }
        
      }else if(name === '广告支出'){
        this.xData = this.data[3]
        for(let i = 0 ; i < 10 ; i++){
          this.list.push([this.xData[i] , this.yData[i]])
        }
      }
      this.list.sort(function(a , b){
        return a[0] - b[0]
      })
      
      this.drawLine()
      

    },
    drawLine() {
      let myChart = echarts.init(document.getElementById('main'))
        let line = {
          xAxis: {},
          yAxis: {},
          series: [{
              data: this.list,
              type: 'line',
              smooth: true
          }]
        };
      myChart.setOption(line)
    },


    drawPie() {
      let myChart = echarts.init(document.getElementById('pie'))
        let pie = {
          title : {
            text : '饼图'
          },
          series : {
            type : 'pie',
            data : this.result.map((item , index) => {
              return {
                name: item.name + ' 占比：' + item.value*5 + '%',
                value: item.value
              }
            })
          }
        }
      myChart.setOption(pie)
    },

    changeCluster() {
      this.drawPie()
    }
  }

}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}
  .card{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .outer{
    display: flex;
    flex-direction: column;
  }
  .yAxis{
    position: absolute;
    top: 25px;
    left: 5px;
    font-size: 12px;
  }
  .el-icon-right{
    font-size: 20px;
    cursor: pointer;
  }
  .el-icon-right:hover{
    color: #409EFF;
    transition: all .2s;
    font-size: 20px;
  }
  .advertise{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90vh;
  }
</style>
