<template>
  <div class="flex">
    <el-card>
      <div slot="header" class="clearfix">
        <span>企业客户定位决策支持系统</span>
        <i class="el-icon-back" style="float: right;" @click="changeFlag"></i>
      </div>
    <i @click="change" class="el-icon-refresh" style="margin-bottom: 20px"></i>
      <!-- 饼图 -->
      <div v-show="isPie" id="pie" style="width: 1000px; height: 400px;"></div>
      <!-- 条形图 -->
      <div v-show="!isPie" id="bar" style="width: 1000px; height: 400px;"></div>

      <!-- 标准差 -->
      <el-input style="width: 400px" v-model="biaozhuncha"></el-input>
      
      <!-- 滑条 -->
      <div class="block" style="margin-top: 20px">
        <el-slider
          v-model="clusterNum"
          :step="1"
          :max='19'
          :min='2'
          show-input
          style="max-width: 400px">
        </el-slider>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import cluster from '../backend/file'
export default {
  data() {
    return {
      isPie: true,
      clusterNum: 3,
      random: [],
      flag: true
    }
  },
  computed: {
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
  mounted() {
    this.drawPie()
    this.drawBar()
  },
  watch: {
    clusterNum() {
      this.drawPie()
      this.drawBar()
    }
  },
  methods: {
    changeFlag() {
      this.$emit('changeFlag')
    },
    change() {
      this.isPie = !this.isPie
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
    drawBar() {
      let myChart = echarts.init(document.getElementById('bar'))
        let bar = {
           xAxis: {
            type: 'category',
            data: this.result.map(item => item.name)
          },
          yAxis: {
              type: 'value'
          },
          title : {
            text : '条形图'
          },
          series: [{
            data: this.result.map(item => item.value),
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            },
            label: {
              show: true,
              position: 'inside'
            },
          }]
      };
      myChart.setOption(bar)
    }
  }
}
</script>

<style>
  .flex{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .el-icon-back{
    font-size: 20px;
    cursor: pointer;
  }
  .el-icon-back:hover{
    color: #409EFF;
    transition: all .2s;
    font-size: 20px;
  }
  .el-icon-refresh{
    font-size: 20px;
    cursor: pointer;
  }
  .el-icon-refresh:hover{
    color: #409EFF;
    transition: all .2s;
  }
</style>