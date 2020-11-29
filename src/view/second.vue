<template>
  <div>
    <div class="flex">
      <el-card style="position: relative; z-index: 1">
        <div slot="header" class="clearfix">
          <span>企业客户定位决策支持系统</span>
          <i class="el-icon-back" style="float: right;" @click="changeFlag"></i>
        </div>
      <i @click="change" class="el-icon-refresh" style="margin-bottom: 20px"></i>
        <!-- 饼图 -->
        <div v-show="isPie" id="pie" style="width: 1000px; height: 400px;"></div>
        <!-- 条形图 -->
        <div v-show="!isPie" id="bar" style="width: 1000px; height: 400px;"></div>

        <div style="display: flex">
          <div>
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
          </div>

          <!-- 弹出聚类情况 -->
          <el-button type="primary" size='mini' style="height: 35px; margin-top: 60px; margin-left: 20px;" @click="dialogVisible = true">聚类详情</el-button>
          
          <el-button type="primary" size='mini' style="height: 35px; margin-top: 60px; margin-left: 20px" @click="ansy = true">聚类分析</el-button>
        </div>
        
      </el-card>
    </div>
    <el-dialog
      title="聚类情况"
      :visible.sync="dialogVisible"
      width="32%">
      <div style="overflow: auto; height: 380px">
        <div v-for="(item , index) in result" :key="index" style="width: 410px;">
          <div style="text-align: center; margin-top: 20px">聚类{{index + 1}}</div>
          <div :title="item.name" name="1">
            <div style="display: inline-block; width: 80px; text-align: center; border: 1px solid rgba(0,0,0,.2);">客户号</div>
            <div style="display: inline-block; width: 80px; text-align: center; border: 1px solid rgba(0,0,0,.2);">2009年</div>
            <div style="display: inline-block; width: 80px; text-align: center; border: 1px solid rgba(0,0,0,.2);">2010年</div>
            <div style="display: inline-block; width: 80px; text-align: center; border: 1px solid rgba(0,0,0,.2);">2008年</div>
            <div style="display: inline-block; width: 80px; text-align: center; border: 1px solid rgba(0,0,0,.2);">将来业务量</div>

            <div v-for="(i , ind) in item.item.slice(1)" :key="ind" style="text-align: center;">
              <div style="display: inline-block; width: 80px; border: 1px solid rgba(0,0,0,.2);">{{i[5]}}</div>
              <div style="display: inline-block; width: 80px; border: 1px solid rgba(0,0,0,.2);" v-for="(it , inde) in i.slice(0 , 4)" :key="inde">{{it}}</div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog
      title="聚类分析"
      :visible.sync="ansy"
      width="32%">
      <div style="overflow: auto; height: 380px">
        <div>从饼图可知，交易额处在较高水平的客户占比只有四分之一，</div>
        <div>处于中间水平也只有四分之一，</div>
        <div>大约一半的客户交易额处在一个较低的水平上</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ansy = false">确 定</el-button>
      </span>
    </el-dialog>
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
      flag: true,
      dialogVisible: false,
      ansy: false
    }
  },
  computed: {
    result() {
      if(!this.flag) return cluster(this.clusterNum , this.random)

      //更改聚类原始数据的位置，random为一个二十个数据的数组，内容为不重复的序号
      for(let i = 0 ; i < 20 ; i++){
        if(i % 2 === 0){
          this.random[i] = i + 1
        }else{
          this.random[i] = i - 1
        }
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
                name: item.name + ' ' + item.aver + ' 占比：' + (parseFloat(item.value) * 5) + '%',
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