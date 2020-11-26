<template>
  <div>
    <div class="line"></div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="position: fixed; top: 0; width: 100vw; z-index: 100">
      <el-menu-item index="1" @click.native="moveTo(0)">企业销售决策支持系统</el-menu-item>
      <el-menu-item index="2" @click.native="moveTo(1)">企业客户定位决策支持系统</el-menu-item>
    </el-menu>

    <div>
      
      <div style="margin-top: 100px; margin-left: 650px;margin-bottom: -40px">广告支出与销售量的关系曲线</div>
      <div id="main" style="width: 600px; height: 400px; margin-left: 470px"></div>
      <el-card style=" margin-top: 175px; text-align: center">
        模型方程为：
      <span style=" font-size: 14px">{{threeData}}</span>
      <br>

        销售量变化
        <el-input 
          style="width: 100px; margin-top: 40px; line-height: 40px;"
          v-model="yQuery"
          clearable
          >
          <i slot="suffix" >%</i>
        </el-input>

        则
        <el-select v-model="queryObj" style="width: 120px;">
          <el-option value='价格'></el-option>
          <el-option value='广告支出'></el-option>
          <el-option value='汽车产量'></el-option>
        </el-select>
        应达到
        <el-input 
          v-model="xQuery"
          :placeholder='queryObj' 
          style="width: 100px; margin-right: 20px" 
          disabled
          >
        </el-input>
        <el-button type="primary" @click.native='calc' style="margin-top: 20px">确定</el-button>
      </el-card>


    </div>


    <div>
      <div id="pie" style="width: 1000px; height: 400px; margin-left: 350px"></div>
      <div style="width: 400px; margin-left: 750px">{{biaozhuncha}}</div>
      <el-card style="width: 600px; height: 270px; margin-left: 550px; margin-top: 50px">
        <div slot="header" class="clearfix">
          <span>分析</span>
        </div>
      </el-card>


    </div>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
import cluster from '../backend/file'
export default {
  data() {
      return {
        activeIndex2: '1',

        xAxis: '年份',
        xData : [],
        yData : [],
        data: [],
        list: [],
        xQuery: '',
        yQuery: '',
        threeData: '',
        queryObj: '价格',

        clusterNum: 3,
        random: [],
        flag: true
      };
    },
    async mounted() {
      await this.getData()
      await this.drawLine()
      this.drawPie()

    },
    watch: {
      clusterNum() {
        this.drawPie()
      }
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
      moveTo(index) {
        this.$el.parentElement.parentElement.parentElement.style['scroll-behavior'] = 'smooth'
        if(index === 0){
          this.$el.parentElement.parentElement.parentElement.scrollTop = 0
          

        }else{
          this.$el.parentElement.parentElement.parentElement.scrollTop = 1000


        }
      },
      handleSelect(key, keyPath) {
        
      },
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
                name: item.name + ' ' + item.aver + ' 初始数据：' + item.originData,
                value: item.value
              }
            })
          }
        }
      myChart.setOption(pie)
    },
  }
}
</script>

<style>

</style>