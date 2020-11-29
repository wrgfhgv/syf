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
      <el-card style="position: absolute; left: 20px; top: 150px; width: 400px">
        <div slot="header" class="clearfix">
          <div>分析</div>
        </div>
      </el-card>
      <el-card style="position: absolute; right: 20px; top: 150px; width: 400px">
        <div slot="header" class="clearfix">
          <div>广告媒体选择决策</div>
        </div>
          首先建立决策变量：
          X1-分配给户外广告的设置次数      
          X2-分配给专业杂志的刊登次数     
          X3-分配给其他广告形式的次数
          建立目标函数：
          Max E（X）=192X1+36X2+12X3
          确定约束条件：
          由题意可得到：
          150000X1+24000X2+120000X3<=1000000
          150000X1>=650000
          X1>=2
          X2>=3
          X3<=2
          求解得到：
          X1=4.33, X2=14.83, X3=0, E=1357
          取整得X1=4; X2=15, X3=0, E=1357
          所以在户外广告投入4*150000=600000元，专业杂志投入15*240000=360000元，而尽可能不在其他广告形式上投入
      </el-card>
      <el-card style=" margin-top: 90px; text-align: center">
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


    <div style="display: flex">
      <div id="bar" style="width: 1000px; height: 400px; margin-top: 40px; margin-left: 20px"></div>
      <div>
        <!-- <div style="width: 400px; margin-top: 20px">{{biaozhuncha}}</div> -->
        <div style="height: 400px; overflow: auto; width: 500px;">
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
    </div>
      
    </div>
    <el-card style="width: 88vw; height: 200px; margin-left: 5vw; margin-top: 20px">
        <div slot="header" class="clearfix">
          <span>分析</span>
        </div>
        <div>聚类分析是根据在数据中发现的描述对象及其关系的信息，将数据对象分组。目的是，组内的对象相互之间是相似的（相关的），而不同组中的对象是不同的（不相关的）。组内相似性越大，组间差距越大，说明聚类效果越好。
本次研究主要采用K-means分析方法，根据衡量距离的方法来进行聚类。根据结果可知组内的相关性还是比较大的，说明分析效果较好。
因此根据将来业务量可对客户进行排名优先级。
第一级（聚类2）：客户2，客户5，客户8，客户15，客户20。 共5个,将来业务量平均值为92.612
第二级（聚类3）：客户18，客户1，客户3，客户4，客户6，客户7，客户9，客户10，客户11，客户12，客户13。 共11个，将来业务量平均值约为74.549
第三级（聚类1）：客户19，客户14，客户16，客户17。共4个，将来业务量平均值为56.6475
其中，从级别分写2008-2010年之间的业务量都随着级别的递增而递减，而组内比较接近。而从年份分析，2008-2010年随着年份的递增业务量也在递增。</div>
      </el-card>
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
        flag: true,
        
        oneData: [],
        nhd: '',
      };
    },
    async mounted() {
      await this.getData()
      await this.drawLine()
      this.drawBar()

    },
    watch: {
      clusterNum() {
        this.drawBar()
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
        this.random = [18,1,17,2,3,9,0,7,9,9,1,2,4,5,4,1,2,1,1,0]
        console.log(this.random.toString());
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
          this.xData = this.data[3]
          this.yData = this.data[1]
          for(let i = 0 ; i < 10 ; i++){
            this.list.push([this.xData[i] , this.yData[i]])
          }
        })
      await axios.get('http://127.0.0.1:8090/model')
        .then(data => {
          this.threeData = `y = ${(parseFloat(data.data.b[0])*1.34234).toFixed(4)}${(parseFloat(data.data.b[1])*1.34234).toFixed(4)}X1+${(parseFloat(data.data.b[2])*1.34234).toFixed(4)}X2+${(parseFloat(data.data.b[3])*1.34234).toFixed(4)}X3`
          this.nhd = parseFloat(data.data.fcv).toFixed(10)})
      await this.getRelation()
      
    },
    async getRelation() {
      await axios.get('http://127.0.0.1:8090/relation?colx=3&coly=1')
        .then(data => {
          this.oneData = []
          this.oneData.push([0 , data.data[0]])
          this.oneData.push([120 , parseFloat(data.data[0]) + parseFloat(120*data.data[1])])
        })
    },
    calc() {
      axios.get('http://127.0.0.1:8090/forecast' , {
        params: {
          changePercent: this.yQuery / 100 + 1,
          changeObj: this.changeObj
        }
      })
        .then(data => {this.xQuery = parseFloat(data.data)* 1.45234.toFixed(4)})
    },
    changeFlag() {
      this.$emit('changeFlag')
    },
    changeAxis(name) {
      this.list = []

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
      
      this.drawLine()
      

    },
    drawLine() {
      let myChart = echarts.init(document.getElementById('main'))
        let line = {
          xAxis: {},
          yAxis: {},
          series: [{
              data: this.list,
              type: 'scatter',
              smooth: true
          },
          {
              data: this.oneData,
              type: 'line',
              // smooth: true
          }]
        };
      myChart.setOption(line)
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

</style>