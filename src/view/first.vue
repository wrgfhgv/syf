<template>
  <div>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>企业销售决策支持系统</span>
        <i class="el-icon-right" style="float: right;" @click="changeFlag"></i>
      </div>
      <div style="display: flex">
        <div class="outer">
          <el-button size='small' style=" margin-top: 50px" @click="changeAxis('年份')">年份</el-button>
          <el-button size='small' style=" margin: 30px 0" @click="changeAxis('价格')">价格</el-button>
          <el-button size='small' style=" margin: 0" @click="changeAxis('广告支出')">广告支出</el-button>
        </div>
        <div style="display: flex; position:relative">
          <div style="display: flex; flex-direction: column;">
            <div class="yAxis">销售量</div>
            <div id="main" style="width: 400px; height: 250px;"></div>
          </div>
          <div style="min-width: 4em; margin-top: 195px; margin-left: -26px; font-size: 12px">{{xAxis}}</div>
        </div>
      </div>
      <div style="text-align: center;">
        <!-- 三元一次方程 -->
        <el-input v-model="threeData" style="width: 330px;"></el-input>


        
        <el-card style="width: 400px; margin: 0 auto; margin-top: 20px">
          <div slot="header" class="clearfix">
            <span>预测</span>
          </div>
          <el-input 
            placeholder='销售量'  
            style="width: 330px; margin-bottom: 20px; line-height: 40px"
            v-model="yQuery"
            clearable
            >
            <i slot="suffix" >%</i>
          </el-input>
          <br>

          <el-select v-model="queryObj" style="width: 120px; margin-right: 10px">
            <el-option value='价格'></el-option>
            <el-option value='广告支出'></el-option>
            <el-option value='汽车产量'></el-option>
          </el-select>
          <el-input 
            v-model="xQuery"
            :placeholder='queryObj' 
            style="width: 200px;" 
            disabled
            >
          </el-input>
          <el-button type="primary" @click.native='calc' style="margin-top: 20px">确定</el-button>

        </el-card>

      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
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
      queryObj: '价格'
    }
  },
  
  async mounted() {
    await this.getData()
    await this.drawLine()
  },
  computed: {
    changeObj() {
      if(this.queryObj === '价格') return 0
      else if(this.queryObj === '广告支出') return 1
      else if(this.queryObj === '汽车产量') return 2
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
</style>
