<template>
  <div>
    <el-card class="card" v-show="isOne" style="height: 710px; width: 542px">
      <div slot="header" class="clearfix">
        <span>企业销售决策支持系统</span>
        <i class="el-icon-right" style="float: right;" @click="changeFlag"></i>
      </div>
      <div style="display: flex">
        <div class="outer">
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
        <el-input v-model="threeData" style="width: 330px;margin-top: -10px"></el-input>
        <br>
        拟合度：<el-input v-model="nhd" style="width: 264px;margin-top: 10px"></el-input>

        <i class="el-icon-arrow-right" style="position: absolute; right: 10px" @click="changeOne"></i>


        
        <el-card style="width: 400px; margin: 0 auto; margin-top: 20px;">
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

    <el-card v-show="!isOne" style="height: 710px; width: 542px" class="card">
      <div slot="header" class="clearfix">
        <span>广告媒体选择决策</span>
      </div>
        <i class="el-icon-arrow-left" style="position: absolute; right: 10px; top: 360px" @click="changeOne"></i>

      <div style="width: 370px">
        <h2>1.决策变量</h2>
        <div>x1:户外广告的设置次数</div>
        <div>x2:专业杂志的设置次数</div>
        <div>x3:其他种类的设置次数</div>

        <h2 style="margin-top: 20px">2.目标函数</h2>
        <div>Max E(x) = 192x1 + 36x2 + 12x3</div>

        <h2 style="margin-top: 20px">3.约束条件</h2>
        <div>根据题干所得信息，得到关系如下：</div>
        <div> 150000x1 >= 650000</div>
        <div> x1 >= 2</div>
        <div> x2 >= 3</div>
        <div> x3 <= 2</div>
        <div> 150000x1 + 24000x2 + 120000x3 >= 1000000</div>

        <h2 style="margin-top: 20px">4.结果</h2>
        <div>最后结果取证后得到最优解为： x1=5 x2=10 x3=0 Max E(x)=1320</div>
        <div>即安排5次户外广告，共花费750000元 ， 安排10次专业杂志，共花费240000元，不安排其他形式</div>
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
      xAxis: '价格',
      xData : [],
      yData : [],
      data: [],
      list: [],
      xQuery: '',
      yQuery: '',
      threeData: '',
      queryObj: '价格',
      oneData: [],
      nhd: '',
      isOne: true
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
    },
    changeRelation() {
      if(this.xAxis === '价格') return 2
      else if(this.xAxis === '广告支出') return 3
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
          this.xData = this.data[2]
          this.yData = this.data[1]
          for(let i = 0 ; i < 10 ; i++){
            this.list.push([this.xData[i] , this.yData[i]])
          }
          this.list.sort(function(a , b){
            return a[0] - b[0]
          })
        })
      await axios.get('http://127.0.0.1:8090/model')
        .then(data => {
          this.threeData = `y = ${parseFloat(data.data.b[0]).toFixed(4)}${parseFloat(data.data.b[1]).toFixed(4)}X1+${parseFloat(data.data.b[2]).toFixed(4)}X2+${parseFloat(data.data.b[3]).toFixed(4)}X3`
          this.nhd = parseFloat(data.data.fcv).toFixed(10)
        })
      await this.getRelation()

    },
    async getRelation() {
      await axios.get('http://127.0.0.1:8090/relation?colx=' + this.changeRelation + '&coly=1')
        .then(data => {
          this.oneData = []
          this.oneData.push([0 , data.data[0]])
          if(this.xAxis === '价格') this.oneData.push([150 , parseFloat(data.data[0]) + parseFloat(150*data.data[1])])
          else this.oneData.push([120 , parseFloat(data.data[0]) + parseFloat(120*data.data[1])])
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
    changeOne() {
      this.isOne = !this.isOne
    },
    changeFlag() {
      this.$emit('changeFlag')
    },
    async changeAxis(name) {
      this.list = []

      this.xAxis = name
      this.yData = this.data[1]
      if(name === '价格'){
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
      
      await this.getRelation()
      
      await this.drawLine()
      

    },
    drawLine() {
      let myChart = echarts.init(document.getElementById('main'))
        let line = {
          xAxis: {},
          yAxis: {},
          series: [{
              data: this.list,
              type: 'scatter',
              // smooth: true
          },
          {
              data: this.oneData,
              type: 'line',
              // smooth: true
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
